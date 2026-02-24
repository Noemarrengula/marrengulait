import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cpu, HardDrive, MemoryStick, Monitor, Zap, Fan, Box, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface PCComponent {
  category: string;
  name: string;
  price: number;
  icon: any;
}

const PCBuilder = () => {
  const navigate = useNavigate();
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

  const components = {
    processor: [
      { name: "Intel Core i5-13400F", price: 25000, icon: Cpu },
      { name: "Intel Core i7-13700K", price: 45000, icon: Cpu },
      { name: "AMD Ryzen 5 7600X", price: 28000, icon: Cpu },
      { name: "AMD Ryzen 7 7700X", price: 42000, icon: Cpu },
      { name: "Intel Core i9-13900K", price: 75000, icon: Cpu },
    ],
    motherboard: [
      { name: "ASUS Prime B660M-A", price: 15000, icon: Box },
      { name: "MSI MAG B760 Tomahawk", price: 22000, icon: Box },
      { name: "Gigabyte X670 AORUS Elite", price: 35000, icon: Box },
    ],
    ram: [
      { name: "16GB DDR4 3200MHz", price: 8000, icon: MemoryStick },
      { name: "32GB DDR4 3600MHz", price: 15000, icon: MemoryStick },
      { name: "32GB DDR5 5600MHz", price: 22000, icon: MemoryStick },
      { name: "64GB DDR5 6000MHz", price: 42000, icon: MemoryStick },
    ],
    storage: [
      { name: "SSD 500GB NVMe", price: 6000, icon: HardDrive },
      { name: "SSD 1TB NVMe", price: 10000, icon: HardDrive },
      { name: "SSD 2TB NVMe", price: 18000, icon: HardDrive },
      { name: "SSD 1TB + HDD 2TB", price: 15000, icon: HardDrive },
    ],
    gpu: [
      { name: "NVIDIA RTX 4060", price: 45000, icon: Monitor },
      { name: "NVIDIA RTX 4070", price: 72000, icon: Monitor },
      { name: "AMD RX 7700 XT", price: 55000, icon: Monitor },
      { name: "NVIDIA RTX 4090", price: 180000, icon: Monitor },
    ],
    psu: [
      { name: "600W 80+ Bronze", price: 6000, icon: Zap },
      { name: "750W 80+ Gold", price: 10000, icon: Zap },
      { name: "850W 80+ Platinum", price: 15000, icon: Zap },
    ],
    case: [
      { name: "Gabinete ATX Básico", price: 5000, icon: Box },
      { name: "Gabinete ATX RGB", price: 8000, icon: Box },
      { name: "Gabinete Premium Vidro", price: 12000, icon: Box },
    ],
    cooling: [
      { name: "Cooler Stock", price: 0, icon: Fan },
      { name: "Cooler Tower 120mm", price: 3000, icon: Fan },
      { name: "Water Cooler 240mm", price: 8000, icon: Fan },
      { name: "Water Cooler 360mm", price: 12000, icon: Fan },
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

  const handleComponentSelect = (category: string, componentName: string) => {
    const component = components[category as keyof typeof components].find(c => c.name === componentName);
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

    toast.success("PC personalizado adicionado ao carrinho!");
    // Aqui você pode adicionar a lógica para adicionar ao carrinho
  };

  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🖥️ Monte Seu PC</h1>
          <p className="text-muted-foreground">
            Configure o PC dos seus sonhos escolhendo cada componente
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Component Selection */}
          <div className="lg:col-span-2 space-y-4">
            {Object.entries(components).map(([category, items]) => {
              const Icon = items[0].icon;
              return (
                <Card key={category}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{categoryLabels[category]}</CardTitle>
                        {selectedComponents[category] && (
                          <CardDescription className="text-primary font-medium">
                            {selectedComponents[category]?.price.toLocaleString('pt-MZ')} MT
                          </CardDescription>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Select onValueChange={(value) => handleComponentSelect(category, value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={`Selecione ${categoryLabels[category]}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {items.map((item) => (
                          <SelectItem key={item.name} value={item.name}>
                            {item.name} - {item.price.toLocaleString('pt-MZ')} MT
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
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumo da Configuração</CardTitle>
                <CardDescription>Componentes selecionados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(selectedComponents).map(([category, component]) => (
                  component && (
                    <div key={category} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{categoryLabels[category]}</span>
                      <span className="font-medium">{component.price.toLocaleString('pt-MZ')} MT</span>
                    </div>
                  )
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{total.toLocaleString('pt-MZ')} MT</span>
                  </div>
                </div>

                <Button 
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-primary to-primary-glow"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Adicionar ao Carrinho
                </Button>

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
