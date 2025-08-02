// IMPORT STATEMENTS - These bring in external code we need
// @/ is an alias for the src/ folder, making imports cleaner
import { Toaster } from "@/components/ui/toaster";  // Toast notifications (popup messages)
import { Toaster as Sonner } from "@/components/ui/sonner";  // Alternative toast system (renamed to avoid conflicts)
import { TooltipProvider } from "@/components/ui/tooltip";  // Provides tooltip functionality to child components
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";  // Manages API calls and data caching
import { BrowserRouter, Routes, Route } from "react-router-dom";  // Handles navigation between pages
import Index from "./pages/Index";  // The main page component
import NotFound from "./pages/NotFound";  // Page shown when user visits invalid URLs

// CREATE QUERY CLIENT - This manages all our API calls and caches data
// It stores data from Supabase so we don't have to refetch it constantly
const queryClient = new QueryClient();

// MAIN APP COMPONENT - This is the root of our entire application
// React components are functions that return JSX (HTML-like syntax)
const App = () => (
  // QUERY CLIENT PROVIDER - Gives all child components access to the query client
  // This enables API calls and data caching throughout the app
  <QueryClientProvider client={queryClient}>
    {/* TOOLTIP PROVIDER - Enables tooltips (hover help text) throughout the app */}
    <TooltipProvider>
      {/* TOAST COMPONENTS - These show popup notifications to users */}
      <Toaster />  {/* Main toast system */}
      <Sonner />   {/* Backup toast system */}
      
      {/* BROWSER ROUTER - Enables navigation between different pages */}
      <BrowserRouter>
        {/* ROUTES - Define which component shows for each URL */}
        <Routes>
          {/* HOME ROUTE - Shows Index component when user visits "/" */}
          <Route path="/" element={<Index />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          
          {/* CATCH-ALL ROUTE - Shows NotFound for any URL that doesn't match above */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
