/**
 * HomePage Component - Main landing page for Bermuda HomeConnect
 * 
 * This component serves as the primary entry point for users, showcasing:
 * - Hero section with call-to-action buttons
 * - Key platform features highlighting Bermuda's unique requirements
 * - Service categories with live job counts from the database
 * - Recent job listings to demonstrate platform activity
 * - Final CTA section to drive user engagement
 * 
 * Design Philosophy:
 * - Bermuda-themed tropical aesthetics with coral glows and wave effects
 * - Mobile-first responsive design with proper breakpoints
 * - Performance-optimized with lazy loading and semantic HTML
 * - SEO-friendly structure with proper heading hierarchy
 */

// UI Component imports for building the interface
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Lucide icons for visual elements throughout the page
import { Hammer, Users, Shield, Star, ArrowRight, Wrench, Paintbrush, Zap, Home, CheckCircle, Waves, Palmtree, Umbrella } from 'lucide-react';

// Static assets
import heroImage from '@/assets/hero-home-services.jpg';

// Custom hooks for data fetching
import { useJobs } from '@/hooks/useJobs';

/**
 * Props interface for HomePage component
 * @param onViewChange - Callback function to handle navigation between different views/pages
 */
interface HomePageProps {
  onViewChange: (view: string) => void;
}

