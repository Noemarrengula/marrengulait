import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StarRating } from './StarRating';
import { toast } from 'sonner';
import { Loader2, Send } from 'lucide-react';

interface ReviewFormProps {
  productId: string;
  onSubmit?: () => void;
}

export function ReviewForm({ productId, onSubmit }: ReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Precisas de iniciar sessão para deixar uma avaliação');
      return;
    }

    if (rating === 0) {
      toast.error('Por favor, selecciona uma classificação');
      return;
    }

    if (!comment.trim()) {
      toast.error('Por favor, escreve um comentário');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('reviews').insert({
        product_id: productId,
        user_id: user.id,
        rating,
        title: title.trim() || null,
        comment: comment.trim(),
        is_verified_purchase: false,
        is_approved: false,
      });

      if (error) throw error;

      toast.success('Obrigado! A tua avaliação foi submetida e aguarda aprovação.');
      setHasReviewed(true);
      setRating(0);
      setTitle('');
      setComment('');
      
      if (onSubmit) onSubmit();
    } catch (error: unknown) {
      console.error('Erro ao submeter review:', error);
      const message = error instanceof Error ? error.message : 'Erro ao submeter avaliação';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="p-6 bg-muted/50 rounded-lg text-center">
        <p className="text-muted-foreground mb-3">
          Inicia sessão para deixar a tua avaliação
        </p>
        <Button asChild>
          <a href="/auth">Iniciar Sessão</a>
        </Button>
      </div>
    );
  }

  if (hasReviewed) {
    return (
      <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
        <div className="text-4xl mb-2">✅</div>
        <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">
          Avaliação Submetida!
        </h3>
        <p className="text-sm text-muted-foreground">
          A tua avaliação será visível após aprovação do administrador.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 border rounded-lg bg-card">
      <div className="text-center">
        <Label className="text-base font-medium block mb-2">
          Como classificas este produto?
        </Label>
        <StarRating
          rating={rating}
          size="lg"
          interactive
          onChange={setRating}
        />
        {rating > 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            {rating === 1 && 'Muito mau'}
            {rating === 2 && 'Mau'}
            {rating === 3 && 'Razoável'}
            {rating === 4 && 'Bom'}
            {rating === 5 && 'Excelente!'}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="title" className="text-sm font-medium">
          Título (opcional)
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Resumo da tua experiência"
          maxLength={100}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="comment" className="text-sm font-medium">
          A tua avaliação *
        </Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Conta-nos a tua experiência com este produto..."
          rows={4}
          required
          maxLength={1000}
          className="mt-1 resize-none"
        />
        <p className="text-xs text-muted-foreground mt-1 text-right">
          {comment.length}/1000 caracteres
        </p>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || rating === 0 || !comment.trim()}
        className="w-full bg-[#FF3131] hover:bg-[#FF5555]"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            A submeter...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Submeter Avaliação
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        A tua avaliação será revista antes de ser publicada.
      </p>
    </form>
  );
}

export default ReviewForm;
