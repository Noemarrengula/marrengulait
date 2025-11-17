import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Star } from "lucide-react";

interface ProductCardProps {
  title: string;
  price: string;
  oldPrice?: string;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
  storeName?: string;
}

const ProductCard = ({ title, price, oldPrice, image, rating, reviews, badge, storeName }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {badge && (
          <Badge className="absolute top-2 left-2 bg-primary">
            {badge}
          </Badge>
        )}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4">
        {storeName && (
          <p className="text-xs text-muted-foreground mb-1">Por: {storeName}</p>
        )}
        <Link to="/produto/1">
          <h3 className="font-medium text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors cursor-pointer">
            {title}
          </h3>
        </Link>
        
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < rating ? "fill-primary text-primary" : "text-muted"}`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({reviews})</span>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-primary">{price}</span>
          {oldPrice && (
            <span className="text-sm text-muted-foreground line-through">{oldPrice}</span>
          )}
        </div>

        <Button className="w-full bg-primary hover:bg-primary/90" size="sm">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
