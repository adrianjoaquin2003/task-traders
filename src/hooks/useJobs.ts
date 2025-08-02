// IMPORT REACT QUERY HOOKS - These help us manage API calls to our database
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';  // Our database connection
import { useToast } from '@/hooks/use-toast';  // For showing success/error messages

// JOB INTERFACE - Defines the structure of a job object from our database
// TypeScript interfaces help prevent bugs by ensuring data has the right shape
export interface Job {
  id: string;                    // Unique identifier for each job
  title: string;                 // Job title (e.g., "Kitchen Cabinet Painting")
  description: string;           // Detailed description of the work needed
  category: string;              // Type of work (e.g., "painting", "plumbing")
  budget_min: number;            // Minimum budget in cents (e.g., 10000 = $100)
  budget_max: number;            // Maximum budget in cents
  budget_type: string;           // "range" or "hourly"
  location: string;              // Where the job is located
  timeline: string;              // When the work needs to be done
  status: string;                // "open", "in_progress", "completed", etc.
  homeowner_id: string | null;   // ID of the person who posted the job (null if not logged in)
  homeowner_name: string;        // Name of the person who posted the job
  homeowner_verified: boolean;   // Whether the homeowner is verified
  created_at: string;            // When the job was posted (timestamp)
  updated_at: string;            // When the job was last modified (timestamp)
}

// NEW JOB INTERFACE - Defines what data we need to create a new job
// This is separate from Job because it doesn't have id, created_at, etc. (database generates those)
export interface NewJob {
  title: string;                      // Required: Job title
  description: string;                // Required: Job description
  category: string;                   // Required: Job category
  budget_min: number;                 // Required: Minimum budget in cents
  budget_max: number;                 // Required: Maximum budget in cents
  budget_type?: string;               // Optional: "range" or "hourly" (? means optional)
  location: string;                   // Required: Job location
  timeline?: string;                  // Optional: When work needs to be done
  homeowner_name: string;             // Required: Name of person posting job
  homeowner_verified?: boolean;       // Optional: Whether homeowner is verified
}

// HOOK TO FETCH JOBS FROM DATABASE - This is a custom React hook
// Hooks are functions that let us use React features (they start with "use")
export const useJobs = () => {
  // useQuery automatically fetches data and manages loading/error states
  return useQuery({
    queryKey: ['jobs'],  // Unique identifier for this query (used for caching)
    
    // queryFn - The function that actually fetches the data
    queryFn: async () => {
      // Call Supabase database to get jobs
      const { data, error } = await supabase
        .from('jobs')                          // From the "jobs" table
        .select('*')                           // Select all columns (*)
        .eq('status', 'open')                  // Only get jobs where status equals 'open'
        .order('created_at', { ascending: false }); // Sort by newest first (false = descending)
      
      // If there was an error fetching data, throw it (React Query will catch it)
      if (error) throw error;
      
      // Return the data, telling TypeScript it's an array of Job objects
      return data as Job[];
    }
  });
};

// HOOK TO CREATE NEW JOBS - This handles posting a new job to the database
export const useCreateJob = () => {
  // Get access to the query client (manages our cached data)
  const queryClient = useQueryClient();
  // Get the toast function (for showing success/error messages)
  const { toast } = useToast();

  // useMutation is for operations that change data (CREATE, UPDATE, DELETE)
  // Unlike useQuery (which fetches), mutations only run when we tell them to
  return useMutation({
    // The function that actually creates the job in the database
    mutationFn: async (newJob: NewJob) => {
      // Insert the new job data into Supabase
      const { data, error } = await supabase
        .from('jobs')           // Into the "jobs" table
        .insert(newJob)         // Insert the newJob data
        .select()               // Return the inserted data
        .single();              // Expect only one row back
      
      // If database returns an error, throw it
      if (error) throw error;
      // Return the newly created job data
      return data;
    },
    
    // onSuccess runs when the job is successfully created
    onSuccess: () => {
      // Invalidate the jobs query to refetch fresh data
      // This ensures the new job appears in the job list immediately
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      
      // Show success message to user
      toast({
        title: "Job Posted Successfully!",
        description: "Your job has been posted and professionals will start bidding soon.",
      });
    },
    
    // onError runs if something went wrong creating the job
    onError: (error) => {
      // Show error message to user
      toast({
        title: "Failed to post job",
        description: "Please try again later.",
        variant: "destructive"  // Makes the toast red/error styling
      });
      // Log the error to browser console for debugging
      console.error('Error creating job:', error);
    }
  });
};