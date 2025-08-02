import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* =========================================================================
   BADGE COMPONENT
   =========================================================================
   
   Small status indicators and labels for displaying concise information.
   Perfect for tags, status indicators, counts, and category labels.
   
   USAGE EXAMPLES:
   - <Badge>New</Badge>
   - <Badge variant="secondary">Draft</Badge>
   - <Badge variant="destructive">Error</Badge>
   - <Badge variant="outline">Pending</Badge>
   
   VARIANTS:
   - default: Primary badge with brand color background
   - secondary: Subtle badge with light background
   - destructive: Red badge for errors or warnings
   - outline: Bordered badge with transparent background
   
   STYLING:
   - Rounded pill shape with small padding
   - Small text (text-xs) with semibold weight
   - Focus ring support for accessibility
   ========================================================================= */

/* Badge styling variants using class-variance-authority */
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/* Badge component props interface extending standard div props */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/* Badge component - simple div with variant-based styling */

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
