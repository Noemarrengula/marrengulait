import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Package, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/context/SettingsContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EmptyState from "@/components/EmptyState";
import { SkeletonOrderList } from "@/components/SkeletonTable";

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  payment_method: string;
  total_amount: number;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  delivery_city: string;
  items?: any[];
}

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { locale, currency } = useSettings();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      pending: { color: 'bg-yellow-500', label: 'Pendente' },
      confirmed: { color: 'bg-blue-500', label: 'Confirmado' },
      processing: { color: 'bg-purple-500', label: 'Em Processamento' },
      shipped: { color: 'bg-orange-500', label: 'Enviado' },
      delivered: { color: 'bg-green-500', label: 'Entregue' },
      cancelled: { color: 'bg-red-500', label: 'Cancelado' },
    };

    const config = statusConfig[status] || { color: 'bg-gray-500', label: status };
    
    return (
      <Badge className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    );
  };

  const getPaymentBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pendente' },
      paid: { color: 'bg-green-100 text-green-800', label: 'Pago' },
      failed: { color: 'bg-red-100 text-red-800', label: 'Falhhou' },
      refunded: { color: 'bg-gray-100 text-gray-800', label: 'Reembolsado' },
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Inicie sessão para ver os seus pedidos</h1>
          <p className="text-muted-foreground mb-6">
            Para visualizar o histórico de pedidos, você precisa estar autenticado.
          </p>
          <Button onClick={() => navigate('/auth')} className="bg-[#FF3131]">
            Iniciar Sessão
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Meus Pedidos</h1>
          <p className="text-muted-foreground">
            Acompanhe o estado dos seus pedidos
          </p>
        </div>

        {loading ? (
          <SkeletonOrderList count={4} />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="Nenhum pedido ainda"
            description="Faça seu primeiro pedido e acompanhe aqui"
            actionLabel="Explorar Produtos"
            onAction={() => navigate('/produtos')}
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div>
                        <CardTitle className="text-lg">{order.order_number}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(order.created_at)}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(order.status)}
                        {getPaymentBadge(order.payment_status)}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#FF3131]">
                          {order.total_amount.toLocaleString(locale)} {currency}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.customer_name}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/pedido/${order.id}`)}
                        className="hover:bg-[#FF3131]/10 hover:border-[#FF3131] hover:text-[#FF3131]"
                      >
                        Ver Detalhes
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      <span>Entrega para: {order.delivery_city}</span>
                    </div>
                    <div>
                      Pagamento: <span className="font-medium capitalize">{order.payment_method}</span>
                    </div>
                    <div>
                      Telefone: <span className="font-medium">{order.customer_phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Orders;
