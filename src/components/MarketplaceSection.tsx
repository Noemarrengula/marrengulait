import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MarketplaceSection = () => {
  const navigate = useNavigate();
  
  const stores = [
    {
      name: "TechStore MZ",
      logo: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200",
      rating: 4.8,
      products: 234,
      followers: "12.5k"
    },
    {
      name: "Hardware Pro",
      logo: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200",
      rating: 4.9,
      products: 189,
      followers: "8.3k"
    },
    {
      name: "Gaming Gear",
      logo: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200",
      rating: 4.7,
      products: 156,
      followers: "15.2k"
    },
    {
      name: "Apple Store MZ",
      logo: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200",
      rating: 5.0,
      products: 67,
      followers: "25.8k"
    }
  ];

  return (
    <section className="py-16 bg-secondary/30 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.05),transparent_70%)]" />
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12 animate-slide-up">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 text-primary border border-primary/30 rounded-full text-sm font-medium mb-4 shadow-lg shadow-primary/10">
            <Store className="w-4 h-4 animate-pulse" />
            Marketplace
          </span>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Lojas em <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Destaque</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Compre das melhores lojas especializadas em tecnologia. 
            Cada loja oferece produtos únicos e atendimento especializado.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stores.map((store, index) => (
            <Card
              key={store.name}
              onClick={() => navigate('/produtos')}
              className="overflow-hidden hover:border-primary/50 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 group cursor-pointer hover:-translate-y-2 bg-card/80 backdrop-blur-sm animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-32 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/10 group-hover:to-primary/20 transition-colors" />
                <div className="absolute top-2 right-2 w-16 h-16 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                  <div className="w-20 h-20 rounded-full border-4 border-card overflow-hidden bg-background shadow-lg group-hover:scale-110 group-hover:border-primary/50 transition-all duration-300">
                    <img
                      src={store.logo}
                      alt={store.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-12 pb-6 px-6 text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {store.name}
                </h3>
                
                <div className="flex items-center justify-center gap-1 mb-3">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-medium text-foreground">{store.rating}</span>
                  <span className="text-sm text-muted-foreground">({store.followers})</span>
                </div>

                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Store className="h-4 w-4" />
                    <span>{store.products} produtos</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full group-hover:bg-primary/10 group-hover:border-primary/50 transition-all" onClick={(e) => { e.stopPropagation(); navigate('/produtos'); }}>
                  Visitar Loja
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <Button size="lg" variant="outline" className="hover:bg-primary/10 hover:border-primary hover:scale-105 transition-all shadow-lg" onClick={() => navigate('/produtos')}>
            Ver Todas as Lojas do Marketplace
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MarketplaceSection;
