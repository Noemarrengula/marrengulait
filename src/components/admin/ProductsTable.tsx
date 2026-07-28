import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Eye } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  brand: string;
  stock: number;
  store_name: string;
  featured: boolean;
  image_url?: string;
}

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductsTable = ({ products, onEdit, onDelete }: ProductsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Imagem</TableHead>
          <TableHead>Produto</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Marca</TableHead>
          <TableHead>Preço</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Loja</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <img 
                src={product.image_url || '/placeholder.png'} 
                alt={product.title}
                className="w-12 h-12 object-cover rounded"
                onError={(e) => { e.currentTarget.src = '/placeholder.png'; }}
              />
            </TableCell>
            <TableCell className="font-medium max-w-xs truncate">
              {product.title}
            </TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>{product.brand}</TableCell>
            <TableCell className="font-bold">MT {product.price.toFixed(2)}</TableCell>
            <TableCell>
              <Badge variant={product.stock > 10 ? 'default' : product.stock > 0 ? 'secondary' : 'destructive'}>
                {product.stock}
              </Badge>
            </TableCell>
            <TableCell className="text-sm">{product.store_name}</TableCell>
            <TableCell>
              {product.featured && <Badge>Destaque</Badge>}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" aria-label="Editar produto" onClick={() => onEdit(product)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" aria-label="Eliminar produto" onClick={() => onDelete(product.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductsTable;
