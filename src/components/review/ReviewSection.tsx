import { useState, useEffect } from 'react';
import { StarRating } from './StarRating';
import { ReviewCard } from './ReviewCard';
import { ReviewForm } from './ReviewForm';
import { Button } from '@/components/ui/button';
import { Loader2, MessageSquare } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Review = Database['public']['Tables']['reviews']['Row'] & {
  profiles?: {
    full_name?: string;
    email?: string;
  };
};

interface ReviewSectionProps {
  productId: string;
  productRating?: number;
  reviewsCount?: number;
}

export function ReviewSection({
  productId,
  productRating = 0,
  reviewsCount = 0,
}: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .eq('product_id', productId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Erro ao carregar reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHelpful = async (reviewId: string) => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const review = reviews.find((r) => r.id === reviewId);
      if (!review) return;

      const { error } = await supabase
        .from('reviews')
        .update({ helpful_count: (review.helpful_count || 0) + 1 })
        .eq('id', reviewId);

      if (error) throw error;

      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId ? { ...r, helpful_count: (r.helpful_count || 0) + 1 } : r
        )
      );
    } catch (error) {
      console.error('Erro ao marcar útil:', error);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    if (filter === 'all') return true;
    return review.rating === parseInt(filter);
  });

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: reviews.length > 0 
      ? Math.round((reviews.filter((r) => r.rating === rating).length / reviews.length) * 100)
      : 0,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF3131]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-[#FF3131]" />
        <h2 className="text-2xl font-bold">Avaliações ({reviews.length})</h2>
      </div>

      {reviews.length > 0 && (
        <>
          <div className="grid md:grid-cols-2 gap-8 p-6 bg-card rounded-lg border">
            <div className="text-center">
              <div className="text-5xl font-bold text-[#FF3131]">
                {productRating > 0 ? productRating.toFixed(1) : '0.0'}
              </div>
              <StarRating rating={productRating} size="lg" className="justify-center mt-2" />
              <p className="text-sm text-muted-foreground mt-1">
                Baseado em {reviews.length} avaliação{reviews.length !== 1 && 'es'}
              </p>
            </div>

            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <button
                  key={rating}
                  onClick={() => setFilter(filter === String(rating) ? 'all' : String(rating) as any)}
                  className={`flex items-center gap-2 w-full text-sm hover:bg-muted/50 rounded px-2 py-1 transition-colors ${
                    filter === String(rating) ? 'bg-muted' : ''
                  }`}
                >
                  <span className="w-8">{rating} ★</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FFB800] transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-muted-foreground">{count}</span>
                </button>
              ))}
            </div>
          </div>

          {filter !== 'all' && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Mostrando {filteredReviews.length} avaliação(ões) com {filter} ★
              </p>
              <Button variant="ghost" size="sm" onClick={() => setFilter('all')}>
                Mostrar todas
              </Button>
            </div>
          )}
        </>
      )}

      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onHelpful={handleHelpful}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-muted-foreground">
              Ainda não há avaliações para este produto.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Seja o primeiro a avaliar!
            </p>
          </div>
        )}
      </div>

      <div className="border-t pt-8">
        {!showForm ? (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-[#FF3131] hover:bg-[#FF5555]"
          >
            Escrever Avaliação
          </Button>
        ) : (
          <ReviewForm
            productId={productId}
            onSubmit={() => {
              setShowForm(false);
              fetchReviews();
            }}
          />
        )}
      </div>
    </div>
  );
}

export default ReviewSection;
