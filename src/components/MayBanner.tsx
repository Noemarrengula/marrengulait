import { Sparkles, Briefcase, Award, Wrench, Hammer, HardHat, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const MayBanner = () => {
  const navigate = useNavigate();
  const workerImage = "/assets/worker.jpg";

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-[#15803D] via-[#16A34A] to-[#22C55E]">
      {/* Background Pattern - Enhanced */}
      <div className="absolute inset-0 opacity-15">
        <div className="cyber-grid opacity-50" />
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      {/* Floating decorations - More dynamic */}
      <div className="absolute top-4 left-8 animate-bounce opacity-60" style={{ animationDuration: '2s' }}>
        <Briefcase className="w-8 h-8 text-yellow-300" />
      </div>
      <div className="absolute top-20 right-16 animate-bounce opacity-60" style={{ animationDuration: '2.5s', animationDelay: '0.3s' }}>
        <Award className="w-10 h-10 text-yellow-300" />
      </div>
      <div className="absolute bottom-20 left-20 animate-bounce opacity-50" style={{ animationDuration: '3s', animationDelay: '0.6s' }}>
        <HardHat className="w-8 h-8 text-white" />
      </div>
      <div className="absolute bottom-10 right-24 animate-bounce opacity-60" style={{ animationDuration: '2.8s', animationDelay: '0.9s' }}>
        <Wrench className="w-7 h-7 text-yellow-300" />
      </div>
      <div className="absolute top-1/3 left-1/4 animate-bounce opacity-40" style={{ animationDuration: '2.2s', animationDelay: '1.2s' }}>
        <TrendingUp className="w-9 h-9 text-white" />
      </div>
      <div className="absolute top-1/4 right-1/3 animate-bounce opacity-50" style={{ animationDuration: '3.2s', animationDelay: '0.4s' }}>
        <Users className="w-8 h-8 text-green-200" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-10 md:py-16">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          
          {/* Photo Section - Larger and more prominent */}
          <div className="flex-shrink-0 relative order-1 lg:order-1">
            {/* Enhanced glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 rounded-3xl blur-2xl opacity-60 animate-pulse" />
            <div className="absolute -inset-4 bg-gradient-to-r from-green-400/30 to-yellow-400/30 rounded-3xl blur-xl" />
            
            {/* Photo Avatar - Larger size */}
            <div className="relative w-56 h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-3xl overflow-hidden border-6 border-white/30 shadow-2xl transform hover:scale-105 transition-transform duration-500">
              {/* Fallback icon - behind image */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center z-0">
                <HardHat className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 text-white" />
              </div>
              <img 
                src={workerImage} 
                alt="Trabalhador Moçambicano celebrando"
                className="w-full h-full object-cover relative z-10"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/40 to-transparent" />
            </div>
            
            {/* Floating badge on photo */}
            <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-green-900 px-4 py-2 rounded-full font-bold shadow-lg animate-bounce">
              <span className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                #1 em TI
              </span>
            </div>
          </div>

          {/* Right Content - More prominent */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-2">
            {/* Enhanced badges */}
            <div className="flex items-center justify-center lg:justify-start gap-3 flex-wrap mb-6">
              <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full text-white text-sm font-semibold border border-white/30">
                💼 Mês do Trabalhador
              </span>
              <span className="inline-flex items-center gap-2 bg-yellow-400 backdrop-blur-sm px-5 py-2 rounded-full text-green-900 text-sm font-bold border border-yellow-300 shadow-lg">
                ⭐ Ofertas até 50%
              </span>
            </div>

            {/* Main headline - Larger and bolder */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 leading-tight drop-shadow-lg">
              Maio dos Trabalhadores!
            </h2>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-yellow-300 mb-6 drop-shadow-md">
              Celebramos o Trabalho! 🚀
            </h3>
            
            {/* Enhanced description */}
            <p className="text-white/95 text-lg md:text-xl max-w-2xl mb-8 leading-relaxed">
              As melhores <span className="font-bold text-yellow-300 text-2xl">ofertas de Maio</span> para ti! 
              <br className="hidden md:block" />
              Descontos especiais em celebração ao Dia Internacional do Trabalhador.
            </p>

            {/* CTA Button - More prominent */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                onClick={() => navigate('/produtos?promo=true')}
                className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 text-green-900 hover:from-yellow-300 hover:to-yellow-200 font-bold px-10 py-5 text-xl rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 group"
              >
                <Award className="w-6 h-6 mr-3 group-hover:animate-spin" />
                Ver Ofertas de Maio
                <Sparkles className="w-5 h-5 ml-3 opacity-80" />
              </Button>
              
              <Button
                onClick={() => navigate('/servicos-ti')}
                variant="outline"
                className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-8 py-5 text-lg rounded-2xl font-semibold"
              >
                <Briefcase className="w-5 h-5 mr-2" />
                Ver Serviços
              </Button>
            </div>
          </div>

          {/* Right side - Date cards */}
          <div className="flex lg:flex-col items-center gap-4 order-3 lg:order-3">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-5 text-center transform hover:rotate-2 hover:scale-105 transition-all duration-300 shadow-xl">
              <div className="text-5xl mb-2">💼</div>
              <div className="text-white font-bold text-2xl">1 Maio</div>
              <div className="text-yellow-300 text-sm font-medium">Dia Int. do Trabalhador</div>
            </div>

            <div className="bg-yellow-400/90 backdrop-blur-md rounded-2xl p-5 text-center transform -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 shadow-xl">
              <div className="text-5xl mb-2">🎁</div>
              <div className="text-green-900 font-bold text-2xl">Maio</div>
              <div className="text-green-700 text-sm font-medium">Ofertas Exclusivas</div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-center">
              <div className="flex items-center gap-2 text-white font-semibold">
                <TrendingUp className="w-5 h-5 text-green-300" />
                +200 Produtos
              </div>
              <div className="text-green-200 text-xs">Com desconto</div>
            </div>
          </div>
        </div>

        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10 md:h-12">
            <path
              d="M0 50V25C120 50 360 0 720 25C1080 50 1320 0 1440 25V50H0Z"
              fill="white"
              fillOpacity="0.2"
            />
          </svg>
        </div>

        {/* Enhanced sparkle effects */}
        <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-yellow-300 rounded-full animate-ping opacity-80" />
        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-white rounded-full animate-ping opacity-60" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-green-200 rounded-full animate-ping opacity-70" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping opacity-50" style={{ animationDelay: '1.5s' }} />
      </div>
    </div>
  );
};

export default MayBanner;