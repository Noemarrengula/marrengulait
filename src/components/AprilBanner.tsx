import { Sparkles, Heart, Gift, Star, Flower2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import womanImage from "@/assets/mm-600x600.jpg";

const AprilBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-[#FF3131] via-[#FF4444] to-[#CC0000]">
      {/* Background Pattern - Matching HeroSection */}
      <div className="absolute inset-0 opacity-10">
        <div className="cyber-grid opacity-30" />
      </div>
      {/* Floating particles matching HeroSection */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#FF5555]/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF3131]/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Floating decorations */}
      <div className="absolute top-4 left-8 animate-bounce opacity-40" style={{ animationDuration: '3s' }}>
        <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
      </div>
      <div className="absolute top-12 right-12 animate-bounce opacity-40" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>
        <Heart className="w-8 h-8 text-yellow-300 fill-pink-200" />
      </div>
      <div className="absolute bottom-16 left-16 animate-bounce opacity-30" style={{ animationDuration: '4s', animationDelay: '1s' }}>
        <Gift className="w-6 h-6 text-white" />
      </div>
      <div className="absolute bottom-8 right-24 animate-bounce opacity-40" style={{ animationDuration: '3.5s', animationDelay: '0.3s' }}>
        <Sparkles className="w-5 h-5 text-yellow-300" />
      </div>
      <div className="absolute top-1/3 left-1/6 animate-bounce opacity-30" style={{ animationDuration: '2.8s', animationDelay: '0.7s' }}>
        <Flower2 className="w-7 h-7 text-pink-200" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
          
          {/* Avatar Section */}
          <div className="flex-shrink-0 relative order-1 lg:order-1">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-pink-300 to-yellow-300 rounded-full blur-xl opacity-50 animate-pulse" />
            
            {/* Avatar */}
            <div className="relative w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden border-4 border-white/40 shadow-2xl">
              <img 
                src={womanImage} 
                alt="Mulher Moçambicana celebrando"
                className="w-full h-full object-cover"
              />
              {/* Overlay gradient for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#FF3131]/30 to-transparent" />
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-2">
            {/* Top badges */}
            <div className="flex items-center justify-center lg:justify-start gap-3 flex-wrap mb-4">
              <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-white text-sm font-medium">
                🎀 Dia da Mulher Moçambicana
              </span>
              <span className="inline-flex items-center gap-1.5 bg-yellow-400/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[#FF3131] text-sm font-bold">
                🥚 Páscoa - 5 Abril
              </span>
            </div>

            {/* Main headline */}
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-2 leading-tight">
              Abril é Nosso!
            </h2>
            <h3 className="text-xl md:text-3xl font-bold text-yellow-300 mb-4">
              Celebramos Connosco! ✨
            </h3>
            
            {/* Description */}
            <p className="text-white/95 text-base md:text-lg max-w-xl mb-6">
              As melhores <span className="font-bold text-yellow-300">ofertas de Abril</span> para ti! 
              Descontos especiais em homenagem às mulheres de Moçambique e em celebração da Páscoa.
            </p>

            {/* CTA Button */}
            <Button
              onClick={() => navigate('/produtos?promo=true')}
              className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-[#FF3131] hover:from-yellow-300 hover:to-yellow-200 font-bold px-8 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
            >
              <Gift className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              Ver Ofertas de Abril
              <Sparkles className="w-4 h-4 ml-2 opacity-70" />
            </Button>
          </div>

          {/* Left - Date cards */}
          <div className="flex lg:flex-col items-center lg:items-center gap-4 order-3 lg:order-3">
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 text-center transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="text-4xl mb-1">🌸</div>
              <div className="text-white font-bold text-xl">7 Abril</div>
              <div className="text-pink-200 text-xs">Mulher Moçambicana</div>
            </div>

            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 text-center transform -rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="text-4xl mb-1">🥚</div>
              <div className="text-white font-bold text-xl">5 Abril</div>
              <div className="text-pink-200 text-xs">Páscoa</div>
            </div>
          </div>
        </div>

        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-8 md:h-10">
            <path
              d="M0 40V20C120 40 360 0 720 20C1080 40 1320 0 1440 20V40H0Z"
              fill="white"
              fillOpacity="0.15"
            />
          </svg>
        </div>

        {/* Sparkle effects */}
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-60" />
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-white rounded-full animate-ping opacity-40" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-pink-200 rounded-full animate-ping opacity-50" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
};

export default AprilBanner;
