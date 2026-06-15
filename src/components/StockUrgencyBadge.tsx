import { Clock, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StockUrgencyBadgeProps {
  stock: number;
  lowStockThreshold?: number;
  className?: string;
}

export default function StockUrgencyBadge({
  stock,
  lowStockThreshold = 5,
  className = ''
}: StockUrgencyBadgeProps) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    if (stock > 0 && stock <= lowStockThreshold) {
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay.getTime() - Date.now();

      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}h ${minutes}m`);
      }
    }
  }, [stock, lowStockThreshold]);

  if (stock === 0) {
    return (
      <div className={`flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-sm font-bold uppercase ${className}`}>
        <AlertTriangle className="w-4 h-4" />
        <span>Esgotado</span>
      </div>
    );
  }

  if (stock <= lowStockThreshold) {
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <div className="flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-sm font-bold animate-pulse">
          <AlertTriangle className="w-4 h-4" />
          <span>Apenas {stock} {stock === 1 ? 'unidade' : 'unidades'}!</span>
        </div>
        {timeLeft && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>Promoção termina em {timeLeft}</span>
          </div>
        )}
      </div>
    );
  }

  if (stock <= lowStockThreshold * 2) {
    return (
      <div className={`flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-full text-sm font-medium ${className}`}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
        </span>
        <span>Poucas unidades</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium ${className}`}>
      <span className="relative flex h-2 w-2">
        <span className="inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <span>Em Stock</span>
    </div>
  );
}
