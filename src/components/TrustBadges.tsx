import { Badge } from "@/components/ui/badge";
import { TrendingUp, CheckCircle, DollarSign, Sparkles, Package } from "lucide-react";

interface TrustBadgesProps {
  badges?: string[];
  salesCount?: number;
  viewsCount?: number;
}

const TrustBadges = ({ badges = [], salesCount = 0, viewsCount = 0 }: TrustBadgesProps) => {
  const badgeConfig = {
    best_seller: { icon: TrendingUp, label: "Mais Vendido", color: "bg-orange-500" },
    verified: { icon: CheckCircle, label: "Verificado", color: "bg-green-500" },
    best_price: { icon: DollarSign, label: "Melhor Preço", color: "bg-blue-500" },
    trending: { icon: Sparkles, label: "Em Alta", color: "bg-purple-500" },
    new_arrival: { icon: Package, label: "Novidade", color: "bg-pink-500" }
  };

  return (
    <div className="space-y-3">
      {/* Trust Badges */}
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => {
            const config = badgeConfig[badge as keyof typeof badgeConfig];
            if (!config) return null;
            
            const Icon = config.icon;
            return (
              <Badge
                key={badge}
                className={`${config.color} text-white gap-1.5 px-3 py-1.5`}
              >
                <Icon className="w-3.5 h-3.5" />
                {config.label}
              </Badge>
            );
          })}
        </div>
      )}

      {/* Social Proof */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        {salesCount > 0 && (
          <div className="flex items-center gap-1">
            <Package className="w-4 h-4" />
            <span className="font-semibold text-foreground">{salesCount}</span> vendidos
          </div>
        )}
        {viewsCount > 0 && (
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span className="font-semibold text-foreground">{viewsCount}</span> visualizações
          </div>
        )}
      </div>

      {/* Seller Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
        <CheckCircle className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-primary">Vendido por MarrengulaIT</span>
      </div>
    </div>
  );
};

export default TrustBadges;
