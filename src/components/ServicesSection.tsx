import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Network, Wrench, Palette, TrendingUp, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import servicesImage from "@/assets/services-it.jpg";

const ServicesSection = () => {
  const navigate = useNavigate();
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal();
  const { ref: imageRef, isVisible: imageVisible } = useScrollReveal();
  
  const services = [
    {
      icon: Code,
      title: "Desenvolvimento Web",
      description: "Sites, e-commerce e aplicações web personalizadas"
    },
    {
      icon: Network,
      title: "Redes & Infraestrutura",
      description: "Instalação e manutenção de redes empresariais"
    },
    {
      icon: Wrench,
      title: "Suporte Técnico",
      description: "Manutenção e reparação de equipamentos"
    },
    {
      icon: Palette,
      title: "Design Gráfico",
      description: "Identidade visual e material publicitário"
    },
    {
      icon: TrendingUp,
      title: "Marketing Digital",
      description: "Estratégias para crescimento online"
    },
    {
      icon: Shield,
      title: "Consultoria TI",
      description: "Soluções estratégicas para o seu negócio"
    }
  ];

  return (
    <section className="py-16 bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,hsl(var(--primary)/0.1),transparent_50%)]" />
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
          <div ref={titleRef} className={`scroll-reveal-left ${titleVisible ? 'is-visible' : ''}`}>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/30 rounded-full text-sm font-medium mb-4 shadow-lg shadow-primary/10">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Serviços Profissionais
            </span>
            <h2 className="text-4xl font-bold text-foreground mb-4 leading-tight">
              Soluções Completas de TI para o Seu <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Negócio</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Além de vender produtos, oferecemos serviços especializados para impulsionar 
              a transformação digital da sua empresa.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all" onClick={() => navigate('/servicos')}>
              Ver Todos os Serviços
            </Button>
          </div>

          <div ref={imageRef} className={`relative scroll-reveal-right ${imageVisible ? 'is-visible' : ''}`}>
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <img
              src={servicesImage}
              alt="Serviços de TI"
              className="relative rounded-lg shadow-2xl hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent rounded-lg" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card
              key={service.title}
              onClick={() => navigate('/servicos')}
              className="p-6 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 group cursor-pointer hover:-translate-y-2 bg-card/50 backdrop-blur-sm animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <service.icon className="h-7 w-7 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
