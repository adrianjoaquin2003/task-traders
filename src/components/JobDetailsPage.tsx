// ==============================================
// JOB DETAILS PAGE COMPONENT
// ==============================================
// This component displays comprehensive information about a specific job
// including all details and submitted bids from professionals

// REACT IMPORTS
import React, { useEffect, useState } from "react";

// ICON IMPORTS - Various icons for different sections
import { ArrowLeft, MapPin, Calendar, DollarSign, User, Clock, Mail, Phone } from "lucide-react";

// UI COMPONENT IMPORTS
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// SUPABASE CLIENT - For fetching job and bid data
import { supabase } from "@/integrations/supabase/client";

// COMPONENT PROPS INTERFACE
interface JobDetailsPageProps {
  jobId: string;                              // ID of the job to display
  onViewChange: (view: string) => void;       // Function to navigate between pages
}

// JOB DATA INTERFACE
// Defines the structure of job data from the database
interface Job {
  id: string;                    // Unique job identifier
  title: string;                 // Job title
  description: string;           // Detailed job description
  location: string;              // Job location
  category: string;              // Job category (plumbing, electrical, etc.)
  budget_min?: number;           // Optional minimum budget
  budget_max?: number;           // Optional maximum budget
  budget_type: string;           // "range" or "fixed"
  timeline?: string;             // Optional timeline information
  status: string;                // Job status (open, closed, etc.)
  homeowner_name: string;        // Name of person who posted the job
  homeowner_verified: boolean;   // Whether homeowner is verified
  created_at: string;            // When the job was posted
}

// BID DATA INTERFACE
// Defines the structure of bid data from the database
interface Bid {
  id: string;                    // Unique bid identifier
  amount: number;                // Total bid amount
  bidder_name?: string;          // Optional bidder name
  bidder_email?: string;         // Optional contact email
  bidder_phone?: string;         // Optional contact phone
  hourly_rate?: number;          // Optional hourly rate
  estimated_hours?: number;      // Optional estimated hours
  message?: string;              // Optional message from bidder
  status: string;                // Bid status (pending, accepted, rejected)
  created_at: string;            // When the bid was submitted
}

// MAIN COMPONENT FUNCTION
const JobDetailsPage: React.FC<JobDetailsPageProps> = ({ jobId, onViewChange }) => {
  // STATE VARIABLES
  const [job, setJob] = useState<Job | null>(null);      // Stores job details, null initially
  const [bids, setBids] = useState<Bid[]>([]);           // Stores array of bids for this job
  const [loading, setLoading] = useState(true);          // Tracks if data is still loading

  // EFFECT HOOK - Runs when component mounts or jobId changes
  // This automatically fetches fresh data whenever we view a different job
  useEffect(() => {
    fetchJobDetails();  // Get the job information
    fetchBids();        // Get all bids for this job
  }, [jobId]); // Dependencies: re-run if jobId changes

  // FETCH JOB DETAILS FUNCTION
  // Retrieves job information from the database
  const fetchJobDetails = async () => {
    try {
      // QUERY DATABASE for job with matching ID
      const { data, error } = await supabase
        .from("jobs")              // From the jobs table
        .select("*")               // Select all columns
        .eq("id", jobId)           // Where id equals our jobId
        .single();                 // Expect only one result

      if (error) throw error;      // Handle any database errors
      setJob(data);                // Store the job data in state
    } catch (error) {
      console.error("Error fetching job details:", error);
      // Note: We don't set loading to false here because fetchBids() will do it
    }
  };

  // FETCH BIDS FUNCTION
  // Retrieves all bids submitted for this job
  const fetchBids = async () => {
    try {
      // QUERY DATABASE for all bids for this job
      const { data, error } = await supabase
        .from("bids")                                    // From the bids table
        .select("*")                                     // Select all columns
        .eq("job_id", jobId)                            // Where job_id matches our jobId
        .order("created_at", { ascending: false });     // Order by newest first

      if (error) throw error;       // Handle any database errors
      setBids(data || []);          // Store bids in state, use empty array if null
    } catch (error) {
      console.error("Error fetching bids:", error);
    } finally {
      // ALWAYS SET LOADING TO FALSE
      // This runs whether the fetch succeeded or failed
      setLoading(false);
    }
  };

  // UTILITY FUNCTIONS FOR FORMATTING DATA

  // FORMAT DATE FUNCTION
  // Converts database date string to readable format like "January 15, 2024"
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",     // Show full year
      month: "long",       // Show full month name
      day: "numeric",      // Show day number
    });
  };

  // FORMAT BUDGET FUNCTION
  // Displays budget information in a user-friendly way
  const formatBudget = (min?: number, max?: number, type?: string) => {
    if (!min && !max) return "Budget not specified";                           // No budget info
    if (type === "fixed" && min) return `$${min.toLocaleString()}`;            // Fixed budget
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`; // Budget range
    return `$${(min || max)?.toLocaleString()}`;                               // Single value (min or max)
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