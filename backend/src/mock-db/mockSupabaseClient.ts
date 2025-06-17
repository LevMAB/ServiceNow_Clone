// backend/src/mock-db/mockSupabaseClient.ts

import { mockDatabase, MockUser, MockRole, MockCategory, MockPriority, MockTicket, MockComment, MockTicketHistory } from './data';
import { deepCopy, filterData, generateUuid, orderData, rangeData, performMockJoin } from './utils';

// Type for the mock database tables
type MockTable = MockUser[] | MockRole[] | MockCategory[] | MockPriority[] | MockTicket[] | MockComment[] | MockTicketHistory[];

// Helper to get a mutable reference to a table
function getTable(tableName: string): MockTable {
  switch (tableName) {
    case 'users': return mockDatabase.users;
    case 'roles': return mockDatabase.roles;
    case 'categories': return mockDatabase.categories;
    case 'priorities': return mockDatabase.priorities;
    case 'tickets': return mockDatabase.tickets;
    case 'comments': return mockDatabase.comments;
    case 'ticket_history': return mockDatabase.ticket_history;
    default: throw new Error(`Mock table '${tableName}' not found.`);
  }
}

// Mock Query Builder to chain methods like Supabase
class MockQueryBuilder {
  private data: any[];
  private tableName: string;
  private filters: { column: string; value: any }[] = [];
  private orderBy: { column: string; ascending: boolean } | null = null;
  private range: { from: number; to: number } | null = null;
  private selectedColumns: string = '*';

  constructor(tableName: string) {
    this.tableName = tableName;
    this.data = deepCopy(getTable(tableName)); // Work on a copy
  }

  // --- Query Methods ---

  select(columns: string = '*'): MockQueryBuilder {
    this.selectedColumns = columns;
    return this;
  }

  eq(column: string, value: any): MockQueryBuilder {
    this.filters.push({ column, value });
    return this;
  }

  order(column: string, options?: { ascending?: boolean }): MockQueryBuilder {
    this.orderBy = { column, ascending: options?.ascending ?? true };
    return this;
  }

  range(from: number, to: number): MockQueryBuilder {
    this.range = { from, to };
    return this;
  }

  single(): Promise<{ data: any | null; error: any }> {
    return this.execute().then(result => {
      if (result.error) {
        return { data: null, error: result.error };
      }
      if (result.data.length > 1) {
        return { data: null, error: { message: 'More than one row returned for single()', code: '2000' } };
      }
      return { data: result.data[0] || null, error: null };
    });
  }

  // --- Data Manipulation Methods ---

  async insert(data: any | any[]): Promise<{ data: any[] | null; error: any }> {
    const recordsToInsert = Array.isArray(data) ? data : [data];
    const insertedRecords: any[] = [];
    const table = getTable(this.tableName); // Get reference to original table for mutation

    for (const record of recordsToInsert) {
      const newRecord = {
        ...record,
        id: record.id || generateUuid(), // Assign UUID if not provided
        created_at: record.created_at || new Date().toISOString(),
        updated_at: record.updated_at || new Date().toISOString(), // For tickets
      };

      // Basic validation for unique fields (e.g., email for users)
      if (this.tableName === 'users' && table.some((u: any) => u.email === newRecord.email)) {
        return { data: null, error: { message: 'Duplicate key (email) violates unique constraint.', code: '23505' } };
      }
      if (this.tableName === 'roles' && table.some((r: any) => r.user_id === newRecord.user_id)) {
        return { data: null, error: { message: 'Duplicate key (user_id) violates unique constraint.', code: '23505' } };
      }

      (table as any[]).push(newRecord);
      insertedRecords.push(newRecord);
    }
    return { data: insertedRecords, error: null };
  }

  async update(data: any): Promise<{ data: any[] | null; error: any }> {
    const updatedRecords: any[] = [];
    const table = getTable(this.tableName); // Get reference to original table for mutation

    // Apply filters to find records to update
    let recordsToUpdate = deepCopy(table);
    for (const filter of this.filters) {
      recordsToUpdate = filterData(recordsToUpdate, filter.column, filter.value);
    }

    for (const record of recordsToUpdate) {
      const originalIndex = (table as any[]).findIndex((item: any) => item.id === record.id);
      if (originalIndex !== -1) {
        const updatedRecord = {
          ...(table as any[])[originalIndex],
          ...data,
          updated_at: new Date().toISOString(), // Update timestamp for tickets
        };
        (table as any[])[originalIndex] = updatedRecord;
        updatedRecords.push(updatedRecord);
      }
    }
    return { data: updatedRecords, error: null };
  }

  async delete(): Promise<{ data: any[] | null; error: any }> {
    const deletedRecords: any[] = [];
    const table = getTable(this.tableName); // Get reference to original table for mutation

    // Apply filters to find records to delete
    let recordsToDelete = deepCopy(table);
    for (const filter of this.filters) {
      recordsToDelete = filterData(recordsToDelete, filter.column, filter.value);
    }

    for (const record of recordsToDelete) {
      const originalIndex = (table as any[]).findIndex((item: any) => item.id === record.id);
      if (originalIndex !== -1) {
        deletedRecords.push((table as any[]).splice(originalIndex, 1)[0]);
      }
    }
    return { data: deletedRecords, error: null };
  }

  // --- Internal Execution ---

  private async execute(): Promise<{ data: any[] | null; error: any }> {
    let resultData = deepCopy(getTable(this.tableName));

    // Apply filters
    for (const filter of this.filters) {
      resultData = filterData(resultData, filter.column, filter.value);
    }

    // Apply joins/relations if columns are specified
    if (this.selectedColumns !== '*') {
      const columnsToSelect = this.selectedColumns.split(',').map(c => c.trim());
      const directColumns = columnsToSelect.filter(c => !c.includes('('));
      const relationColumns = columnsToSelect.filter(c => c.includes('('));

      resultData = resultData.map((item: any) => {
        let processedItem: any = {};

        // Select direct columns
        if (directColumns.includes('*')) {
          processedItem = deepCopy(item);
        } else {
          directColumns.forEach(col => {
            if (item.hasOwnProperty(col)) {
              processedItem[col] = item[col];
            }
          });
        }

        // Process relations
        relationColumns.forEach(relStr => {
          const joiner = performMockJoin(relStr, mockDatabase);
          processedItem = joiner(processedItem);
        });

        return processedItem;
      });
    }

    // Apply ordering
    if (this.orderBy) {
      resultData = orderData(resultData, this.orderBy.column, this.orderBy.ascending);
    }

    // Apply range
    if (this.range) {
      resultData = rangeData(resultData, this.range.from, this.range.to);
    }

    return { data: resultData, error: null };
  }

  // Make the query builder awaitable
  then(onFulfilled?: (value: { data: any, error: any }) => any, onRejected?: (reason: any) => any): Promise<any> {
    return this.execute().then(onFulfilled, onRejected);
  }
}

// Mock Supabase Client
class MockSupabaseClient {
  from(tableName: string): MockQueryBuilder {
    return new MockQueryBuilder(tableName);
  }
}

export const mockSupabase = new MockSupabaseClient();