import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryAction,
  className = ""
}: EmptyStateProps) {
  return (
    <Card className={`border-dashed ${className}`}>
      <CardContent className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF3131]/10 to-[#FF5555]/10 flex items-center justify-center mb-6 animate-in fade-in zoom-in duration-300">
          <Icon className="h-10 w-10 text-[#FF3131]" />
        </div>
        
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        
        {description && (
          <p className="text-muted-foreground max-w-sm mb-6">
            {description}
          </p>
        )}
        
        {(actionLabel || secondaryAction) && (
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            {actionLabel && onAction && (
              <Button 
                onClick={onAction} 
                className="bg-gradient-to-r from-[#FF3131] to-[#FF5555] hover:from-[#FF2222] hover:to-[#FF4444] transition-all shadow-lg shadow-[#FF3131]/25"
              >
                {actionLabel}
              </Button>
            )}
            
            {secondaryAction && (
              <Button 
                variant="outline" 
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default EmptyState;
