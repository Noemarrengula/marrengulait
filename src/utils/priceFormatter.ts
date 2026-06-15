import { useSettings } from '@/contexts/SettingsContext';

export function usePriceFormatter() {
  const { currency, locale, convertPrice } = useSettings();
  
  const formatPrice = (priceInMZN: number): string => {
    const converted = convertPrice(priceInMZN);
    return `${currency} ${converted.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  const formatPriceNumber = (priceInMZN: number): number => {
    return convertPrice(priceInMZN);
  };
  
  return { formatPrice, formatPriceNumber, currency, convertPrice };
}

export function formatPriceValue(priceInMZN: number, currency: string, locale: string, convertPrice: (p: number) => number): string {
  const converted = convertPrice(priceInMZN);
  return `${currency} ${converted.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
