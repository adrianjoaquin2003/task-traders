import React, { useEffect, useState } from "react";
import { ArrowLeft, MapPin, Calendar, DollarSign, User, Clock, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";

interface JobDetailsPageProps {
  jobId: string;
  onViewChange: (view: string) => void;
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
  homeowner_name: string;
  homeowner_verified: boolean;
  created_at: string;
}

interface Bid {
  id: string;
  amount: number;
  bidder_name?: string;
  bidder_email?: string;
  bidder_phone?: string;
  hourly_rate?: number;
  estimated_hours?: number;
  message?: string;
  status: string;
  created_at: string;
}

const JobDetailsPage: React.FC<JobDetailsPageProps> = ({ jobId, onViewChange }) => {
  const [job, setJob] = useState<Job | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobDetails();
    fetchBids();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .single();

      if (error) throw error;
      setJob(data);
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };

  const fetchBids = async () => {
    try {
      const { data, error } = await supabase
        .from("bids")
        .select("*")
        .eq("job_id", jobId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBids(data || []);
    } catch (error) {
      console.error("Error fetching bids:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatBudget = (min?: number, max?: number, type?: string) => {
    if (!min && !max) return "Budget not specified";
    if (type === "fixed" && min) return `$${min.toLocaleString()}`;
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    return `$${(min || max)?.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading job details...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Job not found</p>
          <Button onClick={() => onViewChange("browse-jobs")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        </div>
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
            onClick={() => onViewChange("browse-jobs")}
            className="text-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl font-bold text-primary mb-2">
                      {job.title}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Posted {formatDate(job.created_at)}
                      </div>
                    </div>
                  </div>
                  <Badge variant={job.status === "open" ? "default" : "secondary"}>
                    {job.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {job.description}
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4" />
                      Budget
                    </h4>
                    <p className="text-muted-foreground">
                      {formatBudget(job.budget_min, job.budget_max, job.budget_type)}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4" />
                      Timeline
                    </h4>
                    <p className="text-muted-foreground">
                      {job.timeline || "To be discussed"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-2">
                    <User className="h-4 w-4" />
                    Homeowner
                  </h4>
                  <div className="flex items-center gap-2">
                    <span>{job.homeowner_name}</span>
                    {job.homeowner_verified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bids Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Active Bids ({bids.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bids.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No bids yet. Be the first to bid!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {bids.map((bid) => (
                      <div key={bid.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              {bid.bidder_name || "Anonymous"}
                            </span>
                            <Badge 
                              variant={bid.status === "pending" ? "outline" : "default"}
                              className="text-xs"
                            >
                              {bid.status}
                            </Badge>
                          </div>
                          <span className="font-bold text-primary">
                            ${bid.amount.toLocaleString()}
                          </span>
                        </div>

                        {bid.hourly_rate && bid.estimated_hours && (
                          <div className="text-sm text-muted-foreground mb-2">
                            ${bid.hourly_rate}/hr × {bid.estimated_hours} hours
                          </div>
                        )}

                        {bid.bidder_email && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                            <Mail className="h-3 w-3" />
                            {bid.bidder_email}
                          </div>
                        )}

                        {bid.bidder_phone && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                            <Phone className="h-3 w-3" />
                            {bid.bidder_phone}
                          </div>
                        )}

                        {bid.message && (
                          <p className="text-sm text-muted-foreground mt-2 pt-2 border-t">
                            "{bid.message}"
                          </p>
                        )}

                        <div className="text-xs text-muted-foreground mt-2">
                          Submitted {formatDate(bid.created_at)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;