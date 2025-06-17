// backend/src/mock-db/utils.ts

import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a UUID (Universally Unique Identifier).
 * @returns {string} A new UUID.
 */
export function generateUuid(): string {
  return uuidv4();
}

/**
 * Performs a deep copy of an object or array to prevent direct mutation of mock data.
 * @param {T} obj - The object or array to copy.
 * @returns {T} A deep copy of the input.
 */
export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Filters an array of objects based on a single equality condition.
 * @param {T[]} data - The array to filter.
 * @param {string} column - The column to match.
 * @param {any} value - The value to match against.
 * @returns {T[]} The filtered array.
 */
export function filterData<T>(data: T[], column: string, value: any): T[] {
  return data.filter((item: any) => item[column] === value);
}

/**
 * Orders an array of objects by a specified column.
 * @param {T[]} data - The array to order.
 * @param {string} column - The column to order by.
 * @param {boolean} ascending - Whether to sort in ascending order (default: true).
 * @returns {T[]} The sorted array.
 */
export function orderData<T>(data: T[], column: string, ascending: boolean = true): T[] {
  return [...data].sort((a: any, b: any) => {
    if (a[column] < b[column]) return ascending ? -1 : 1;
    if (a[column] > b[column]) return ascending ? 1 : -1;
    return 0;
  });
}

/**
 * Selects a range of items from an array.
 * @param {T[]} data - The array.
 * @param {number} from - The starting index (inclusive).
 * @param {number} to - The ending index (inclusive).
 * @returns {T[]} The sliced array.
 */
export function rangeData<T>(data: T[], from: number, to: number): T[] {
  return data.slice(from, to + 1);
}

/**
 * Simulates a basic join operation for nested selects (e.g., `categories (name)`).
 * This is a simplified version and might need to be extended for more complex join scenarios.
 * @param {any[]} data - The primary data array.
 * @param {string} relationString - The relation string (e.g., 'categories (name)', 'assigned_to:users!assigned_to (email)').
 * @param {Record<string, any[]>} allTables - A map of all mock tables.
 * @returns {Function} A function that takes a single item and returns it with joined data.
 */
export function performMockJoin(relationString: string, allTables: Record<string, any[]>) {
  // Example: 'categories (name)' or 'assigned_to:users!assigned_to (email)'
  const parts = relationString.match(/(\w+)(?::(\w+)!(\w+))?\s*\(([^)]+)\)/);

  if (!parts) {
    // Handle simple direct column selection or invalid format
    return (item: any) => item;
  }

  const [, aliasOrTable, foreignTable, foreignKey, selectColumnsStr] = parts;
  const selectColumns = selectColumnsStr.split(',').map(col => col.trim());

  let localKey: string;
  let targetTable: string;
  let targetIdField: string = 'id'; // Default ID field in related table

  if (foreignTable && foreignKey) {
    // Case: assigned_to:users!assigned_to (email)
    localKey = foreignKey; // e.g., 'assigned_to'
    targetTable = foreignTable; // e.g., 'users'
  } else {
    // Case: categories (name)
    localKey = `${aliasOrTable}_id`; // e.g., 'category_id'
    targetTable = aliasOrTable; // e.g., 'categories'
  }

  const relatedData = allTables[targetTable];

  return (item: any) => {
    const joinedItem = deepCopy(item);
    const fkValue = joinedItem[localKey];

    if (fkValue !== undefined && fkValue !== null && relatedData) {
      const relatedRecord = relatedData.find((record: any) => record[targetIdField] === fkValue);
      if (relatedRecord) {
        const selectedRelated = selectColumns.reduce((acc: any, col: string) => {
          acc[col] = relatedRecord[col];
          return acc;
        }, {});
        joinedItem[aliasOrTable] = selectedRelated;
      } else {
        joinedItem[aliasOrTable] = null; // Or handle as per Supabase behavior for no match
      }
    } else {
      joinedItem[aliasOrTable] = null;
    }
    return joinedItem;
  };
}