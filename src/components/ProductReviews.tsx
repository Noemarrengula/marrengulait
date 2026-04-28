import { useState, useEffect } from "react";
import { Star, Loader2, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { reviewService, type ProductReview, type ReviewFormData } from "@/services/review.service";

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 5,
    title: "",
    comment: "",
  });

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewService.getReviewsByProduct(productId);
      setReviews(data);
    } catch (error) {
      console.error("Erro ao carregar reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.comment) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      setSubmitting(true);
      await reviewService.submitReview(productId, "anonymous", formData);
      toast.success("Obrigado! A sua avaliação será publicada após aprovação.");
      setShowForm(false);
      setFormData({ rating: 5, title: "", comment: "" });
    } catch (error) {
      toast.error("Erro ao submeter avaliação");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setFormData({ ...formData, rating: star })}
            className={interactive ? "cursor-pointer hover:scale-110" : "cursor-default"}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">
          Avaliações ({reviews.length})
        </h3>
        <Button onClick={() => setShowForm(!showForm)} variant="outline">
          Escrever Avaliação
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-muted p-6 rounded-lg space-y-4">
          <div>
            <Label>Rating</Label>
            {renderStars(formData.rating, true)}
          </div>
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Resumo da sua avaliação"
              required
            />
          </div>
          <div>
            <Label htmlFor="comment">Comentário</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="Descreva a sua experiência com o produto..."
              rows={4}
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  A submeter...
                </>
              ) : (
                "Submeter Avaliação"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Ainda não há avaliações para este produto.</p>
          <p className="text-sm">Seja o primeiro a avaliar!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{review.user_name}</span>
                </div>
                {renderStars(review.rating)}
              </div>
              {review.title && (
                <h4 className="font-semibold mb-1">{review.title}</h4>
              )}
              <p className="text-muted-foreground">{review.comment}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(review.created_at).toLocaleDateString("pt-MZ")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}