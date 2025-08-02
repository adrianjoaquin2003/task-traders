import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hammer, Users, Shield, Star, ArrowRight, Wrench, Paintbrush, Zap, Home, CheckCircle } from 'lucide-react';
import heroImage from '@/assets/hero-home-services.jpg';

interface HomePageProps {
  onViewChange: (view: string) => void;
}

export const HomePage = ({ onViewChange }: HomePageProps) => {
  const features = [
    {
      icon: Users,
      title: "Vetted Professionals",
      description: "All contractors are background-checked and verified for quality work."
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Protected payments released only when work is completed to satisfaction."
    },
    {
      icon: Star,
      title: "Quality Guarantee",
      description: "All work comes with our satisfaction guarantee and contractor insurance."
    }
  ];

  const serviceCategories = [
    { icon: Paintbrush, name: "Painting", jobs: 45 },
    { icon: Wrench, name: "Plumbing", jobs: 32 },
    { icon: Zap, name: "Electrical", jobs: 28 },
    { icon: Home, name: "General Maintenance", jobs: 67 }
  ];

  const recentJobs = [
    {
      id: 1,
      title: "Kitchen Cabinet Painting",
      description: "Need to paint 20 kitchen cabinets in white semi-gloss",
      budget: "$800 - $1,200",
      location: "Downtown, Seattle",
      bids: 8,
      timePosted: "2 hours ago"
    },
    {
      id: 2,
      title: "Bathroom Faucet Replacement", 
      description: "Replace old bathroom faucet with new modern fixture",
      budget: "$150 - $300",
      location: "Bellevue, WA",
      bids: 12,
      timePosted: "4 hours ago"
    },
    {
      id: 3,
      title: "Ceiling Fan Installation",
      description: "Install 3 ceiling fans in bedrooms, wiring already in place",
      budget: "$200 - $400",
      location: "Redmond, WA",
      bids: 6,
      timePosted: "6 hours ago"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-hero/80"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Connect with Trusted
              <span className="block text-accent">Home Service Pros</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Post your home maintenance job and get competitive bids from verified local professionals. 
              From painting to plumbing, find the right expert for your project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" variant="accent" onClick={() => onViewChange('post-job')}>
                Post Your Job
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="xl" variant="outline" className="border-white text-black hover:bg-white hover:text-primary" onClick={() => onViewChange('browse-jobs')}>
                Browse Jobs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose TaskBridge?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We make it easy and safe to connect homeowners with skilled professionals
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-elegant">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Popular Services</h2>
            <p className="text-muted-foreground">Find professionals for any home project</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-elegant transition-all cursor-pointer" onClick={() => onViewChange('browse-jobs')}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <category.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{category.name}</h3>
                  <Badge variant="secondary">{category.jobs} active jobs</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Jobs */}
      <section className="py-16 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Recent Job Posts</h2>
              <p className="text-muted-foreground">See what homeowners are looking for</p>
            </div>
            <Button variant="outline" onClick={() => onViewChange('browse-jobs')}>
              View All Jobs
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6">
            {recentJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-elegant transition-all cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{job.location}</p>
                    </div>
                    <Badge variant="secondary">{job.bids} bids</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{job.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-primary">{job.budget}</span>
                    <span className="text-sm text-muted-foreground">{job.timePosted}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-primary text-white border-0">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of homeowners and professionals using TaskBridge
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="accent" onClick={() => onViewChange('post-job')}>
                  Post Your First Job
                </Button>
                <Button size="lg" variant="outline" className="border-white text-black hover:bg-white hover:text-primary" onClick={() => onViewChange('professionals')}>
                  Browse Professionals
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};