import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Truck, Shield, Headphones, Zap, ArrowRight, Sparkles, Star, Users, Package, Clock } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF3131] via-[#FF4444] to-[#CC0000] z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10" />
        <div className="cyber-grid opacity-20" />
        
        {/* Animated floating particles */}
        <div className="absolute inset-0 z-5 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#FF5555]/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF3131]/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 py-20 md:py-28">
        <div className="max-w-5xl mx-auto text-center">
          
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 bg-white/15 backdrop-blur-md rounded-full border border-white/30 animate-bounce-in">
            <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
            <span className="text-white text-sm font-bold uppercase tracking-wider">Ofertas Relâmpago - Até 50% OFF</span>
          </div>
          
          {/* Main Title with Neon Effect */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            <span className="block neon-text animate-pulse-scale">TECNOLOGIA</span>
            <span className="block text-yellow-300 drop-shadow-lg">DE PONTA</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up">
            Monte seu PC gamer, encontre os melhores smartphones e componentes com 
            <span className="text-yellow-300 font-semibold"> entrega rápida</span> em Moçambique
          </p>

          {/* Dual CTAs with Animated Effects */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button
              size="lg"
              onClick={() => navigate('/monte-seu-pc')}
              className="group bg-white text-[#FF3131] hover:bg-white/95 text-lg px-8 py-6 h-auto font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Zap className="w-5 h-5 mr-2 group-hover:animate-spin" style={{ animationDuration: '1s' }} />
              Monte Seu PC
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
            </Button>
            
            <Button
              size="lg"
              onClick={() => navigate('/produtos?promo=true')}
              variant="outline"
              className="bg-transparent border-3 border-white text-white hover:bg-white hover:text-[#FF3131] text-lg px-8 py-6 h-auto font-bold transition-all duration-300 hover:scale-105 btn-gradient-animated"
            >
              <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
              Ver Ofertas
            </Button>
          </div>

          {/* Stats with Animated Entrance */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-12">
            {[
              { icon: Package, value: "10K+", label: "Produtos", color: "text-yellow-300" },
              { icon: Users, value: "5K+", label: "Clientes", color: "text-green-300" },
              { icon: Star, value: "4.9★", label: "Avaliação", color: "text-yellow-300" },
              { icon: Clock, value: "24h", label: "Entrega", color: "text-blue-300" },
            ].map((stat, index) => (
              <div 
                key={stat.label} 
                className="glass p-4 md:p-6 rounded-xl backdrop-blur-md border border-white/20 hover:border-white/40 hover:scale-105 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <stat.icon className={`h-6 w-6 ${stat.color} mx-auto mb-2`} />
                <div className="text-2xl md:text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-xs md:text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Bar with Slide-in Animation */}
      <div className="relative z-20 bg-black/40 backdrop-blur-xl border-t border-white/20">
        <div className="container mx-auto px-4 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="flex items-center gap-3 text-white group cursor-pointer">
              <div className="p-2 bg-white/10 rounded-lg group-hover:bg-[#FF3131]/30 transition-colors">
                <Truck className="w-5 h-5 text-yellow-300" />
              </div>
              <div>
                <div className="font-bold text-sm">Frete Grátis</div>
                <div className="text-xs text-white/70">Acima de 5.000 MT</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-white group cursor-pointer">
              <div className="p-2 bg-white/10 rounded-lg group-hover:bg-[#FF3131]/30 transition-colors">
                <Shield className="w-5 h-5 text-green-300" />
              </div>
              <div>
                <div className="font-bold text-sm">Garantia Estendida</div>
                <div className="text-xs text-white/70">Até 3 anos</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-white group cursor-pointer">
              <div className="p-2 bg-white/10 rounded-lg group-hover:bg-[#FF3131]/30 transition-colors">
                <Headphones className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <div className="font-bold text-sm">Suporte 24/7</div>
                <div className="text-xs text-white/70">Chat ao vivo</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-white group cursor-pointer">
              <div className="p-2 bg-white/10 rounded-lg group-hover:bg-[#FF3131]/30 transition-colors">
                <Zap className="w-5 h-5 text-yellow-300" />
              </div>
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
