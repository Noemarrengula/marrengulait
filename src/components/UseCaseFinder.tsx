import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Monitor, Briefcase, Gamepad2, Video, Code, GraduationCap, ArrowRight, Cpu, DollarSign, Sparkles } from "lucide-react";

interface UseCase {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  budget: string;
  searchQuery: string;
  products: string[];
}

const useCases: UseCase[] = [
  {
    id: "gaming",
    title: "Gaming",
    description: "PCs e componentes para jogos de alta performance",
    icon: Gamepad2,
    color: "text-[#FF3131]",
    gradient: "from-[#FF3131] to-[#FF5555]",
    budget: "A partir de 25.000 MT",
    searchQuery: "gaming",
    products: ["Placas Gráficas RTX", "Monitores 144Hz", "Teclados Mecânicos"]
  },
  {
    id: "office",
    title: "Escritório",
    description: "Soluções completas para o seu escritório",
    icon: Briefcase,
    color: "text-blue-500",
    gradient: "from-blue-500 to-cyan-500",
    budget: "A partir de 15.000 MT",
    searchQuery: "escritorio",
    products: ["Laptops Business", "Monitores 24\"", "Impressoras"]
  },
  {
    id: "design",
    title: "Design & Vídeo",
    description: "Estações de trabalho para criativos",
    icon: Video,
    color: "text-purple-500",
    gradient: "from-purple-500 to-pink-500",
    budget: "A partir de 45.000 MT",
    searchQuery: "design",
    products: ["Workstations", "Monitores 4K", "SSD NVMe"]
  },
  {
    id: "programming",
    title: "Programação",
    description: "Equipamentos para developers",
    icon: Code,
    color: "text-green-500",
    gradient: "from-green-500 to-emerald-500",
    budget: "A partir de 20.000 MT",
    searchQuery: "programacao",
    products: ["Laptops Dev", "Monitores Ultrawide", "Teclados"]
  },
  {
    id: "education",
    title: "Educação",
    description: "Computadores acessíveis para estudantes",
    icon: GraduationCap,
    color: "text-yellow-500",
    gradient: "from-yellow-500 to-amber-500",
    budget: "A partir de 10.000 MT",
    searchQuery: "educacao",
    products: ["Laptops Económicos", "Tablets", "Acessórios"]
  },
  {
    id: "cctv",
    title: "CCTV & Segurança",
    description: "Sistemas de vigilância completos",
    icon: Monitor,
    color: "text-primary",
    gradient: "from-primary to-primary-glow",
    budget: "A partir de 8.000 MT",
    searchQuery: "cctv",
    products: ["Câmaras Hikvision", "DVRs", "Discos Rígidos"]
  }
];

export default function UseCaseFinder() {
  const navigate = useNavigate();
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  const selected = useCases.find(c => c.id === selectedCase);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/30 rounded-full text-sm font-medium mb-4 shadow-lg shadow-primary/10">
            <Sparkles className="w-4 h-4 animate-pulse" />
            Encontre o Equipamento Ideal
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Para que vai <span className="gradient-text">usar?</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Selecione o seu caso de uso e descubrimos os melhores produtos para si
          </p>
        </div>

        {/* Use Case Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            const isSelected = selectedCase === useCase.id;
            return (
              <Card
                key={useCase.id}
                onClick={() => setSelectedCase(useCase.id === selectedCase ? null : useCase.id)}
                className={`cursor-pointer transition-all duration-300 border-2 hover:-translate-y-1 hover:shadow-lg animate-slide-up ${
                  isSelected
                    ? "border-primary shadow-md shadow-primary/20"
                    : "border-border hover:border-primary/50"
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-4 text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${useCase.gradient} mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1 text-foreground">{useCase.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{useCase.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Selected Case Details */}
        {selected && (
          <Card className="border-2 border-primary/30 overflow-hidden animate-slide-up">
            <CardContent className="p-0">
              <div className={`bg-gradient-to-r ${selected.gradient} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{selected.title}</h3>
                    <p className="text-white/90">{selected.description}</p>
                  </div>
                  <selected.icon className="w-16 h-16 text-white/20" />
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="flex items-center gap-3">
                    <DollarSign className={`w-8 h-8 ${selected.color}`} />
                    <div>
                      <p className="text-xs text-muted-foreground">Orçamento</p>
                      <p className="font-semibold text-foreground">{selected.budget}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Cpu className={`w-8 h-8 ${selected.color}`} />
                    <div>
                      <p className="text-xs text-muted-foreground">Produtos Populares</p>
                      <p className="font-semibold text-foreground">{selected.products.join(", ")}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <Button
                      onClick={() => navigate(`/produtos?search=${selected.searchQuery}`)}
                      className={`bg-gradient-to-r ${selected.gradient} hover:opacity-90 text-white`}
                    >
                      Ver Produtos <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
