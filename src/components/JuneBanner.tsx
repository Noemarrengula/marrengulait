import { Sparkles, Gift, Star, Smile, Candy, PartyPopper, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAdminSettings } from "@/hooks/useAdminSettings";

const JuneBanner = () => {
  const navigate = useNavigate();
  const { settings } = useAdminSettings();

  if (!settings.showJuneBanner) return null;

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-[#FF6B35] via-[#FF8C42] to-[#FFD166]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="cyber-grid opacity-50" />
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#FFE76D]/25 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#FF3131]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/3 left-1/2 w-64 h-64 bg-[#06D6A0]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      {/* Floating decorations */}
      <div className="absolute top-4 left-8 animate-bounce opacity-70" style={{ animationDuration: '2s' }}>
        <PartyPopper className="w-8 h-8 text-[#EF476F]" />
      </div>
      <div className="absolute top-20 right-20 animate-bounce opacity-60" style={{ animationDuration: '2.5s', animationDelay: '0.3s' }}>
        <Star className="w-10 h-10 text-[#FFD166] fill-[#FFD166]" />
      </div>
      <div className="absolute bottom-16 left-20 animate-bounce opacity-50" style={{ animationDuration: '3s', animationDelay: '0.6s' }}>
        <Candy className="w-8 h-8 text-[#EF476F]" />
      </div>
      <div className="absolute bottom-8 right-24 animate-bounce opacity-60" style={{ animationDuration: '2.8s', animationDelay: '0.9s' }}>
        <Gift className="w-7 h-7 text-[#06D6A0]" />
      </div>
      <div className="absolute top-1/3 left-1/4 animate-bounce opacity-40" style={{ animationDuration: '2.2s', animationDelay: '1.2s' }}>
        <Smile className="w-9 h-9 text-[#FFD166]" />
      </div>
      <div className="absolute top-1/4 right-1/3 animate-bounce opacity-50" style={{ animationDuration: '3.2s', animationDelay: '0.4s' }}>
        <Sparkles className="w-8 h-8 text-[#EF476F]" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-10 md:py-16">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          
          {/* Photo Section */}
          <div className="flex-shrink-0 relative order-1 lg:order-1">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#EF476F] via-[#FFD166] to-[#06D6A0] rounded-3xl blur-2xl opacity-50 animate-pulse" />
            <div className="absolute -inset-4 bg-gradient-to-r from-[#FF6B35]/30 to-[#FFD166]/30 rounded-3xl blur-xl" />
            
            {/* Photo Avatar */}
            <div className="relative w-56 h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-3xl overflow-hidden border-6 border-white/30 shadow-2xl transform hover:scale-105 transition-transform duration-500">
              {/* Fallback icon */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#EF476F] to-[#FFD166] flex items-center justify-center z-0">
                <Gift className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 text-white/90" />
              </div>
              <img 
                src="/assets/june-kids.jpg" 
                alt="Crianças Moçambicanas celebrando"
                className="w-full h-full object-cover relative z-10"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#FF6B35]/40 to-transparent" />
            </div>
            
            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-[#EF476F] to-[#FFD166] text-white px-4 py-2 rounded-full font-bold shadow-lg animate-bounce">
              <span className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-white" />
                #JunhoCriança
              </span>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-2">
            {/* Badges */}
            <div className="flex items-center justify-center lg:justify-start gap-3 flex-wrap mb-6">
              <span className="inline-flex items-center gap-2 bg-white/25 backdrop-blur-sm px-5 py-2 rounded-full text-white text-sm font-semibold border border-white/30">
                🎈 Mês das Crianças
              </span>
              <span className="inline-flex items-center gap-2 bg-[#EF476F]/80 backdrop-blur-sm px-5 py-2 rounded-full text-white text-sm font-bold border border-[#EF476F]/50 shadow-lg">
                🎁 Ofertas até 40%
              </span>
            </div>

            {/* Main headline */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 leading-tight drop-shadow-lg">
              Junho Criança!
            </h2>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white/90 mb-6 drop-shadow-md">
              Celebrar a Infância! 🎉
            </h3>
            
            {/* Description */}
            <p className="text-white/95 text-lg md:text-xl max-w-2xl mb-8 leading-relaxed">
              As melhores <span className="font-bold text-white text-2xl">ofertas de Junho</span> para os mais pequenos! 
              <br className="hidden md:block" />
              Descontos especiais em celebração ao Dia Internacional da Criança.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                onClick={() => navigate('/produtos?promo=true')}
                className="bg-white text-[#EF476F] hover:bg-white/95 font-bold px-10 py-5 text-xl rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 group"
              >
                <Gift className="w-6 h-6 mr-3 group-hover:animate-spin" />
                Ver Ofertas de Junho
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                onClick={() => navigate('/produtos?category=Infantil')}
                variant="outline"
                className="border-2 border-white/40 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-8 py-5 text-lg rounded-2xl font-semibold"
              >
                <Smile className="w-5 h-5 mr-2" />
                Ver Produtos Infantis
              </Button>
            </div>
          </div>

          {/* Right side - Date cards */}
          <div className="flex lg:flex-col items-center gap-4 order-3 lg:order-3">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-5 text-center transform hover:rotate-2 hover:scale-105 transition-all duration-300 shadow-xl border border-white/20">
              <div className="text-5xl mb-2">🎈</div>
              <div className="text-white font-bold text-2xl">1 Junho</div>
              <div className="text-white/80 text-sm font-medium">Dia Int. da Criança</div>
            </div>

            <div className="bg-gradient-to-br from-[#EF476F] to-[#FFD166] backdrop-blur-md rounded-2xl p-5 text-center transform -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 shadow-xl">
              <div className="text-5xl mb-2">🎁</div>
              <div className="text-white font-bold text-2xl">Junho</div>
              <div className="text-white/85 text-sm font-medium">Ofertas Especiais</div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Sparkles className="w-5 h-5 text-white/80" />
                +150 Produtos
              </div>
              <div className="text-white/70 text-xs">Em promoção</div>
            </div>
          </div>
        </div>

        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10 md:h-12">
            <path
              d="M0 50V25C120 50 360 0 720 25C1080 50 1320 0 1440 25V50H0Z"
              fill="white"
              fillOpacity="0.15"
            />
          </svg>
        </div>

        {/* Sparkle effects */}
        <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-[#FFD166] rounded-full animate-ping opacity-80" />
        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-white rounded-full animate-ping opacity-60" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-[#06D6A0]/70 rounded-full animate-ping opacity-70" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-2.5 h-2.5 bg-[#EF476F] rounded-full animate-ping opacity-50" style={{ animationDelay: '1.5s' }} />
      </div>
    </div>
  );
};

export default JuneBanner;
