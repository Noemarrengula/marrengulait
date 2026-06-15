import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Clock, X, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSettings } from "@/contexts/SettingsContext";

interface RecentlyViewedItem {
  id: string;
  name: string;
  slug?: string;
  price: number;
  image?: string;
  viewedAt: string;
}

const STORAGE_KEY = 'marrengula_recently_viewed';
const MAX_ITEMS = 10;

export function addToRecentlyViewed(product: {
  id: string;
  name: string;
  slug?: string;
  price: number;
  image?: string;
}) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let items: RecentlyViewedItem[] = stored ? JSON.parse(stored) : [];
    
    items = items.filter(item => item.id !== product.id);
    
    items.unshift({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image,
      viewedAt: new Date().toISOString(),
    });
    
    items = items.slice(0, MAX_ITEMS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to add to recently viewed:', e);
  }
}

export function getRecentlyViewed(): RecentlyViewedItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

export function clearRecentlyViewed() {
  localStorage.removeItem(STORAGE_KEY);
}

interface RecentlyViewedProps {
  limit?: number;
  showHeader?: boolean;
  onClear?: () => void;
}

export function RecentlyViewed({ 
  limit = 6, 
  showHeader = true,
  onClear 
}: RecentlyViewedProps) {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);
  const { locale, currency, convertPrice } = useSettings();
  
  useEffect(() => {
    setItems(getRecentlyViewed());
    
    const handleStorageChange = () => {
      setItems(getRecentlyViewed());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  const displayed = items.slice(0, limit);
  
  if (displayed.length === 0) return null;
  
  const handleClear = () => {
    clearRecentlyViewed();
    setItems([]);
    onClear?.();
  };
  
  const formatPrice = (price: number) => {
    const convertedPrice = convertPrice(price);
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  return (
    <Card>
      {showHeader && (
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#FF3131]" />
              <CardTitle className="text-lg">Vistos Recentemente</CardTitle>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClear}
              className="text-muted-foreground hover:text-destructive"
            >
              Limpar
            </Button>
          </div>
        </CardHeader>
      )}
      <CardContent className={showHeader ? "pt-0" : ""}>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          {displayed.map((item) => (
            <Link 
              key={item.id} 
              to={`/produto/${item.slug || item.id}`}
              className="flex-shrink-0 w-36 group"
            >
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-2">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Clock className="h-8 w-8" />
                  </div>
                )}
              </div>
              <h4 className="text-sm font-medium line-clamp-2 group-hover:text-[#FF3131] transition-colors">
                {item.name}
              </h4>
              <p className="text-sm font-bold text-[#FF3131] mt-1">
                {formatPrice(item.price)}
              </p>
            </Link>
          ))}
          
          {items.length > limit && (
            <Link 
              to="/produtos"
              className="flex-shrink-0 w-36 flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-muted-foreground/20 hover:border-[#FF3131] hover:bg-[#FF3131]/5 transition-colors"
            >
              <span className="text-sm text-muted-foreground mb-1">Ver mais</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function RecentlyViewedSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-6 w-40" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-36">
              <Skeleton className="aspect-square rounded-lg mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentlyViewed;
