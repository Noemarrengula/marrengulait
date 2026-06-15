import { Laptop, HardDrive, Keyboard, Monitor, Wifi, Server, Smartphone, Headphones } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();
  
  const categories = [
    { icon: Laptop, name: "Laptops", count: "234", query: "laptops" },
    { icon: HardDrive, name: "Hardware", count: "567", query: "hardware" },
    { icon: Keyboard, name: "Acessórios", count: "891", query: "acessórios" },
    { icon: Monitor, name: "Monitores", count: "156", query: "monitores" },
    { icon: Wifi, name: "Redes", count: "123", query: "redes" },
    { icon: Server, name: "Servidores", count: "45", query: "servidores" },
    { icon: Smartphone, name: "Smartphones", count: "378", query: "smartphones" },
    { icon: Headphones, name: "Audio", count: "234", query: "audio" },
  ];

  return (
    <section className="py-12 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,hsl(var(--primary)/0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,hsl(var(--accent)/0.08),transparent_50%)]" />
      
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between mb-8">
          <div className="animate-slide-up">
            <h2 className="text-3xl font-bold text-foreground mb-2">Categorias Populares</h2>
            <p className="text-muted-foreground">Encontre o que procura rapidamente</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category, index) => (
            <Card
              key={category.name}
              onClick={() => navigate(`/produtos?search=${category.query}`)}
              className="p-6 flex flex-col items-center justify-center gap-3 hover:bg-card-hover hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer group hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <category.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="text-center">
                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.count}+ itens</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
