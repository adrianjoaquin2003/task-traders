// IMPORT REACT HOOKS AND UI COMPONENTS
import { useState } from 'react';  // For managing form data state
import { Button } from '@/components/ui/button';  // Reusable button component
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';  // Card layout components
import { Input } from '@/components/ui/input';  // Text input field
import { Label } from '@/components/ui/label';  // Form labels
import { Textarea } from '@/components/ui/textarea';  // Multi-line text input
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';  // Dropdown selects
import { Badge } from '@/components/ui/badge';  // Small status indicators
import { ArrowLeft, MapPin, DollarSign, Calendar, CheckCircle } from 'lucide-react';  // Icons
import { useCreateJob, NewJob } from '@/hooks/useJobs';  // Custom hook for creating jobs
import { useAuth } from '@/hooks/useAuth';  // Authentication hook

// INTERFACE - Defines props this component expects
interface PostJobPageProps {
  onViewChange: (view: string) => void;  // Function to navigate between pages
}

// POST JOB PAGE COMPONENT - Form for creating new job posts
export const PostJobPage = ({ onViewChange }: PostJobPageProps) => {
  const { user, profile } = useAuth();
  // MUTATION HOOK - Handles creating jobs in the database
  // This gives us a function to call when user submits the form
  const createJobMutation = useCreateJob();
  
  // FORM STATE - Stores all the form field values
  // useState with an object to track multiple form fields at once
  const [formData, setFormData] = useState({
    title: '',        // Job title (e.g., "Kitchen Cabinet Painting")
    description: '',  // Detailed description of the work
    category: '',     // Type of work (painting, plumbing, etc.)
    budget: '',       // Budget range selected by user
    location: '',     // Where the job is located
    timeline: '',     // When the work needs to be done
    photos: []        // Array for uploaded photos (not implemented yet)
  });

  const categories = [
    'Painting',
    'Plumbing', 
    'Electrical',
    'General Maintenance',
    'Carpentry',
    'Cleaning',
    'Landscaping',
    'HVAC',
    'Roofing',
    'Other'
  ];

  const budgetRanges = [
    'Under $100',
    '$100 - $300',
    '$300 - $500',
    '$500 - $1,000',
    '$1,000 - $2,500',
    '$2,500 - $5,000',
    '$5,000+',
    'Hourly Rate'
  ];

  const timelines = [
    'ASAP (Within 24 hours)',
    'Within a few days',
    'Within a week',
    'Within a month',
    'Flexible timing'
  ];

  // HANDLE FORM SUBMISSION - Called when user clicks "Post Job"
  const handleSubmit = (e: React.FormEvent) => {
    // Prevent default form submission (which would reload the page)
    e.preventDefault();
    
    // Check if user is authenticated
    if (!user) {
      onViewChange('auth');
      return;
    }
    
    // FORM VALIDATION - Check that required fields are filled
    if (!formData.title || !formData.description || !formData.category || !formData.budget || !formData.location) {
      return;  // Exit early if any required field is missing
    }

    // BUDGET PARSING - Convert user-friendly budget range to database format
    // Find the budget range that matches what user selected
    const budgetRange = budgetRanges.find(range => 
      range.toLowerCase().replace(/[\s$+]/g, '-') === formData.budget
    );
    
    // Initialize budget values (stored in cents in database)
    let budget_min = 0;
    let budget_max = 0;
    
    // CONVERT BUDGET RANGES TO CENTS - Database stores money as integers (cents)
    // $100 = 10000 cents, $1000 = 100000 cents, etc.
    if (budgetRange?.includes('Under $100')) {
      budget_max = 10000; // $100 in cents
    } else if (budgetRange?.includes('$100 - $300')) {
      budget_min = 10000;   // $100 in cents
      budget_max = 30000;   // $300 in cents
    } else if (budgetRange?.includes('$300 - $500')) {
      budget_min = 30000;   // $300 in cents
      budget_max = 50000;   // $500 in cents
    } else if (budgetRange?.includes('$500 - $1,000')) {
      budget_min = 50000;   // $500 in cents
      budget_max = 100000;  // $1,000 in cents
    } else if (budgetRange?.includes('$1,000 - $2,500')) {
      budget_min = 100000;  // $1,000 in cents
      budget_max = 250000;  // $2,500 in cents
    } else if (budgetRange?.includes('$2,500 - $5,000')) {
      budget_min = 250000;  // $2,500 in cents
      budget_max = 500000;  // $5,000 in cents
    } else if (budgetRange?.includes('$5,000+')) {
      budget_min = 500000;  // $5,000+ in cents
    }

    // CREATE JOB OBJECT - Format data for database insertion
    const newJob: NewJob = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      budget_min,  // Minimum budget in cents
      budget_max,  // Maximum budget in cents
      budget_type: budgetRange?.includes('Hourly') ? 'hourly' : 'range',  // Budget type
      location: formData.location,
      timeline: formData.timeline,
      homeowner_name: profile?.full_name || profile?.email || 'User', // Use actual user name
      homeowner_verified: false,  // TODO: Set based on actual user verification status
      user_id: user.id  // Set the authenticated user's ID
    };

    // SUBMIT TO DATABASE - Call our mutation hook to create the job
    createJobMutation.mutate(newJob, {
      // onSuccess runs if job creation was successful
      onSuccess: () => {
        // RESET FORM - Clear all form fields after successful submission
        setFormData({
          title: '',
          description: '',
          category: '',
          budget: '',
          location: '',
          timeline: '',
          photos: []
        });

        // REDIRECT USER - Navigate to browse jobs page after a short delay
        // This gives time for the success toast to show
        setTimeout(() => {
          onViewChange('browse-jobs');
        }, 2000);
      }
    });
  };

  // HANDLE INPUT CHANGES - Updates form state when user types in any field
  // This function is generic - it can update any field in our formData
  const handleInputChange = (field: string, value: string) => {
    // Use functional update to modify the specific field while keeping others unchanged
    // prev = previous state, ...prev = copy all existing fields, [field]: value = update specific field
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => onViewChange('home')} 
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">Post a Job</h1>
          <p className="text-muted-foreground">
            Tell us about your project and get competitive bids from trusted professionals
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>
                Provide a clear description of what needs to be done
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Kitchen Cabinet Painting"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project in detail. Include materials needed, scope of work, access requirements, etc."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="mt-1 min-h-32"
                />
              </div>
            </CardContent>
          </Card>

          {/* Location & Budget */}
          <Card>
            <CardHeader>
              <CardTitle>Location & Budget</CardTitle>
              <CardDescription>
                Help professionals understand the scope and location
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="City, State or ZIP code"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="mt-1 pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="budget">Budget Range *</Label>
                <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetRanges.map((range) => (
                      <SelectItem key={range} value={range.toLowerCase().replace(/[\s$+]/g, '-')}>
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timeline">Timeline</Label>
                <Select value={formData.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="When do you need this completed?" />
                  </SelectTrigger>
                  <SelectContent>
                    {timelines.map((timeline) => (
                      <SelectItem key={timeline} value={timeline.toLowerCase().replace(/[\s()]/g, '-')}>
                        {timeline}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <CheckCircle className="h-5 w-5 mr-2" />
                Tips for Better Responses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Be specific about materials, colors, and quality expectations</li>
                <li>• Include access information (stairs, parking, etc.)</li>
                <li>• Mention if you'll provide materials or if contractor should include them</li>
                <li>• Add photos if possible to help contractors understand the scope</li>
                <li>• Be realistic about timeline and budget expectations</li>
              </ul>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              type="submit" 
              size="lg" 
              className="flex-1"
              disabled={createJobMutation.isPending}
            >
              {createJobMutation.isPending ? 'Posting...' : 'Post Job'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              size="lg" 
              onClick={() => onViewChange('home')}
              className="flex-1 sm:flex-initial sm:px-8"
            >
              Save Draft
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};