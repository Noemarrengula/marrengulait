import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cpu, HardDrive, MemoryStick, Monitor, Zap, Fan, Box, ShoppingCart, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useSettings } from "@/context/SettingsContext";
import { useProducts } from "@/hooks/useProducts";

interface PCComponent {
  id: string;
  category: string;
  name: string;
  price: number;
  image: string;
  icon: any;
}

const PCBuilder = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { locale, currency } = useSettings();
  
  const [selectedComponents, setSelectedComponents] = useState<Record<string, PCComponent | null>>({
    processor: null,
    motherboard: null,
    ram: null,
    storage: null,
    gpu: null,
    psu: null,
    case: null,
    cooling: null,
  });

  const { data: allProducts } = useProducts();
  
  const components = {
    processor: [
      { id: "proc-1", name: "Intel Core i5-13400F", price: 25000, image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=100", icon: Cpu },
      { id: "proc-2", name: "Intel Core i7-13700K", price: 45000, image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=100", icon: Cpu },
      { id: "proc-3", name: "AMD Ryzen 5 7600X", price: 28000, image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=100", icon: Cpu },
      { id: "proc-4", name: "AMD Ryzen 7 7700X", price: 42000, image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=100", icon: Cpu },
      { id: "proc-5", name: "Intel Core i9-13900K", price: 75000, image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=100", icon: Cpu },
    ],
    motherboard: [
      { id: "mob-1", name: "ASUS Prime B660M-A", price: 15000, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=100", icon: Box },
      { id: "mob-2", name: "MSI MAG B760 Tomahawk", price: 22000, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=100", icon: Box },
      { id: "mob-3", name: "Gigabyte X670 AORUS Elite", price: 35000, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=100", icon: Box },
    ],
    ram: [
      { id: "ram-1", name: "16GB DDR4 3200MHz", price: 8000, image: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=100", icon: MemoryStick },
      { id: "ram-2", name: "32GB DDR4 3600MHz", price: 15000, image: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=100", icon: MemoryStick },
      { id: "ram-3", name: "32GB DDR5 5600MHz", price: 22000, image: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=100", icon: MemoryStick },
      { id: "ram-4", name: "64GB DDR5 6000MHz", price: 42000, image: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=100", icon: MemoryStick },
    ],
    storage: [
      { id: "sto-1", name: "SSD 500GB NVMe", price: 6000, image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=100", icon: HardDrive },
      { id: "sto-2", name: "SSD 1TB NVMe", price: 10000, image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=100", icon: HardDrive },
      { id: "sto-3", name: "SSD 2TB NVMe", price: 18000, image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=100", icon: HardDrive },
      { id: "sto-4", name: "SSD 1TB + HDD 2TB", price: 15000, image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=100", icon: HardDrive },
    ],
    gpu: [
      { id: "gpu-1", name: "NVIDIA RTX 4060", price: 45000, image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=100", icon: Monitor },
      { id: "gpu-2", name: "NVIDIA RTX 4070", price: 72000, image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=100", icon: Monitor },
      { id: "gpu-3", name: "AMD RX 7700 XT", price: 55000, image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=100", icon: Monitor },
      { id: "gpu-4", name: "NVIDIA RTX 4090", price: 180000, image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=100", icon: Monitor },
    ],
    psu: [
      { id: "psu-1", name: "600W 80+ Bronze", price: 6000, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=100", icon: Zap },
      { id: "psu-2", name: "750W 80+ Gold", price: 10000, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=100", icon: Zap },
      { id: "psu-3", name: "850W 80+ Platinum", price: 15000, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=100", icon: Zap },
    ],
    case: [
      { id: "case-1", name: "Gabinete ATX Básico", price: 5000, image: "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=100", icon: Box },
      { id: "case-2", name: "Gabinete ATX RGB", price: 8000, image: "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=100", icon: Box },
      { id: "case-3", name: "Gabinete Premium Vidro", price: 12000, image: "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=100", icon: Box },
    ],
    cooling: [
      { id: "cool-1", name: "Cooler Stock (Inclusivo)", price: 0, image: "", icon: Fan },
      { id: "cool-2", name: "Cooler Tower 120mm", price: 3000, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=100", icon: Fan },
      { id: "cool-3", name: "Water Cooler 240mm", price: 8000, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=100", icon: Fan },
      { id: "cool-4", name: "Water Cooler 360mm", price: 12000, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=100", icon: Fan },
    ],
  };

  const categoryLabels: Record<string, string> = {
    processor: "Processador",
    motherboard: "Placa-Mãe",
    ram: "Memória RAM",
    storage: "Armazenamento",
    gpu: "Placa de Vídeo",
    psu: "Fonte de Alimentação",
    case: "Gabinete",
    cooling: "Refrigeração",
  };

  const categoryIcons: Record<string, any> = {
    processor: Cpu,
    motherboard: Box,
    ram: MemoryStick,
    storage: HardDrive,
    gpu: Monitor,
    psu: Zap,
    case: Box,
    cooling: Fan,
  };

  const handleComponentSelect = (category: string, componentName: string) => {
    const componentList = components[category as keyof typeof components];
    const component = componentList?.find(c => c.name === componentName);
    if (component) {
      setSelectedComponents(prev => ({
        ...prev,
        [category]: { category, ...component }
      }));
    }
  };

  const calculateTotal = () => {
    return Object.values(selectedComponents).reduce((total, component) => {
      return total + (component?.price || 0);
    }, 0);
  };

  const handleAddToCart = () => {
    const missingComponents = Object.entries(selectedComponents)
      .filter(([key, value]) => !value && key !== 'cooling')
      .map(([key]) => categoryLabels[key]);

    if (missingComponents.length > 0) {
      toast.error(`Selecione: ${missingComponents.join(", ")}`);
      return;
    }

    // Adicionar cada componente ao carrinho
    Object.values(selectedComponents).forEach(component => {
      if (component) {
        addItem({
          id: component.id,
          title: component.name,
          price: component.price,
          image: component.image || "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=100",
        });
      }
    });

    toast.success("PC personalizado adicionado ao carrinho!", {
      description: `${Object.values(selectedComponents).filter(Boolean).length} componentes adicionados`
    });
  };

  const handleClearSelection = (category: string) => {
    setSelectedComponents(prev => ({
      ...prev,
      [category]: null
    }));
  };

  const selectedCount = Object.values(selectedComponents).filter(Boolean).length;
  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">
            <span className="text-[#FF3131]">Monte</span> Seu PC
          </h1>
          <p className="text-muted-foreground">
            Configure o PC dos seus sonhos escolhendo cada componente
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progresso</span>
            <span className="text-sm text-muted-foreground">{selectedCount}/8 componentes</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#FF3131] to-[#FF5555] transition-all duration-500"
              style={{ width: `${(selectedCount / 8) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Component Selection */}
          <div className="lg:col-span-2 space-y-4">
            {Object.entries(components).map(([category, items]) => {
              const Icon = categoryIcons[category] || Box;
              const selected = selectedComponents[category];
              
              return (
                <Card key={category} className={`transition-all ${selected ? 'border-[#FF3131]' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selected ? 'bg-[#FF3131]' : 'bg-[#FF3131]/10'}`}>
                          <Icon className={`w-5 h-5 ${selected ? 'text-white' : 'text-[#FF3131]'}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{categoryLabels[category]}</CardTitle>
                          {selected && (
                            <CardDescription className="text-[#FF3131] font-semibold">
                              {selected.price.toLocaleString(locale)} {currency}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                      {selected && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleClearSelection(category)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Select onValueChange={(value) => handleComponentSelect(category, value)}>
                      <SelectTrigger className={selected ? 'border-[#FF3131]' : ''}>
                        <SelectValue placeholder={`Selecione ${categoryLabels[category]}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {items.map((item) => (
                          <SelectItem key={item.name} value={item.name}>
                            <div className="flex items-center justify-between w-full">
                              <span>{item.name}</span>
                              <span className="ml-4 text-muted-foreground">
                                {item.price === 0 ? 'Grátis' : `${item.price.toLocaleString(locale)} ${currency}`}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-[#FF3131]" />
                  Resumo
                </CardTitle>
                <CardDescription>Componentes selecionados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(selectedComponents).map(([category, component]) => (
                  <div key={category} className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{categoryLabels[category]}</span>
                    {component ? (
                      <span className="font-medium text-right flex-1 ml-4 text-end">
                        {component.name}
                        <span className="text-[#FF3131] ml-2">
                          {component.price === 0 ? 'Grátis' : `${component.price.toLocaleString(locale)}`}
                        </span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">Não selecionado</span>
                    )}
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[#FF3131]">{total.toLocaleString(locale)} {currency}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-[#FF3131] to-[#FF5555] hover:opacity-90"
                  size="lg"
                  disabled={selectedCount < 4}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Adicionar ao Carrinho
                </Button>

                {selectedCount < 4 && (
                  <p className="text-xs text-center text-muted-foreground">
                    Selecione pelo menos 4 componentes principais
                  </p>
                )}

                <Button 
                  onClick={() => navigate('/servicos')}
                  variant="outline"
                  className="w-full"
                >
                  Solicitar Orçamento Personalizado
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PCBuilder;
