import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';

const CartButton = () => {
  const { totalItems } = useCart();

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Link to="/carrinho" onClick={handleClick}>
      <Button variant="ghost" size="icon" className="relative hover:bg-accent/10 transition-all">
        <ShoppingCart className="h-5 w-5 transition-transform hover:scale-110" />
        {totalItems > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-in zoom-in-50 duration-300"
            variant="destructive"
          >
            {totalItems > 99 ? '99+' : totalItems}
          </Badge>
        )}
      </Button>
    </Link>
  );
};

export default CartButton;
