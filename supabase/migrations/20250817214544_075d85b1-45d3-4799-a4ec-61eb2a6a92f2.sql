-- Create restricted table for sensitive financial data
CREATE TABLE IF NOT EXISTS public.bid_payment_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bid_id uuid NOT NULL REFERENCES public.bids(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  bank_account_number text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (bid_id)
);

-- Enable RLS
ALTER TABLE public.bid_payment_details ENABLE ROW LEVEL SECURITY;

-- Only the owner (bidder) can insert their own payment details and only for their own bid
CREATE POLICY "Users can create their own bid payment details"
ON public.bid_payment_details
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.bids b WHERE b.id = bid_id AND b.user_id = auth.uid()
  )
);

-- Only the owner can view their payment details
CREATE POLICY "Users can view their own bid payment details"
ON public.bid_payment_details
FOR SELECT
USING (auth.uid() = user_id);

-- Only the owner can update their payment details
CREATE POLICY "Users can update their own bid payment details"
ON public.bid_payment_details
FOR UPDATE
USING (
  auth.uid() = user_id
  AND EXISTS (SELECT 1 FROM public.bids b WHERE b.id = bid_id AND b.user_id = auth.uid())
)
WITH CHECK (auth.uid() = user_id);

-- Keep timestamps fresh
CREATE TRIGGER update_bid_payment_details_updated_at
BEFORE UPDATE ON public.bid_payment_details
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Migrate existing data from bids to the new table
INSERT INTO public.bid_payment_details (bid_id, user_id, bank_account_number, created_at, updated_at)
SELECT id, user_id, bank_account_number, now(), now()
FROM public.bids
WHERE bank_account_number IS NOT NULL;

-- Remove sensitive column from bids to prevent exposure
ALTER TABLE public.bids DROP COLUMN IF EXISTS bank_account_number;