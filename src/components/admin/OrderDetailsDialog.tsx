import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/types/order';

interface OrderDetailsDialogProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}

const OrderDetailsDialog = ({ order, open, onClose }: OrderDetailsDialogProps) => {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pedido #{order.order_number}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Status</h3>
            <div className="flex gap-2">
              <Badge>{order.status}</Badge>
              <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                {order.payment_status}
              </Badge>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Cliente</h3>
            <div className="text-sm space-y-1">
              <div><span className="text-muted-foreground">Nome:</span> {order.customer_name}</div>
              <div><span className="text-muted-foreground">Email:</span> {order.customer_email}</div>
              <div><span className="text-muted-foreground">Telefone:</span> {order.customer_phone}</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Entrega</h3>
            <div className="text-sm">
              {order.shipping_address}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Pagamento</h3>
            <div className="text-sm">
              <div><span className="text-muted-foreground">Método:</span> {order.payment_method}</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Itens</h3>
            <div className="space-y-2">
              {order.items?.map((item, index) => (
                <div key={index} className="flex justify-between text-sm border-b pb-2">
                  <div>
                    <div className="font-medium">{item.product_name}</div>
                    <div className="text-muted-foreground">Qtd: {item.quantity}</div>
                  </div>
                  <div className="font-bold">MT {item.subtotal.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>MT {order.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
