-- Create a function to check if a user is not the job poster
CREATE OR REPLACE FUNCTION public.user_is_not_job_poster(bid_user_id uuid, job_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.jobs 
    WHERE id = job_id AND user_id = bid_user_id
  );
$$;

-- Update the RLS policy for bid creation to prevent job posters from bidding on their own jobs
DROP POLICY IF EXISTS "Professionals can create bids" ON public.bids;

CREATE POLICY "Users can create bids on jobs they don't own" 
ON public.bids 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id 
  AND public.user_is_not_job_poster(auth.uid(), job_id)
);