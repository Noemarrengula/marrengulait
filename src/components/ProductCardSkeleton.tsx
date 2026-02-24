import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProductCardSkeleton = () => {
  return (
    <Card className="overflow-hidden relative group">
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent z-10 pointer-events-none" />
      
      {/* Image Skeleton */}
      <Skeleton className="aspect-square w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 animate-pulse" />
      </Skeleton>
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Store Name */}
        <Skeleton className="h-3 w-24 rounded-full" />
        
        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-3/4 rounded-md" />
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-3 w-12 rounded-full" />
        </div>
        
        {/* Price */}
        <Skeleton className="h-6 w-32 rounded-md" />
        
        {/* Button */}
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
    </Card>
  );
};

export default ProductCardSkeleton;
