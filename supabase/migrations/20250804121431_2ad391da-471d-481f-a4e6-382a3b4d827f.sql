
-- Remove the unique constraint that prevents multiple bids from the same user on the same job
ALTER TABLE bids DROP CONSTRAINT IF EXISTS bids_job_id_professional_id_key;
