-- LabDash Authentication System - Supabase Tables
-- Run this SQL in your Supabase SQL Editor

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password TEXT,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    google_id VARCHAR(255) UNIQUE,
    profile_picture TEXT,
    auth_provider VARCHAR(50) DEFAULT 'email' CHECK (auth_provider IN ('email', 'phone', 'google')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    CONSTRAINT email_or_phone_or_google_required CHECK (email IS NOT NULL OR phone IS NOT NULL OR google_id IS NOT NULL)
);

-- Create index for Google ID
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);

-- Create OTP verifications table
CREATE TABLE IF NOT EXISTS otp_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(20) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_otp_phone ON otp_verifications(phone);
CREATE INDEX IF NOT EXISTS idx_otp_expires ON otp_verifications(expires_at);

-- Create user orders table (for future use)
CREATE TABLE IF NOT EXISTS user_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    order_type VARCHAR(50) NOT NULL, -- 'lab_test', 'medicine', 'pet_care'
    order_details JSONB NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user lab tests table (for future use)
CREATE TABLE IF NOT EXISTS user_lab_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    test_name VARCHAR(255) NOT NULL,
    test_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    report_url TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sample_collected', 'processing', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lab_tests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders" ON user_orders
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own orders" ON user_orders
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- RLS Policies for lab tests
CREATE POLICY "Users can view their own lab tests" ON user_lab_tests
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Admin policies (bypass RLS for admin role)
-- You can create service role key in Supabase for admin operations

-- Insert sample admin user (change password in production!)
-- Password: Admin@12345 (hashed with bcrypt)
INSERT INTO users (name, email, password, role) 
VALUES ('Admin', 'admin@labdash.com', '$2a$10$8K1p/e0p0RCQp4zQBZq0aeqzHLxGqWJm7PZqZ.FaVq9yYiM5C6Vzi', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Clean up old OTPs automatically (run this as a Supabase function)
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS void AS $$
BEGIN
    DELETE FROM otp_verifications WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- You can schedule this function to run periodically using Supabase Edge Functions or pg_cron

COMMENT ON TABLE users IS 'User accounts with email/phone authentication';
COMMENT ON TABLE otp_verifications IS 'OTP codes for phone number verification';
COMMENT ON TABLE user_orders IS 'User order history for lab tests, medicines, and pet care';
COMMENT ON TABLE user_lab_tests IS 'User lab test bookings and reports';
