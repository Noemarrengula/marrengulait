import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Camera, 
  Home, 
  Building, 
  Warehouse,
  ChevronRight,
  Check,
  Wifi,
  Eye,
  Smartphone,
  Shield,
  DollarSign,
  Truck,
  Clock
} from "lucide-react";

interface CameraPosition {
  id: number;
  x: number;
  y: number;
  label: string;
  type: "entrada" | "janela" | "garagem" | "sala" | "quarto" | "cozinha" | "quintal";
}

interface Tip {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const CCTVTutorial = () => {
  const [activeSection, setActiveSection] = useState<"intro" | "tipos" | "posicionamento" | "calculadora">("intro");
  const [phone, setPhone] = useState("");

  const sections = [
    { id: "intro", label: "Introdução", icon: <Shield className="h-4 w-4" /> },
    { id: "tipos", label: "Tipos de Câmaras", icon: <Camera className="h-4 w-4" /> },
    { id: "posicionamento", label: "Onde Colocar", icon: <Home className="h-4 w-4" /> },
    { id: "calculadora", label: "Calculadora", icon: <DollarSign className="h-4 w-4" /> },
  ];

  const cameraTypes = [
    {
      name: "Bullet",
      image: "https://www.securitywholesalers.com.au/wp-content/uploads/2024/01/2CD2067G2H.png",
      description: "Forma cilíndrica, ideal para exterior",
      pros: ["Resistente às condições climáticas", "Longo alcance", "Fácil instalação"],
      cons: ["Visão limitada a um ângulo", "Mais visível"],
      bestFor: "Entradas, estacionamentos, muros",
      priceRange: "4.500 - 15.000 MT"
    },
    {
      name: "Dome",
      image: "https://zicaigrupo.com/wp-content/uploads/2025/03/311322068.jpg",
      description: "Forma de domo, design discreto",
      pros: ["Design estético e discreto", "Difícil de manipular", "360° opções"],
      cons: ["Instalação mais complexa", "Manutenção mais difícil"],
      bestFor: "Interior, lojas, escritórios",
      priceRange: "6.000 - 18.000 MT"
    },
    {
      name: "PTZ",
      image: "https://cctv-direct.co.za/cdn/shop/files/26_45291cd0-c243-42c4-ae79-d41079402d6a.png?v=1769677117",
      description: "Câmara com movimento remoto",
      pros: ["360° rotação", "Zoom óptico", "Seguimento automático"],
      cons: ["Preço mais elevado", "Requer conhecimento técnico"],
      bestFor: "Grandes áreas, vigilância avançada",
      priceRange: "25.000 - 80.000 MT"
    },
    {
      name: "WiFi/IP",
      image: "https://megateh.eu/files/products/00/51/28/c3n.jpg",
      description: "Sem fios, fácil instalação",
      pros: ["Sem cabos", "Instalação rápida", "App móvil"],
      cons: ["Depende do WiFi", "Pode haver interferências"],
      bestFor: "Casas, pequenos negócios",
      priceRange: "3.500 - 12.000 MT"
    }
  ];

  const placementTips: Tip[] = [
    {
      icon: <Home className="h-5 w-5" />,
      title: "Entrada Principal",
      description: "Cobre a porta da frente e área de chegada. Altura ideal: 2.5-3m"
    },
    {
      icon: <Building className="h-5 w-5" />,
      title: "Janelas Laterais",
      description: "Vigie janelas acessíveis. Evite reflexos do sol"
    },
    {
      icon: <Warehouse className="h-5 w-5" />,
      title: "Garagem",
      description: "Protecção contra roubo de veículos. Considere visão noturna"
    },
    {
      icon: <Eye className="h-5 w-5" />,
      title: "Jardim/Quintal",
      description: "Resistente às condições climáticas. Visão noturna essencial"
    }
  ];

  const cameraPositions: CameraPosition[] = [
    { id: 1, x: 20, y: 15, label: "Entrada", type: "entrada" },
    { id: 2, x: 80, y: 15, label: "Janela", type: "janela" },
    { id: 3, x: 50, y: 50, label: "Sala", type: "sala" },
    { id: 4, x: 20, y: 80, label: "Garagem", type: "garagem" },
    { id: 5, x: 80, y: 80, label: "Quintal", type: "quintal" },
  ];

  const getPositionColor = (type: string) => {
    const colors: Record<string, string> = {
      entrada: "bg-red-500",
      janela: "bg-orange-500",
      sala: "bg-blue-500",
      garagem: "bg-purple-500",
      quintal: "bg-green-500",
    };
    return colors[type] || "bg-gray-500";
  };

