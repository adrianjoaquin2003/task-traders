import * as React from "react"

import { cn } from "@/lib/utils"

/* =========================================================================
   CARD COMPONENTS
   =========================================================================
   
   A set of composable components for building content cards.
   Cards provide a flexible foundation for displaying grouped content.
   
   COMPONENTS:
   - Card: The main container with border and background
   - CardHeader: Top section for titles and actions
   - CardFooter: Bottom section for actions or additional info
   - CardTitle: Primary heading within card header
   - CardDescription: Subtitle or description text
   - CardContent: Main content area with proper spacing
   
   USAGE EXAMPLE:
   <Card>
     <CardHeader>
       <CardTitle>Card Title</CardTitle>
       <CardDescription>Card description goes here</CardDescription>
     </CardHeader>
     <CardContent>
       <p>Main content...</p>
     </CardContent>
     <CardFooter>
       <Button>Action</Button>
     </CardFooter>
   </Card>
   
   STYLING:
   - Uses semantic color tokens for theming
   - Consistent spacing and typography
   - Responsive and accessible by default
   ========================================================================= */

/* Main card container with border, background, and shadow */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

/* Card header section - typically contains title and description */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

/* Card title - primary heading with proper typography */
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

/* Card description - subtitle text with muted styling */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

/* Card content - main content area with consistent padding */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

/* Card footer - bottom section for actions or additional info */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
