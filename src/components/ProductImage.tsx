import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";

interface ProductImageProps {
  src: string;
  alt: string;
  badge?: string;
  onFavoriteClick?: () => void;
  isFavorite?: boolean;
  className?: string;
}

const IMAGE_CONTAINER_CLASSES = "relative aspect-square overflow-hidden bg-secondary/50 group-hover:bg-secondary/70 transition-colors duration-500";
const IMAGE_CLASSES = "w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-700";
const BADGE_CLASSES = "absolute top-3 left-3 bg-gradient-to-r from-accent to-primary text-white shadow-lg animate-pulse-glow z-10";
const FAVORITE_BUTTON_CLASSES = "absolute top-3 right-3 bg-background/90 hover:bg-background backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:text-accent hover:scale-110 border border-border/50 z-10";

const ProductImage = ({ 
  src, 
  alt, 
  badge, 
  onFavoriteClick, 
  isFavorite = false,
  className = ''
}: ProductImageProps) => {
  return (
    <div className={`${IMAGE_CONTAINER_CLASSES} ${className}`}>
      {/* Overlay gradiente no hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[1]" />
      
      <img
        src={src}
        alt={alt}
        className={IMAGE_CLASSES}
        loading="lazy"
      />
      
      {badge && (
        <Badge className={BADGE_CLASSES}>
          {badge}
        </Badge>
      )}
      
      <Button
        size="icon"
        variant="ghost"
        className={FAVORITE_BUTTON_CLASSES}
        onClick={onFavoriteClick}
        aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      >
        <Heart className={`h-4 w-4 transition-all duration-300 ${isFavorite ? 'fill-red-500 text-red-500 scale-110' : ''}`} />
      </Button>
    </div>
  );
};

export default ProductImage;
