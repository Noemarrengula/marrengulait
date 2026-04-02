import { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripe, STRIPE_APPEARANCE, IS_STRIPE_CONFIGURED } from '@/lib/stripe/client';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface StripeCardFormProps {
  amount: number;
  currency?: string;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
}

function CardForm({ amount, currency = 'MZN', onSuccess, onError }: StripeCardFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data: clientSecret, error: intentError } = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
            'Authorization': `Bearer ${session?.access_token || ''}`,
          },
          body: JSON.stringify({
            amount: Math.round(amount * 100),
            currency: currency.toLowerCase(),
          }),
        }
      ).then(res => res.json());

      if (intentError) {
        throw new Error(intentError.message || 'Erro ao criar pagamento');
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Elemento do cartão não encontrado');
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret?.clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (paymentIntent?.status === 'succeeded') {
        onSuccess(paymentIntent);
      } else {
        throw new Error('Pagamento não foi processado');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao processar pagamento';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#000000',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-lg bg-muted/50">
        <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
          <CreditCard className="h-4 w-4" />
          <span>Dados do cartão</span>
        </div>
        <CardElement options={cardElementOptions} />
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-[#FF3131] hover:bg-[#FF5555]"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            A processar pagamento...
          </>
        ) : (
          <>
            <Lock className="h-4 w-4 mr-2" />
            Pagar MT {amount.toFixed(2)}
          </>
        )}
      </Button>

      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Lock className="h-3 w-3" />
        <span>Pagamento seguro processado por Stripe</span>
      </div>
    </form>
  );
}

interface StripeCardWrapperProps {
  amount: number;
  currency?: string;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
}

export function StripeCardWrapper(props: StripeCardWrapperProps) {
  if (!IS_STRIPE_CONFIGURED) {
    return (
      <div className="p-6 border rounded-lg bg-muted/50 text-center">
        <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="font-semibold mb-2">Stripe não configurado</h3>
        <p className="text-sm text-muted-foreground">
          Configura a chave da API do Stripe para ativar pagamentos com cartão.
        </p>
      </div>
    );
  }

  return (
    <Elements stripe={getStripe()} options={{ appearance: STRIPE_APPEARANCE }}>
      <CardForm {...props} />
    </Elements>
  );
}

export default StripeCardWrapper;
