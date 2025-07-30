import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Hammer, User, Plus } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Navigation = ({ currentView, onViewChange }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: null },
    { id: 'browse-jobs', label: 'Browse Jobs', icon: null },
    { id: 'post-job', label: 'Post a Job', icon: Plus },
    { id: 'professionals', label: 'Find Pros', icon: User },
  ];

  return (
    <nav className="bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Hammer className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">TaskBridge</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === item.id
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" onClick={() => onViewChange('login')}>
              Sign In
            </Button>
            <Button variant="hero" onClick={() => onViewChange('post-job')}>
              Post a Job
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-muted-foreground hover:text-foreground"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    currentView === item.id
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                </button>
              ))}
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="outline" onClick={() => onViewChange('login')}>
                  Sign In
                </Button>
                <Button variant="hero" onClick={() => onViewChange('post-job')}>
                  Post a Job
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};