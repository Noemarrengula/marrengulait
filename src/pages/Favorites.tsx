import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EmptyState from '@/components/EmptyState';

const Favorites = () => {
  const navigate = useNavigate();
  // TODO: Integrar com backend quando estiver pronto
  const favorites = [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Meus Favoritos</h1>
        
        {favorites.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Nenhum favorito ainda"
            description="Adicione produtos aos favoritos para vê-los aqui e acessá-los rapidamente"
            actionLabel="Explorar Produtos"
            onAction={() => navigate('/produtos')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* TODO: Mapear produtos favoritos */}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Favorites;
