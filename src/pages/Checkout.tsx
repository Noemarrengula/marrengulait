import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/context/SettingsContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PaymentProofUpload from '@/components/checkout/PaymentProofUpload';
import { Loader2, CreditCard, Smartphone, Banknote, Truck, CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react';

type PaymentMethod = 'mpesa' | 'emola' | 'transfer' | 'cod';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { locale, currency, convertPrice } = useSettings();
  
  const formatPrice = (price: number) => price.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  
  // Payment proof state
  interface CreatedOrder {
    id: string;
    order_number?: string;
  }
  const [createdOrder, setCreatedOrder] = useState<CreatedOrder | null>(null);
  const [showPaymentProof, setShowPaymentProof] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    phone: '',
    email: user?.email || '',
    address: '',
    city: 'Maputo',
    province: 'Maputo',
    paymentMethod: 'mpesa' as PaymentMethod,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateCoupon = async () => {
    if (!couponCode.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .single();
      
      if (error || !data) {
        setCouponError('Código de cupom inválido');
        setCouponDiscount(0);
        return;
      }

      if (data.valid_until && new Date(data.valid_until) < new Date()) {
        setCouponError('Cupom expirado');
        setCouponDiscount(0);
        return;
      }

      if (data.min_order_amount && totalPrice < data.min_order_amount) {
        const convertedMinAmount = convertPrice(data.min_order_amount);
        setCouponError(`Valor mínimo: ${formatPrice(convertedMinAmount)} ${currency}`);
        setCouponDiscount(0);
        return;
      }

      if (data.usage_limit && data.used_count >= data.usage_limit) {
        setCouponError('Cupom esgotado');
        setCouponDiscount(0);
        return;
      }

      let discount = 0;
      if (data.discount_type === 'percentage') {
        discount = totalPrice * (data.discount_value / 100);
        if (data.max_discount_amount) {
          discount = Math.min(discount, data.max_discount_amount);
        }
      } else if (data.discount_type === 'fixed') {
        discount = data.discount_value;
      }

      setCouponDiscount(discount);
      setCouponError('');
      const convertedDiscount = convertPrice(discount);
      toast({ title: 'Cupom aplicado!', description: `Desconto de ${formatPrice(convertedDiscount)} ${currency}` });
    } catch (error) {
      setCouponError('Erro ao validar cupom');
      setCouponDiscount(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast({ title: 'Carrinho vazio', variant: 'destructive' });
      return;
    }

    setLoading(true);

    try {
      const subtotal = totalPrice;
      const shippingCost = subtotal >= 5000 ? 0 : 500;
      const discount = couponDiscount;
      const total = subtotal + shippingCost - discount;

      const orderNumber = `MARR-${Date.now()}`;

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id || null,
          order_number: orderNumber,
          status: 'pending',
          payment_status: 'pending',
          payment_method: formData.paymentMethod,
          subtotal: subtotal,
          shipping_cost: shippingCost,
          discount_amount: discount,
          coupon_code: couponCode || null,
          total_amount: total,
          currency: 'MZN',
          customer_name: formData.fullName,
          customer_email: formData.email || null,
          customer_phone: formData.phone,
          delivery_address: formData.address,
          delivery_city: formData.city,
          delivery_province: formData.province,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.title,
        product_image: item.image,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      if (couponCode && couponDiscount > 0) {
        await supabase.rpc('increment_coupon_usage', { coupon_code: couponCode.toUpperCase() });
      }

      // For M-Pesa and E-Mola, show payment proof upload
      if (formData.paymentMethod === 'mpesa' || formData.paymentMethod === 'emola') {
        setCreatedOrder(order);
        setOrderTotal(total);
        setShowPaymentProof(true);
        setLoading(false);
        return;
      }

      // For other methods, complete order immediately
      clearCart();
      toast({ title: 'Pedido criado com sucesso!' });
      navigate(`/pedido/${order.id}`);
      
    } catch (error: unknown) {
      console.error('Erro ao criar pedido:', error);
      const message = error instanceof Error ? error.message : 'Tente novamente';
      toast({ 
        title: 'Erro ao criar pedido', 
        description: message,
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentProofUploaded = async (proofUrl: string, proofData: { method: string; reference: string; message: string }) => {
    if (!createdOrder) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          payment_proof_url: proofUrl || null,
          payment_proof_data: proofData,
          payment_reference: proofData.reference || null,
        })
        .eq('id', createdOrder.id);

      if (error) throw error;

      clearCart();
      toast({ 
        title: '✅ Pedido e comprovativo enviados!',
        description: 'O seu pagamento será confirmado em breve. Tempo médio: 15-30 minutos.'
      });
      navigate(`/pedido/${createdOrder.id}`);
      
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({ 
        title: 'Erro ao enviar comprovativo', 
        description: message,
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
      setShowPaymentProof(false);
    }
  };

  const finalTotal = totalPrice - couponDiscount;
  const shippingCost = finalTotal >= 5000 ? 0 : 500;

  if (items.length === 0 && !showPaymentProof) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">O seu carrinho está vazio</h1>
          <p className="text-muted-foreground mb-6">
            Adicione produtos para continuar com a compra.
          </p>
          <Button onClick={() => navigate('/produtos')} className="bg-[#FF3131]">
            Explorar Produtos
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (showPaymentProof && createdOrder) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => {
              setShowPaymentProof(false);
              navigate('/checkout');
            }}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao checkout
          </Button>
          
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Confirmação de Pagamento</h1>
              <p className="text-muted-foreground">
                Pedido #{createdOrder.order_number} criado. Agora envie o comprovativo.
              </p>
            </div>
            
            <PaymentProofUpload
              paymentMethod={formData.paymentMethod as "mpesa" | "emola"}
              amount={orderTotal}
              orderId={createdOrder.id}
              onProofUploaded={handlePaymentProofUploaded}
              onCancel={() => {
                setShowPaymentProof(false);
                navigate('/checkout');
              }}
            />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Delivery Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-[#FF3131]" />
                    Dados de Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nome Completo *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone (M-Pesa) *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+258 84 XXX XXXX"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço de Entrega *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Rua, número, bairro"
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Cidade"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="province">Província *</Label>
                      <Input
                        id="province"
                        name="province"
                        value={formData.province}
                        onChange={handleInputChange}
                        placeholder="Província"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-[#FF3131]" />
                    Método de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value as PaymentMethod }))}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="mpesa" id="mpesa" />
                      <Label htmlFor="mpesa" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Smartphone className="h-6 w-6 text-green-600" />
                        <div>
                          <p className="font-semibold">M-Pesa</p>
                          <p className="text-sm text-muted-foreground">Pagamento rápido via telemóvel</p>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="emola" id="emola" />
                      <Label htmlFor="emola" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Smartphone className="h-6 w-6 text-orange-600" />
                        <div>
                          <p className="font-semibold">E-Mola</p>
                          <p className="text-sm text-muted-foreground">Pagamento via telemóvel Vodacom</p>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="transfer" id="transfer" />
                      <Label htmlFor="transfer" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Banknote className="h-6 w-6 text-blue-600" />
                        <div>
                          <p className="font-semibold">Transferência Bancária</p>
                          <p className="text-sm text-muted-foreground">Dados bancários serão enviados após confirmação</p>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Banknote className="h-6 w-6 text-purple-600" />
                        <div>
                          <p className="font-semibold">Pagamento na Entrega</p>
                          <p className="text-sm text-muted-foreground">Pague quando receber o produto</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {items.map(item => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          <p className="text-sm font-semibold text-[#FF3131]">
                            {formatPrice(convertPrice(item.price * item.quantity))} {currency}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(convertPrice(totalPrice))} {currency}</span>
                    </div>
                    
                    {/* Coupon */}
                    <div className="space-y-2 pt-2">
                      <div className="flex gap-2">
                        <Input
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Código do cupom"
                          className="text-sm"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={validateCoupon}
                          disabled={!couponCode.trim()}
                        >
                          Aplicar
                        </Button>
                      </div>
                      {couponError && (
                        <p className="text-xs text-red-500">{couponError}</p>
                      )}
                      {couponDiscount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Desconto</span>
                          <span>-{formatPrice(convertPrice(couponDiscount))} {currency}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Frete</span>
                      <span>{shippingCost === 0 ? 'Grátis' : `${formatPrice(convertPrice(shippingCost))} ${currency}`}</span>
                    </div>
                    
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-[#FF3131]">{formatPrice(convertPrice(finalTotal + shippingCost))} {currency}</span>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="flex items-center gap-2 pt-4 text-xs text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    <span>Pagamento seguro e protegido</span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#FF3131] to-[#FF5555] hover:opacity-90"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Confirmar Pedido
                      </>
                    )}
                  </Button>
                </CardContent>
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
