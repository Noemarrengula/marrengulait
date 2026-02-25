import { Badge } from "@/components/ui/badge";
import { useSettings } from "@/context/SettingsContext";

interface ProductPriceProps {
  price: string | number;
  oldPrice?: string | number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
  showDiscount?: boolean;
  className?: string;
}

const ProductPrice = ({ 
  price, 
  oldPrice, 
  currency: propCurrency,
  size = 'md', 
  showDiscount = true,
  className = ''
}: ProductPriceProps) => {
  const { currency: ctxCurrency, locale } = useSettings();
  const currency = propCurrency || ctxCurrency;
  // Calcula percentual de desconto
  const calculateDiscount = (): number => {
    if (!oldPrice) return 0;
    
    const priceNum = typeof price === 'string' ? parseFloat(price.replace(/[^\d.]/g, '')) : price;
    const oldPriceNum = typeof oldPrice === 'string' ? parseFloat(oldPrice.replace(/[^\d.]/g, '')) : oldPrice;
    
    if (isNaN(priceNum) || isNaN(oldPriceNum) || oldPriceNum === 0) return 0;
    
    return Math.round(((oldPriceNum - priceNum) / oldPriceNum) * 100);
  };

  const discount = calculateDiscount();

  // Classes de tamanho
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  // Formata preço para exibição
  const formatPrice = (value: string | number): string => {
    if (typeof value === 'number') {
      // use locale for formatting
      return value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return value;
  };

  return (
    <div className={`flex items-baseline gap-2 ${className}`}>
      <span 
        className={`${sizeClasses[size]} font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent`}
        aria-label={`Preço: ${currency} ${formatPrice(price)}`}
      >
        {currency} {formatPrice(price)}
      </span>
      
      {oldPrice && (
        <>
          <span 
            className="text-sm text-muted-foreground line-through"
            aria-label={`Preço anterior: ${currency} ${formatPrice(oldPrice)}`}
          >
            {currency} {formatPrice(oldPrice)}
          </span>
          
          {showDiscount && discount > 0 && (
            <Badge 
              variant="destructive" 
              className="ml-1"
              aria-label={`Desconto de ${discount}%`}
            >
              -{discount}%
            </Badge>
          )}
        </>
      )}
    </div>
  );
};

export default ProductPrice;
