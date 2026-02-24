import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { createOrder } from '@/services/orderService';
import { PaymentMethod } from '@/types/order';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Loader2 } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    paymentMethod: 'mpesa' as PaymentMethod
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast({ title: 'Carrinho vazio', variant: 'destructive' });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({ title: 'Faça login para continuar', variant: 'destructive' });
        navigate('/auth');
        return;
      }

      const orderData = {
        user_id: user.id,
        total_amount: totalPrice,
        shipping_address: `${formData.address}, ${formData.city}`,
        customer_name: formData.fullName,
        customer_phone: formData.phone,
        customer_email: formData.email,
        payment_method: formData.paymentMethod,
        items: items.map(item => ({
          product_id: item.id,
          product_name: item.title,
          quantity: item.quantity,
          unit_price: item.price,
          subtotal: item.price * item.quantity
        }))
      };

      const order = await createOrder(orderData);
      
      clearCart();
      toast({ title: 'Pedido criado com sucesso!' });
      navigate(`/pedido/${order.id}`);
      
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      toast({ title: 'Erro ao criar pedido', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/carrinho');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Dados de Entrega</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Nome Completo</Label>
                    <Input
                      id="fullName"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        placeholder="+258 84 123 4567"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      required
                      placeholder="Rua, número, bairro"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Método de Pagamento</h2>
                
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData({...formData, paymentMethod: value as PaymentMethod})}
                >
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="mpesa" id="mpesa" />
                    <Label htmlFor="mpesa" className="flex-1 cursor-pointer">
                      <div className="font-semibold">M-Pesa</div>
                      <div className="text-sm text-muted-foreground">Pagamento via M-Pesa</div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                    <Label htmlFor="bank_transfer" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Transferência Bancária</div>
                      <div className="text-sm text-muted-foreground">Pagamento via transferência</div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
                    <Label htmlFor="cash_on_delivery" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Pagamento na Entrega</div>
                      <div className="text-sm text-muted-foreground">Pague ao receber</div>
                    </Label>
                  </div>
                </RadioGroup>
              </Card>
            </div>
            
            <div>
              <Card className="p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Resumo</h2>
                
                <div className="space-y-2 mb-4">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.title} x{item.quantity}</span>
                      <span>MT {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>MT {totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Entrega</span>
                    <span className="text-green-600">Grátis</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>MT {totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    'Confirmar Pedido'
                  )}
                </Button>
              </Card>
            </div>
          </div>
        </form>
      </div>
      
      <Footer />
    </div>
  );
};

export default Checkout;
