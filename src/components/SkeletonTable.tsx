import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SkeletonTableProps {
  columns?: number;
  rows?: number;
  className?: string;
}

export function SkeletonTable({ columns = 5, rows = 5, className }: SkeletonTableProps) {
  const defaultWidths = ['w-20', 'w-40', 'w-24', 'w-24', 'w-20'];
  
  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6">
        <div className="space-y-3">
          <div className="flex gap-4 pb-3 border-b">
            {Array.from({ length: columns }).map((_, i) => (
              <Skeleton 
                key={i} 
                className={cn("h-4", defaultWidths[i] || 'w-24')} 
              />
            ))}
          </div>
          
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-4 py-3">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton 
                  key={colIndex} 
                  className={cn(
                    "h-4",
                    colIndex === 0 ? 'w-32' : 
                    colIndex === columns - 1 ? 'w-20' : 
                    defaultWidths[colIndex] || 'w-24'
                  )} 
                />
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function SkeletonOrderCard({ className }: { className?: string }) {
  return (
    <Card className={cn("hover:shadow-lg transition-shadow", className)}>
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right space-y-2">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-28" />
        </div>
      </CardContent>
    </Card>
  );
}

export function SkeletonOrderList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonOrderCard key={i} />
      ))}
    </div>
  );
}

export default SkeletonTable;
