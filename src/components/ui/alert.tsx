import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => {
  try {
    return <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
  } catch (error) {
    console.error('Error rendering Alert:', error);
    return <div ref={ref} role="alert" className="border p-4 rounded-lg" {...props} />;
  }
});
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    try {
      return <h5 ref={ref} className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />;
    } catch (error) {
      console.error('Error rendering AlertTitle:', error);
      return <h5 ref={ref} className="mb-1 font-medium" {...props} />;
    }
  },
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    try {
      return <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />;
    } catch (error) {
      console.error('Error rendering AlertDescription:', error);
      return <div ref={ref} className="text-sm" {...props} />;
    }
  },
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
