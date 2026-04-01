import { ShieldCheck, CreditCard, Truck, Headphones, RotateCcw, Lock, Check, TrendingUp, CheckCircle, DollarSign, Sparkles, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TrustBadgeProps {
  icon: typeof ShieldCheck;
  title: string;
  description?: string;
  variant?: 'default' | 'compact' | 'inline';
  className?: string;
}

export function TrustBadge({ 
  icon: Icon, 
  title, 
  description, 
  variant = 'default',
  className 
}: TrustBadgeProps) {
  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Icon className="h-5 w-5 text-[#FF3131]" />
        <span className="text-sm font-medium">{title}</span>
      </div>
    );
  }
  
  if (variant === 'inline') {
    return (
      <div className={cn("flex items-center gap-1.5 text-sm text-muted-foreground", className)}>
        <Icon className="h-4 w-4 text-green-600" />
        <span>{title}</span>
      </div>
    );
  }
  
  return (
    <div className={cn("flex flex-col items-center text-center p-4", className)}>
      <div className="w-14 h-14 rounded-full bg-[#FF3131]/10 flex items-center justify-center mb-3">
        <Icon className="h-7 w-7 text-[#FF3131]" />
      </div>
      <h4 className="font-semibold mb-1">{title}</h4>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

interface TrustBadgeGroupProps {
  variant?: 'grid' | 'row' | 'compact';
  className?: string;
}

export function TrustBadgeGroup({ variant = 'grid', className }: TrustBadgeGroupProps) {
  if (variant === 'row') {
    return (
      <div className={cn("flex flex-wrap items-center justify-center gap-6 py-4", className)}>
        <TrustBadge icon={ShieldCheck} title="SSL Seguro" variant="compact" />
        <TrustBadge icon={CreditCard} title="Pagamento Seguro" variant="compact" />
        <TrustBadge icon={Truck} title="Entrega Rápida" variant="compact" />
        <TrustBadge icon={RotateCcw} title="7 Dias Devolução" variant="compact" />
      </div>
    );
  }
  
  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center gap-4 text-xs", className)}>
        <TrustBadge icon={ShieldCheck} title="Seguro" variant="inline" />
        <TrustBadge icon={Truck} title="Entrega Rápida" variant="inline" />
        <TrustBadge icon={RotateCcw} title="7 Dias" variant="inline" />
      </div>
    );
  }
  
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4", className)}>
      <TrustBadge icon={ShieldCheck} title="SSL Seguro" description="Conexão encriptada" />
      <TrustBadge icon={CreditCard} title="Pagamento Seguro" description="Múltiplas opções" />
      <TrustBadge icon={Truck} title="Entrega Rápida" description="Em todo Moçambique" />
      <TrustBadge icon={Headphones} title="Suporte 24/7" description="Sempre disponível" />
      <TrustBadge icon={RotateCcw} title="7 Dias Devolução" description="Garantia de satisfação" />
      <TrustBadge icon={Lock} title="Dados Protegidos" description="Privacidade garantida" />
    </div>
  );
}

interface CheckoutTrustBadgesProps {
  className?: string;
}

export function CheckoutTrustBadges({ className }: CheckoutTrustBadgesProps) {
  return (
    <Card className={cn("bg-muted/50", className)}>
      <CardContent className="py-4">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-1.5 text-green-600">
            <ShieldCheck className="h-4 w-4" />
            <span>Pagamento 100% seguro</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>Encriptação SSL</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            <span>Visa, M-Pesa, Transferência</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ProductTrustIndicatorsProps {
  className?: string;
}

export function ProductTrustIndicators({ className }: ProductTrustIndicatorsProps) {
  return (
    <div className={cn("flex flex-wrap gap-x-4 gap-y-1 text-sm", className)}>
      <div className="flex items-center gap-1 text-green-600">
        <Check className="h-4 w-4" />
        <span>Em stock</span>
      </div>
      <div className="flex items-center gap-1 text-green-600">
        <Truck className="h-4 w-4" />
        <span>Entrega rápida</span>
      </div>
      <div className="flex items-center gap-1 text-green-600">
        <RotateCcw className="h-4 w-4" />
        <span>7 dias devolução</span>
      </div>
    </div>
  );
}

interface TrustBadgesProductProps {
  badges?: string[];
  salesCount?: number;
  viewsCount?: number;
}

export function TrustBadges({ badges = [], salesCount = 0, viewsCount = 0 }: TrustBadgesProductProps) {
  const badgeConfig = {
    best_seller: { icon: TrendingUp, label: "Mais Vendido", color: "bg-orange-500" },
    verified: { icon: CheckCircle, label: "Verificado", color: "bg-green-500" },
    best_price: { icon: DollarSign, label: "Melhor Preço", color: "bg-blue-500" },
    trending: { icon: Sparkles, label: "Em Alta", color: "bg-purple-500" },
    new_arrival: { icon: Package, label: "Novidade", color: "bg-pink-500" }
  };

  return (
    <div className="space-y-3">
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

      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
        <CheckCircle className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-primary">Vendido por MarrengulaIT</span>
      </div>
    </div>
  );
}

export default TrustBadges;
