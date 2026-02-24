import { useState } from "react";
import Header from "@/components/Header";
import MegaMenu from "@/components/MegaMenu";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Code, Network, Smartphone, Shield, Palette, TrendingUp, CheckCircle2, ArrowRight, Wifi, Printer, FileText, Server } from "lucide-react";
import { toast } from "sonner";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Services = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    serviceType: "",
    budget: "",
    message: ""
  });
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal();
  const { ref: benefitsRef, isVisible: benefitsVisible } = useScrollReveal();

  const handleQuoteRequest = (serviceName: string) => {
    setSelectedService(serviceName);
  };

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.serviceType) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    toast.success('Orçamento solicitado com sucesso! Entraremos em contacto em breve.');
    setSelectedService(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      serviceType: "",
      budget: "",
      message: ""
    });
  };

  const benefits = [
    { icon: CheckCircle2, text: "Equipa especializada e certificada" },
    { icon: CheckCircle2, text: "Suporte técnico 24/7" },
    { icon: CheckCircle2, text: "Orçamentos personalizados" },
    { icon: CheckCircle2, text: "Garantia de qualidade" },
  ];

  const services = [
    {
      icon: Code,
      title: "Desenvolvimento Web",
      description: "Criação de websites e aplicações web modernas e responsivas",
      features: ["Websites Corporativos", "E-commerce", "Aplicações Web", "APIs"]
    },
    {
      icon: Network,
      title: "Redes de Computadores",
      description: "Instalação, configuração e manutenção de redes empresariais",
      features: ["Cabeamento Estruturado", "Roteadores e Switches", "Wi-Fi Empresarial", "VPN e Segurança"]
    },
    {
      icon: Server,
      title: "Servidores e Infraestrutura",
      description: "Implementação e gestão de servidores e data centers",
      features: ["Servidores Windows/Linux", "Virtualização", "Cloud Computing", "Backup e Disaster Recovery"]
    },
    {
      icon: Wifi,
      title: "Dispositivos de Rede",
      description: "Fornecimento e configuração de equipamentos de rede",
      features: ["Switches Gerenciáveis", "Access Points", "Firewalls", "Balanceadores de Carga"]
    },
    {
      icon: Shield,
      title: "Segurança Digital",
      description: "Proteção de dados e sistemas contra ameaças cibernéticas",
      features: ["Análise de Vulnerabilidades", "Firewalls", "Antivírus Corporativo", "Monitorização 24/7"]
    },
    {
      icon: Smartphone,
      title: "Consultoria TI",
      description: "Consultoria especializada em tecnologia de informação",
      features: ["Análise de Sistemas", "Otimização de Processos", "Gestão de Projetos", "Formação"]
    },
    {
      icon: Printer,
      title: "Material de Escritório",
      description: "Fornecimento de equipamentos e materiais para escritório",
      features: ["Impressoras e Scanners", "Consumíveis", "Mobiliário TI", "Acessórios"]
    },
    {
      icon: FileText,
      title: "Gestão Documental",
      description: "Soluções para digitalização e gestão de documentos",
      features: ["Digitalização", "Arquivo Digital", "Workflow", "Assinatura Digital"]
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
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 py-16 relative">
          <div ref={heroRef} className={`max-w-3xl mx-auto text-center scroll-reveal ${heroVisible ? 'is-visible' : ''}`}>
            <span className="inline-block px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm font-medium mb-6">
              💼 Serviços Profissionais
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Serviços de <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">TI Completos</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Soluções completas de tecnologia para impulsionar o seu negócio
            </p>
            <Button size="lg" className="bg-gradient-to-r from-primary to-primary-glow hover:scale-105 transition-all shadow-lg">
              Solicitar Consulta Gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-secondary/30 border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div ref={benefitsRef} className={`grid grid-cols-2 md:grid-cols-4 gap-4 scroll-reveal ${benefitsVisible ? 'is-visible' : ''}`}>
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <benefit.icon className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-foreground">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card 
              key={service.title} 
              className="hover:shadow-xl hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 group animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <service.icon className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-primary-glow hover:scale-105 transition-all shadow-lg" 
                      onClick={() => handleQuoteRequest(service.title)}
                      size="lg"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Solicitar Orçamento Profissional
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">Solicitar Orçamento - {service.title}</DialogTitle>
                      <DialogDescription>
                        Preencha o formulário detalhado e nossa equipe entrará em contacto em até 24 horas.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitQuote} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome Completo *</Label>
                          <Input 
                            id="name"
                            placeholder="João Silva" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input 
                            id="email"
                            type="email" 
                            placeholder="joao@empresa.com" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required 
                          />
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefone *</Label>
                          <Input 
                            id="phone"
                            type="tel" 
                            placeholder="+258 84 123 4567" 
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Empresa</Label>
                          <Input 
                            id="company"
                            placeholder="Nome da empresa" 
                            value={formData.company}
                            onChange={(e) => setFormData({...formData, company: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="serviceType">Tipo de Serviço *</Label>
                        <Select 
                          value={formData.serviceType} 
                          onValueChange={(value) => setFormData({...formData, serviceType: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de serviço" />
                          </SelectTrigger>
                          <SelectContent>
                            {services.map((s) => (
                              <SelectItem key={s.title} value={s.title}>{s.title}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="budget">Orçamento Estimado</Label>
                        <Select 
                          value={formData.budget} 
                          onValueChange={(value) => setFormData({...formData, budget: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a faixa de orçamento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5000-10000">5.000 - 10.000 MT</SelectItem>
                            <SelectItem value="10000-25000">10.000 - 25.000 MT</SelectItem>
                            <SelectItem value="25000-50000">25.000 - 50.000 MT</SelectItem>
                            <SelectItem value="50000-100000">50.000 - 100.000 MT</SelectItem>
                            <SelectItem value="100000+">Acima de 100.000 MT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Descrição do Projeto *</Label>
                        <Textarea 
                          id="message"
                          placeholder="Descreva detalhadamente as suas necessidades, objetivos e prazos..." 
                          rows={5} 
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          required 
                        />
                      </div>

                      <div className="bg-secondary/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          ✓ Resposta em até 24 horas<br/>
                          ✓ Orçamento sem compromisso<br/>
                          ✓ Consultoria gratuita incluída
                        </p>
                      </div>

                      <Button type="submit" className="w-full" size="lg">
                        Enviar Solicitação de Orçamento
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Services;
