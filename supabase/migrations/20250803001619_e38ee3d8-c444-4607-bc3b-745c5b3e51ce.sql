-- Add new columns to bids table for enhanced bid information
ALTER TABLE public.bids 
ADD COLUMN bidder_name TEXT,
ADD COLUMN bidder_email TEXT,
ADD COLUMN bidder_phone TEXT,
ADD COLUMN hourly_rate INTEGER,
ADD COLUMN estimated_hours INTEGER,
ADD COLUMN bank_account_number TEXT;

-- Update the total amount calculation trigger (optional enhancement)
CREATE OR REPLACE FUNCTION calculate_bid_total()
RETURNS TRIGGER AS $$
BEGIN
  -- If hourly_rate and estimated_hours are provided, calculate total
  IF NEW.hourly_rate IS NOT NULL AND NEW.estimated_hours IS NOT NULL THEN
    NEW.amount = NEW.hourly_rate * NEW.estimated_hours;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-calculate total when hourly rate and hours are provided
CREATE TRIGGER calculate_bid_total_trigger
  BEFORE INSERT OR UPDATE ON public.bids
  FOR EACH ROW
  EXECUTE FUNCTION calculate_bid_total();