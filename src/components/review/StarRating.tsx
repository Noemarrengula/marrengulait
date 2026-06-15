import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showValue?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
  showValue = false,
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const displayRating = hoverRating ?? rating;

  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(null);
    }
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">
        {Array.from({ length: maxRating }, (_, index) => {
          const value = index + 1;
          const isFilled = value <= displayRating;
          const isHalf = !isFilled && value - 0.5 <= displayRating;

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => handleClick(value)}
              onMouseEnter={() => handleMouseEnter(value)}
              onMouseLeave={handleMouseLeave}
              className={cn(
                'transition-all',
                interactive && 'cursor-pointer hover:scale-110'
              )}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  'transition-colors',
                  isFilled
                    ? 'fill-[#FFB800] text-[#FFB800]'
                    : isHalf
                    ? 'fill-[#FFB800]/50 text-[#FFB800]'
                    : 'fill-transparent text-muted-foreground/30'
                )}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="ml-1 text-sm text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export default StarRating;
