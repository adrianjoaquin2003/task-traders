-- Secure bids visibility and updates; restrict to job owner and bidder only
-- 1) Ensure RLS is enabled
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;

-- 2) Drop overly permissive policies
DROP POLICY IF EXISTS "Bids are viewable by job owner and bidding professional" ON public.bids;
DROP POLICY IF EXISTS "Users can update their own bids" ON public.bids;
DROP POLICY IF EXISTS "Users can create bids on jobs they don't own" ON public.bids;

-- 3) Recreate secure policies scoped to authenticated users only

-- Allow bidders to create bids on jobs they do not own
CREATE POLICY "Users can create bids on jobs they don't own"
ON public.bids
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND public.user_is_not_job_poster(auth.uid(), job_id)
);

-- Allow viewing bids only to the bidding user or the job owner
CREATE POLICY "Bids visible to job owner and bidder"
ON public.bids
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1
    FROM public.jobs j
    WHERE j.id = public.bids.job_id
      AND j.user_id = auth.uid()
  )
);

-- Allow users to update only their own bids
CREATE POLICY "Users can update their own bids"
ON public.bids
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
