import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Home, ShoppingBag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className="flex-1 flex items-center justify-center py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto p-12 text-center">
            <div className="mb-8">
              <h1 className="text-9xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">404</h1>
              <h2 className="text-3xl font-bold text-foreground mb-4">Página Não Encontrada</h2>
              <p className="text-lg text-muted-foreground">
                Ops! A página que procura não existe ou foi movida.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/')}>
                <Home className="mr-2 h-5 w-5" />
                Voltar ao Início
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/produtos')}>
                <ShoppingBag className="mr-2 h-5 w-5" />
                Ver Produtos
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">Sugestões:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button size="sm" variant="ghost" onClick={() => navigate('/produtos')}>Produtos</Button>
                <Button size="sm" variant="ghost" onClick={() => navigate('/servicos')}>Serviços</Button>
                <Button size="sm" variant="ghost" onClick={() => navigate('/sobre')}>Sobre Nós</Button>
                <Button size="sm" variant="ghost" onClick={() => navigate('/carrinho')}>Carrinho</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
