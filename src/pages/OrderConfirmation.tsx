import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getOrderById } from '@/services/orderService';
import { Order } from '@/types/order';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle2, Clock, Package, Loader2 } from 'lucide-react';

const OrderConfirmation = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      if (!id) return;
      
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (error) {
        console.error('Erro ao carregar pedido:', error);
        toast({ title: 'Erro ao carregar pedido', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id, toast]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="h-6 w-6 text-green-600" />;
      case 'processing':
        return <Package className="h-6 w-6 text-blue-600" />;
      default:
        return <Clock className="h-6 w-6 text-yellow-600" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Pendente',
      confirmed: 'Confirmado',
      processing: 'Em Processamento',
      shipped: 'Enviado',
      delivered: 'Entregue',
      cancelled: 'Cancelado'
    };
    return statusMap[status] || status;
  };

  const getPaymentStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Pendente',
      paid: 'Pago',
      failed: 'Falhou',
      refunded: 'Reembolsado'
    };
    return statusMap[status] || status;
  };

  const getPaymentMethodText = (method: string) => {
    const methodMap: Record<string, string> = {
      mpesa: 'M-Pesa',
      bank_transfer: 'Transferência Bancária',
      cash_on_delivery: 'Pagamento na Entrega'
    };
    return methodMap[method] || method;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Pedido não encontrado</h1>
          <Link to="/">
            <Button>Voltar ao Início</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card className="p-8 mb-6 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Pedido Confirmado!</h1>
            <p className="text-muted-foreground mb-4">
              Obrigado pela sua compra. Seu pedido foi recebido.
            </p>
            <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-lg">
              <span className="text-sm text-muted-foreground">Número do Pedido:</span>
              <span className="font-mono font-bold">{order.order_number}</span>
            </div>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Status do Pedido</h2>
            
            <div className="flex items-center gap-3 mb-4">
              {getStatusIcon(order.status)}
              <div>
                <div className="font-semibold">{getStatusText(order.status)}</div>
                <div className="text-sm text-muted-foreground">
                  Criado em {new Date(order.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Pagamento</div>
                <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                  {getPaymentStatusText(order.payment_status)}
                </Badge>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground mb-1">Método</div>
                <div className="font-medium">{getPaymentMethodText(order.payment_method)}</div>
              </div>
            </div>
          </Card>

          {order.payment_method !== 'cash_on_delivery' && order.payment_status === 'pending' && (
            <Card className="p-6 mb-6 bg-blue-50 dark:bg-blue-950 border-blue-200">
              <h2 className="text-xl font-bold mb-4">Instruções de Pagamento</h2>
              
              {order.payment_method === 'mpesa' && (
                <div className="space-y-2">
                  <p className="font-semibold">Envie o pagamento via M-Pesa:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Abra o app M-Pesa</li>
                    <li>Selecione "Enviar Dinheiro"</li>
                    <li>Número: <span className="font-mono font-bold">84 123 4567</span></li>
                    <li>Valor: <span className="font-bold">MT {order.total_amount.toFixed(2)}</span></li>
                    <li>Referência: <span className="font-mono">{order.order_number}</span></li>
                  </ol>
                </div>
              )}
              
              {order.payment_method === 'bank_transfer' && (
                <div className="space-y-2">
                  <p className="font-semibold">Dados para transferência:</p>
                  <div className="text-sm space-y-1">
                    <div>Banco: <span className="font-bold">Millennium BIM</span></div>
                    <div>NIB: <span className="font-mono font-bold">0001 0000 1234 5678 9012 3</span></div>
                    <div>Titular: <span className="font-bold">Marrengula IT</span></div>
                    <div>Valor: <span className="font-bold">MT {order.total_amount.toFixed(2)}</span></div>
                    <div>Referência: <span className="font-mono">{order.order_number}</span></div>
                  </div>
                </div>
              )}
            </Card>
          )}

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Detalhes da Entrega</h2>
            
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Nome:</span>{' '}
                <span className="font-medium">{order.customer_name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Telefone:</span>{' '}
                <span className="font-medium">{order.customer_phone}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>{' '}
                <span className="font-medium">{order.customer_email}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Endereço:</span>{' '}
                <span className="font-medium">{order.delivery_address}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Itens do Pedido</h2>
            
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={item.product_name} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <div className="font-medium">{item.product_name}</div>
                    <div className="text-sm text-muted-foreground">
                      Quantidade: {item.quantity} x MT {item.unit_price.toFixed(2)}
                    </div>
                  </div>
                  <div className="font-bold">
                    MT {item.subtotal.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>MT {order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          <div className="flex gap-4">
            <Link to="/" className="flex-1">
              <Button variant="outline" className="w-full">
                Voltar ao Início
              </Button>
            </Link>
            <Link to="/produtos" className="flex-1">
              <Button className="w-full">
                Continuar Comprando
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
