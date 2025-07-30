import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { HomePage } from '@/components/HomePage';
import { PostJobPage } from '@/components/PostJobPage';
import { BrowseJobsPage } from '@/components/BrowseJobsPage';
import { ProfessionalsPage } from '@/components/ProfessionalsPage';

const Index = () => {
  const [currentView, setCurrentView] = useState('home');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'post-job':
        return <PostJobPage onViewChange={setCurrentView} />;
      case 'browse-jobs':
        return <BrowseJobsPage onViewChange={setCurrentView} />;
      case 'professionals':
        return <ProfessionalsPage onViewChange={setCurrentView} />;
      default:
        return <HomePage onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      {renderCurrentView()}
    </div>
  );
};

export default Index;
