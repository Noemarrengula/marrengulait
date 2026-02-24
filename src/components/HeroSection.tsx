import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Truck, Shield, Headphones, Zap, ArrowRight } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-accent/80 to-primary/90 z-10" />
        <div className="cyber-grid opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <span className="text-white text-sm font-semibold">🔥 Ofertas Relâmpago - Até 50% OFF</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Tecnologia de Ponta
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Preços Imbatíveis
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
            Monte seu PC gamer, encontre os melhores smartphones e componentes com entrega rápida em Moçambique
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              onClick={() => navigate('/monte-seu-pc')}
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 h-auto font-bold group"
            >
              <Zap className="w-5 h-5 mr-2" />
              Monte Seu PC
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button
              size="lg"
              onClick={() => navigate('/produtos?promo=true')}
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-6 h-auto font-bold"
            >
              Ver Ofertas Relâmpago
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { value: "10K+", label: "Produtos" },
              { value: "5K+", label: "Clientes" },
              { value: "4.9★", label: "Avaliação" },
              { value: "24h", label: "Entrega" }
            ].map((stat) => (
              <div key={stat.label} className="glass p-4 rounded-lg">
                <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Bar */}
      <div className="relative z-20 bg-black/30 backdrop-blur-md border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 text-white">
              <Truck className="w-5 h-5 text-yellow-300" />
              <div>
                <div className="font-bold text-sm">Frete Grátis</div>
                <div className="text-xs text-white/70">Acima de 5.000 MT</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-white">
              <Shield className="w-5 h-5 text-yellow-300" />
              <div>
                <div className="font-bold text-sm">Garantia Estendida</div>
                <div className="text-xs text-white/70">Até 3 anos</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-white">
              <Headphones className="w-5 h-5 text-yellow-300" />
              <div>
                <div className="font-bold text-sm">Suporte 24/7</div>
                <div className="text-xs text-white/70">Chat ao vivo</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-white">
              <Zap className="w-5 h-5 text-yellow-300" />
              <div>
                <div className="font-bold text-sm">Cashback</div>
                <div className="text-xs text-white/70">Até 5% de volta</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
