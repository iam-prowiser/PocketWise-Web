-- Fix transaction_id column to support UUIDs
-- Current: VARCHAR(10) - too short for UUIDs (36 chars)
-- New: VARCHAR(50) - supports UUIDs and future ID formats

ALTER TABLE transactions
ALTER COLUMN transaction_id TYPE VARCHAR(50);

-- Also ensure users table has all required columns for profile
-- (These may already exist from signup)
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS college VARCHAR(100);
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS course VARCHAR(100);
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS year VARCHAR(20);
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(100);
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image TEXT;

-- Add index for faster user profile lookups
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);