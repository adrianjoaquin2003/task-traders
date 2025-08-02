import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hammer, Users, Shield, Star, ArrowRight, Wrench, Paintbrush, Zap, Home, CheckCircle, Waves, Palmtree, Umbrella } from 'lucide-react';
import heroImage from '@/assets/hero-home-services.jpg';
import { useJobs } from '@/hooks/useJobs';

interface HomePageProps {
  onViewChange: (view: string) => void;
}

export const HomePage = ({ onViewChange }: HomePageProps) => {
  const { data: jobs = [] } = useJobs();
  
  const features = [
    {
      icon: Users,
      title: "Bermuda-Certified Professionals",
      description: "All contractors are background-checked, insured, and experienced with Bermuda's unique building requirements."
    },
    {
      icon: Star,
      title: "Hurricane & Saltwater Ready",
      description: "Our experts understand Bermuda's climate challenges and use materials built for coastal living."
    }
  ];

  // Calculate active jobs by category
  const getActiveJobsCount = (categoryName: string) => {
    return jobs.filter(job => 
      job.status === 'open' && 
      job.category.toLowerCase().includes(categoryName.toLowerCase())
    ).length;
  };

  const serviceCategories = [
    { icon: Paintbrush, name: "Hurricane Prep & Cleanup", jobs: getActiveJobsCount("hurricane") },
    { icon: Wrench, name: "Saltwater Damage Repair", jobs: getActiveJobsCount("saltwater") },
    { icon: Umbrella, name: "Roof & Gutter Services", jobs: getActiveJobsCount("roof") },
    { icon: Waves, name: "Pool & Deck Maintenance", jobs: getActiveJobsCount("pool") },
    { icon: Home, name: "Limestone Restoration", jobs: getActiveJobsCount("limestone") },
    { icon: Palmtree, name: "Garden & Landscaping", jobs: getActiveJobsCount("garden") }
  ];

  // Get recent jobs from the database (last 3 open jobs)
  const recentJobs = jobs
    .filter(job => job.status === 'open')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

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
              Connect with Bermuda's
              <span className="block text-accent">Home Service Experts</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              From Hamilton to St. George's - post your home project and get competitive bids from verified local professionals. 
              Hurricane prep, saltwater repairs, limestone restoration, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" variant="accent" className="coral-glow wave-hover" onClick={() => onViewChange('post-job')}>
                Post Your Project
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="xl" variant="outline" className="border-white text-black hover:bg-white hover:text-primary transition-all duration-500" onClick={() => onViewChange('browse-jobs')}>
                Browse Jobs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Wave Divider */}
      <div className="wave-divider"></div>

      {/* Features Section */}
      <section className="py-16 bg-secondary/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Bermuda HomeConnect?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We understand coastal living - connecting homeowners with professionals who know Bermuda inside and out
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-2 border-primary/20 shadow-elegant coral-glow-subtle hover:border-primary/40 transition-all duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 coral-glow-subtle">
                    <feature.icon className="h-8 w-8 text-white" />
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

      {/* Wave Divider */}
      <div className="wave-divider-reverse"></div>

      {/* Service Categories */}
      <section className="py-16 relative">
        <div className="absolute inset-0 tropical-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Bermuda Services</h2>
            <p className="text-muted-foreground">Specialized services for Bermuda homes and businesses</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-elegant hover:coral-glow-subtle transition-all duration-300 cursor-pointer border-2 border-accent/20 hover:border-accent/50" onClick={() => onViewChange('browse-jobs')}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4 coral-glow-subtle">
                    <category.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{category.name}</h3>
                  <Badge variant="secondary">{category.jobs} active jobs</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Wave Divider */}
      <div className="wave-divider"></div>

      {/* Recent Jobs */}
      <section className="py-16 bg-secondary/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Recent Local Projects</h2>
              <p className="text-muted-foreground">See what Bermuda homeowners are looking for</p>
            </div>
            <Button variant="outline" className="coral-glow-subtle hover:coral-glow transition-all duration-300" onClick={() => onViewChange('browse-jobs')}>
              View All Jobs
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6">
            {recentJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-elegant hover:coral-glow-subtle transition-all duration-300 cursor-pointer border-2 border-primary/20 hover:border-primary/40">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{job.location}</p>
                    </div>
                    <Badge variant="secondary">{job.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{job.description.length > 100 ? job.description.substring(0, 100) + '...' : job.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-primary">
                      {job.budget_max && job.budget_max > 0 ? 
                        `$${(job.budget_min / 100).toLocaleString()} - $${(job.budget_max / 100).toLocaleString()}` : 
                        `$${(job.budget_min / 100).toLocaleString()}+`
                      }
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Wave Divider */}
      <div className="wave-divider-reverse"></div>

      {/* CTA Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 tropical-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Card className="bg-gradient-hero text-white border-0 coral-glow overflow-hidden relative">
            <div className="absolute inset-0 tropical-overlay opacity-10"></div>
            <CardContent className="p-12 text-center relative">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join hundreds of Bermuda homeowners and professionals using HomeConnect
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="accent" className="coral-glow wave-hover" onClick={() => onViewChange('post-job')}>
                  Post Your First Project
                </Button>
                <Button size="lg" variant="outline" className="border-white text-black hover:bg-white hover:text-primary transition-all duration-500" onClick={() => onViewChange('professionals')}>
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