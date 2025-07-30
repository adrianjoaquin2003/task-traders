import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Search, MapPin, DollarSign, Clock, Users, Filter } from 'lucide-react';

interface BrowseJobsPageProps {
  onViewChange: (view: string) => void;
}

export const BrowseJobsPage = ({ onViewChange }: BrowseJobsPageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');

  const jobs = [
    {
      id: 1,
      title: "Kitchen Cabinet Painting",
      description: "Need to paint 20 kitchen cabinets in white semi-gloss. Cabinets are currently oak stained. Looking for professional quality work with proper prep and finish. Must use high-quality paint suitable for kitchen use.",
      budget: "$800 - $1,200",
      location: "Downtown, Seattle",
      category: "Painting",
      bids: 8,
      timePosted: "2 hours ago",
      timeline: "Within a week",
      homeowner: "Sarah M.",
      verified: true
    },
    {
      id: 2,
      title: "Bathroom Faucet Replacement", 
      description: "Replace old bathroom faucet with new modern fixture. New faucet already purchased (Delta brand). Need professional installation including shutoff valve replacement if needed.",
      budget: "$150 - $300",
      location: "Bellevue, WA",
      category: "Plumbing",
      bids: 12,
      timePosted: "4 hours ago",
      timeline: "ASAP",
      homeowner: "Mike R.",
      verified: true
    },
    {
      id: 3,
      title: "Ceiling Fan Installation",
      description: "Install 3 ceiling fans in bedrooms. Wiring already in place, just need fans mounted and connected. Fans are purchased, just need installation labor.",
      budget: "$200 - $400",
      location: "Redmond, WA",
      category: "Electrical",
      bids: 6,
      timePosted: "6 hours ago",
      timeline: "Within a few days",
      homeowner: "Jennifer L.",
      verified: true
    },
    {
      id: 4,
      title: "Deck Staining and Repair",
      description: "400 sq ft deck needs sanding, minor board replacement (estimate 5-8 boards), and re-staining. Deck is cedar, looking for natural stain color. Some loose boards and minor rot repair needed.",
      budget: "$600 - $900",
      location: "Kirkland, WA",
      category: "General Maintenance",
      bids: 15,
      timePosted: "8 hours ago",
      timeline: "Within a month",
      homeowner: "David K.",
      verified: true
    },
    {
      id: 5,
      title: "Garbage Disposal Installation",
      description: "Install new garbage disposal unit in kitchen sink. Unit is already purchased (InSinkErator 3/4 HP). Need electrical connection and plumbing hookup.",
      budget: "$120 - $250",
      location: "Tacoma, WA",
      category: "Plumbing",
      bids: 9,
      timePosted: "1 day ago",
      timeline: "Within a week",
      homeowner: "Lisa H.",
      verified: false
    },
    {
      id: 6,
      title: "Interior Room Painting",
      description: "Paint living room and dining room (approximately 400 sq ft total). Walls are currently light beige, want to change to light gray. Need professional prep work and clean application.",
      budget: "$400 - $700",
      location: "Renton, WA",
      category: "Painting",
      bids: 11,
      timePosted: "1 day ago",
      timeline: "Flexible",
      homeowner: "Tom W.",
      verified: true
    }
  ];

  const categories = ['All', 'Painting', 'Plumbing', 'Electrical', 'General Maintenance', 'Carpentry', 'Cleaning', 'Landscaping'];
  const budgetRanges = ['All', 'Under $200', '$200 - $500', '$500 - $1,000', '$1,000+'];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || job.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const handleBidClick = (jobId: number) => {
    onViewChange(`bid-${jobId}`);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Browse Jobs</h1>
          <p className="text-muted-foreground">
            Find projects that match your skills and submit competitive bids
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filter Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Budget Range" />
                </SelectTrigger>
                <SelectContent>
                  {budgetRanges.map((range) => (
                    <SelectItem key={range} value={range.toLowerCase()}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Location..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </p>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-elegant transition-all">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      {job.verified && (
                        <Badge variant="secondary" className="text-xs">Verified</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {job.timePosted}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {job.bids} bids
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end mb-1">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-primary">{job.budget}</span>
                    </div>
                    <Badge variant="secondary">{job.category}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{job.description}</p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4 text-sm">
                    <span><strong>Timeline:</strong> {job.timeline}</span>
                    <span><strong>Posted by:</strong> {job.homeowner}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleBidClick(job.id)}
                    >
                      Submit Bid
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">No jobs found matching your criteria.</p>
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setBudgetFilter('all');
                setLocationFilter('');
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};