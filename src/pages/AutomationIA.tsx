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
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight, Bot, Workflow, Sparkles, Zap, Shield, Clock, MessageSquare, Settings, Database, Layers, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const AutomationIA = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    serviceType: "",
    message: "",
  });
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal();
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollReveal();

  const services = [
    {
      icon: Bot,
      title: "Chatbots Inteligentes",
      description: "Crie chatbots personalizados para WhatsApp, website e redes sociais.",
      features: ["Atendimento 24/7", "Respostas automáticas", "Integração com CRM", "Análise de conversas"],
      price: "A partir de 15.000 MT",
      popular: true,
    },
    {
      icon: Workflow,
      title: "Automação N8N",
      description: "Automatize processos repetitivos e economize tempo.",
      features: ["Workflows visuais", "Integração com 400+ apps", "Automação de emails", "Relatórios automáticos"],
      price: "A partir de 25.000 MT",
      popular: false,
    },
    {
      icon: Sparkles,
      title: "Integração IA",
      description: "Integre inteligência artificial no seu negócio.",
      features: ["ChatGPT API", "Análise de dados", "Geração de conteúdo", "Previsões inteligente"],
      price: "A partir de 35.000 MT",
      popular: false,
    },
    {
      icon: MessageSquare,
      title: "WhatsApp Business API",
      description: "Solução completa para vendas e atendimento via WhatsApp.",
      features: ["Catálogo de produtos", "Respostas rápidas", "Integração com loja", "API oficial"],
      price: "A partir de 20.000 MT",
      popular: false,
    },
    {
      icon: Database,
      title: "RPA (Robotic Process Automation)",
      description: "Automatize tarefas manuais com bots inteligentes.",
      features: ["Extração de dados", "Preenchimento automático", "Relatórios", "Integração sistemas"],
      price: "A partir de 45.000 MT",
      popular: false,
    },
    {
      icon: Layers,
      title: "Customização e Integração",
      description: "Soluções sob medida para sua empresa.",
      features: ["Desenvolvimento personalizado", "Integração API", "Treinamento da equipa", "Suporte contínuo"],
      price: "Sob consulta",
      popular: false,
    },
  ];

  const benefits = [
    { icon: Clock, title: "Economia de Tempo", description: "Automatize tarefas que levam horas" },
    { icon: Shield, title: "Redução de Erros", description: "Processos mais precisos e consistentes" },
    { icon: Zap, title: "Resposta Imediata", description: "Atendimento 24 horas por dia" },
    { icon: Settings, title: "Escalabilidade", description: "Cresça sem aumentar equipa" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.serviceType) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    toast.success("Orçamento solicitado! Entraremos em contacto em breve.");
    setFormData({ name: "", email: "", phone: "", company: "", serviceType: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MegaMenu />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-900 via-primary/20 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.3),transparent_50%)]" />
        <div className="container mx-auto px-4 py-24 relative">
          <div ref={heroRef} className={`max-w-4xl mx-auto text-center scroll-reveal ${heroVisible ? 'is-visible' : ''}`}>
            <Badge className="mb-6 bg-purple-100 text-purple-800 border-purple-200">
              🤖 Tecnologia de Ponta
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Automação & <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Inteligência Artificial</span>
            </h1>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Transforme o seu negócio com chatbots inteligentes, automação de processos e integração de IA. 
              A Marrengula-IT traz as melhores soluções tecnológicas para Moçambique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 shadow-lg shadow-purple-500/30">
                Solicitar Orçamento
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-purple-300 text-purple-100 hover:bg-purple-800/50">
                Ver Demonstração
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-purple-900/10 border-b border-purple-200/20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossos Serviços de IA & Automação</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Soluções completas para automatizar o seu negócio e integrar inteligência artificial
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card 
              key={service.title} 
              className={`relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                service.popular ? 'border-purple-500 shadow-purple-500/20' : ''
              }`}
            >
              {service.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-pink-600 text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
                  Mais Popular
                </div>
              )}
              <CardHeader>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                  service.popular ? 'bg-gradient-to-br from-purple-600 to-pink-600' : 'bg-purple-100'
                }`}>
                  <service.icon className={`h-7 w-7 ${service.popular ? 'text-white' : 'text-purple-600'}`} />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm">
                      <CheckCircle2 className="h-4 w-4 text-purple-600 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <p className="text-sm font-medium text-purple-600 mb-4">{service.price}</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className={`w-full ${service.popular ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90' : ''}`}>
                      Solicitar
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Solicitar {service.title}</DialogTitle>
                      <DialogDescription>
                        Preencha o formulário e entraremos em contacto em breve.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nome *</Label>
                        <Input 
                          id="name" 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Seu nome"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input 
                          id="email" 
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="seu@email.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefone *</Label>
                        <Input 
                          id="phone" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="+258 84/85 XXXXXX"
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">Empresa</Label>
                        <Input 
                          id="company" 
                          value={formData.company}
                          onChange={(e) => setFormData({...formData, company: e.target.value})}
                          placeholder="Nome da empresa"
                        />
                      </div>
                      <div>
                        <Label htmlFor="serviceType">Serviço</Label>
                        <Input 
                          id="serviceType" 
                          value={service.title}
                          disabled
                        />
                      </div>
                      <div>
                        <Label htmlFor="message">Mensagem</Label>
                        <Textarea 
                          id="message" 
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          placeholder="Descreva o que precisa..."
                          rows={3}
                        />
                      </div>
                      <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                        Enviar Pedido
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Process */}
      <div className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Como Funciona</h2>
            <p className="text-muted-foreground">Processo simples e transparente</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Consulta", desc: "Analisamos suas necessidades" },
              { step: "2", title: "Proposta", desc: "Criamos solução personalizada" },
              { step: "3", title: "Implementação", desc: "Desenvolvemos e testamos" },
              { step: "4", title: "Suporte", desc: "Acompanhamento contínuo" },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pronto para Automatizar seu Negócio?
          </h2>
          <p className="text-purple-100 mb-8 max-w-xl mx-auto">
            Agende uma demonstração gratuita e veja como a IA pode transformar a sua empresa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-900 hover:bg-purple-50">
              Agendar Demonstração
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Falar com Especialista
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AutomationIA;
