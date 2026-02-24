import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) => {
  return (
    <Card className="p-12 text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
          <Icon className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-foreground">{title}</h3>
          <p className="text-muted-foreground max-w-md">{description}</p>
        </div>
        {actionLabel && onAction && (
          <Button onClick={onAction} size="lg" className="mt-4">
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default EmptyState;
