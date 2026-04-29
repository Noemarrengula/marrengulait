import { useState, useEffect } from "react";
import { Suspense } from "react";
import { toast } from "sonner";
import Header from "@/components/Header";
import MegaMenu from "@/components/MegaMenu";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { serviceCatalog, type ServiceLevel, type BusinessService } from "@/services/serviceCatalog.service";
import { quoteService, type QuoteResult } from "@/services/quote.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { 
  Check, ChevronRight, HardDrive, Headphones, MessageCircle, Shield, Sparkles, Swords, Wrench, Loader2, 
  Phone, Mail, MapPin, Clock, Star, Users, Award, Zap, ArrowRight, Send, Copy, CheckCircle2,
  Building2, FileText, Package, DollarSign
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  wifi: HardDrive,
  shield: Shield,
  headset: Headphones,
  server: Sparkles,
  'message-circle': MessageCircle,
  code: Swords,
  'hard-drive': HardDrive,
  wrench: Wrench,
};

const levelConfig: Record<ServiceLevel, { label: string; description: string; badge: string }> = {
  basic: { 
    label: 'Básico', 
    description: 'Solução essencial para necessidades simples',
    badge: 'bg-blue-500'
  },
  professional: { 
    label: 'Profissional', 
    description: 'Solução completa com suporte prioritário',
    badge: 'bg-[#93291E]'
  },
  enterprise: { 
    label: 'Enterprise', 
    description: 'Solução completa com SLA e suporte dedicado',
    badge: 'bg-purple-600'
  }
};

