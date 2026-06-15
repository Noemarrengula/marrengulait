import { Badge } from "@/components/ui/badge";
import { Zap, TrendingUp, Star, Flame } from "lucide-react";

interface StatusBadgeProps {
  type: "new" | "hot" | "trending" | "featured";
  className?: string;
}

const badgeConfig = {
  new: {
    icon: Zap,
    text: "Novo",
    className: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white animate-pulse-glow",
  },
  hot: {
    icon: Flame,
    text: "Hot",
    className: "bg-gradient-to-r from-red-500 to-orange-500 text-white animate-bounce-subtle",
  },
  trending: {
    icon: TrendingUp,
    text: "Tendência",
    className: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
  },
  featured: {
    icon: Star,
    text: "Destaque",
    className: "bg-gradient-to-r from-yellow-500 to-amber-500 text-white",
  },
};

const StatusBadge = ({ type, className = "" }: StatusBadgeProps) => {
  const config = badgeConfig[type];
  const Icon = config.icon;

  return (
    <Badge className={`${config.className} ${className} shadow-lg hover:scale-110 transition-transform cursor-default`}>
      <Icon className="h-3 w-3 mr-1" />
      {config.text}
    </Badge>
  );
};

export default StatusBadge;
