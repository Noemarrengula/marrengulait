import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'default' | 'card' | 'text' | 'avatar' | 'button';
  lines?: number;
}

const LoadingSkeleton = ({ className, variant = 'default', lines = 1 }: LoadingSkeletonProps) => {
  const baseClasses = "animate-pulse bg-gradient-to-r from-muted via-muted/50 to-muted rounded-md";
  
  const variants = {
    default: "h-4 w-full",
    card: "h-48 w-full",
    text: "h-3 w-3/4",
    avatar: "h-10 w-10 rounded-full",
    button: "h-10 w-24"
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              variants.text,
              i === lines - 1 ? "w-1/2" : "w-full"
            )}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, variants[variant], className)}
    />
  );
};

export default LoadingSkeleton;