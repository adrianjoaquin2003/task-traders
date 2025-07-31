import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  budget_min: number;
  budget_max: number;
  budget_type: string;
  location: string;
  timeline: string;
  status: string;
  homeowner_id: string | null;
  homeowner_name: string;
  homeowner_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewJob {
  title: string;
  description: string;
  category: string;
  budget_min: number;
  budget_max: number;
  budget_type?: string;
  location: string;
  timeline?: string;
  homeowner_name: string;
  homeowner_verified?: boolean;
}

export const useJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Job[];
    }
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (newJob: NewJob) => {
      const { data, error } = await supabase
        .from('jobs')
        .insert(newJob)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast({
        title: "Job Posted Successfully!",
        description: "Your job has been posted and professionals will start bidding soon.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to post job",
        description: "Please try again later.",
        variant: "destructive"
      });
      console.error('Error creating job:', error);
    }
  });
};