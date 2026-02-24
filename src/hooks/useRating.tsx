import { Star } from "lucide-react";

interface UseRatingOptions {
  maxRating?: number;
  starSize?: string;
  filledColor?: string;
  emptyColor?: string;
}

interface UseRatingReturn {
  renderStars: () => JSX.Element[];
  percentage: number;
  rating: number;
  maxRating: number;
}

export const useRating = (
  rating: number, 
  options: UseRatingOptions = {}
): UseRatingReturn => {
  const {
    maxRating = 5,
    starSize = 'h-3.5 w-3.5',
    filledColor = 'fill-primary text-primary',
    emptyColor = 'text-muted'
  } = options;

  const normalizedRating = Math.max(0, Math.min(rating, maxRating));
  const percentage = (normalizedRating / maxRating) * 100;

  const renderStars = (): JSX.Element[] => {
    return [...Array(maxRating)].map((_, index) => {
      const isFilled = index < normalizedRating;
      const starClasses = `${starSize} ${isFilled ? filledColor : emptyColor}`;
      
      return (
        <Star 
          key={index} 
          className={starClasses}
          aria-hidden="true"
        />
      );
    });
  };

  return {
    renderStars,
    percentage,
    rating: normalizedRating,
    maxRating
  };
};
