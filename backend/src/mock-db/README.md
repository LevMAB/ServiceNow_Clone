# Mock Database System

⚠️ **WARNING: FOR TESTING PURPOSES ONLY** ⚠️

This directory contains a mock database system that replaces Supabase integration for testing purposes.

## Overview

The mock database system provides:
- In-memory data storage that mimics your Supabase schema
- Basic CRUD operations (Create, Read, Update, Delete)
- Simple join operations for nested selects
- Sample test data that represents realistic scenarios
- Same function signatures and return types as Supabase

## Files

- `data.ts` - Mock data structures and seed data
- `utils.ts` - Utility functions for data manipulation
- `mockSupabaseClient.ts` - Mock Supabase client implementation
- `README.md` - This documentation file

## Usage

### Enable Mock Database

Set the environment variable in your `backend/.env` file:
```bash
USE_MOCK_DB=true
```

### Disable Mock Database

Set the environment variable to false or remove it:
```bash
USE_MOCK_DB=false
```

## Features Supported

### Query Operations
- `select()` - Column selection with basic joins
- `eq()` - Equality filtering
- `order()` - Sorting by column
- `range()` - Pagination
- `single()` - Single record retrieval

### Data Operations
- `insert()` - Create new records
- `update()` - Update existing records
- `delete()` - Delete records

### Basic Joins
- Simple nested selects like `categories (name)`
- Foreign key relations like `assigned_to:users!assigned_to (email)`

## Limitations

### Not Implemented
- Complex filtering (`in`, `gt`, `lt`, `ilike`, `not`, `or`, `and`)
- Real-time subscriptions
- RPC (Remote Procedure Calls)
- Advanced join scenarios
- Count operations
- Limit operations (use range instead)

### Data Persistence
- All data is stored in memory
- Data resets on server restart
- No persistence between sessions

### Error Handling
- Basic error handling for duplicates
- Limited error codes compared to real database

## Sample Data

The mock database includes:
- 5 test users (admin, 2 agents, 2 requesters)
- 5 categories (IT Support, HR, Facilities, Finance, Security)
- 4 priorities (Low, Medium, High, Critical)
- 3 sample tickets with different statuses
- Comments and ticket history

## Extending the Mock Database

### Adding New Query Methods

To add support for additional Supabase query methods, extend the `MockQueryBuilder` class in `mockSupabaseClient.ts`:

```typescript
// Example: Adding 'in' filter support
in(column: string, values: any[]): MockQueryBuilder {
  this.filters.push({ column, value: values, operator: 'in' });
  return this;
}
```

### Adding New Tables

1. Add interface to `data.ts`
2. Add sample data array
3. Update `mockDatabase` object
4. Add case to `getTable()` function in `mockSupabaseClient.ts`

### Modifying Join Logic

Update the `performMockJoin()` function in `utils.ts` to handle more complex join scenarios.

## Testing

The mock database is designed to work with your existing tests without modification. Simply set `USE_MOCK_DB=true` and run your tests.

## Production Safety

⚠️ **CRITICAL**: This mock database system MUST be removed before production deployment.

### Removal Checklist
- [ ] Set `USE_MOCK_DB=false` in production environment
- [ ] Remove mock database files from production build
- [ ] Verify all tests pass with real Supabase
- [ ] Remove mock-related environment variables

## Troubleshooting

### Common Issues

1. **"Mock table not found" error**
   - Ensure the table name matches exactly in `getTable()` function
   - Check that the table is added to `mockDatabase` object

2. **Join not working**
   - Verify the relation string format matches expected patterns
   - Check that foreign key relationships are correctly defined

3. **Data not persisting**
   - Remember that mock database is in-memory only
   - Data resets on every server restart

### Debug Mode

Enable detailed logging by adding console.log statements in the mock client methods to trace query execution.