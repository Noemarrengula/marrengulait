import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-[500px] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="Tecnologia Avançada"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      </div>
      
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl">
          <span className="inline-block px-4 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm font-medium mb-4">
            🔥 Novidade
          </span>
          <h2 className="text-5xl font-bold mb-4 text-foreground">
            A Tecnologia que o seu Negócio Precisa
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Hardware de ponta, soluções completas de TI e marketplace com as melhores lojas de tecnologia.
          </p>
          <div className="flex gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Explorar Produtos
            </Button>
            <Button size="lg" variant="outline">
              Serviços de TI
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        size="icon"
        variant="ghost"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/50 hover:bg-background/80"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/50 hover:bg-background/80"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <div className="w-2 h-2 rounded-full bg-muted" />
        <div className="w-2 h-2 rounded-full bg-muted" />
      </div>
    </section>
  );
};

export default HeroSection;
