import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Search, Check, Clock, Truck, Home, XCircle, Loader2, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/contexts/SettingsContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderTracking {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  payment_method: string;
  total_amount: number;
  subtotal: number;
  shipping_cost: number;
  created_at: string;
  updated_at: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: string;
  delivery_city: string;
  notes?: string;
  items: OrderItem[];
}

const statusSteps = [
  { key: 'pending', label: 'Pendente', icon: Clock },
  { key: 'confirmed', label: 'Confirmado', icon: Check },
  { key: 'processing', label: 'Em Processamento', icon: Package },
  { key: 'shipped', label: 'Enviado', icon: Truck },
  { key: 'delivered', label: 'Entregue', icon: Home },
];

const Tracking = () => {
  const navigate = useNavigate();
  const { locale, currency } = useSettings();
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<OrderTracking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const searchOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setLoading(true);
    setError(null);
    setOrder(null);
    setSearched(true);

    try {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_name,
            quantity,
            price,
            image_url
          )
        `)
        .ilike('order_number', `%${orderNumber}%`)
        .single();

      if (fetchError || !data) {
        setError("Encomenda não encontrada. Verifique o número e tente novamente.");
        return;
      }

      const formattedOrder: OrderTracking = {
        ...data,
        items: (data.order_items || []).map((item: { id: string; product_name: string; quantity: number; price: number; image_url?: string }) => ({
          ...item,
          image: item.image_url,
        })),
      };

      setOrder(formattedOrder);
    } catch (err) {
      setError("Ocorreu um erro ao buscar a encomenda. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status: string) => {
    return statusSteps.findIndex(s => s.key === status);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500',
      confirmed: 'bg-blue-500',
      processing: 'bg-purple-500',
      shipped: 'bg-orange-500',
      delivered: 'bg-green-500',
      cancelled: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pendente',
      confirmed: 'Confirmado',
      processing: 'Em Processamento',
      shipped: 'Enviado',
      delivered: 'Entregue',
      cancelled: 'Cancelado',
    };
    return labels[status] || status;
  };

  const getPaymentLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pendente',
      paid: 'Pago',
      refunded: 'Reembolsado',
      failed: 'Falhado',
    };
    return labels[status] || status;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-MZ', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF3131]/10 rounded-full mb-4">
            <Package className="w-8 h-8 text-[#FF3131]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Rastrear Encomenda
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Digite o número da sua encomenda para acompanhar o estado da entrega
          </p>
        </div>

        {/* Search Form */}
        <Card className="max-w-xl mx-auto mb-8">
          <CardContent className="pt-6">
            <form onSubmit={searchOrder} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Ex: MRG-2025-XXXX"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={loading} className="bg-[#FF3131] hover:bg-[#FF5555]">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Rastrear'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="max-w-xl mx-auto border-red-500">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-red-500">
                <XCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Details */}
        {order && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Order Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-xl">Encomenda #{order.order_number}</CardTitle>
                    <CardDescription>
                      Efetuada em {formatDate(order.created_at)}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                    <Badge variant="outline">
                      {getPaymentLabel(order.payment_status)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estado da Encomenda</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
                    <div 
                      className="h-full bg-[#FF3131] transition-all duration-500"
                      style={{ 
                        width: `${Math.min(100, (getStatusIndex(order.status) + 1) / statusSteps.length * 100)}%` 
                      }}
                    />
                  </div>
                  
                  {/* Steps */}
                  <div className="relative flex justify-between">
                    {statusSteps.map((step, index) => {
                      const isActive = index <= getStatusIndex(order.status);
                      const isCurrent = step.key === order.status;
                      const Icon = step.icon;
                      
                      return (
                        <div key={step.key} className="flex flex-col items-center">
                          <div 
                            className={`
                              w-12 h-12 rounded-full flex items-center justify-center z-10
                              transition-all duration-300
                              ${isActive 
                                ? 'bg-[#FF3131] text-white' 
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}
                              ${isCurrent ? 'ring-4 ring-[#FF3131]/30 scale-110' : ''}
                            `}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className={`
                            mt-2 text-xs font-medium text-center max-w-[80px]
                            ${isActive ? 'text-foreground' : 'text-muted-foreground'}
                          `}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações de Entrega</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#FF3131]/10 rounded-lg">
                    <Phone className="h-5 w-5 text-[#FF3131]" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contacto</p>
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-sm">{order.customer_phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#FF3131]/10 rounded-lg">
                    <MapPin className="h-5 w-5 text-[#FF3131]" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Endereço de Entrega</p>
                    <p className="font-medium">{order.delivery_address}</p>
                    <p className="text-sm">{order.delivery_city}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Produtos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.product_name} width="64" height="64" className="w-full h-full object-cover" />
                        ) : (
                          <Package className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-muted-foreground">Quantidade: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-[#FF3131]">
                        {(item.price * item.quantity).toLocaleString(locale)} {currency}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-6 pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{order.subtotal?.toLocaleString(locale) || order.total_amount.toLocaleString(locale)} {currency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Entrega</span>
                    <span>{order.shipping_cost === 0 ? 'Grátis' : `${order.shipping_cost.toLocaleString(locale)} ${currency}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-[#FF3131]">{order.total_amount.toLocaleString(locale)} {currency}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => navigate('/contato')}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Contactar Suporte
                  </Button>
                  <Button 
                    className="flex-1 bg-[#FF3131] hover:bg-[#FF5555]"
                    onClick={() => navigate('/pedidos')}
                  >
                    Ver Meus Pedidos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {searched && !order && !error && !loading && (
          <Card className="max-w-xl mx-auto">
            <CardContent className="pt-6 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Encomenda não encontrada. Verifique o número e tente novamente.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Tracking;
