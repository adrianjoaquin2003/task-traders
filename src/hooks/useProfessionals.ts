import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Professional {
  id: string;
  user_id: string | null;
  name: string;
  title: string;
  description: string | null;
  location: string;
  skills: string[];
  experience_years: number;
  hourly_rate: number | null;
  response_time: string;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
  verified: boolean;
  rating: number;
  review_count: number;
  completed_jobs: number;
  created_at: string;
  updated_at: string;
}

export const useProfessionals = () => {
  return useQuery({
    queryKey: ['professionals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .order('rating', { ascending: false });
      
      if (error) throw error;
      return data as Professional[];
    }
  });
};