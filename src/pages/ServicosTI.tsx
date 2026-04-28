import { useState, useEffect } from "react";
import { Suspense } from "react";
import { toast } from "sonner";
import Header from "@/components/Header";
import MegaMenu from "@/components/MegaMenu";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { serviceCatalog, type ServiceLevel, type BusinessService } from "@/services/serviceCatalog.service";
import { quoteService } from "@/services/quote.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check, ChevronRight, HardDrive, Headphones, MessageCircle, Shield, Sparkles, Swords, Wrench, Loader2 } from "lucide-react";

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

function ServiceCard({ service, onSelect }: { service: BusinessService; onSelect: (s: BusinessService, l: ServiceLevel) => void }) {
  const [level, setLevel] = useState<ServiceLevel>("basic");

  const prices = [
    { level: "basic" as ServiceLevel, price: service.price_basic },
    { level: "professional" as ServiceLevel, price: service.price_professional },
    { level: "enterprise" as ServiceLevel, price: service.price_enterprise },
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{service.category}</Badge>
          {service.is_featured && <Badge className="bg-yellow-500">Destaque</Badge>}
        </div>
        <CardTitle className="text-xl mt-2">{service.name}</CardTitle>
        <CardDescription>{service.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <Label>Nível do Serviço</Label>
          <RadioGroup value={level} onValueChange={(v) => setLevel(v as ServiceLevel)} className="flex gap-2">
            {prices.map((p) => (
              <div key={p.level} className="flex-1">
                <RadioGroupItem value={p.level} id={p.level} className="peer sr-only" />
                <Label
                  htmlFor={p.level}
                  className={`flex flex-col items-center justify-between rounded-md border-2 p-3 cursor-pointer hover:bg-muted ${
                    level === p.level ? "border-primary bg-primary/10" : "border-muted"
                  }`}
                >
                  <span className="text-xs capitalize">{p.level}</span>
                  <span className="font-bold text-primary">{serviceCatalog.formatPrice(p.price)}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {service.duration_minutes && (
          <p className="text-sm text-muted-foreground">
            Duração estimada: {serviceCatalog.formatDuration(service.duration_minutes)}
          </p>
        )}

        <Button onClick={() => onSelect(service, level)} className="w-full">
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
  const [loading, setLoading] = useState(false);
  const [quoteResult, setQuoteResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    setLoading(true);
    try {
      const result = await quoteService.calculateQuote({
        serviceId: selectedService.id,
        quantity,
        level: selectedLevel,
      });
      setQuoteResult(result);
      toast.success("Orçamento criado com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar orçamento");
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = selectedService
    ? serviceCatalog.getPriceByLevel(selectedService, selectedLevel) * quantity
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Solicitar Orçamento</DialogTitle>
          <DialogDescription>
            {selectedService?.name} - Nível {selectedLevel}
          </DialogDescription>
        </DialogHeader>

        {quoteResult ? (
          <div className="space-y-4 text-center py-4">
            <div className="text-4xl font-bold text-primary">
              {serviceCatalog.formatPrice(quoteResult.total_price)}
            </div>
            <p className="text-sm text-muted-foreground">
              Orçamento #{quoteResult.quote_number}
            </p>
            <p className="text-xs text-muted-foreground">
              Válido até: {new Date(quoteResult.valid_until).toLocaleDateString("pt-MZ")}
            </p>
            <Button onClick={() => onOpenChange(false)} className="w-full">
              Fechar
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="h-10 flex items-center text-xl font-bold text-primary">
                  {serviceCatalog.formatPrice(totalPrice)}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas Adicionais</Label>
              <Textarea
                id="notes"
                placeholder="Descreva detalhes adicionais..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "A processar..." : "Solicitar Orçamento"}
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

  // 🔴 CORREÇÃO: UseEffect para carregar dados do Supabase
  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Carregar serviços do Supabase
        const servicesData = await serviceCatalog.getServices();
        setServices(servicesData);
        
        // Carregar categorias únicas
        const categoriesData = await serviceCatalog.getCategories();
        setCategories(categoriesData);
        
        console.log("✅ Serviços carregados:", servicesData.length);
        console.log("✅ Categorias:", categoriesData);
      } catch (err: any) {
        console.error("❌ Erro ao carregar serviços:", err);
        setError(err.message || "Erro ao carregar serviços");
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MegaMenu />

      <div className="container mx-auto px-4 py-4">
        <Breadcrumbs items={[{ label: "Serviços de TI" }]} />
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
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
            <p className="text-muted-foreground mb-4">Em breve we'll have more services!</p>
            <a href="https://wa.me/258864738133" target="_blank" rel="noopener noreferrer">
              <Button>Fale connosco no WhatsApp</Button>
            </a>
          </div>
        )}

        {!loading && !error && services.length > 0 && (
          <>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Serviços de Tecnologia</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Soluções profissionais de TI para empresas e particulares.INST-REDE,
            configuração, manutenção e muito mais.
          </p>
        </div>

        {featuredServices.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Serviços em Destaque</h2>
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

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
          <TabsList className="flex flex-wrap h-auto">
            <TabsTrigger value="all">Todos</TabsTrigger>
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat}>
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-6">
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

        <div className="mt-12 p-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl">
          <h3 className="text-2xl font-bold mb-4">Precisa de ajuda?</h3>
          <p className="text-muted-foreground mb-6">
            Fale connosco para entender qual serviço melhor se adapta às suas necessidades.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://wa.me/258864738133"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
            <a href="tel:+258864738133" className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
              <Wrench className="w-5 h-5" />
              Ligar
            </a>
          </div>
        </div>
          </>
        )}
      </div>

      <Footer />

      <QuoteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedService={selectedService}
        selectedLevel={selectedLevel}
      />
    </div>
  );
}