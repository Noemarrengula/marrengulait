import { Laptop, HardDrive, Keyboard, Monitor, Wifi, Server, Smartphone, Headphones } from "lucide-react";
import { Card } from "@/components/ui/card";

const Categories = () => {
  const categories = [
    { icon: Laptop, name: "Laptops", count: "234" },
    { icon: HardDrive, name: "Hardware", count: "567" },
    { icon: Keyboard, name: "Acessórios", count: "891" },
    { icon: Monitor, name: "Monitores", count: "156" },
    { icon: Wifi, name: "Redes", count: "123" },
    { icon: Server, name: "Servidores", count: "45" },
    { icon: Smartphone, name: "Smartphones", count: "378" },
    { icon: Headphones, name: "Audio", count: "234" },
  ];

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Categorias Populares</h2>
            <p className="text-muted-foreground mt-2">Encontre o que procura rapidamente</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <Card
              key={category.name}
              className="p-6 flex flex-col items-center justify-center gap-3 hover:bg-card-hover hover:border-primary/50 transition-all cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <category.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-medium text-foreground">{category.name}</h3>
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
