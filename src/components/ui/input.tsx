import * as React from "react"

import { cn } from "@/lib/utils"

/* =========================================================================
   INPUT COMPONENT
   =========================================================================
   
   A styled text input component with consistent theming and accessibility.
   Built as a forwardRef component for proper form integration.
   
   USAGE EXAMPLES:
   - <Input type="text" placeholder="Enter text..." />
   - <Input type="email" value={email} onChange={setEmail} />
   - <Input disabled placeholder="Disabled input" />
   - <Input className="custom-class" ref={inputRef} />
   
   FEATURES:
   - Semantic color tokens for theming
   - Focus states with ring indicator
   - Disabled state styling
   - Proper accessibility attributes
   - File input support with custom styling
   
   STYLING:
   - Medium height (h-10) with horizontal padding
   - Rounded corners using design system radius
   - Border with semantic color tokens
   - Focus ring for keyboard navigation
   - Placeholder text with muted color
   ========================================================================= */

/* Input component interface extending standard input props */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

/* Input component with forwardRef for form libraries and accessibility */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
