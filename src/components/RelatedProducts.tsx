import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProductImage from '@/components/ProductImage';
import { useSettings } from '@/context/SettingsContext';
import { useRelatedProducts } from '@/hooks/useRelatedProducts';
import { useAuth } from '@/hooks/useAuth';
import { useToggleWishlist, useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/contexts/CartContext';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface RelatedProductsProps {
  productId?: string;
  category?: string;
  title?: string;
  limit?: number;
}

export default function RelatedProducts({
  productId,
  category,
  title = 'Produtos Relacionados',
  limit = 8,
}: RelatedProductsProps) {
  const { currency } = useSettings();
  const { user } = useAuth();
  const { isInWishlist } = useWishlist(user?.id);
  const toggleWishlist = useToggleWishlist();
  const { addItem } = useCart();
  const { data: products = [], isLoading } = useRelatedProducts(productId, category, limit);

  if (isLoading) {
    return (
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">{title}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-square" />
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-5 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({
      id: product.id,
      title: product.name,
      price: product.price,
      image: product.images?.[0] || '',
    });
    toast.success('Adicionado ao carrinho!');
  };

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">{title}</h2>
          <Button
            variant="ghost"
            onClick={() => window.location.href = `/produtos?search=${encodeURIComponent(category || '')}`}
            className="text-primary hover:text-primary"
          >
            Ver todos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <Link to={`/produto/${product.id}`}>
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <ProductImage
                    src={product.images?.[0] || ''}
                    alt={product.name}
                    isFavorite={isInWishlist(product.id)}
                    onFavoriteClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!user) {
                        toast.error('Inicie sessão para adicionar aos favoritos');
                        return;
                      }
                      toggleWishlist.mutate({
                        userId: user.id,
                        productId: product.id,
                        isCurrentlyInWishlist: isInWishlist(product.id),
                      });
                    }}
                  />
                  {product.on_sale && (
                    <div className="absolute top-2 left-2 bg-[#FF3131] text-white text-xs font-bold px-2 py-1 rounded">
                      -{Math.round((1 - product.price / (product.old_price || product.price)) * 100)}%
                    </div>
                  )}
                </div>

                <CardContent className="p-3 md:p-4">
                  <h3 className="font-medium text-sm md:text-base line-clamp-2 mb-2 group-hover:text-[#FF3131] transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-yellow-500 text-xs">★</span>
                    <span className="text-xs text-muted-foreground">
                      {product.rating?.toFixed(1) || '0.0'} ({product.reviews_count || 0})
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-[#FF3131] text-sm md:text-base">
                      {product.price.toLocaleString()} {currency}
                    </span>
                    {product.old_price && product.old_price > product.price && (
                      <span className="text-xs text-muted-foreground line-through">
                        {product.old_price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Link>

              <div className="px-3 pb-3 md:px-4 md:pb-4">
                <Button
                  size="sm"
                  className="w-full bg-[#FF3131] hover:bg-[#FF5555] text-xs md:text-sm"
                  onClick={() => handleAddToCart(product)}
                >
                  Adicionar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
