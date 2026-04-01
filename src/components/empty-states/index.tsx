import { Link } from "react-router-dom";
import { ShoppingBag, Heart, Package, Search, Bell, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export function EmptyCart() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="max-w-md w-full mx-4">
        <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FF3131]/10 to-[#FF5555]/10 flex items-center justify-center mb-6">
            <ShoppingBag className="h-12 w-12 text-[#FF3131]" />
          </div>
          
          <h2 className="text-2xl font-bold mb-3">Carrinho vazio</h2>
          
          <p className="text-muted-foreground mb-8 max-w-sm">
            Adicione produtos ao seu carrinho para começar suas compras. Temos os melhores preços em tecnologia!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button 
              onClick={() => navigate('/produtos')}
              className="flex-1 bg-gradient-to-r from-[#FF3131] to-[#FF5555] hover:from-[#FF2222] hover:to-[#FF4444]"
            >
              Explorar Produtos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex-1"
            >
              Voltar ao Início
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function EmptyFavorites() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="max-w-md w-full mx-4">
        <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FF3131]/10 to-[#FF5555]/10 flex items-center justify-center mb-6">
            <Heart className="h-12 w-12 text-[#FF3131]" />
          </div>
          
          <h2 className="text-2xl font-bold mb-3">Nenhum favorito ainda</h2>
          
          <p className="text-muted-foreground mb-8 max-w-sm">
            Guarde seus produtos favoritos para encontrá-los facilmente depois. Toque no coração para adicionar!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button 
              onClick={() => navigate('/produtos')}
              className="flex-1 bg-gradient-to-r from-[#FF3131] to-[#FF5555] hover:from-[#FF2222] hover:to-[#FF4444]"
            >
              Descobrir Produtos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex-1"
            >
              Voltar ao Início
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function EmptyOrders() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="max-w-md w-full mx-4">
        <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FF3131]/10 to-[#FF5555]/10 flex items-center justify-center mb-6">
            <Package className="h-12 w-12 text-[#FF3131]" />
          </div>
          
          <h2 className="text-2xl font-bold mb-3">Nenhum pedido ainda</h2>
          
          <p className="text-muted-foreground mb-8 max-w-sm">
            Quando fizer sua primeira compra, poderá acompanhar aqui o estado do seu pedido.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button 
              onClick={() => navigate('/produtos')}
              className="flex-1 bg-gradient-to-r from-[#FF3131] to-[#FF5555] hover:from-[#FF2222] hover:to-[#FF4444]"
            >
              Fazer Primeira Compra
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex-1"
            >
              Voltar ao Início
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function EmptySearch({ query }: { query?: string }) {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="max-w-md w-full mx-4">
        <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FF3131]/10 to-[#FF5555]/10 flex items-center justify-center mb-6">
            <Search className="h-12 w-12 text-[#FF3131]" />
          </div>
          
          <h2 className="text-2xl font-bold mb-3">
            {query ? `Sem resultados para "${query}"` : 'Nenhum resultado encontrado'}
          </h2>
          
          <p className="text-muted-foreground mb-8 max-w-sm">
            {query 
              ? `Não encontramos produtos correspondentes à sua pesquisa. Tente outros termos ou explore nossas categorias.`
              : 'Tente ajustar seus filtros ou explorar nossas categorias.'
            }
          </p>
          
          <div className="flex flex-col gap-3 w-full">
            <Button 
              onClick={() => navigate('/produtos')}
              className="w-full bg-gradient-to-r from-[#FF3131] to-[#FF5555] hover:from-[#FF2222] hover:to-[#FF4444]"
            >
              Ver Todos os Produtos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="w-full"
            >
              Voltar ao Início
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function EmptyNotifications() {
  return (
    <Card className="max-w-md w-full mx-4">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FF3131]/10 to-[#FF5555]/10 flex items-center justify-center mb-6">
          <Bell className="h-12 w-12 text-[#FF3131]" />
        </div>
        
        <h2 className="text-2xl font-bold mb-3">Sem notificações</h2>
        
        <p className="text-muted-foreground mb-6 max-w-sm">
          Você receberá notificações sobre seus pedidos, promoções e muito mais.
        </p>
      </CardContent>
    </Card>
  );
}
