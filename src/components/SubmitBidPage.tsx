import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SubmitBidPageProps {
  job: {
    id: string;
    title: string;
    description: string;
    location: string;
    budget_min?: number;
    budget_max?: number;
  };
  onViewChange: (view: string) => void;
}

const SubmitBidPage: React.FC<SubmitBidPageProps> = ({ job, onViewChange }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    bidder_name: "",
    bidder_email: "",
    bidder_phone: "",
    hourly_rate: "",
    estimated_hours: "",
    bank_account_number: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    const rate = parseFloat(formData.hourly_rate) || 0;
    const hours = parseFloat(formData.estimated_hours) || 0;
    return rate * hours;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const total = calculateTotal();
      
      const { error } = await supabase
        .from("bids")
        .insert({
          job_id: job.id,
          professional_id: null, // Will be set when auth is implemented
          amount: total,
          bidder_name: formData.bidder_name,
          bidder_email: formData.bidder_email,
          bidder_phone: formData.bidder_phone,
          hourly_rate: parseInt(formData.hourly_rate),
          estimated_hours: parseInt(formData.estimated_hours),
          bank_account_number: formData.bank_account_number,
          message: formData.message,
          status: "pending",
        });

      if (error) throw error;

      toast({
        title: "Bid submitted successfully!",
        description: "Your bid has been submitted for review.",
      });

      onViewChange("browse-jobs");
    } catch (error) {
      console.error("Error submitting bid:", error);
      toast({
        title: "Error submitting bid",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
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