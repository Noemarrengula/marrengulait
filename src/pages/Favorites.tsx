import { Link, useNavigate } from "react-router-dom";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist, useRemoveFromWishlist } from "@/hooks/useWishlist";
import { useSettings } from "@/contexts/SettingsContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EmptyState from "@/components/EmptyState";
import { SkeletonGrid } from "@/components/SkeletonCard";

const Favorites = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { locale, currency } = useSettings();
  const { wishlist, isLoading, error, refetch } = useWishlist(user?.id);
  const removeFromWishlist = useRemoveFromWishlist();

  const handleRemoveFavorite = (productId: string) => {
    if (!user) return;
    removeFromWishlist.mutate({ userId: user.id, productId });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Inicie sessão para ver os seus favoritos</h1>
          <p className="text-muted-foreground mb-6">
            Para guardar produtos favoritos, você precisa estar autenticado.
          </p>
          <Button onClick={() => navigate('/auth')} className="bg-[#FF3131]">
            Iniciar Sessão
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Meus Favoritos</h1>
          <p className="text-muted-foreground">
            {wishlist.length} produto{wishlist.length !== 1 ? 's' : ''} salvo{wishlist.length !== 1 ? 's' : ''}
          </p>
        </div>

        {isLoading ? (
          <SkeletonGrid count={8} />
        ) : wishlist.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Nenhum favorito ainda"
            description="Adicione produtos aos favoritos para vê-los aqui e acessá-los rapidamente"
            actionLabel="Explorar Produtos"
            onAction={() => navigate('/produtos')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <Card key={item.id} className="group relative overflow-hidden">
                <button
                  onClick={() => handleRemoveFavorite(item.product_id)}
                  className="absolute top-3 right-3 z-10 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md hover:bg-red-50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  title="Remover dos favoritos"
                  disabled={removeFromWishlist.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                
                <Link to={`/produto/${item.product_id}`}>
                  <div className="aspect-square bg-muted overflow-hidden">
                    <img
                      src={item.product?.images?.[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"}
                      alt={item.product?.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-[#FF3131] transition-colors">
                      {item.product?.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm text-muted-foreground">
                        {item.product?.rating?.toFixed(1) || '0.0'} ({item.product?.reviews_count || 0})
                      </span>
                    </div>
                    
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-[#FF3131]">
                        {item.product?.price?.toLocaleString(locale)} {currency}
                      </span>
                      {item.product?.old_price && (
                        <span className="text-sm text-muted-foreground line-through">
                          {item.product.old_price.toLocaleString(locale)}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Favorites;
