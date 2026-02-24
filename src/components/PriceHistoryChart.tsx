import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingDown, Bell } from "lucide-react";

const PriceHistoryChart = ({ productId, currentPrice }: { productId: string; currentPrice: number }) => {
  const priceHistory = [
    { date: "Jan", price: currentPrice * 1.2 },
    { date: "Fev", price: currentPrice * 1.15 },
    { date: "Mar", price: currentPrice * 1.1 },
    { date: "Abr", price: currentPrice * 1.05 },
    { date: "Mai", price: currentPrice }
  ];

  const lowestPrice = Math.min(...priceHistory.map(p => p.price));
  const highestPrice = Math.max(...priceHistory.map(p => p.price));
  const savings = ((highestPrice - currentPrice) / highestPrice * 100).toFixed(0);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Histórico de Preços</h3>
        <Button variant="outline" size="sm" className="gap-2">
          <Bell className="w-4 h-4" />
          Criar Alerta
        </Button>
      </div>

      {/* Simple Chart */}
      <div className="relative h-32 mb-4">
        <div className="absolute inset-0 flex items-end justify-between gap-2">
          {priceHistory.map((item, i) => {
            const height = ((item.price - lowestPrice) / (highestPrice - lowestPrice)) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-xs font-semibold text-primary">
                  {(item.price / 1000).toFixed(0)}K
                </div>
                <div
                  className="w-full bg-gradient-to-t from-primary to-accent rounded-t"
                  style={{ height: `${Math.max(height, 20)}%` }}
                />
                <div className="text-xs text-muted-foreground">{item.date}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
        <div>
          <p className="text-xs text-muted-foreground">Preço Atual</p>
          <p className="text-lg font-bold text-primary">{currentPrice.toLocaleString()} MT</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Menor Preço</p>
          <p className="text-lg font-bold">{lowestPrice.toLocaleString()} MT</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Economia</p>
          <p className="text-lg font-bold text-green-600 flex items-center gap-1">
            <TrendingDown className="w-4 h-4" />
            {savings}%
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PriceHistoryChart;
