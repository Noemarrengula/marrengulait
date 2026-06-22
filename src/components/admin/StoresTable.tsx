import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, CheckCircle, XCircle } from 'lucide-react';

interface Store {
  name: string;
  productsCount: number;
  totalSales: number;
  status: 'active' | 'pending' | 'suspended';
}

interface StoresTableProps {
  stores: Store[];
  onViewStore: (store: Store) => void;
  onApprove: (storeName: string) => void;
  onSuspend: (storeName: string) => void;
}

const StoresTable = ({ stores, onViewStore, onApprove, onSuspend }: StoresTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome da Loja</TableHead>
          <TableHead>Produtos</TableHead>
          <TableHead>Vendas Totais</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stores.map((store) => (
          <TableRow key={store.name}>
            <TableCell className="font-medium">{store.name}</TableCell>
            <TableCell>{store.productsCount}</TableCell>
            <TableCell className="font-bold">MT {store.totalSales.toFixed(2)}</TableCell>
            <TableCell>
              <Badge variant={
                store.status === 'active' ? 'default' :
                store.status === 'pending' ? 'secondary' : 'destructive'
              }>
                {store.status === 'active' ? 'Ativa' :
                 store.status === 'pending' ? 'Pendente' : 'Suspensa'}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" aria-label="Ver loja" onClick={() => onViewStore(store)}>
                  <Eye className="h-4 w-4" />
                </Button>
                {store.status === 'pending' && (
                  <Button size="sm" variant="ghost" aria-label="Aprovar loja" onClick={() => onApprove(store.name)}>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </Button>
                )}
                {store.status === 'active' && (
                  <Button size="sm" variant="ghost" aria-label="Suspender loja" onClick={() => onSuspend(store.name)}>
                    <XCircle className="h-4 w-4 text-red-600" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default StoresTable;
