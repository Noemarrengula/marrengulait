import { ChevronDown, Laptop, HardDrive, Keyboard, Wifi, ShoppingBag, Wrench, Store, Zap, Cpu, Smartphone, Camera, Radio, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const MegaMenu = () => {
  const navigate = useNavigate();
  
  const menuItems = [
    {
      title: "Computadores",
      icon: Laptop,
      link: "/computadores",
      items: ["Laptops", "Desktops", "Workstations", "All-in-One", "Mini PCs"]
    },
    {
      title: "Hardware",
      icon: HardDrive,
      link: "/armazenamento",
      items: ["SSDs", "HDDs", "Pendrives", "Cartões de Memória", "NAS"]
    },
    {
      title: "Periféricos",
      icon: Keyboard,
      link: "/perifericos",
      items: ["Teclados", "Ratos", "Headsets", "Monitores", "Webcams", "Hubs USB"]
    },
    {
      title: "Redes",
      icon: Wifi,
      link: "/redes",
      items: ["Routers", "Switches", "Cabos", "Segurança", "Access Points"]
    },
    {
      title: "CCTV",
      icon: Camera,
      link: "/kit-cctv",
      items: ["Câmaras", "Kits", "Gravadores", "Acessórios"]
    },
    {
      title: "Switches",
      icon: Zap,
      link: "/switches",
      items: ["Gerenciáveis", "Não-Gerenciáveis", "PoE", "Industriais"]
    },
    {
      title: "Automação & IA",
      icon: Brain,
      link: "/automacao-ia",
      items: ["IoT", "Automação", "Machine Learning", "Chatbots"]
    },
  ];

  // Validação dos dados
  if (!Array.isArray(menuItems) || menuItems.length === 0) {
    console.error("MegaMenu: menuItems inválido");
    return null;
  }

  try {
    return (
    <div className="border-b border-border/50 bg-secondary/30">
      <div className="container mx-auto px-4">
        <NavigationMenu className="max-w-full w-full justify-start">
          <NavigationMenuList className="flex-wrap gap-2">
            {menuItems.map((menu) => {
              // Validação de cada item do menu
              if (!menu || !menu.title || !menu.icon) {
                console.error("MegaMenu: item de menu inválido", menu);
                return null;
              }
              
              return (
                <NavigationMenuItem key={menu.title}>
                  {menu.link ? (
                    <NavigationMenuLink onClick={() => navigate(menu.link!)} className="px-4 py-2 hover:bg-secondary rounded-md transition-colors flex items-center gap-2 cursor-pointer">
                      <menu.icon className="h-4 w-4" />
                      {menu.title}
                    </NavigationMenuLink>
                  ) : (
                    <>
                      <NavigationMenuTrigger className="bg-transparent hover:bg-secondary">
                        <menu.icon className="h-4 w-4 mr-2" />
                        {menu.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="w-[400px] p-4">
                          <div className="grid grid-cols-2 gap-2">
                            {Array.isArray(menu.items) && menu.items.map((item) => {
                              if (menu.title === "CCTV") {
                                const cctvLinks: Record<string, string> = {
                                  "Câmaras": "/produtos?search=camera",
                                  "Kits": "/kit-cctv",
                                  "Gravadores": "/produtos?search=nvr",
                                  "Acessórios": "/produtos?search=cctv"
                                };
                                return (
                                  <NavigationMenuLink
                                    key={item}
                                    onClick={() => navigate(cctvLinks[item] || `/produtos?search=${item.toLowerCase()}`)}
                                    className="block p-3 rounded-md hover:bg-secondary transition-colors cursor-pointer"
                                  >
                                    <span className="text-sm font-medium">{item}</span>
                                  </NavigationMenuLink>
                                );
                              }
                              return (
                                <NavigationMenuLink
                                  key={item}
                                  onClick={() => navigate(`/produtos?search=${item.toLowerCase()}`)}
                                  className="block p-3 rounded-md hover:bg-secondary transition-colors cursor-pointer"
                                >
                                  <span className="text-sm font-medium">{item}</span>
                                </NavigationMenuLink>
                              );
                            })}
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </>
                  )}
                </NavigationMenuItem>
              );
            })}
            
            <NavigationMenuItem>
              <NavigationMenuLink onClick={() => navigate('/sobre')} className="px-4 py-2 hover:bg-secondary rounded-md transition-colors flex items-center gap-2 cursor-pointer">
                <Store className="h-4 w-4" />
                Sobre Nós
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink onClick={() => navigate('/produtos')} className="px-4 py-2 hover:bg-secondary rounded-md transition-colors flex items-center gap-2 cursor-pointer">
                <ShoppingBag className="h-4 w-4" />
                Loja de Material
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink onClick={() => navigate('/servicos')} className="px-4 py-2 hover:bg-secondary rounded-md transition-colors flex items-center gap-2 cursor-pointer">
                <Wrench className="h-4 w-4" />
                Serviços de TI
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink onClick={() => navigate('/monte-seu-pc')} className="px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 rounded-md transition-colors flex items-center gap-2 cursor-pointer border border-primary/20">
                <Cpu className="h-4 w-4 text-primary" />
                <span className="font-semibold text-primary">Monte Seu PC</span>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink onClick={() => navigate('/eletronicos')} className="px-4 py-2 bg-gradient-to-r from-[#FF3131]/10 to-pink-500/10 hover:from-[#FF3131]/20 hover:to-pink-500/20 rounded-md transition-colors flex items-center gap-2 cursor-pointer border border-[#FF3131]/20">
                <Smartphone className="h-4 w-4 text-[#FF3131]" />
                <span className="font-semibold text-[#FF3131]">Eletrônicos & IoT</span>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink onClick={() => navigate('/celulares')} className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 rounded-md transition-colors flex items-center gap-2 cursor-pointer border border-blue-500/20">
                <Smartphone className="h-4 w-4 text-blue-500" />
                <span className="font-semibold text-blue-500">Smartphones</span>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink onClick={() => navigate('/produtos?search=radio')} className="px-4 py-2 bg-gradient-to-r from-orange-500/10 to-amber-500/10 hover:from-orange-500/20 hover:to-amber-500/20 rounded-md transition-colors flex items-center gap-2 cursor-pointer border border-orange-500/20">
                <Radio className="h-4 w-4 text-orange-500" />
                <span className="font-semibold text-orange-500">Walkie Talkie</span>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink onClick={() => navigate('/produtos?search=n8n')} className="px-4 py-2 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 hover:from-purple-500/20 hover:to-indigo-500/20 rounded-md transition-colors flex items-center gap-2 cursor-pointer border border-purple-500/20">
                <Brain className="h-4 w-4 text-purple-500" />
                <span className="font-semibold text-purple-500">IA & Automação</span>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink onClick={() => navigate('/servicos-ti')} className="px-4 py-2 bg-gradient-to-r from-green-500/10 to-teal-500/10 hover:from-green-500/20 hover:to-teal-500/20 rounded-md transition-colors flex items-center gap-2 cursor-pointer border border-green-500/20">
                <Wrench className="h-4 w-4 text-green-500" />
                <span className="font-semibold text-green-500">Serviços TI</span>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink onClick={() => navigate('/produtos')} className="px-4 py-2 hover:bg-secondary rounded-md transition-colors flex items-center gap-2 cursor-pointer">
                <Store className="h-4 w-4" />
                Marketplace
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink onClick={() => navigate('/produtos?promo=true')} className="px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-md transition-colors flex items-center gap-2 text-primary cursor-pointer">
                <Zap className="h-4 w-4" />
                Promoções
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
    );
  } catch (error) {
    console.error("MegaMenu: Erro ao renderizar", error);
    return (
      <div className="border-b border-border/50 bg-secondary/30">
        <div className="container mx-auto px-4 py-2">
          <p className="text-sm text-muted-foreground">Menu temporariamente indisponível</p>
        </div>
      </div>
    );
  }
};

export default MegaMenu;
