import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, DollarSign, Calendar, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PostJobPageProps {
  onViewChange: (view: string) => void;
}

export const PostJobPage = ({ onViewChange }: PostJobPageProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    location: '',
    timeline: '',
    photos: []
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.budget || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Job Posted Successfully!",
      description: "Your job has been posted and professionals will start bidding soon.",
    });

    // Reset form
    setFormData({
      title: '',
      description: '',
      category: '',
      budget: '',
      location: '',
      timeline: '',
      photos: []
    });

    // Redirect to browse jobs after a short delay
    setTimeout(() => {
      onViewChange('browse-jobs');
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
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
                      <SelectItem key={category} value={category.toLowerCase().replace(' ', '-')}>
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
            <Button type="submit" size="lg" className="flex-1">
              Post Job
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