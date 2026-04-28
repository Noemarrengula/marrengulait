import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Store, Sparkles, Heart, Zap } from "lucide-react";
import ProductPrice from "@/components/ProductPrice";
import ProductImage from "@/components/ProductImage";
import StockBadge from "@/components/StockBadge";
import { useRating } from "@/hooks/useRating";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist, useToggleWishlist } from "@/hooks/useWishlist";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: string;
  title: string;
  price: string;
  oldPrice?: string;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
  storeName?: string;
  stock?: number;
}

// Constantes
const CARD_CLASSES = "card-modern hover-lift group relative overflow-hidden bg-card/80 backdrop-blur-sm border-2";
const TITLE_CLASSES = "font-semibold text-foreground mb-2 line-clamp-2 hover:text-[#FF3131] transition-colors cursor-pointer group-hover:translate-x-1 duration-300";
const ADD_TO_CART_BUTTON_CLASSES = "w-full bg-gradient-to-r from-[#FF3131] via-[#FF5555] to-[#FF7B7B] hover:opacity-90 shadow-lg glow-primary transition-all hover:scale-105 active:scale-95";
const STORE_NAME_CLASSES = "text-xs text-muted-foreground mb-1 font-medium flex items-center gap-1 group-hover:text-[#FF3131] transition-colors";
const RATING_CONTAINER_CLASSES = "flex items-center gap-1 mb-3 group-hover:scale-105 transition-transform duration-300";

const ProductCard = ({ id, title, price, oldPrice, image, rating, reviews, badge, storeName, stock }: ProductCardProps) => {
  const { renderStars, maxRating } = useRating(rating);
  const { addItem } = useCart();
  const { user } = useAuth();
  const { isInWishlist } = useWishlist(user?.id);
  const toggleWishlist = useToggleWishlist();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isFavorite = isInWishlist(id);
  const isOutOfStock = stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast({ title: "Produto esgotado", description: "Este produto não está disponível", variant: "destructive" });
      return;
    }
    const priceNum = typeof price === 'string' ? parseFloat(price.replace(/[^\d.]/g, '')) : parseFloat(price);
    
    addItem({
      id,
      title,
      price: priceNum,
      image,
      storeName
    });
    toast({ title: "Adicionado ao carrinho!", description: title });
  };

  const handleBuyNow = () => {
    if (isOutOfStock) {
      toast({ title: "Produto esgotado", description: "Este produto não está disponível", variant: "destructive" });
      return;
    }
    const priceNum = typeof price === 'string' ? parseFloat(price.replace(/[^\d.]/g, '')) : parseFloat(price);
    
    addItem({
      id,
      title,
      price: priceNum,
      image,
      storeName
    });
    navigate('/checkout');
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) return;
    toggleWishlist.mutate({
      userId: user.id,
      productId: id,
      isCurrentlyInWishlist: isFavorite,
    });
  };

  return (
    <Card className={CARD_CLASSES}>
      {/* Efeito de brilho decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF3131]/5 via-transparent to-[#FF5555]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Imagem do produto com badge e botão de favorito */}
      <ProductImage
        src={image}
        alt={title}
        badge={badge}
        onFavoriteClick={handleFavoriteClick}
        isFavorite={isFavorite}
      />
      
      {/* Stock Badge */}
      {stock !== undefined && (
        <div className="absolute bottom-3 left-3 z-10">
          <StockBadge stock={stock} />
        </div>
      )}
      
      {/* Informações do produto */}
      <div className="p-4 relative z-10">
        {storeName && (
          <p className={STORE_NAME_CLASSES}>
            <Store className="h-3 w-3" />
            {storeName}
          </p>
        )}
        
        <Link to={`/produto/${id}`}>
          <h3 className={TITLE_CLASSES}>
            {title}
          </h3>
        </Link>
        
        {/* Avaliação com estrelas */}
        <div className={RATING_CONTAINER_CLASSES}>
          <div className="flex" aria-label={`Avaliação: ${rating} de ${maxRating} estrelas`}>
            {renderStars()}
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            ({reviews})
          </span>
        </div>

        {/* Preço */}
        <ProductPrice
          price={price}
          oldPrice={oldPrice}
          className="mb-4"
        />

        {/* Botões de ação */}
        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-gradient-to-r from-[#FF3131] via-[#FF5555] to-[#FF7B7B] hover:opacity-90 shadow-lg transition-all hover:scale-105 active:scale-95" 
            size="sm"
            aria-label="Comprar agora"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
          >
            <Zap className="h-4 w-4 mr-1" />
            Comprar
          </Button>
          <Button 
            variant="outline"
            className="flex-1 border-2 border-[#FF3131] text-[#FF3131] hover:bg-[#FF3131] hover:text-white transition-all" 
            size="sm"
            aria-label="Adicionar ao carrinho"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Adicionar</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
