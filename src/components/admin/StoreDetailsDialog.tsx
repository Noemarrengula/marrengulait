import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface Store {
  name: string;
  productsCount: number;
  totalSales: number;
  status: 'active' | 'pending' | 'suspended';
}

interface StoreDetailsDialogProps {
  store: Store | null;
  open: boolean;
  onClose: () => void;
}

const StoreDetailsDialog = ({ store, open, onClose }: StoreDetailsDialogProps) => {
  if (!store) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes da Loja</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Nome</h3>
            <p className="text-lg">{store.name}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Status</h3>
            <Badge variant={
              store.status === 'active' ? 'default' :
              store.status === 'pending' ? 'secondary' : 'destructive'
            }>
              {store.status === 'active' ? 'Ativa' :
               store.status === 'pending' ? 'Pendente' : 'Suspensa'}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Total de Produtos</h3>
              <p className="text-2xl font-bold">{store.productsCount}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Vendas Totais</h3>
              <p className="text-2xl font-bold">MT {store.totalSales.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoreDetailsDialog;
