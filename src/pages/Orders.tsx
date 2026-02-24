import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Orders = () => {
  // TODO: Integrar com backend quando estiver pronto
  const orders = [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Meus Pedidos</h1>
        
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Nenhum pedido ainda</h2>
            <p className="text-muted-foreground mb-6">
              Faça seu primeiro pedido e acompanhe aqui
            </p>
            <Link to="/produtos">
              <Button>Explorar Produtos</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* TODO: Mapear pedidos */}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Orders;
