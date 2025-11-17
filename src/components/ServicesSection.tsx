import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Network, Wrench, Palette, TrendingUp, Shield } from "lucide-react";
import servicesImage from "@/assets/services-it.jpg";

const ServicesSection = () => {
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
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
          <div>
            <span className="inline-block px-4 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm font-medium mb-4">
              Serviços Profissionais
            </span>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Soluções Completas de TI para o Seu Negócio
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Além de vender produtos, oferecemos serviços especializados para impulsionar 
              a transformação digital da sua empresa.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Ver Todos os Serviços
            </Button>
          </div>

          <div className="relative">
            <img
              src={servicesImage}
              alt="Serviços de TI"
              className="rounded-lg shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent rounded-lg" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card
              key={service.title}
              className="p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <service.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground">
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
