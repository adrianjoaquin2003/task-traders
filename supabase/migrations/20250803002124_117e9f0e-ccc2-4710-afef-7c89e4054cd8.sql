-- Make professional_id nullable in bids table since auth is not implemented yet
ALTER TABLE public.bids 
ALTER COLUMN professional_id DROP NOT NULL;