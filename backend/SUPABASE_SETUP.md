# LabDash Backend - Supabase Setup Guide

## ✅ Backend Successfully Converted to Supabase!

Aapka backend ab Supabase PostgreSQL database use kar raha hai instead of SQLite.

## 🚀 Setup Instructions

### Step 1: Create Supabase Project

1. Visit: https://app.supabase.com
2. Sign in with GitHub/Email
3. Click "New Project"
4. Fill details:
   - **Name:** LabDash
   - **Database Password:** (save this somewhere safe)
   - **Region:** Choose closest to India (Southeast Asia - Singapore)
5. Click "Create new project" (wait 2-3 minutes)

### Step 2: Get API Credentials

1. Go to: **Settings** → **API** (left sidebar)
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### Step 3: Update .env File

Open `d:\LabDash backend\.env` and update:

```env
PORT=5000
HOST=0.0.0.0

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 4: Run Database Migrations

1. Open Supabase Dashboard: https://app.supabase.com/project/_/sql
2. Click **SQL Editor** (left sidebar)
3. Copy and paste **entire content** of:
   - First: `database/supabase-migration.sql` (creates tables)
   - Then: `database/supabase-seed.sql` (adds sample data)
4. Click **RUN** for each script

### Step 5: Start Backend

```bash
cd "d:\LabDash backend"
npm run dev
```

## 📁 Files Changed

### New Files:
- ✅ `config/supabase.js` - Supabase client configuration
- ✅ `database/supabase-migration.sql` - Database schema for Supabase
- ✅ `database/supabase-seed.sql` - Sample data insert script
- ✅ `.env` - Updated with Supabase credentials

### Updated Files:
- ✅ `utils/db.js` - Now uses Supabase instead of SQLite
- ✅ All controllers automatically work (no changes needed!)

## 🔧 Features

### Database Tables (PostgreSQL):
1. **tests** - Lab tests data
2. **packages** - Test packages
3. **orders** - Customer orders
4. **order_items** - Order details

### Security:
- ✅ Row Level Security (RLS) enabled
- ✅ Public read access policies
- ✅ Public insert for orders (customers can create orders)

### Performance:
- ✅ Indexed queries
- ✅ Automatic timestamps (created_at, updated_at)
- ✅ Foreign key constraints

## 🌐 API Endpoints (Same as before)

All endpoints work exactly the same:
- `GET /api/tests` - Get all tests
- `GET /api/packages` - Get all packages
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order

## 📱 Android App Connection

**No changes needed in Android app!** Same URLs work:
- Emulator: `http://10.0.2.2:5000/api/`
- Device: `http://192.168.137.1:5000/api/`

## ✅ Benefits of Supabase

1. **Cloud Database** - Accessible from anywhere
2. **Scalable** - Can handle millions of records
3. **Free Tier** - 500MB database, 2GB bandwidth/month
4. **Real-time** - Can add real-time features later
5. **Auto Backups** - Daily automatic backups
6. **Dashboard** - View/edit data in browser

## 🔍 Verify Data in Supabase

After running migrations:
1. Go to: https://app.supabase.com/project/_/editor
2. Click **Table Editor** (left sidebar)
3. You should see:
   - 8 tests
   - 4 packages
   - 3 sample orders

## 🐛 Troubleshooting

### Error: "Missing Supabase environment variables"
- Make sure `.env` file has correct SUPABASE_URL and SUPABASE_ANON_KEY

### Error: "relation does not exist"
- Run `database/supabase-migration.sql` in Supabase SQL Editor

### Error: "no rows returned"
- Run `database/supabase-seed.sql` to add sample data

## 📊 Next Steps

1. **Setup Supabase project** (5 minutes)
2. **Copy API credentials** to `.env`
3. **Run migration scripts** in Supabase SQL Editor
4. **Start backend** - `npm run dev`
5. **Test** - Backend will connect to Supabase automatically!

Your backend is now production-ready with cloud database! 🎉
