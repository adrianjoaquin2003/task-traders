// IMPORT REACT HOOK - useState lets us store and change data in our component
import { useState } from 'react';

// IMPORT OUR PAGE COMPONENTS - Each represents a different screen/page
import { Navigation } from '@/components/Navigation';  // Top navigation bar
import { HomePage } from '@/components/HomePage';  // Landing page with hero section
import { PostJobPage } from '@/components/PostJobPage';  // Form to create new jobs
import { BrowseJobsPage } from '@/components/BrowseJobsPage';  // List of available jobs
import { ProfessionalsPage } from '@/components/ProfessionalsPage';  // List of professionals
import SubmitBidPage from '@/components/SubmitBidPage';  // Form to submit bids
import JobDetailsPage from '@/components/JobDetailsPage';  // Job details and bids view
import AuthPage from '@/components/AuthPage';  // Authentication page
import { useAuth } from '@/hooks/useAuth';  // Authentication hook

// MAIN INDEX COMPONENT - This acts like a "single page app" controller
// Instead of multiple HTML pages, we show different React components
const Index = () => {
  // STATE VARIABLE - Tracks which page/view the user is currently on
  // useState('home') means we start on the home page
  // currentView = current value, setCurrentView = function to change it
  const [currentView, setCurrentView] = useState('home');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  
  // Authentication state
  const { loading } = useAuth();

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Custom view change handler to manage job-related navigation
  const handleViewChange = (view: string, jobData?: any) => {
    if (view.startsWith('bid-')) {
      const jobId = view.replace('bid-', '');
      setSelectedJobId(jobId);
      setSelectedJob(jobData);
      setCurrentView('submit-bid');
    } else if (view.startsWith('job-details-')) {
      const jobId = view.replace('job-details-', '');
      setSelectedJobId(jobId);
      setCurrentView('job-details');
    } else {
      setCurrentView(view);
    }
  };

  // FUNCTION TO DECIDE WHICH PAGE TO SHOW - Based on currentView state
  const renderCurrentView = () => {
    // Switch statement checks the currentView and returns the appropriate component
    switch (currentView) {
      case 'post-job':
        // Show job posting form, pass function to change views
        return <PostJobPage onViewChange={handleViewChange} />;
      case 'browse-jobs':
        // Show list of available jobs
        return <BrowseJobsPage onViewChange={handleViewChange} />;
      case 'professionals':
        // Show list of professionals
        return <ProfessionalsPage onViewChange={handleViewChange} />;
      case 'submit-bid':
        // Show bid submission form
        return selectedJob ? (
          <SubmitBidPage job={selectedJob} onViewChange={handleViewChange} />
        ) : (
          <div className="min-h-screen bg-background flex items-center justify-center">
            <p>Job not found</p>
          </div>
        );
      case 'job-details':
        // Show job details page
        return selectedJobId ? (
          <JobDetailsPage jobId={selectedJobId} onViewChange={handleViewChange} />
        ) : (
          <div className="min-h-screen bg-background flex items-center justify-center">
            <p>Job not found</p>
          </div>
        );
      case 'auth':
        // Show authentication page
        return <AuthPage onViewChange={handleViewChange} />;
      default:
        // If currentView doesn't match anything above, show home page
        return <HomePage onViewChange={handleViewChange} />;
    }
  };

  // RENDER THE COMPONENT - This is what gets displayed on screen
  return (
    <div className="min-h-screen">  {/* Full height container */}
      {/* NAVIGATION BAR - Always visible at top, shows current page and handles navigation */}
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      
      {/* CURRENT PAGE CONTENT - Calls our function to show the right page */}
      {renderCurrentView()}
    </div>
  );
};

export default Index;
