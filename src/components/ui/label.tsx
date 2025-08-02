import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* =========================================================================
   LABEL COMPONENT
   =========================================================================
   
   An accessible label component built on Radix UI's Label primitive.
   Automatically handles click events to focus associated form controls.
   
   USAGE EXAMPLES:
   - <Label htmlFor="email">Email Address</Label>
   - <Label>Username</Label>
   - <Label className="text-lg">Custom styled label</Label>
   
   FEATURES:
   - Built on Radix UI for proper accessibility
   - Automatically connects to form controls via htmlFor
   - Supports click-to-focus behavior
   - Disabled state styling when associated control is disabled
   - Consistent typography with design system
   
   ACCESSIBILITY:
   - Proper label-control association
   - Screen reader friendly
   - Keyboard navigation support
   - Disabled state indication
   ========================================================================= */

/* Label styling variants - currently just base styles */
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

/* Label component with forwardRef wrapping Radix UI Label */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
