import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-[600px] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="Tecnologia Avançada"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.15),transparent_50%)]" />
      </div>
      
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl animate-fade-in">
          <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/30 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm">
            🔥 Novidade
          </span>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground leading-tight">
            A Tecnologia que o seu <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Negócio Precisa</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Hardware de ponta, soluções completas de TI e marketplace com as melhores lojas de tecnologia.
          </p>
          <div className="flex gap-4">
            <Button size="lg" className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30">
              Explorar Produtos
            </Button>
            <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/10 hover:border-primary">
              Serviços de TI
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        size="icon"
        variant="ghost"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/50 hover:bg-background/80 backdrop-blur-sm border border-border/50"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/50 hover:bg-background/80 backdrop-blur-sm border border-border/50"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
        <div className="w-8 h-1 rounded-full bg-primary shadow-lg shadow-primary/50" />
        <div className="w-8 h-1 rounded-full bg-muted/50" />
        <div className="w-8 h-1 rounded-full bg-muted/50" />
      </div>
    </section>
  );
};

export default HeroSection;
