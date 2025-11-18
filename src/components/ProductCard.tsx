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
    <Card className="group overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 bg-card hover:bg-card-hover">
      <div className="relative aspect-square overflow-hidden bg-secondary/50">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {badge && (
          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-accent to-primary text-white shadow-lg">
            {badge}
          </Badge>
        )}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-3 right-3 bg-background/90 hover:bg-background backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:text-accent border border-border/50"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4">
        {storeName && (
          <p className="text-xs text-muted-foreground mb-1 font-medium">Por: {storeName}</p>
        )}
        <Link to="/produto/1">
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors cursor-pointer">
            {title}
          </h3>
        </Link>
        
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${i < rating ? "fill-primary text-primary" : "text-muted"}`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground font-medium">({reviews})</span>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{price}</span>
          {oldPrice && (
            <span className="text-sm text-muted-foreground line-through">{oldPrice}</span>
          )}
        </div>

        <Button className="w-full bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30" size="sm">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
