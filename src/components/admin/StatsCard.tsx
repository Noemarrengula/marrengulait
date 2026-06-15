import { TrendingUp, TrendingDown, Users, ShoppingCart, Package, DollarSign, AlertTriangle, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: typeof TrendingUp;
  iconColor?: string;
  isLoading?: boolean;
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  change, 
  changeLabel,
  icon: Icon, 
  iconColor = 'text-[#FF3131]',
  isLoading,
  className 
}: StatCardProps) {
  const isPositiveChange = change && change > 0;
  const isNegativeChange = change && change < 0;
  
  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            
            {change !== undefined && (
              <div className={cn(
                "flex items-center gap-1 text-sm",
                isPositiveChange && "text-green-600",
                isNegativeChange && "text-red-600",
                !isPositiveChange && !isNegativeChange && "text-muted-foreground"
              )}>
                {isPositiveChange ? (
                  <TrendingUp className="h-3 w-3" />
                ) : isNegativeChange ? (
                  <TrendingDown className="h-3 w-3" />
                ) : null}
                <span>
                  {change > 0 ? '+' : ''}{change}%
                  {changeLabel && <span className="text-muted-foreground ml-1">{changeLabel}</span>}
                </span>
              </div>
            )}
          </div>
          
          <div className={cn(
            "h-12 w-12 rounded-full flex items-center justify-center",
            "bg-[#FF3131]/10"
          )}>
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface StatsGridProps {
  stats?: {
    total_users: number;
    total_products: number;
    total_orders: number;
    pending_orders: number;
    today_revenue: number;
    month_revenue: number;
    new_users_today: number;
    new_orders_today: number;
    low_stock_count: number;
  };
  isLoading?: boolean;
  className?: string;
}

export function StatsGrid({ stats, isLoading, className }: StatsGridProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      <StatCard
        title="Receita Hoje"
        value={formatCurrency(stats?.today_revenue || 0)}
        icon={DollarSign}
        iconColor="text-green-600"
        isLoading={isLoading}
      />
      
      <StatCard
        title="Receita Mensal"
        value={formatCurrency(stats?.month_revenue || 0)}
        icon={TrendingUp}
        iconColor="text-blue-600"
        isLoading={isLoading}
      />
      
      <StatCard
        title="Pedidos Pendentes"
        value={stats?.pending_orders || 0}
        icon={ShoppingCart}
        iconColor="text-orange-500"
        isLoading={isLoading}
      />
      
      <StatCard
        title="Stock Baixo"
        value={stats?.low_stock_count || 0}
        icon={AlertTriangle}
        iconColor={stats?.low_stock_count ? "text-red-500" : "text-muted-foreground"}
        isLoading={isLoading}
      />
      
      <StatCard
        title="Total de Utilizadores"
        value={stats?.total_users || 0}
        change={stats?.new_users_today ? Math.round((stats.new_users_today / (stats.total_users || 1)) * 100) : 0}
        changeLabel="hoje"
        icon={Users}
        iconColor="text-purple-600"
        isLoading={isLoading}
      />
      
      <StatCard
        title="Total de Produtos"
        value={stats?.total_products || 0}
        icon={Package}
        iconColor="text-cyan-600"
        isLoading={isLoading}
      />
      
      <StatCard
        title="Total de Pedidos"
        value={stats?.total_orders || 0}
        icon={ShoppingCart}
        iconColor="text-[#FF3131]"
        isLoading={isLoading}
      />
      
      <StatCard
        title="Novos Pedidos Hoje"
        value={stats?.new_orders_today || 0}
        icon={Eye}
        iconColor="text-indigo-600"
        isLoading={isLoading}
      />
    </div>
  );
}
