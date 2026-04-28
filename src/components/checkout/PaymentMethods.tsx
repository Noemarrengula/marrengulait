import { useState } from 'react';
import { CreditCard, Smartphone, Check } from 'lucide-react';
import { StripeCardWrapper } from './StripeCardElement';
import { PayPalButton } from './PayPalButton';
import { cn } from '@/lib/utils';

export type PaymentMethod = 'stripe' | 'paypal' | 'mpesa';

interface PaymentMethodsProps {
  amount: number;
  currency?: string;
  onStripeSuccess: (paymentIntent: Record<string, unknown>) => void;
  onStripeError: (error: string) => void;
  onPayPalSuccess: (order: Record<string, unknown>) => void;
  onPayPalError: (error: string) => void;
  onPayPalCancel?: () => void;
  selectedMethod: PaymentMethod | null;
  onMethodChange: (method: PaymentMethod) => void;
  className?: string;
}

export function PaymentMethods({
  amount,
  currency = 'MZN',
  onStripeSuccess,
  onStripeError,
  onPayPalSuccess,
  onPayPalError,
  onPayPalCancel,
  selectedMethod,
  onMethodChange,
  className,
}: PaymentMethodsProps) {
  const methods = [
    {
      id: 'stripe' as PaymentMethod,
      name: 'Cartão de Crédito/Débito',
      icon: CreditCard,
      description: 'Visa, Mastercard, etc.',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      id: 'paypal' as PaymentMethod,
      name: 'PayPal',
      icon: () => (
        <div className="h-5 w-5 bg-[#003087] rounded flex items-center justify-center">
          <span className="text-white text-xs font-bold">P</span>
        </div>
      ),
      description: 'Pagamento rápido e seguro',
      color: 'from-[#003087] to-[#009cde]',
    },
    {
      id: 'mpesa' as PaymentMethod,
      name: 'M-Pesa',
      icon: Smartphone,
      description: 'Pagamento via telemóvel',
      color: 'from-green-500 to-emerald-500',
      disabled: true,
    },
  ];

  return (
    <div className={cn('space-y-6', className)}>
      <div className="space-y-3">
        <label className="text-sm font-medium">Método de Pagamento</label>
        
        <div className="grid gap-3">
          {methods.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.id;
            const isDisabled = method.disabled;

            return (
              <button
                key={method.id}
                type="button"
                disabled={isDisabled}
                onClick={() => !isDisabled && onMethodChange(method.id)}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left',
                  isSelected
                    ? 'border-[#FF3131] bg-[#FF3131]/5'
                    : 'border-border hover:border-muted-foreground/50',
                  isDisabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br',
                    method.color,
                    isSelected && 'ring-2 ring-[#FF3131] ring-offset-2'
                  )}
                >
                  {method.id === 'paypal' ? (
                    <Icon />
                  ) : (
                    <Icon className="h-5 w-5 text-white" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{method.name}</span>
                    {method.disabled && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded">Em breve</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-[#FF3131] flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedMethod === 'stripe' && (
        <div className="pt-2">
          <StripeCardWrapper
            amount={amount}
            currency={currency}
            onSuccess={onStripeSuccess}
            onError={onStripeError}
          />
        </div>
      )}

      {selectedMethod === 'paypal' && (
        <div className="pt-2 relative">
          <PayPalButton
            amount={amount}
            currency={currency === 'MZN' ? 'USD' : currency}
            onSuccess={onPayPalSuccess}
            onError={onPayPalError}
            onCancel={onPayPalCancel}
          />
        </div>
      )}

      {selectedMethod === 'mpesa' && (
        <div className="p-6 border rounded-lg bg-muted/50 text-center">
          <Smartphone className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">M-Pesa em breve</h3>
          <p className="text-sm text-muted-foreground">
            Este método de pagamento estará disponível em breve.
          </p>
        </div>
      )}
    </div>
  );
}

export default PaymentMethods;
