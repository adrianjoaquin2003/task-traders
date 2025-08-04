-- Remove the foreign key constraint that's causing the issue
-- The professional_id should reference user IDs, not require a professionals table record
ALTER TABLE bids DROP CONSTRAINT IF EXISTS bids_professional_id_fkey;

-- Make professional_id reference auth.users instead, but since we can't reference auth.users,
-- we'll just remove the constraint and rely on application logic
-- The professional_id will just be a UUID that matches user IDs

-- Ensure user_id is properly set for existing bids that might have null user_id
UPDATE bids SET user_id = professional_id WHERE user_id IS NULL AND professional_id IS NOT NULL;