import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';
import { ThumbsUp, BadgeCheck } from 'lucide-react';
import { StarRating } from './StarRating';
import { cn } from '@/lib/utils';
import { sanitizeReview } from '@/lib/sanitize';
import type { Database } from '@/integrations/supabase/types';

type Review = Database['public']['Tables']['reviews']['Row'] & {
  profiles?: {
    full_name?: string;
    email?: string;
  };
  is_verified_purchase?: boolean;
};

interface ReviewCardProps {
  review: Review;
  onHelpful?: (reviewId: string) => void;
  className?: string;
}

export function ReviewCard({ review, onHelpful, className }: ReviewCardProps) {
  const timeAgo = review.created_at
    ? formatDistanceToNow(new Date(review.created_at), {
        addSuffix: true,
        locale: pt,
      })
    : '';

  const userName = review.profiles?.full_name || 
    review.profiles?.email?.split('@')[0] || 
    'Cliente';

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sanitizedReview = sanitizeReview({
    title: review.title,
    comment: review.comment,
  });

  return (
    <div className={cn('p-4 border-b border-border last:border-0', className)}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[#FF3131]/10 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-semibold text-[#FF3131]">
            {initials}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-foreground">{userName}</span>
            {review.is_verified_purchase === true && (
              <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <BadgeCheck className="w-3 h-3" />
                Compra verificada
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={review.rating} size="sm" />
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>

          {sanitizedReview.title && (
            <h4 className="font-semibold text-foreground mt-2">{sanitizedReview.title}</h4>
          )}

          {sanitizedReview.comment && (
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {sanitizedReview.comment}
            </p>
          )}

          {onHelpful && (
            <button
              onClick={() => onHelpful(review.id)}
              className="flex items-center gap-1 mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ThumbsUp className="w-3 h-3" />
              Útil ({review.helpful_count || 0})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;
