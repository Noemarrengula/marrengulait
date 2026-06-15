import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle, XCircle } from "lucide-react";

interface StockBadgeProps {
  stock: number;
  lowStockThreshold?: number;
  className?: string;
}

export default function StockBadge({ stock, lowStockThreshold = 10, className = "" }: StockBadgeProps) {
  if (stock === 0) {
    return (
      <Badge variant="destructive" className={`flex items-center gap-1 ${className}`}>
        <XCircle className="h-3 w-3" />
        Esgotado
      </Badge>
    );
  }
  
  if (stock <= lowStockThreshold) {
    return (
      <Badge variant="outline" className={`flex items-center gap-1 bg-orange-100 text-orange-800 border-orange-200 ${className}`}>
        <AlertTriangle className="h-3 w-3" />
        Últimas {stock} unidades
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className={`flex items-center gap-1 bg-green-50 text-green-700 border-green-200 ${className}`}>
      <Package className="h-3 w-3" />
      Em Stock
    </Badge>
  );
}
