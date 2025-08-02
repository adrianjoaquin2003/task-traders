// IMPORT REACT QUERY - For fetching data from our database
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';  // Database connection

// PROFESSIONAL INTERFACE - Defines the structure of professional data
// This matches the structure of our "professionals" table in Supabase
export interface Professional {
  id: string;                         // Unique identifier for each professional
  user_id: string | null;             // Link to user account (null if not registered)
  name: string;                       // Professional's full name
  title: string;                      // Professional title (e.g., "Licensed Electrician")
  description: string | null;         // Bio/description of services (can be empty)
  location: string;                   // Where the professional is based
  skills: string[];                   // Array of skills (e.g., ["painting", "drywall"])
  experience_years: number;           // Years of experience in their field
  hourly_rate: number | null;         // Hourly rate in cents (null if not specified)
  response_time: string;              // How quickly they respond (e.g., "within 2 hours")
  phone: string | null;               // Phone number (optional)
  email: string | null;               // Email address (optional)
  avatar_url: string | null;          // URL to profile picture (optional)
  verified: boolean;                  // Whether they've been verified by platform
  rating: number;                     // Average rating (0-5 stars)
  review_count: number;               // Total number of reviews received
  completed_jobs: number;             // Number of jobs completed on platform
  created_at: string;                 // When they joined the platform
  updated_at: string;                 // When profile was last updated
}

// HOOK TO FETCH PROFESSIONALS FROM DATABASE
export const useProfessionals = () => {
  // useQuery automatically fetches and caches the data
  return useQuery({
    queryKey: ['professionals'],  // Unique key for caching this data
    
    // Function that fetches the data
    queryFn: async () => {
      // Query Supabase database
      const { data, error } = await supabase
        .from('professionals')                    // From "professionals" table
        .select('*')                              // Get all columns
        .order('rating', { ascending: false });   // Sort by highest rating first
      
      // If error occurred, throw it (React Query handles error states)
      if (error) throw error;
      
      // Return data as Professional array
      return data as Professional[];
    }
  });
};