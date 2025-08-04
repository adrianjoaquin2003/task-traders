import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, MapPin, Calendar, DollarSign, Eye, Users, MessageCircle, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import ChatButton from '@/components/ChatButton';
import { format } from 'date-fns';

interface MyJobsPageProps {
  onViewChange: (view: string, data?: any) => void;
}

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  budget_min?: number;
  budget_max?: number;
  budget_type: string;
  timeline?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Bid {
  id: string;
  job_id: string;
  professional_id?: string;
  bidder_name?: string;
  bidder_email?: string;
  bidder_phone?: string;
  amount: number;
  hourly_rate?: number;
  estimated_hours?: number;
  message?: string;
  status: string;
  created_at: string;
}

const MyJobsPage: React.FC<MyJobsPageProps> = ({ onViewChange }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobBids, setJobBids] = useState<Record<string, Bid[]>>({});
  const [loading, setLoading] = useState(true);
  const [chatDialogOpen, setChatDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMyJobs();
    }
  }, [user]);

  const fetchMyJobs = async () => {
    if (!user) return;

    try {
      // Fetch jobs posted by this user
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (jobsError) throw jobsError;
      setJobs(jobsData || []);

      // Fetch bids for each job
      if (jobsData && jobsData.length > 0) {
        const jobIds = jobsData.map(job => job.id);
        const { data: bidsData, error: bidsError } = await supabase
          .from('bids')
          .select('*')
          .in('job_id', jobIds)
          .order('created_at', { ascending: false });

        if (bidsError) throw bidsError;

        // Group bids by job_id
        const bidsGrouped = (bidsData || []).reduce((acc, bid) => {
          if (!acc[bid.job_id]) acc[bid.job_id] = [];
          acc[bid.job_id].push(bid);
          return acc;
        }, {} as Record<string, Bid[]>);

        setJobBids(bidsGrouped);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load your jobs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateJobStatus = async (jobId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', jobId);

      if (error) throw error;

      // Update local state
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, status: newStatus } : job
      ));

      toast({
        title: "Success",
        description: `Job status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating job status:', error);
      toast({
        title: "Error",
        description: "Failed to update job status",
        variant: "destructive"
      });
    }
  };

  const acceptBid = async (bidId: string, jobId: string) => {
    try {
      // Update the accepted bid status
      const { error: bidError } = await supabase
        .from('bids')
        .update({ status: 'accepted' })
        .eq('id', bidId);

      if (bidError) throw bidError;

      // Reject all other bids for this job
      const { error: rejectError } = await supabase
        .from('bids')
        .update({ status: 'rejected' })
        .eq('job_id', jobId)
        .neq('id', bidId);

      if (rejectError) throw rejectError;

      // Update job status to in-progress
      await updateJobStatus(jobId, 'in-progress');

      // Update local state
      setJobBids(prev => ({
        ...prev,
        [jobId]: prev[jobId]?.map(bid => ({
          ...bid,
          status: bid.id === bidId ? 'accepted' : 'rejected'
        })) || []
      }));

      toast({
        title: "Success",
        description: "Bid accepted successfully!",
      });
    } catch (error) {
      console.error('Error accepting bid:', error);
      toast({
        title: "Error",
        description: "Failed to accept bid",
        variant: "destructive"
      });
    }
  };

  const rejectBid = async (bidId: string, jobId: string) => {
    try {
      const { error } = await supabase
        .from('bids')
        .update({ status: 'rejected' })
        .eq('id', bidId);

      if (error) throw error;

      // Update local state
      setJobBids(prev => ({
        ...prev,
        [jobId]: prev[jobId]?.map(bid => 
          bid.id === bidId ? { ...bid, status: 'rejected' } : bid
        ) || []
      }));

      toast({
        title: "Success",
        description: "Bid rejected",
      });
    } catch (error) {
      console.error('Error rejecting bid:', error);
      toast({
        title: "Error",
        description: "Failed to reject bid",
        variant: "destructive"
      });
    }
  };

  const formatBudget = (min?: number, max?: number, type?: string) => {
    if (!min && !max) return "Budget not specified";
    if (type === "fixed" && min) return `$${(min / 100).toLocaleString()}`;
    if (min && max) return `$${(min / 100).toLocaleString()} - $${(max / 100).toLocaleString()}`;
    return `$${((min || max)! / 100).toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'default';
      case 'in-progress': return 'secondary';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  const handleStartChat = (conversationId: string) => {
    setChatDialogOpen(true);
    // You can implement chat dialog opening logic here
    toast({
      title: "Chat Started",
      description: "Chat functionality will open here",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading your jobs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewChange("home")}
            className="text-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Jobs</h1>
            <p className="text-muted-foreground">Manage your posted jobs and review bids</p>
          </div>
          <Button onClick={() => onViewChange('post-job')}>
            Post New Job
          </Button>
        </div>

        {jobs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">You haven't posted any jobs yet</p>
              <Button onClick={() => onViewChange('post-job')}>
                Post Your First Job
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => {
              const bids = jobBids[job.id] || [];
              const acceptedBid = bids.find(bid => bid.status === 'accepted');
              const pendingBids = bids.filter(bid => bid.status === 'pending');

              return (
                <Card key={job.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold text-primary mb-2">
                          {job.title}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(job.created_at), 'MMM dd, yyyy')}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {formatBudget(job.budget_min, job.budget_max, job.budget_type)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                        <Select
                          value={job.status}
                          onValueChange={(value) => updateJobStatus(job.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground line-clamp-3">{job.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">{bids.length} bids</span>
                        </div>
                        {acceptedBid && (
                          <Badge variant="secondary">
                            Bid Accepted: ${(acceptedBid.amount / 100).toLocaleString()}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewChange('job-details', { jobId: job.id })}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        {acceptedBid && acceptedBid.professional_id && (
                          <ChatButton
                            jobId={job.id}
                            jobPosterId={user?.id || ''}
                            professionalId={acceptedBid.professional_id}
                            onStartChat={handleStartChat}
                            variant="outline"
                            size="sm"
                          />
                        )}
                      </div>
                    </div>

                    {pendingBids.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-semibold mb-3">Pending Bids ({pendingBids.length})</h4>
                          <div className="space-y-3">
                            {pendingBids.slice(0, 3).map((bid) => (
                              <div key={bid.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium">
                                      {bid.bidder_name || 'Anonymous Bidder'}
                                    </span>
                                    <span className="font-bold text-primary">
                                      ${(bid.amount / 100).toLocaleString()}
                                    </span>
                                  </div>
                                  {bid.message && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                      "{bid.message}"
                                    </p>
                                  )}
                                  {bid.bidder_email && (
                                    <p className="text-xs text-muted-foreground">{bid.bidder_email}</p>
                                  )}
                                </div>
                                <div className="flex gap-2 ml-4">
                                  <Button
                                    size="sm"
                                    onClick={() => acceptBid(bid.id, job.id)}
                                    disabled={job.status !== 'open'}
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Accept
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => rejectBid(bid.id, job.id)}
                                    disabled={job.status !== 'open'}
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                  {bid.professional_id && (
                                    <ChatButton
                                      jobId={job.id}
                                      jobPosterId={user?.id || ''}
                                      professionalId={bid.professional_id}
                                      onStartChat={handleStartChat}
                                      variant="ghost"
                                      size="sm"
                                    />
                                  )}
                                </div>
                              </div>
                            ))}
                            {pendingBids.length > 3 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onViewChange('job-details', { jobId: job.id })}
                                className="w-full"
                              >
                                View all {pendingBids.length} bids
                              </Button>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobsPage;