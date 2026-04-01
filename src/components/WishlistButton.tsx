import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToggleWishlist, useWishlist } from '@/hooks/useWishlist';
import { useNavigate } from 'react-router-dom';

interface WishlistButtonProps {
  productId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
  defaultColor?: string;
}

export default function WishlistButton({
  productId,
  size = 'md',
  className = '',
  showText = false,
  defaultColor = 'text-foreground',
}: WishlistButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isInWishlist } = useWishlist(user?.id);
  const toggleWishlist = useToggleWishlist();
  
  const isInList = isInWishlist(productId);
  
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };
  
  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate('/auth');
      return;
    }
    
    toggleWishlist.mutate({
      userId: user.id,
      productId,
      isCurrentlyInWishlist: isInList,
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={toggleWishlist.isPending}
      className={`
        rounded-full transition-all duration-300
        hover:bg-[#FF3131]/10 
        ${isInList 
          ? 'text-[#FF3131] hover:text-[#FF3131]' 
          : `text-muted-foreground hover:text-[#FF3131] ${defaultColor}`
        }
        ${className}
      `}
      title={isInList ? 'Remover da lista de desejos' : 'Adicionar à lista de desejos'}
    >
      <Heart
        className={`
          ${iconSizes[size]} 
          transition-all duration-300
          ${isInList ? 'fill-[#FF3131] scale-110' : 'hover:scale-110'}
        `}
      />
    </Button>
  );
}
