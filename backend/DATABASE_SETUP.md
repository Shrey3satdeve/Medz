# LabDash Backend - Database Setup

## Database Structure

Aapke app ke liye SQLite database successfully setup ho gaya hai! 

### Tables

1. **tests** - Lab tests ki information
   - id, name, description, price, original_price, category, parameters, report_time, fasting

2. **packages** - Test packages
   - id, name, description, price, original_price, tests_count, parameters, report_time, popular, featured

3. **orders** - Customer orders
   - id, total_amount, date, status, appointment_date, appointment_time

4. **order_items** - Order me kaun se tests hain
   - order_id, test_id, test_name, test_price

## Database Location

📁 `database/labdash.db`

## Key Files

- `database/schema.sql` - Database schema definition
- `database/init.js` - Database initialization
- `database/seed.js` - Sample data populate karne ke liye
- `utils/db.js` - Database operations (updated to use SQLite)

## Commands

### Initialize/Reset Database
```bash
node database/seed.js
```

Yeh command:
- Database create karega
- All tables banayega
- JSON files se data migrate karega

## API Endpoints (All Working ✓)

- `GET /api/tests` - All tests list
- `GET /api/packages` - All packages list  
- `GET /api/orders` - All orders list
- `POST /api/orders` - New order create karo

## Next Steps

1. **Start Server**:
   ```bash
   npm run dev
   ```

2. **Test Endpoints** (already verified ✓):
   - GET /api/tests - 8 tests
   - GET /api/packages - 4 packages
   - GET /api/orders - Working
   - POST /api/orders - Working

## Features

✅ SQLite database (fast, lightweight, no separate server needed)
✅ Foreign keys enabled
✅ Indexed queries for better performance
✅ Transaction support
✅ All existing JSON data migrated
✅ Backward compatible API

## Database Benefits

- **Performance**: Database queries are faster than reading JSON files
- **Scalability**: Can handle thousands of orders easily
- **Relationships**: Proper foreign keys between orders and tests
- **Transactions**: Data integrity guaranteed
- **Indexing**: Fast searches on date, status, etc.

Database taiyaar hai! 🎉
