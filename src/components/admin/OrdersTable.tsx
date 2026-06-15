import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye } from 'lucide-react';
import { Order, OrderStatus, PaymentStatus } from '@/types/order';
import { updateOrderStatus, updatePaymentStatus } from '@/services/orderService';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/contexts/SettingsContext';

interface OrdersTableProps {
  orders: Order[];
  onOrderUpdate: () => void;
  onViewOrder: (orderId: string) => void;
}

const OrdersTable = ({ orders, onOrderUpdate, onViewOrder }: OrdersTableProps) => {
  const { toast } = useToast();
  const { locale, currency } = useSettings();
  const [updating, setUpdating] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    setUpdating(orderId);
    try {
      await updateOrderStatus(orderId, status);
      toast({ title: 'Status atualizado' });
      onOrderUpdate();
    } catch (error) {
      toast({ title: 'Erro ao atualizar status', variant: 'destructive' });
    } finally {
      setUpdating(null);
    }
  };

  const handlePaymentChange = async (orderId: string, status: PaymentStatus) => {
    setUpdating(orderId);
    try {
      await updatePaymentStatus(orderId, status);
      toast({ title: 'Pagamento atualizado' });
      onOrderUpdate();
    } catch (error) {
      toast({ title: 'Erro ao atualizar pagamento', variant: 'destructive' });
    } finally {
      setUpdating(null);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Número</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Pagamento</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-mono">{order.order_number}</TableCell>
            <TableCell>
              <div className="text-sm">
                <div className="font-medium">{order.customer_name}</div>
                <div className="text-muted-foreground">{order.customer_phone}</div>
              </div>
            </TableCell>
            <TableCell className="font-bold">{order.total_amount.toLocaleString(locale, {minimumFractionDigits:2,maximumFractionDigits:2})} {currency}</TableCell>
            <TableCell>
              <Select
                value={order.status}
                onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                disabled={updating === order.id}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="confirmed">Confirmado</SelectItem>
                  <SelectItem value="processing">Processando</SelectItem>
                  <SelectItem value="shipped">Enviado</SelectItem>
                  <SelectItem value="delivered">Entregue</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              <Select
                value={order.payment_status}
                onValueChange={(value) => handlePaymentChange(order.id, value as PaymentStatus)}
                disabled={updating === order.id}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="failed">Falhou</SelectItem>
                  <SelectItem value="refunded">Reembolsado</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell className="text-sm">
              {new Date(order.created_at).toLocaleDateString(locale)}
            </TableCell>
            <TableCell>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onViewOrder(order.id)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrdersTable;