function ServiceCard({ service, onSelect }: { service: BusinessService; onSelect: (s: BusinessService, l: ServiceLevel) => void }) {
  const [level, setLevel] = useState<ServiceLevel>("basic");

  const prices: { level: ServiceLevel; price: number }[] = [
    { level: "basic", price: service.price_basic },
    { level: "professional", price: service.price_professional },
    { level: "enterprise", price: service.price_enterprise },
  ];

  return (
    <Card className="overflow-hidden border-2 hover:border-[#93291E]/50 hover:shadow-xl hover:shadow-[#93291E]/10 transition-all duration-300 group">
      <CardHeader className="bg-gradient-to-r from-[#93291E]/5 to-black/5">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">{service.category}</Badge>
          {service.is_featured && (
            <Badge className="bg-gradient-to-r from-[#93291E] to-[#FF3131] text-white">
              <Star className="w-3 h-3 mr-1" /> Destaque
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl mt-3 group-hover:text-[#93291E] transition-colors">{service.name}</CardTitle>
        <CardDescription className="line-clamp-2">{service.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        {/* Price levels */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Nível do Serviço</Label>
          <RadioGroup value={level} onValueChange={(v) => setLevel(v as ServiceLevel)} className="flex flex-col gap-2">
            {prices.map((p) => (
              <div key={p.level} className="flex-1">
                <RadioGroupItem value={p.level} id={`${service.id}-${p.level}`} className="peer sr-only" />
                <Label
                  htmlFor={`${service.id}-${p.level}`}
                  className={`flex items-center justify-between rounded-lg border-2 p-3 cursor-pointer transition-all ${
                    level === p.level 
                      ? "border-[#93291E] bg-[#93291E]/10 shadow-md" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${levelConfig[p.level].badge}`} />
                    <span className="text-sm font-medium">{levelConfig[p.level].label}</span>
                  </div>
                  <span className="font-bold text-[#93291E]">{serviceCatalog.formatPrice(p.price)}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {service.duration_minutes && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Duração: {serviceCatalog.formatDuration(service.duration_minutes)}</span>
          </div>
        )}

        <Separator />

        <div className="space-y-2">
          <div className="text-2xl font-bold text-[#93291E]">
            {serviceCatalog.formatPrice(serviceCatalog.getPriceByLevel(service, level))}
          </div>
          <p className="text-xs text-muted-foreground">{levelConfig[level].description}</p>
        </div>

        <Button 
          onClick={() => onSelect(service, level)} 
          className="w-full bg-gradient-to-r from-[#93291E] to-[#FF3131] hover:from-[#FF3131] hover:to-[#93291E] text-white font-semibold"
        >
          Solicitar Orçamento <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}

function QuoteDialog({
  open,
  onOpenChange,
  selectedService,
  selectedLevel,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedService: BusinessService | null;
  selectedLevel: ServiceLevel;
}) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null);
  const [step, setStep] = useState<'form' | 'result'>('form');

  const totalPrice = selectedService
    ? serviceCatalog.getPriceByLevel(selectedService, selectedLevel) * quantity
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    if (!clientName.trim()) {
      toast.error("Por favor, preencha o seu nome");
      return;
    }

    setLoading(true);
    try {
      const result = await quoteService.calculateQuote({
        serviceId: selectedService.id,
        quantity,
        level: selectedLevel,
      });
      setQuoteResult(result);
      setStep('result');
      toast.success("Orçamento criado com sucesso!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao criar orçamento";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendWhatsApp = () => {
    if (!selectedService) return;
    
    const message = `📋 *PEDIDO DE ORÇAMENTO - MARRENGULA IT*\n\n` +
      `👤 *Cliente:* ${clientName}\n` +
      `📧 *Email:* ${clientEmail || 'N/A'}\n` +
      `📞 *Telefone:* ${clientPhone || 'N/A'}\n\n` +
      `🔧 *Serviço:* ${selectedService.name}\n` +
      `📂 *Categoria:* ${selectedService.category}\n` +
      `🎯 *Nível:* ${levelConfig[selectedLevel].label}\n` +
      `📦 *Quantidade:* ${quantity}\n` +
      `💰 *Valor Total:* ${serviceCatalog.formatPrice(totalPrice)}\n\n` +
      `📝 *Notas:* ${notes || 'Nenhuma'}\n\n` +
      `_Enviado via marrengulait.com_`;

    const whatsappUrl = `https://wa.me/258864738133?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success("Redirecionando para WhatsApp...");
  };

  const handleCopyQuote = () => {
    if (!selectedService) return;
    
    const text = `Orçamento: ${selectedService.name}\n` +
      `Nível: ${levelConfig[selectedLevel].label}\n` +
      `Quantidade: ${quantity}\n` +
      `Valor: ${serviceCatalog.formatPrice(totalPrice)}`;
    
    navigator.clipboard.writeText(text);
    toast.success("Orçamento copiado!");
  };

  const handleReset = () => {
    setStep('form');
    setQuoteResult(null);
    setQuantity(1);
    setNotes("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) handleReset();
      else onOpenChange(open);
    }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {step === 'form' ? 'Solicitar Orçamento' : 'Orçamento Gerado'}
          </DialogTitle>
          <DialogDescription>
            {step === 'form' 
              ? selectedService ? `${selectedService.name} - ${levelConfig[selectedLevel].label}` : 'Preencha os dados abaixo'
              : 'Seu orçamento está pronto!'
            }
          </DialogDescription>
        </DialogHeader>

        {step === 'result' && quoteResult ? (
          <div className="space-y-6 py-4">
            {/* Success animation */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-[#93291E]">
                {serviceCatalog.formatPrice(quoteResult.total_price)}
              </h3>
            </div>

            <Card className="bg-gradient-to-r from-[#93291E]/5 to-black/5">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Nº Orçamento:</span>
                  <span className="font-mono font-bold">{quoteResult.quote_number}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Serviço:</span>
                  <span className="font-medium">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Nível:</span>
                  <span className="font-medium">{levelConfig[selectedLevel].label}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quantidade:</span>
                  <span className="font-medium">{quantity}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-[#93291E] text-lg">
                    {serviceCatalog.formatPrice(quoteResult.total_price)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Válido até:</span>
                  <span className="font-medium">
                    {new Date(quoteResult.valid_until).toLocaleDateString("pt-MZ")}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={handleCopyQuote} 
                variant="outline" 
                className="w-full"
              >
                <Copy className="w-4 h-4 mr-2" /> Copiar
              </Button>
              <Button 
                onClick={handleSendWhatsApp} 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
              </Button>
            </div>

            <Button onClick={handleReset} className="w-full">
              Fechar
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Client info */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Users className="w-4 h-4" /> Dados do Cliente
              </h4>
              <div className="space-y-2">
                <Label htmlFor="clientName">Nome Completo *</Label>
                <Input
                  id="clientName"
                  placeholder="Seu nome completo"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientPhone">Telefone</Label>
                  <Input
                    id="clientPhone"
                    placeholder="+258 84 000 0000"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Service details */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <FileText className="w-4 h-4" /> Detalhes do Serviço
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Valor Total</Label>
                  <div className="h-10 flex items-center text-xl font-bold text-[#93291E]">
                    {serviceCatalog.formatPrice(totalPrice)}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas Adicionais</Label>
                <Textarea
                  id="notes"
                  placeholder="Descreva detalhes adicionais sobre o serviço..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-[#93291E] to-[#FF3131] hover:from-[#FF3131] hover:to-[#93291E] text-white font-semibold py-6" disabled={loading}>
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> A processar...</>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" /> Gerar Orçamento
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function ServicosTI() {
  const [services, setServices] = useState<BusinessService[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedService, setSelectedService] = useState<BusinessService | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<ServiceLevel>("basic");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const servicesData = await serviceCatalog.getServices();
        setServices(servicesData);
        
        const categoriesData = await serviceCatalog.getCategories();
        setCategories(categoriesData);
        
        console.log("✅ Serviços carregados:", servicesData.length);
        console.log("✅ Categorias:", categoriesData);
      } catch (err) {
        console.error("❌ Erro ao carregar serviços:", err);
        const message = err instanceof Error ? err.message : "Erro ao carregar serviços";
        setError(message);
        toast.error("Erro ao carregar serviços");
      } finally {
        setLoading(false);
      }
    };
    
    loadServices();
  }, []);

  const handleServiceSelect = (service: BusinessService, level: ServiceLevel) => {
    setSelectedService(service);
    setSelectedLevel(level);
    setDialogOpen(true);
  };

  const filteredServices =
    activeCategory === "all"
      ? services
      : services.filter((s) => s.category === activeCategory);

  const featuredServices = services.filter((s) => s.is_featured);

  const whyChooseUs = [
    { icon: Award, title: "Experiência Comprovada", description: "Mais de 500 projetos concluídos com sucesso" },
    { icon: Zap, title: "Resposta Rápida", description: "Atendimento em até 24 horas" },
    { icon: Shield, title: "Garantia de Serviço", description: "Garantia de 90 dias em todos os serviços" },
    { icon: Users, title: "Equipa Especializada", description: "Técnicos certificados e experientes" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MegaMenu />

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumbs items={[{ label: "Serviços de TI" }]} />
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#240b36] via-[#3d1047] to-[#93291E] text-white py-16">
        <div className="absolute inset-0 opacity-10">
          <div className="cyber-grid" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-white/20 text-white border border-white/30 mb-4">
              <Wrench className="w-3 h-3 mr-1" /> Serviços Profissionais
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Soluções de Tecnologia para o Seu Negócio
            </h1>
            <p className="text-lg text-white/90 mb-8">
              Instalação, configuração, manutenção e consultoria em TI. 
              Serviços adaptados à realidade de Moçambique com preços competitivos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/258864738133?text=Olá! Gostaria de solicitar um orçamento para serviços de TI." target="_blank" rel="noopener noreferrer">
                <Button className="bg-white text-[#93291E] hover:bg-white/95 font-semibold px-6">
                  <MessageCircle className="w-5 h-5 mr-2" /> Falar no WhatsApp
                </Button>
              </a>
              <a href="tel:+258864738133">
                <Button variant="outline" className="border-2 border-white/40 bg-white/10 text-white hover:bg-white/20">
                  <Phone className="w-5 h-5 mr-2" /> Ligar Agora
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Por que escolher a Marrengula IT?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, index) => (
              <Card key={index} className="border-2 hover:border-[#93291E]/30 transition-all">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#93291E]/10 mb-4">
                    <item.icon className="w-6 h-6 text-[#93291E]" />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="container mx-auto px-4 py-12">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-[#93291E] mb-4" />
            <p className="text-muted-foreground">A carregar serviços...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-red-500 font-medium mb-2">Erro ao carregar</p>
            <p className="text-muted-foreground text-sm mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>
          </div>
        )}

        {!loading && !error && services.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Wrench className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl font-medium mb-2">Nenhum serviço disponível</p>
            <p className="text-muted-foreground mb-4">Em breve teremos mais serviços!</p>
            <a href="https://wa.me/258864738133" target="_blank" rel="noopener noreferrer">
              <Button>Fale connosco no WhatsApp</Button>
            </a>
          </div>
        )}

        {!loading && !error && services.length > 0 && (
          <>
            {/* Featured Services */}
            {featuredServices.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <Star className="w-6 h-6 text-[#93291E]" />
                  <h2 className="text-2xl font-bold">Serviços em Destaque</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredServices.slice(0, 4).map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onSelect={handleServiceSelect}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Services with Tabs */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-6">Todos os Serviços</h2>
            </div>
            
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="flex flex-wrap h-auto mb-6">
                <TabsTrigger value="all">Todos</TabsTrigger>
                {categories.map((cat) => (
                  <TabsTrigger key={cat} value={cat}>
                    {cat}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value={activeCategory} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onSelect={handleServiceSelect}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Contact CTA */}
            <div className="mt-16 p-8 bg-gradient-to-r from-[#93291E]/10 to-black/5 rounded-2xl border-2 border-[#93291E]/20">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="text-center lg:text-left">
                  <h3 className="text-2xl font-bold mb-2">Precisa de ajuda para escolher?</h3>
                  <p className="text-muted-foreground">
                    Fale connosco para entender qual serviço melhor se adapta às suas necessidades.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://wa.me/258864738133?text=Olá! Preciso de ajuda para escolher um serviço de TI."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp
                    </Button>
                  </a>
                  <a href="tel:+258864738133">
                    <Button variant="outline">
                      <Phone className="w-5 h-5 mr-2" /> Ligar
                    </Button>
                  </a>
                  <a href="mailto:info@marrengulait.com">
                    <Button variant="outline">
                      <Mail className="w-5 h-5 mr-2" /> Email
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />

      <Suspense fallback={null}>
        <QuoteDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          selectedService={selectedService}
          selectedLevel={selectedLevel}
        />
      </Suspense>
    </div>
  );
}
