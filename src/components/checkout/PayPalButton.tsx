import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PayPalButtonProps {
  amount: number;
  currency?: string;
  onSuccess: (order: Record<string, unknown>) => void;
  onError: (error: string) => void;
  onCancel?: () => void;
}

interface PayPalOrder {
  id?: string;
  status?: string;
  purchase_units?: Array<{
    amount?: { value?: string };
  }>;
}

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: Record<string, unknown>) => {
        render: (selector: string) => void;
      };
    };
  }
}

export function PayPalButton({ amount, currency = 'USD', onSuccess, onError, onCancel }: PayPalButtonProps) {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
    
    if (!clientId) {
      console.warn('PayPal Client ID not configured');
      return;
    }

    setIsConfigured(true);

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}`;
    script.async = true;
    
    script.onload = () => {
      setIsReady(true);
    };

    script.onerror = () => {
      console.error('Failed to load PayPal SDK');
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [currency]);

  useEffect(() => {
    if (!isReady || !window.paypal || !window.paypal.Buttons) return;

    const container = document.getElementById('paypal-button-container');
    if (!container) return;

    container.innerHTML = '';

    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'pay',
      },
      createOrder: (_data: Record<string, unknown>, actions: { order: { create: (config: Record<string, unknown>) => Promise<string> } }) => {
        setIsLoading(true);
        return actions.order.create({
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: currency,
                value: amount.toFixed(2),
              },
            },
          ],
        });
      },
      onApprove: async (_data: Record<string, unknown>, actions: { order: { capture: () => Promise<PayPalOrder> } }) => {
        try {
          const order = await actions.order.capture();
          onSuccess(order as Record<string, unknown>);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Erro ao processar pagamento PayPal';
          onError(message);
        } finally {
          setIsLoading(false);
        }
      },
      onError: (err: unknown) => {
        const message = err instanceof Error ? err.message : 'Erro no PayPal';
        onError(message);
        setIsLoading(false);
      },
      onCancel: () => {
        if (onCancel) onCancel();
        setIsLoading(false);
      },
    }).render('#paypal-button-container');
  }, [isReady, amount, currency, onSuccess, onError, onCancel]);

  if (!isConfigured) {
    return (
      <div className="p-6 border rounded-lg bg-muted/50 text-center">
        <div className="h-12 w-12 mx-auto mb-4 bg-[#003087] rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-lg">P</span>
        </div>
        <h3 className="font-semibold mb-2">PayPal não configurado</h3>
        <p className="text-sm text-muted-foreground">
          Adiciona o Client ID do PayPal para ativar este método de pagamento.
        </p>
        <div className="mt-4 p-3 bg-muted rounded-lg text-xs font-mono">
          VITE_PAYPAL_CLIENT_ID=sua_chave_aqui
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div id="paypal-button-container" className="min-h-[150px]">
        {!isReady && (
          <div className="flex items-center justify-center h-[150px]">
            <Loader2 className="h-8 w-8 animate-spin text-[#003087]" />
          </div>
        )}
      </div>
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
          <Loader2 className="h-8 w-8 animate-spin text-[#003087]" />
        </div>
      )}

      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <span className="text-[#003087] font-bold">Pay</span>
        <span className="text-[#009cde] font-bold">Pal</span>
        <span>- Pagamento seguro</span>
      </div>
    </div>
  );
}

export default PayPalButton;
