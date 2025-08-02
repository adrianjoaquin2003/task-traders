import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* =========================================================================
   BUTTON COMPONENT
   =========================================================================
   
   A flexible button component with multiple variants and sizes.
   Built using class-variance-authority for type-safe styling variants.
   
   USAGE EXAMPLES:
   - <Button>Default button</Button>
   - <Button variant="secondary" size="lg">Large secondary</Button>
   - <Button variant="outline" disabled>Disabled outline</Button>
   - <Button asChild><Link to="/page">Link as button</Link></Button>
   
   VARIANTS:
   - default: Primary brand button with solid background
   - destructive: Red button for dangerous actions
   - outline: Bordered button with transparent background
   - secondary: Subtle button with light background
   - ghost: Minimal button with no background
   - link: Text-only button styled like a link
   - hero: Special variant for hero sections
   - accent: Golden accent button for highlights
   - success: Green button for positive actions
   
   SIZES:
   - default: Standard button size (h-10 px-4 py-2)
   - sm: Small button (h-9 px-3)
   - lg: Large button (h-11 px-8)
   - xl: Extra large button (h-12 px-12)
   - icon: Square button for icons only (h-10 w-10)
   ========================================================================= */

/* Button variant and size definitions using class-variance-authority */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-gradient-hero text-white shadow-elegant hover:shadow-lg hover:scale-105 transition-all duration-300",
        accent: "bg-accent text-accent-foreground shadow hover:bg-accent/90",
        success: "bg-success text-success-foreground shadow hover:bg-success/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/* Button component props interface */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

/* Main Button component with forwardRef for proper DOM ref handling */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
