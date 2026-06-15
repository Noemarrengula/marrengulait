import { Truck } from 'lucide-react';

interface FreeShippingBadgeProps {
  minAmount?: number;
  currentAmount?: number;
  className?: string;
}

export default function FreeShippingBadge({ 
  minAmount = 5000, 
  currentAmount = 0,
  className = ''
}: FreeShippingBadgeProps) {
  const remaining = minAmount - currentAmount;
  const hasFreeShipping = currentAmount >= minAmount;

  if (hasFreeShipping) {
    return (
      <div className={`flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium ${className}`}>
        <Truck className="w-4 h-4" />
        <span>Frete Grátis!</span>
      </div>
    );
  }

  if (remaining > 0 && remaining <= 1000) {
    return (
      <div className={`flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-sm font-medium animate-pulse ${className}`}>
        <Truck className="w-4 h-4" />
        <span>Falta {remaining.toLocaleString('pt-MZ')} MT para Frete Grátis!</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 bg-muted text-muted-foreground px-3 py-1.5 rounded-full text-sm ${className}`}>
      <Truck className="w-4 h-4" />
      <span>Frete Grátis acima de {minAmount.toLocaleString('pt-MZ')} MT</span>
    </div>
  );
}