  const benefits = [
    { icon: <Shield className="h-6 w-6" />, title: "Proteção 24/7", desc: "Vigilância contínua do seu espaço" },
    { icon: <Smartphone className="h-6 w-6" />, title: "App Móvel", desc: "Veja tudo pelo celular" },
    { icon: <Clock className="h-6 w-6" />, title: "Gravação", desc: "Registre tudo para rever depois" },
    { icon: <Truck className="h-6 w-6" />, title: "Entrega Rápida", desc: "Receba em 24-48h" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#FF3131] to-[#FF5555] py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <Camera className="h-20 w-20 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Guia Completo de CCTV
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Tudo o que precisa saber sobre sistemas de vigilância para proteger a sua casa ou negócio
          </p>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-4">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "default" : "ghost"}
                className={activeSection === section.id ? "bg-[#FF3131]" : ""}
                onClick={() => setActiveSection(section.id as any)}
              >
                {section.icon}
                <span className="ml-2">{section.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Introduction */}
        {activeSection === "intro" && (
          <div className="space-y-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">O que é CCTV?</h2>
              <p className="text-lg text-muted-foreground">
                CCTV (Closed-Circuit Television) é um sistema de televisão onde as câmaras transmitem 
                sinais para um número limitado de monitores, diferente da televisão convencional. 
                É usado principalmente para vigilância e segurança.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {benefits.map((benefit, i) => (
                <Card key={i} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-[#FF3131]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#FF3131]">
                      {benefit.icon}
                    </div>
                    <h3 className="font-bold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA */}
            <Card className="bg-gradient-to-r from-[#FF3131] to-[#FF5555] text-white">
              <CardContent className="py-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Pronto para proteger o seu espaço?</h3>
                <p className="mb-6 opacity-90">
                  Solicite um orçamento gratuito ou monte o seu kit personalizado
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <Input
                    placeholder="Seu número de WhatsApp"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-white text-foreground"
                  />
                  <Button 
                    className="bg-white text-[#FF3131] hover:bg-gray-100"
                    onClick={() => window.open(`https://wa.me/258${phone}?text=Ola! Gostaria de saber mais sobre CCTV`)}
                  >
                    <Wifi className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Camera Types */}
        {activeSection === "tipos" && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center">Tipos de Câmaras</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {cameraTypes.map((camera, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-video bg-muted">
                    <img
                      src={camera.image}
                      alt={camera.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{camera.name}</span>
                      <Badge>{camera.priceRange}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{camera.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-green-600 mb-2">Vantagens:</h4>
                        <ul className="space-y-1">
                          {camera.pros.map((pro, j) => (
                            <li key={j} className="flex items-center gap-2 text-sm">
                              <Check className="h-4 w-4 text-green-500" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-600 mb-2">Desvantagens:</h4>
                        <ul className="space-y-1">
                          {camera.cons.map((con, j) => (
                            <li key={j} className="flex items-center gap-2 text-sm">
                              <span className="text-red-500">×</span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-muted rounded-lg p-3">
                      <span className="text-sm">
                        <strong>Melhor para:</strong> {camera.bestFor}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Positioning */}
        {activeSection === "posicionamento" && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center">Onde Colocar as Câmaras</h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* House Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Exemplo de Posicionamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border-2">
                    {/* House outline */}
                    <div className="absolute inset-4 border-4 border-gray-400 rounded-lg">
                      {/* Roof */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[60px] border-r-[60px] border-b-[40px] border-l-transparent border-r-transparent border-b-gray-300" />
                      
                      {/* Camera positions */}
                      {cameraPositions.map((pos) => (
                        <div
                          key={pos.id}
                          className="absolute"
                          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                        >
                          <div className={`w-8 h-8 ${getPositionColor(pos.type)} rounded-full flex items-center justify-center text-white transform -translate-x-1/2 -translate-y-1/2 animate-pulse`}>
                            <Camera className="h-4 w-4" />
                          </div>
                          <span className="absolute top-10 left-1/2 -translate-x-1/2 text-xs font-medium bg-white px-1 rounded shadow">
                            {pos.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {[
                      { type: "entrada", color: "bg-red-500" },
                      { type: "janela", color: "bg-orange-500" },
                      { type: "sala", color: "bg-blue-500" },
                      { type: "garagem", color: "bg-purple-500" },
                      { type: "quintal", color: "bg-green-500" },
                    ].map((item) => (
                      <Badge key={item.type} className={`${item.color} text-white`}>
                        {item.type}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Dicas de Posicionamento</h3>
                {placementTips.map((tip, i) => (
                  <Card key={i}>
                    <CardContent className="flex gap-4 pt-6">
                      <div className="w-10 h-10 bg-[#FF3131]/10 rounded-full flex items-center justify-center text-[#FF3131]">
                        {tip.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground">{tip.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Shield className="h-6 w-6 text-yellow-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">Importante</h4>
                    <p className="text-sm text-yellow-700">
                      Respeite a privacidade: não aponte câmaras para propriedades vizinhas ou áreas públicas 
                      sem autorização. Verifique as leis locais sobre vigilância.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Calculator */}
        {activeSection === "calculadora" && (
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Calculadora de Armazenamento</h2>
            <p className="text-muted-foreground mb-8">
              Use a nossa ferramenta para descobrir quanto espaço de armazenamento precisa
            </p>
            <Button 
              className="bg-[#FF3131] hover:bg-[#FF5555] text-lg px-8 py-6"
              onClick={() => window.location.href = "/calculadora-cctv"}
            >
              <Camera className="h-5 w-5 mr-2" />
              Abrir Calculadora
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CCTVTutorial;
