import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { Product } from "@/integrations/supabase/types";

interface ProductGridProps {
  title: string;
  subtitle?: string;
  loading?: boolean;
  products?: Product[];
  showViewAll?: boolean;
  viewAllLink?: string;
}

const ProductGrid = ({ 
  title, 
  subtitle, 
  loading = false, 
  products = [],
  showViewAll = false,
  viewAllLink = "/produtos"
}: ProductGridProps) => {
  const [imageCache, setImageCache] = useState<number>(Date.now());
  const displayProducts = products.length > 0 ? products : [];

  useEffect(() => {
    setImageCache(Date.now());
  }, [products]);

  const getImageUrl = (url: string | undefined) => {
    if (!url) return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400";
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${imageCache}`;
  };

  return (
    <section className="py-16 cyber-grid relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF3131]/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-3">
            <span className="gradient-text">{title}</span>
          </h2>
          {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={`skeleton-${index}`} />
            ))
          ) : displayProducts.length > 0 ? (
            displayProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="animate-slide-up" 
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ProductCard 
                  id={product.id}
                  title={product.name}
                  price={product.price.toLocaleString()}
                  oldPrice={product.old_price?.toLocaleString()}
                  image={getImageUrl(product.images?.[0])}
                  rating={product.rating}
                  reviews={product.reviews_count}
                  badge={product.on_sale ? `-${Math.round((1 - product.price / (product.old_price || product.price)) * 100)}%` : product.featured ? "Destaque" : undefined}
                  storeName="Marrengula-IT"
                  stock={product.stock}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">Nenhum produto encontrado</p>
            </div>
          )}
        </div>

        {showViewAll && displayProducts.length > 0 && (
          <div className="mt-12 text-center">
            <a 
              href={viewAllLink}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#FF3131] to-[#FF5555] text-white font-semibold rounded-lg hover:opacity-90 transition-all hover:scale-105"
            >
              Ver Todos os Produtos
              <span className="text-lg">→</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
