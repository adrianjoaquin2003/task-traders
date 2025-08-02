// IMPORT REACT HOOKS - useState and useEffect for component state and lifecycle
import { useState, useEffect } from 'react';

// IMPORT OUR PAGE COMPONENTS - Each represents a different screen/page
import { Navigation } from '@/components/Navigation';  // Top navigation bar
import { HomePage } from '@/components/HomePage';  // Landing page with hero section
import { PostJobPage } from '@/components/PostJobPage';  // Form to create new jobs
import { BrowseJobsPage } from '@/components/BrowseJobsPage';  // List of available jobs
import { ProfessionalsPage } from '@/components/ProfessionalsPage';  // List of professionals

// MAIN INDEX COMPONENT - This acts like a "single page app" controller
// Instead of multiple HTML pages, we show different React components
const Index = () => {
  // STATE VARIABLE - Tracks which page/view the user is currently on
  // useState('home') means we start on the home page
  // currentView = current value, setCurrentView = function to change it
  const [currentView, setCurrentView] = useState('home');

  // CURSOR GLOW EFFECT - Track mouse position for sea-blue glow
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const glow = document.querySelector('body::after') as HTMLElement;
      if (glow) {
        document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
      }
    };

    const handleMouseEnter = () => {
      document.documentElement.style.setProperty('--cursor-opacity', '1');
    };

    const handleMouseLeave = () => {
      document.documentElement.style.setProperty('--cursor-opacity', '0');
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // FUNCTION TO DECIDE WHICH PAGE TO SHOW - Based on currentView state
  const renderCurrentView = () => {
    // Switch statement checks the currentView and returns the appropriate component
    switch (currentView) {
      case 'post-job':
        // Show job posting form, pass function to change views
        return <PostJobPage onViewChange={setCurrentView} />;
      case 'browse-jobs':
        // Show list of available jobs
        return <BrowseJobsPage onViewChange={setCurrentView} />;
      case 'professionals':
        // Show list of professionals
        return <ProfessionalsPage onViewChange={setCurrentView} />;
      default:
        // If currentView doesn't match anything above, show home page
        return <HomePage onViewChange={setCurrentView} />;
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