export const HomePage = ({ onViewChange }: HomePageProps) => {
  // Fetch all jobs data using React Query for caching and optimistic updates
  // Default to empty array to prevent rendering errors during loading state
  const { data: jobs = [] } = useJobs();
  
  /**
   * Platform Features Configuration
   * Highlights the unique value propositions for Bermuda's market:
   * - Certified professionals familiar with local building codes
   * - Climate-aware expertise for hurricane and saltwater challenges
   */
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

  /**
   * Dynamic Job Counter Function
   * Calculates real-time job counts for each service category by:
   * 1. Filtering jobs with 'open' status (available for bidding)
   * 2. Case-insensitive category matching for flexible data handling
   * 3. Returns live count to show platform activity and demand
   * 
   * @param categoryName - Service category to count jobs for
   * @returns Number of active jobs in that category
   */
  const getActiveJobsCount = (categoryName: string) => {
    return jobs.filter(job => 
      job.status === 'open' && 
      job.category.toLowerCase().includes(categoryName.toLowerCase())
    ).length;
  };

  /**
   * Service Categories Configuration
   * Bermuda-specific services that address unique island challenges:
   * - Hurricane prep/cleanup for seasonal storms
   * - Saltwater damage repair from coastal exposure
   * - Specialized roof services for wind resistance
   * - Pool/deck maintenance for year-round outdoor living
   * - Limestone restoration for historic Bermuda architecture
   * - Garden/landscaping adapted to subtropical climate
   * 
   * Each category shows live job count to indicate market demand
   */
  const serviceCategories = [
    { icon: Paintbrush, name: "Hurricane Prep & Cleanup", jobs: getActiveJobsCount("hurricane") },
    { icon: Wrench, name: "Saltwater Damage Repair", jobs: getActiveJobsCount("saltwater") },
    { icon: Umbrella, name: "Roof & Gutter Services", jobs: getActiveJobsCount("roof") },
    { icon: Waves, name: "Pool & Deck Maintenance", jobs: getActiveJobsCount("pool") },
    { icon: Home, name: "Limestone Restoration", jobs: getActiveJobsCount("limestone") },
    { icon: Palmtree, name: "Garden & Landscaping", jobs: getActiveJobsCount("garden") }
  ];

  /**
   * Recent Jobs Data Processing
   * Creates a curated list of the most recent job postings to:
   * 1. Show platform activity and build trust with visitors
   * 2. Demonstrate the variety of projects available
   * 3. Encourage professionals to browse more opportunities
   * 
   * Processing steps:
   * - Filter to only show 'open' jobs (available for bidding)
   * - Sort by creation date (newest first) for relevancy
   * - Limit to 3 jobs to avoid overwhelming the landing page
   */
  const recentJobs = jobs
    .filter(job => job.status === 'open')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* ===============================================================================
          HERO SECTION - Primary landing area with value proposition
          ===============================================================================
          
          Features:
          - Full-width background image with overlay for text readability
          - Responsive typography scaling from mobile to desktop
          - Two primary CTAs: "Post Your Project" (primary action) and "Browse Jobs"
          - Bermuda-specific copy mentioning Hamilton to St. George's
          - Accessibility: Proper heading hierarchy (h1) and semantic structure
          
          Design Elements:
          - Hero image: Professional home services photo
          - Gradient overlay: Ocean-to-coral theme (--gradient-hero)
          - Coral glow effects on primary CTA button
          - Wave hover animations for interactive feedback
      */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background image container with overlay for text readability */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          {/* Semi-transparent gradient overlay ensures text contrast */}
          <div className="absolute inset-0 bg-gradient-hero/80"></div>
        </div>
        
        {/* Content container with responsive padding and max-width */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Primary heading - SEO optimized with target keywords */}
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Connect with Bermuda's
              <span className="block text-accent">Home Service Experts</span>
            </h1>
            
            {/* Value proposition paragraph with local geography references */}
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              From Hamilton to St. George's - post your home project and get competitive bids from verified local professionals. 
              Hurricane prep, saltwater repairs, limestone restoration, and more.
            </p>
            
            {/* Primary and secondary CTA buttons with responsive stacking */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Primary CTA - Post job (main user action) with coral glow effect */}
              <Button size="xl" variant="accent" className="coral-glow wave-hover" onClick={() => onViewChange('post-job')}>
                Post Your Project
                <ArrowRight className="h-5 w-5" />
              </Button>
              
              {/* Secondary CTA - Browse jobs (alternative entry point) */}
              <Button size="xl" variant="outline" className="border-white text-black hover:bg-white hover:text-primary transition-all duration-500" onClick={() => onViewChange('browse-jobs')}>
                Browse Jobs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ===============================================================================
          VISUAL DIVIDER - Wave-themed section separator
          ===============================================================================
          
          Purpose: Creates visual flow between sections while maintaining theme
          Effect: Subtle gradient with animated wave overlay for movement
      */}

      {/* ===============================================================================
          FEATURES SECTION - Platform value propositions
          ===============================================================================
          
          Purpose: Build trust and highlight unique value for Bermuda market
          Strategy: Focus on local expertise and climate-specific challenges
          
          Features:
          - Responsive 2-column grid layout (stacks on mobile)
          - Icon-driven design for quick visual scanning
          - Hover effects with coral glow and border transitions
          - Professional certification and climate expertise messaging
      */}
      <section className="wave-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section header with compelling headline and supporting text */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Bermuda HomeConnect?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We understand coastal living - connecting homeowners with professionals who know Bermuda inside and out
            </p>
          </div>
          
          {/* Feature cards grid - responsive layout with hover effects */}
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-2 border-primary/20 shadow-elegant coral-glow-subtle hover:border-primary/40 transition-all duration-300">
                <CardHeader>
                  {/* Icon container with gradient background and glow effect */}
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

      {/* Wave divider with reverse orientation for visual variety */}
      <div className="wave-divider-reverse"></div>

      {/* ===============================================================================
          SERVICE CATEGORIES - Bermuda-specific service offerings
          ===============================================================================
          
          Purpose: Showcase specialized services and current market demand
          Strategy: Use live job counts to show platform activity and opportunity
          
          Features:
          - 6 categories in responsive grid (2 cols mobile, 3 cols desktop)
          - Real-time job counts from database to show demand
          - Click-through to browse jobs page for engagement
          - Bermuda-specific services addressing unique island challenges
          - Tropical background pattern for subtle texture
      */}
      <section className="py-16 relative">
        {/* Subtle tropical pattern background for texture */}
        <div className="absolute inset-0 tropical-pattern opacity-5"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section header emphasizing Bermuda specialization */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Bermuda Services</h2>
            <p className="text-muted-foreground">Specialized services for Bermuda homes and businesses</p>
          </div>
          
          {/* Service category cards with click-through functionality */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-elegant hover:coral-glow-subtle transition-all duration-300 cursor-pointer border-2 border-accent/20 hover:border-accent/50" onClick={() => onViewChange('browse-jobs')}>
                <CardContent className="p-6 text-center">
                  {/* Service icon with gradient background */}
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4 coral-glow-subtle">
                    <category.icon className="h-6 w-6 text-white" />
                  </div>
                  
                  {/* Service name and live job count badge */}
                  <h3 className="font-semibold text-foreground mb-2">{category.name}</h3>
                  <Badge variant="secondary">{category.jobs} active jobs</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Wave divider to separate sections */}
      <div className="wave-divider"></div>

      {/* ===============================================================================
          RECENT JOBS SECTION - Social proof and platform activity
          ===============================================================================
          
          Purpose: Demonstrate platform activity and encourage engagement
          Strategy: Show real recent jobs to build trust and show opportunity
          
          Features:
          - Wave-divider inspired background with animated gradient overlay
          - Responsive 3-column grid (stacks on smaller screens)
          - Job cards with key details: title, location, category, budget, date
          - Truncated descriptions to maintain clean layout
          - "View All Jobs" CTA to drive traffic to jobs page
          
          Background: 
          - Custom gradient from secondary to background colors
          - Animated gradient overlay with gentle wave motion for movement
      */}
      <section className="py-16 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--background)))'
      }}>
        {/* Animated gradient overlay for subtle movement effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/10 to-transparent animate-[gentle-wave_4s_ease-in-out_infinite]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section header with CTA button for easy navigation */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Recent Local Projects</h2>
              <p className="text-muted-foreground">See what Bermuda homeowners are looking for</p>
            </div>
            {/* Quick access to all jobs with coral glow effect */}
            <Button variant="outline" className="coral-glow-subtle hover:coral-glow transition-all duration-300" onClick={() => onViewChange('browse-jobs')}>
              View All Jobs
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Recent jobs grid - shows up to 3 most recent open jobs */}
          <div className="grid lg:grid-cols-3 gap-6">
            {recentJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-elegant hover:coral-glow-subtle transition-all duration-300 cursor-pointer border-2 border-primary/20 hover:border-primary/40">
                <CardHeader>
                  {/* Job header with title, location, and category badge */}
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{job.location}</p>
                    </div>
                    <Badge variant="secondary">{job.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Truncated job description for clean layout */}
                  <p className="text-muted-foreground mb-4">{job.description.length > 100 ? job.description.substring(0, 100) + '...' : job.description}</p>
                  
                  {/* Job footer with budget range and post date */}
                  <div className="flex justify-between items-center">
                    {/* Budget display with proper formatting (cents to dollars) */}
                    <span className="font-semibold text-primary">
                      {job.budget_max && job.budget_max > 0 ? 
                        `$${(job.budget_min / 100).toLocaleString()} - $${(job.budget_max / 100).toLocaleString()}` : 
                        `$${(job.budget_min / 100).toLocaleString()}+`
                      }
                    </span>
                    {/* Post date for recency context */}
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

      {/* Wave divider with reverse orientation */}
      <div className="wave-divider-reverse"></div>

      {/* ===============================================================================
          CALL-TO-ACTION SECTION - Final conversion opportunity
          ===============================================================================
          
          Purpose: Provide final opportunity for user conversion before page exit
          Strategy: Prominent CTAs with social proof and urgency messaging
          
          Features:
          - Full-width card with gradient background and tropical effects
          - Dual CTAs: Post project (primary) and Browse professionals (secondary)
          - Social proof messaging ("hundreds of users")
          - Tropical overlay animation for visual interest
          - High contrast white text on gradient background
      */}
      <section className="py-16 relative">
        {/* Subtle tropical pattern background */}
        <div className="absolute inset-0 tropical-pattern opacity-5"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Main CTA card with gradient background and effects */}
          <Card className="bg-gradient-hero text-white border-0 coral-glow overflow-hidden relative">
            {/* Animated tropical overlay for visual richness */}
            <div className="absolute inset-0 tropical-overlay opacity-10"></div>
            
            <CardContent className="p-12 text-center relative">
              {/* Strong CTA headline */}
              <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
              
              {/* Social proof and encouragement messaging */}
              <p className="text-xl mb-8 opacity-90">
                Join hundreds of Bermuda homeowners and professionals using HomeConnect
              </p>
              
              {/* Final conversion buttons with responsive stacking */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* Primary CTA - Post project with enhanced effects */}
                <Button size="lg" variant="accent" className="coral-glow wave-hover" onClick={() => onViewChange('post-job')}>
                  Post Your First Project
                </Button>
                
                {/* Secondary CTA - Browse professionals */}
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