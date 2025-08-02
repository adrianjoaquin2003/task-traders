// IMPORT REACT HOOK AND UI COMPONENTS
import { useState } from 'react';  // For managing mobile menu open/closed state
import { Button } from '@/components/ui/button';  // Reusable button component
import { Menu, X, Hammer, User, Plus } from 'lucide-react';  // Icons from Lucide library

// INTERFACE - Defines what props this component expects
interface NavigationProps {
  currentView: string;                          // Which page is currently active
  onViewChange: (view: string) => void;         // Function to call when user clicks navigation
}

// NAVIGATION COMPONENT - The top navigation bar
// Props are passed in as function parameters using destructuring
export const Navigation = ({ currentView, onViewChange }: NavigationProps) => {
  // STATE FOR MOBILE MENU - tracks whether mobile menu is open or closed
  // useState(false) means menu starts closed
  const [isOpen, setIsOpen] = useState(false);

  // NAVIGATION ITEMS - Array of objects defining our menu items
  // Each object has an id (matches view name), display label, and optional icon
  const navItems = [
    { id: 'home', label: 'Home', icon: null },              // Home page, no icon
    { id: 'browse-jobs', label: 'Browse Jobs', icon: null }, // Job listings, no icon
    { id: 'post-job', label: 'Post a Job', icon: Plus },     // Job posting form, plus icon
    { id: 'professionals', label: 'Find Pros', icon: User }, // Professional listings, user icon
  ];

  // RENDER THE NAVIGATION BAR - This is the JSX that creates the HTML structure
  return (
    <nav className="bg-white border-b border-border shadow-sm"> {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> {/* Center content with max width */}
        <div className="flex justify-between items-center h-16"> {/* Horizontal layout with 16 units height */}
          
          {/* LOGO SECTION - Left side of navigation */}
          <div className="flex items-center space-x-2">
            <Hammer className="h-8 w-8 text-primary" /> {/* Hammer icon using primary color */}
            <span className="text-xl font-bold text-foreground">TaskBridge</span> {/* App name */}
          </div>

          {/* DESKTOP NAVIGATION - Only visible on medium screens and up (hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-8">
            {/* MAP OVER navItems - Creates a button for each navigation item */}
            {navItems.map((item) => (
              <button
                key={item.id}  // React needs unique keys for list items
                onClick={() => onViewChange(item.id)}  // Call parent function when clicked
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === item.id
                    ? 'text-primary bg-primary/10'  // Active state: primary color with light background
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'  // Inactive state with hover effects
                }`}
              >
                {/* CONDITIONAL ICON - Only show icon if item has one */}
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.label}</span>  {/* Button text */}
              </button>
            ))}
          </div>

          {/* CTA BUTTONS - Call-to-action buttons on the right (desktop only) */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" onClick={() => onViewChange('login')}>
              Sign In
            </Button>
            <Button variant="hero" onClick={() => onViewChange('post-job')}>
              Post a Job
            </Button>
          </div>

          {/* MOBILE MENU BUTTON - Only visible on small screens */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}  // Toggle mobile menu open/closed
              className="text-muted-foreground hover:text-foreground"
            >
              {/* CONDITIONAL ICON - Show X when menu open, hamburger when closed */}
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* MOBILE NAVIGATION MENU - Only shows when isOpen is true AND on mobile */}
        {isOpen && (
          <div className="md:hidden"> {/* Hidden on desktop, visible on mobile */}
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border">
              {/* MOBILE NAVIGATION ITEMS - Same items as desktop but in vertical layout */}
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);  // Navigate to the page
                    setIsOpen(false);       // Close mobile menu after clicking
                  }}
                  className={`flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    currentView === item.id
                      ? 'text-primary bg-primary/10'  // Active state styling
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'  // Inactive with hover
                  }`}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                </button>
              ))}
              
              {/* MOBILE CTA BUTTONS - Sign in and Post Job buttons for mobile */}
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