import { Badge } from "@/components/ui/badge";
import { useSettings } from "@/contexts/SettingsContext";

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
  const { currency: ctxCurrency, locale, convertPrice } = useSettings();
  const currency = propCurrency || ctxCurrency;
  
  const priceNum = typeof price === 'string' ? parseFloat(price.replace(/[^\d.]/g, '')) : price;
  const oldPriceNum = oldPrice ? (typeof oldPrice === 'string' ? parseFloat(oldPrice.replace(/[^\d.]/g, '')) : oldPrice) : undefined;
  
  const convertedPrice = convertPrice(priceNum);
  const convertedOldPrice = oldPriceNum ? convertPrice(oldPriceNum) : undefined;

  const calculateDiscount = (): number => {
    if (!convertedOldPrice) return 0;
    
    if (isNaN(convertedPrice) || isNaN(convertedOldPrice) || convertedOldPrice === 0) return 0;
    
    return Math.round(((convertedOldPrice - convertedPrice) / convertedOldPrice) * 100);
  };

  const discount = calculateDiscount();

  // Classes de tamanho
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  const formatPrice = (value: number): string => {
    return value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className={`flex items-baseline gap-2 ${className}`}>
      <span 
        className={`${sizeClasses[size]} font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent`}
        aria-label={`Preço: ${currency} ${formatPrice(convertedPrice)}`}
      >
        {currency} {formatPrice(convertedPrice)}
      </span>
      
      {oldPrice && (
        <>
          <span 
            className="text-sm text-muted-foreground line-through"
            aria-label={`Preço anterior: ${currency} ${formatPrice(convertedOldPrice!)}`}
          >
            {currency} {formatPrice(convertedOldPrice!)}
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
