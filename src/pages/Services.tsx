import Header from "@/components/Header";
import MegaMenu from "@/components/MegaMenu";
import Footer from "@/components/Footer";
import ServicesSection from "@/components/ServicesSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Network, Smartphone, Shield, Palette, TrendingUp } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Code,
      title: "Desenvolvimento Web",
      description: "Criação de websites e aplicações web modernas e responsivas",
      features: ["Websites Corporativos", "E-commerce", "Aplicações Web", "APIs"]
    },
    {
      icon: Network,
      title: "Redes e Infraestrutura",
      description: "Implementação e manutenção de infraestrutura de rede",
      features: ["Instalação de Redes", "Configuração de Servidores", "Segurança de Rede", "Suporte Técnico"]
    },
    {
      icon: Smartphone,
      title: "Consultoria TI",
      description: "Consultoria especializada em tecnologia de informação",
      features: ["Análise de Sistemas", "Otimização de Processos", "Gestão de Projetos", "Formação"]
    },
    {
      icon: Shield,
      title: "Segurança Digital",
      description: "Proteção de dados e sistemas contra ameaças cibernéticas",
      features: ["Análise de Vulnerabilidades", "Firewalls", "Backup e Recuperação", "Monitorização 24/7"]
    },
    {
      icon: Palette,
      title: "Design Gráfico",
      description: "Criação de identidade visual e materiais de marketing",
      features: ["Logotipos", "Branding", "Marketing Digital", "Design UI/UX"]
    },
    {
      icon: TrendingUp,
      title: "Marketing Digital",
      description: "Estratégias para aumentar a presença online do seu negócio",
      features: ["SEO", "Redes Sociais", "Email Marketing", "Análise de Dados"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MegaMenu />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Serviços de TI</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Soluções completas de tecnologia para impulsionar o seu negócio
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service) => (
            <Card key={service.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-4">Solicitar Orçamento</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <ServicesSection />
      </div>
      
      <Footer />
    </div>
  );
};

export default Services;
