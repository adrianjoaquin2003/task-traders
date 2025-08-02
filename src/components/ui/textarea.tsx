import * as React from "react"

import { cn } from "@/lib/utils"

/* =========================================================================
   TEXTAREA COMPONENT
   =========================================================================
   
   A multi-line text input component with consistent styling matching Input.
   Perfect for longer text content like descriptions, comments, or messages.
   
   USAGE EXAMPLES:
   - <Textarea placeholder="Enter your message..." />
   - <Textarea rows={4} value={text} onChange={setText} />
   - <Textarea disabled placeholder="Read-only content" />
   - <Textarea className="min-h-[200px]" />
   
   FEATURES:
   - Matches Input component styling for consistency
   - Resizable by default (resize-none to disable)
   - Semantic color tokens for theming
   - Focus states with ring indicator
   - Disabled state styling
   - Proper accessibility attributes
   
   STYLING:
   - Minimum height with padding for comfortable use
   - Rounded corners using design system radius
   - Border with semantic color tokens
   - Focus ring for keyboard navigation
   - Placeholder text with muted color
   ========================================================================= */

/* Textarea component interface extending standard textarea props */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

/* Textarea component with forwardRef for form libraries */
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
