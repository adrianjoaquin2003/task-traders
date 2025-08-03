-- Fix the function search path security issue
CREATE OR REPLACE FUNCTION calculate_bid_total()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- If hourly_rate and estimated_hours are provided, calculate total
  IF NEW.hourly_rate IS NOT NULL AND NEW.estimated_hours IS NOT NULL THEN
    NEW.amount = NEW.hourly_rate * NEW.estimated_hours;
  END IF;
  RETURN NEW;
END;
$$;