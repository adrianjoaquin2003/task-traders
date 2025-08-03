// ==============================================
// SUBMIT BID PAGE COMPONENT
// ==============================================
// This component allows professionals to submit bids for jobs
// It includes a form with bidder information, pricing, and messaging

// REACT IMPORTS
import React, { useState } from "react";

// ICON IMPORTS - ArrowLeft for back navigation
import { ArrowLeft } from "lucide-react";

// UI COMPONENT IMPORTS - Pre-built components from our design system
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// CUSTOM HOOKS - useToast for showing success/error messages
import { useToast } from "@/hooks/use-toast";

// SUPABASE CLIENT - For database operations
import { supabase } from "@/integrations/supabase/client";

// COMPONENT PROPS INTERFACE
// Defines what data this component expects to receive from parent
interface SubmitBidPageProps {
  job: {
    id: string;           // Unique job identifier
    title: string;        // Job title to display
    description: string;  // Job description
    location: string;     // Job location
    budget_min?: number;  // Optional minimum budget
    budget_max?: number;  // Optional maximum budget
  };
  onViewChange: (view: string) => void; // Function to navigate to different pages
}

// MAIN COMPONENT FUNCTION
const SubmitBidPage: React.FC<SubmitBidPageProps> = ({ job, onViewChange }) => {
  // TOAST HOOK - For showing success/error notifications
  const { toast } = useToast();
  
  // SUBMISSION STATE - Prevents multiple submissions and shows loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // FORM DATA STATE - Stores all the form input values
  // Using a single object to manage multiple related form fields
  const [formData, setFormData] = useState({
    bidder_name: "",           // Professional's full name
    bidder_email: "",          // Contact email
    bidder_phone: "",          // Contact phone number
    hourly_rate: "",           // How much they charge per hour
    estimated_hours: "",       // How many hours they estimate the job will take
    bank_account_number: "",   // For payment processing
    message: "",               // Optional message to the homeowner
  });

  // FORM INPUT HANDLER
  // This function runs every time the user types in any form field
  // It updates the corresponding field in our formData state
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target; // Get the field name and new value
    setFormData(prev => ({ ...prev, [name]: value })); // Update only that field, keep others unchanged
  };

  // TOTAL CALCULATION FUNCTION
  // Calculates the total bid amount based on hourly rate × estimated hours
  // parseFloat converts strings to numbers, || 0 provides fallback if empty/invalid
  const calculateTotal = () => {
    const rate = parseFloat(formData.hourly_rate) || 0;
    const hours = parseFloat(formData.estimated_hours) || 0;
    return rate * hours;
  };

  // FORM SUBMISSION HANDLER
  // This function runs when the user clicks "Submit Bid"
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission (page reload)
    setIsSubmitting(true); // Show loading state and disable submit button

    try {
      // Calculate the total bid amount
      const total = calculateTotal();
      
      // INSERT BID INTO DATABASE
      // Using Supabase client to add a new record to the "bids" table
      const { error } = await supabase
        .from("bids")
        .insert({
          job_id: job.id,                                    // Link bid to specific job
          professional_id: null,                             // Will be set when authentication is implemented
          amount: total,                                     // Total calculated bid amount
          bidder_name: formData.bidder_name,                // Professional's name
          bidder_email: formData.bidder_email,              // Contact email
          bidder_phone: formData.bidder_phone,              // Contact phone
          hourly_rate: parseInt(formData.hourly_rate),      // Convert string to integer
          estimated_hours: parseInt(formData.estimated_hours), // Convert string to integer
          bank_account_number: formData.bank_account_number, // Payment info
          message: formData.message,                         // Optional message
          status: "pending",                                 // Default status for new bids
        });

      // CHECK FOR DATABASE ERRORS
      if (error) throw error;

      // SHOW SUCCESS MESSAGE
      toast({
        title: "Bid submitted successfully!",
        description: "Your bid has been submitted for review.",
      });

      // NAVIGATE BACK TO JOB LISTINGS
      onViewChange("browse-jobs");
      
    } catch (error) {
      // HANDLE ANY ERRORS
      console.error("Error submitting bid:", error);
      toast({
        title: "Error submitting bid",
        description: "Please try again later.",
        variant: "destructive", // Red error styling
      });
    } finally {
      // ALWAYS RESET LOADING STATE
      // This runs whether the submission succeeded or failed
      setIsSubmitting(false);
    }
  };

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

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary">
                Submit Bid for: {job.title}
              </CardTitle>
              <p className="text-muted-foreground">{job.location}</p>
              {job.budget_min && job.budget_max && (
                <p className="text-sm text-muted-foreground">
                  Budget: ${job.budget_min} - ${job.budget_max}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bidder_name">Full Name *</Label>
                    <Input
                      id="bidder_name"
                      name="bidder_name"
                      value={formData.bidder_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="bidder_email">Email *</Label>
                    <Input
                      id="bidder_email"
                      name="bidder_email"
                      type="email"
                      value={formData.bidder_email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bidder_phone">Phone Number *</Label>
                  <Input
                    id="bidder_phone"
                    name="bidder_phone"
                    type="tel"
                    value={formData.bidder_phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hourly_rate">Hourly Rate ($) *</Label>
                    <Input
                      id="hourly_rate"
                      name="hourly_rate"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.hourly_rate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="estimated_hours">Estimated Hours *</Label>
                    <Input
                      id="estimated_hours"
                      name="estimated_hours"
                      type="number"
                      min="0"
                      step="0.5"
                      value={formData.estimated_hours}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-lg font-semibold text-primary">
                    Total Bid Amount: ${calculateTotal().toFixed(2)}
                  </p>
                </div>

                <div>
                  <Label htmlFor="bank_account_number">Bank Account Number *</Label>
                  <Input
                    id="bank_account_number"
                    name="bank_account_number"
                    value={formData.bank_account_number}
                    onChange={handleInputChange}
                    placeholder="For payment processing"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Additional Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell the homeowner why you're the best choice for this job..."
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Bid"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubmitBidPage;