import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  variant?: 'product' | 'horizontal' | 'compact';
  className?: string;
}

export function SkeletonCard({ variant = 'product', className }: SkeletonCardProps) {
  if (variant === 'horizontal') {
    return (
      <Card className={cn("p-4", className)}>
        <div className="flex gap-4">
          <Skeleton className="w-24 h-24 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
          <div className="text-right space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <Card className={cn("p-3", className)}>
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-2 w-1/2" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3 w-10" />
        </div>
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
    </Card>
  );
}

export function SkeletonGrid({ count = 8, className }: { count?: number; className?: string }) {
  return (
    <div className={cn(
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
      className
    )}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default SkeletonCard;
