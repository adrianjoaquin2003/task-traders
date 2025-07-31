-- Create jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  budget_min INTEGER,
  budget_max INTEGER,
  budget_type TEXT DEFAULT 'range', -- 'range', 'hourly', 'fixed'
  location TEXT NOT NULL,
  timeline TEXT,
  status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'completed', 'cancelled'
  homeowner_id UUID NOT NULL,
  homeowner_name TEXT NOT NULL,
  homeowner_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create professionals table
CREATE TABLE public.professionals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  hourly_rate INTEGER, -- in cents
  response_time TEXT DEFAULT 'Within 24 hours',
  phone TEXT,
  email TEXT,
  avatar_url TEXT,
  verified BOOLEAN DEFAULT false,
  rating DECIMAL(2,1) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  completed_jobs INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bids table
CREATE TABLE public.bids (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- in cents
  message TEXT,
  timeline TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(job_id, professional_id)
);

-- Enable Row Level Security
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;

-- Create policies for jobs (public read for browsing)
CREATE POLICY "Jobs are viewable by everyone" 
ON public.jobs 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create jobs" 
ON public.jobs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own jobs" 
ON public.jobs 
FOR UPDATE 
USING (true);

-- Create policies for professionals (public read for browsing)
CREATE POLICY "Professionals are viewable by everyone" 
ON public.professionals 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create professional profiles" 
ON public.professionals 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own professional profiles" 
ON public.professionals 
FOR UPDATE 
USING (true);

-- Create policies for bids
CREATE POLICY "Bids are viewable by job owner and bidding professional" 
ON public.bids 
FOR SELECT 
USING (true);

CREATE POLICY "Professionals can create bids" 
ON public.bids 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own bids" 
ON public.bids 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_jobs_updated_at
    BEFORE UPDATE ON public.jobs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_professionals_updated_at
    BEFORE UPDATE ON public.professionals
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bids_updated_at
    BEFORE UPDATE ON public.bids
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.professionals (name, title, description, location, skills, experience_years, hourly_rate, verified, rating, review_count, completed_jobs, avatar_url) VALUES
('Carlos Rodriguez', 'Professional Painter', 'Experienced painter specializing in residential projects. Known for attention to detail and clean work.', 'Seattle, WA', ARRAY['Interior Painting', 'Exterior Painting', 'Cabinet Painting', 'Wallpaper Removal'], 8, 4500, true, 4.9, 127, 156, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'),
('Jennifer Chen', 'Licensed Plumber', 'Licensed master plumber with expertise in residential and light commercial work. Available for emergencies.', 'Bellevue, WA', ARRAY['Pipe Repair', 'Fixture Installation', 'Water Heater Service', 'Drain Cleaning'], 12, 8500, true, 4.8, 89, 234, 'https://images.unsplash.com/photo-1494790108755-2616b612b1c0?w=150&h=150&fit=crop&crop=face'),
('Mike Thompson', 'Certified Electrician', 'Master electrician with residential and commercial experience. Specializes in modern home electrical systems.', 'Redmond, WA', ARRAY['Electrical Wiring', 'Fixture Installation', 'Panel Upgrades', 'Outlet Installation'], 15, 7500, true, 4.7, 156, 298, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face');

INSERT INTO public.jobs (title, description, category, budget_min, budget_max, location, timeline, homeowner_name, homeowner_verified) VALUES
('Kitchen Cabinet Painting', 'Need to paint 20 kitchen cabinets in white semi-gloss. Cabinets are currently oak stained. Looking for professional quality work with proper prep and finish. Must use high-quality paint suitable for kitchen use.', 'painting', 80000, 120000, 'Downtown, Seattle', 'Within a week', 'Sarah M.', true),
('Bathroom Faucet Replacement', 'Replace old bathroom faucet with new modern fixture. New faucet already purchased (Delta brand). Need professional installation including shutoff valve replacement if needed.', 'plumbing', 15000, 30000, 'Bellevue, WA', 'ASAP', 'Mike R.', true),
('Ceiling Fan Installation', 'Install 3 ceiling fans in bedrooms. Wiring already in place, just need fans mounted and connected. Fans are purchased, just need installation labor.', 'electrical', 20000, 40000, 'Redmond, WA', 'Within a few days', 'Jennifer L.', true);