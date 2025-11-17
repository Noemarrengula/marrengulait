import { ChevronDown, Laptop, HardDrive, Keyboard, Wifi, ShoppingBag, Wrench, Store, Zap } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const MegaMenu = () => {
  const menuItems = [
    {
      title: "Computadores",
      icon: Laptop,
      items: ["Laptops", "Desktops", "Workstations", "All-in-One", "Mini PCs"]
    },
    {
      title: "Hardware",
      icon: HardDrive,
      items: ["GPUs", "CPUs", "SSDs", "HDDs", "Motherboards", "RAM", "Fontes"]
    },
    {
      title: "Acessórios",
      icon: Keyboard,
      items: ["Teclados", "Ratos", "Headsets", "Monitores", "Webcams", "Hubs USB"]
    },
    {
      title: "Redes",
      icon: Wifi,
      items: ["Routers", "Switches", "Cabos", "Segurança", "Access Points"]
    },
  ];

  return (
    <div className="border-b border-border/50 bg-secondary/30">
      <div className="container mx-auto px-4">
        <NavigationMenu className="max-w-full w-full justify-start">
          <NavigationMenuList className="flex-wrap gap-2">
            {menuItems.map((menu) => (
              <NavigationMenuItem key={menu.title}>
                <NavigationMenuTrigger className="bg-transparent hover:bg-secondary">
                  <menu.icon className="h-4 w-4 mr-2" />
                  {menu.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[400px] p-4">
                    <div className="grid grid-cols-2 gap-2">
                      {menu.items.map((item) => (
                        <NavigationMenuLink
                          key={item}
                          className="block p-3 rounded-md hover:bg-secondary transition-colors"
                        >
                          <span className="text-sm font-medium">{item}</span>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
            
            <NavigationMenuItem>
              <NavigationMenuLink className="px-4 py-2 hover:bg-secondary rounded-md transition-colors flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Loja de Material
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink className="px-4 py-2 hover:bg-secondary rounded-md transition-colors flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Serviços de TI
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink className="px-4 py-2 hover:bg-secondary rounded-md transition-colors flex items-center gap-2">
                <Store className="h-4 w-4" />
                Marketplace
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink className="px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-md transition-colors flex items-center gap-2 text-primary">
                <Zap className="h-4 w-4" />
                Promoções
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default MegaMenu;
