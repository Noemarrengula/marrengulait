import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Wifi, Shield, Headphones, Server, MessageCircle, Code } from "lucide-react";

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  serviceCount: number;
  route: string;
}

const categories: ServiceCategory[] = [
  {
    id: "redes",
    name: "Redes & WiFi",
    description: "Instalação e configuração de redes empresariais",
    icon: Wifi,
    color: "text-blue-500",
    gradient: "from-blue-500 to-cyan-400",
    serviceCount: 4,
    route: "/servicos-ti"
  },
  {
    id: "seguranca",
    name: "Segurança & CCTV",
    description: "Sistemas de vigilância e proteção de dados",
    icon: Shield,
    color: "text-green-500",
    gradient: "from-green-500 to-emerald-400",
    serviceCount: 3,
    route: "/servicos-ti"
  },
  {
    id: "suporte",
    name: "Suporte Técnico",
    description: "Manutenção preventiva e corretiva",
    icon: Headphones,
    color: "text-purple-500",
    gradient: "from-purple-500 to-pink-400",
    serviceCount: 3,
    route: "/servicos-ti"
  },
  {
    id: "infraestrutura",
    name: "Infraestrutura",
    description: "Servidores, VoIP e migração de dados",
    icon: Server,
    color: "text-orange-500",
    gradient: "from-orange-500 to-amber-400",
    serviceCount: 3,
    route: "/servicos-ti"
  },
  {
    id: "consultoria",
    name: "Consultoria TI",
    description: "Estratégias e soluções tecnológicas",
    icon: MessageCircle,
    color: "text-primary",
    gradient: "from-[#FF3131] to-[#FF5555]",
    serviceCount: 2,
    route: "/servicos-ti"
  },
  {
    id: "desenvolvimento",
    name: "Desenvolvimento",
    description: "Sites, apps e software personalizado",
    icon: Code,
    color: "text-indigo-500",
    gradient: "from-indigo-500 to-violet-400",
    serviceCount: 2,
    route: "/servicos-ti"
  },
];

export default function ServiceCategoriesGrid() {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,hsl(var(--primary)/0.1),transparent_50%)]" />
      
      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Categorias de <span className="gradient-text">Serviços</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore as nossas soluções organizadas por área de especialização
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card
                key={category.id}
                onClick={() => navigate(category.route)}
                className="cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/50 bg-card/50 backdrop-blur-sm animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-5 text-center">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${category.gradient} mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1 text-foreground hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {category.description}
                  </p>
                  <span className="text-xs text-primary font-medium">
                    {category.serviceCount} serviços
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
