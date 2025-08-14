// ==============================================
// ASSIGNED JOBS PAGE COMPONENT
// ==============================================
// This component displays jobs that have been assigned to the current professional
// (jobs where their bid was accepted)

// REACT IMPORTS
import React, { useEffect, useState } from "react";

// ICON IMPORTS - Various icons for different sections
import { Calendar, MapPin, DollarSign, Eye, MessageCircle, CheckCircle } from "lucide-react";

// UI COMPONENT IMPORTS
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

// SUPABASE CLIENT - For fetching assigned jobs data
import { supabase } from "@/integrations/supabase/client";

// COMPONENT PROPS INTERFACE
interface AssignedJobsPageProps {
  onViewChange: (view: string, data?: any) => void;
}

// ASSIGNED JOB DATA INTERFACE
interface AssignedJob {
  job_id: string;
  job_title: string;
  job_description: string;
  job_location: string;
  job_category: string;
  job_status: string;
  homeowner_name: string;
  homeowner_verified: boolean;
  created_at: string;
  bid_amount: number;
  bid_status: string;
  job_poster_id: string;
}

// MAIN COMPONENT FUNCTION
const AssignedJobsPage: React.FC<AssignedJobsPageProps> = ({ onViewChange }) => {
  const { user, isProfessional } = useAuth();
  const { toast } = useToast();
  
  // STATE VARIABLES
  const [assignedJobs, setAssignedJobs] = useState<AssignedJob[]>([]);
  const [loading, setLoading] = useState(true);

  // EFFECT HOOK - Runs when component mounts
  useEffect(() => {
    if (user && isProfessional) {
      fetchAssignedJobs();
    }
  }, [user, isProfessional]);

  // FETCH ASSIGNED JOBS FUNCTION
  const fetchAssignedJobs = async () => {
    try {
      setLoading(true);
      
      // Query for jobs where the current user has an accepted bid
      const { data, error } = await supabase
        .from('bids')
        .select(`
          job_id,
          amount,
          status,
          jobs:job_id (
            id,
            title,
            description,
            location,
            category,
            status,
            homeowner_name,
            homeowner_verified,
            created_at,
            user_id
          )
        `)
        .eq('professional_id', user!.id)
        .eq('status', 'accepted')
        .eq('status', 'in-progress')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our interface
      const transformedData: AssignedJob[] = data?.map((item: any) => ({
        job_id: item.job_id,
        job_title: item.jobs.title,
        job_description: item.jobs.description,
        job_location: item.jobs.location,
        job_category: item.jobs.category,
        job_status: item.jobs.status,
        homeowner_name: item.jobs.homeowner_name,
        homeowner_verified: item.jobs.homeowner_verified,
        created_at: item.jobs.created_at,
        bid_amount: item.amount,
        bid_status: item.status,
        job_poster_id: item.jobs.user_id
      })) || [];

      setAssignedJobs(transformedData);
    } catch (error) {
      console.error('Error fetching assigned jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load assigned jobs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // UTILITY FUNCTIONS

  // FORMAT DATE FUNCTION
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // FORMAT CURRENCY FUNCTION
  const formatCurrency = (amount: number) => {
    return `$${(amount / 100).toLocaleString()}`;
  };

  // GET STATUS COLOR FUNCTION
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'open':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  // Redirect if not a professional
  if (!isProfessional) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">
            This page is only available for professionals
          </p>
          <Button onClick={() => onViewChange('home')}>
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* PAGE HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">My Assigned Jobs</h1>
          <p className="text-lg text-muted-foreground">
            Jobs where your bid has been accepted and you're actively working
          </p>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* STATS SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{assignedJobs.length}</p>
                      <p className="text-sm text-muted-foreground">Assigned Jobs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">
                        {formatCurrency(assignedJobs.reduce((sum, job) => sum + job.bid_amount, 0))}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Value</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">
                        {assignedJobs.filter(job => job.job_status === 'in-progress').length}
                      </p>
                      <p className="text-sm text-muted-foreground">In Progress</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* JOBS LIST */}
            {assignedJobs.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Assigned Jobs Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    When homeowners accept your bids, they'll appear here
                  </p>
                  <Button onClick={() => onViewChange('browse-jobs')}>
                    Browse Available Jobs
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {assignedJobs.map((job) => (
                  <Card key={job.job_id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <CardTitle className="text-xl font-bold text-primary mb-2">
                            {job.job_title}
                          </CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.job_location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Assigned {formatDate(job.created_at)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-4 sm:mt-0">
                          <Badge variant={getStatusColor(job.job_status)}>
                            {job.job_status}
                          </Badge>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">
                              {formatCurrency(job.bid_amount)}
                            </p>
                            <p className="text-xs text-muted-foreground">Your bid</p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        {/* Job Description */}
                        <div>
                          <h4 className="font-semibold mb-2">Description</h4>
                          <p className="text-muted-foreground">
                            {job.job_description.length > 200 
                              ? `${job.job_description.substring(0, 200)}...` 
                              : job.job_description
                            }
                          </p>
                        </div>

                        {/* Homeowner Info */}
                        <div>
                          <h4 className="font-semibold mb-2">Homeowner</h4>
                          <div className="flex items-center gap-2">
                            <span>{job.homeowner_name}</span>
                            {job.homeowner_verified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                          <Button 
                            onClick={() => onViewChange('job-details', { jobId: job.job_id })}
                            className="flex-1"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          
                          <Button 
                            variant="outline"
                            onClick={() => onViewChange('job-details', { jobId: job.job_id })}
                            className="flex-1"
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Message Homeowner
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AssignedJobsPage;