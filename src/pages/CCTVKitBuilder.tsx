import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { useSettings } from "@/contexts/SettingsContext";
import { toast } from "sonner";
import { 
  Camera, 
  HardDrive, 
  Cable, 
  Monitor,
  ShoppingCart,
  Minus,
  Plus,
  Check,
  Shield,
  Truck,
  RotateCcw,
  Wifi,
  Eye,
  Wrench,
  MessageCircle
} from "lucide-react";

interface KitCamera {
  id: string;
  name: string;
  price: number;
  resolution: string;
  type: "bullet" | "dome" | "ptz";
  image: string;
  quantity: number;
}

interface KitOption {
  id: string;
  name: string;
  type: "dvr" | "nvr" | "hdd" | "cable" | "monitor";
  options: { name: string; price: number; spec: string }[];
  selected: number;
}

const CCTVKitBuilder = () => {
  const { addItem } = useCart();
  const { locale, currency, convertPrice } = useSettings();
  const [selectedCameras, setSelectedCameras] = useState<KitCamera[]>([]);
  const [phone, setPhone] = useState("");
  const [kitOptions, setKitOptions] = useState<KitOption>({
    id: "recorder",
    name: "Gravador",
    type: "nvr",
    options: [
      { name: "NVR 4 Canais 4K", price: 15000, spec: "4CH, 4K, 1HDD" },
      { name: "NVR 8 Canais 4K", price: 22000, spec: "8CH, 4K, 2HDD" },
      { name: "DVR 4 Canais 1080p", price: 8000, spec: "4CH, 1080p" },
    ],
    selected: 0,
  });
  const [hddOption, setHddOption] = useState({
    name: "HDD 1TB Surveillance",
    price: 3500,
    spec: "1TB, 24/7",
  });
  const [cableOption, setCableOption] = useState({
    name: "Cabo CAT6 100m",
    price: 2500,
    spec: "100m, UV resistant",
  });
  const [withInstallation, setWithInstallation] = useState(false);
  const [installationPrice, setInstallationPrice] = useState(0);
  const [showKit, setShowKit] = useState(false);

  const cameras: KitCamera[] = [
    {
      id: "cam-4mp",
      name: "Câmara 4MP Dome",
      price: 6500,
      resolution: "4MP",
      type: "dome",
      image: "https://zicaigrupo.com/wp-content/uploads/2025/03/311322068.jpg",
      quantity: 1,
    },
    {
      id: "cam-5mp",
      name: "Câmara 5MP Bullet ColorVu",
      price: 9500,
      resolution: "5MP",
      type: "bullet",
      image: "https://www.securitywholesalers.com.au/wp-content/uploads/2024/01/2CD2067G2H.png",
      quantity: 1,
    },
    {
      id: "cam-6mp",
      name: "Câmara 6MP ColorVu Pro",
      price: 12500,
      resolution: "6MP",
      type: "bullet",
      image: "https://www.securitywholesalers.com.au/wp-content/uploads/2024/01/2CD2067G2H.png",
      quantity: 1,
    },
    {
      id: "cam-wifi",
      name: "Câmara WiFi IP",
      price: 4500,
      resolution: "3MP",
      type: "dome",
      image: "https://megateh.eu/files/products/00/51/28/c3n.jpg",
      quantity: 1,
    },
  ];

  const addCamera = (camera: KitCamera) => {
    const existing = selectedCameras.find((c) => c.id === camera.id);
    if (existing) {
      setSelectedCameras(
        selectedCameras.map((c) =>
          c.id === camera.id ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      setSelectedCameras([...selectedCameras, { ...camera }]);
    }
    toast.success(`${camera.name} adicionada!`);
  };

  const removeCamera = (cameraId: string) => {
    const existing = selectedCameras.find((c) => c.id === cameraId);
    if (existing && existing.quantity > 1) {
      setSelectedCameras(
        selectedCameras.map((c) =>
          c.id === cameraId ? { ...c, quantity: c.quantity - 1 } : c
        )
      );
    } else {
      setSelectedCameras(selectedCameras.filter((c) => c.id !== cameraId));
    }
  };

  const getTotal = () => {
    const camerasTotal = selectedCameras.reduce(
      (acc, cam) => acc + cam.price * cam.quantity,
      0
    );
    const recorderTotal = kitOptions.options[kitOptions.selected].price;
    const baseTotal = camerasTotal + recorderTotal + hddOption.price + cableOption.price;
    
    // Calcular instalação: 1500MT por câmara + 3000MT base
    const numCameras = selectedCameras.reduce((acc, cam) => acc + cam.quantity, 0);
    const calculatedInstallation = numCameras > 0 ? 3000 + (numCameras * 1500) : 0;
    setInstallationPrice(calculatedInstallation);
    
    return withInstallation ? baseTotal + calculatedInstallation : baseTotal;
  };

  const getInstallationPrice = () => {
    const numCameras = selectedCameras.reduce((acc, cam) => acc + cam.quantity, 0);
    return numCameras > 0 ? 3000 + (numCameras * 1500) : 0;
  };

  const addKitToCart = () => {
    const totalCameras = selectedCameras.reduce(
      (acc, cam) => acc + cam.quantity,
      0
    );
    
    addItem({
      id: `kit-cctv-${Date.now()}`,
      title: `Kit CCTV ${totalCameras} Câmaras${withInstallation ? ' c/ Instalação' : ''}`,
      price: getTotal(),
      image: selectedCameras[0]?.image || "https://images.tcdn.com.br/img/img_prod/430365/kit_4_cameras_de_seguranca_intelbras_720p_1_megapixel_2_bullet_2_dome_1120_dvr_4_canais_hd_250gb_572_1_616243f803b3932e17a0c91803be4584.jpg",
    });
    
    toast.success("Kit CCTV adicionado ao carrinho!");
    setShowKit(true);
  };

  const getCameraIcon = (type: string) => {
    switch (type) {
      case "bullet":
        return <Camera className="h-8 w-8 text-[#FF3131]" />;
      case "dome":
        return <Eye className="h-8 w-8 text-[#FF3131]" />;
      case "ptz":
        return <Wifi className="h-8 w-8 text-[#FF3131]" />;
      default:
        return <Camera className="h-8 w-8 text-[#FF3131]" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#FF3131] to-[#FF5555] py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Monte seu Kit CCTV
          </h1>
          <p className="text-xl mb-6">
            Escolha as câmaras, gravador e acessórios para criar o sistema perfeito
          </p>
          <Badge className="bg-white text-[#FF3131] text-lg px-4 py-2">
            Instalação profissional disponível
          </Badge>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Camera Selection */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-6 w-6 text-[#FF3131]" />
                  Selecione as Câmaras
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {cameras.map((camera) => (
                    <div
                      key={camera.id}
                      className="border rounded-lg p-4 hover:border-[#FF3131] transition-colors"
                    >
                      <img
                        src={camera.image}
                        alt={camera.name}
                        className="w-full h-40 object-cover rounded-lg mb-3"
                      />
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{camera.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {camera.resolution}
                          </p>
                        </div>
                        <p className="font-bold text-[#FF3131]">
                          {convertPrice(camera.price).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                        </p>
                      </div>
                      <Button
                        className="w-full mt-3 bg-[#FF3131] hover:bg-[#FF5555]"
                        onClick={() => addCamera(camera)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recorder Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-6 w-6 text-[#FF3131]" />
                  Gravador (NVR/DVR)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {kitOptions.options.map((option, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        kitOptions.selected === index
                          ? "border-[#FF3131] bg-red-50"
                          : "hover:border-[#FF3131]"
                      }`}
                      onClick={() =>
                        setKitOptions({ ...kitOptions, selected: index })
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {kitOptions.selected === index && (
                            <Check className="h-5 w-5 text-[#FF3131]" />
                          )}
                          <div>
                            <h3 className="font-semibold">{option.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {option.spec}
                            </p>
                          </div>
                        </div>
                        <p className="font-bold">
                          {convertPrice(option.price).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Accessories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cable className="h-6 w-6 text-[#FF3131]" />
                  Acessórios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <HardDrive className="h-5 w-5 text-[#FF3131]" />
                        <span className="font-medium">Disco Rígido</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {hddOption.name} - {hddOption.spec}
                    </p>
                    <p className="font-bold">
                      {convertPrice(hddOption.price).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Cable className="h-5 w-5 text-[#FF3131]" />
                        <span className="font-medium">Cabo de Rede</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {cableOption.name} - {cableOption.spec}
                    </p>
                    <p className="font-bold">
                      {convertPrice(cableOption.price).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Kit Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumo do Kit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedCameras.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Selecione pelo menos uma câmara
                  </p>
                ) : (
                  <>
                    {selectedCameras.map((camera) => (
                      <div
                        key={camera.id}
                        className="flex items-center justify-between border-b pb-3"
                      >
                        <div className="flex items-center gap-3">
                          {getCameraIcon(camera.type)}
                          <div>
                            <p className="font-medium">{camera.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Qtd: {camera.quantity}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => removeCamera(camera.id)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">
                            {camera.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => addCamera(camera)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Gravador:</span>
                        <span>
                          {convertPrice(kitOptions.options[kitOptions.selected].price).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
                          {currency}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>HDD:</span>
                        <span>
                          {convertPrice(hddOption.price).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Cabo:</span>
                        <span>
                          {convertPrice(cableOption.price).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                        </span>
                      </div>
                    </div>

                    {/* Opção de Instalação */}
                    <div className="border-t pt-4 space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <Wrench className="h-5 w-5 text-[#FF3131]" />
                          <div>
                            <p className="font-medium">Instalação Profissional</p>
                            <p className="text-xs text-muted-foreground">
                              Inclui: cabos, configuração, teste
                            </p>
                          </div>
                        </div>
                        <Button
                          variant={withInstallation ? "default" : "outline"}
                          size="sm"
                          className={withInstallation ? "bg-[#FF3131]" : ""}
                          onClick={() => setWithInstallation(!withInstallation)}
                        >
                          {withInstallation ? <Check className="h-4 w-4" /> : "+"}
                        </Button>
                      </div>
                      {withInstallation && (
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Instalação ({selectedCameras.reduce((acc, c) => acc + c.quantity, 0)} câmaras):</span>
                          <span>+{convertPrice(getInstallationPrice()).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}</span>
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between text-xl font-bold">
                        <span>Total:</span>
                        <span className="text-[#FF3131]">
                          {convertPrice(getTotal()).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                        </span>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-[#FF3131] hover:bg-[#FF5555] py-6 text-lg"
                      onClick={addKitToCart}
                      disabled={selectedCameras.length === 0}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Adicionar Kit ao Carrinho
                    </Button>

                    {/* WhatsApp Button */}
                    <div className="space-y-3 pt-2">
                      <p className="text-center text-sm text-muted-foreground">ou</p>
                      <div className="space-y-2">
                        <Input
                          placeholder="Seu número WhatsApp"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="text-center"
                        />
                        <Button
                          variant="outline"
                          className="w-full border-green-500 text-green-600 hover:bg-green-50"
                          onClick={() => {
                            if (!phone) {
                              toast.error("Insira seu número de WhatsApp");
                              return;
                            }
                            const numCameras = selectedCameras.reduce((acc, c) => acc + c.quantity, 0);
                            const message = `🏠 Olá! Gostaria de um orçamento para CCTV:\n\n📹 Câmaras: ${numCameras}\n${withInstallation ? '✅ Com instalação profissional' : '❌ Sem instalação'}\n📍 Localização: Maputo, Moçambique\n\nPor favor, enviem-me um orçamento detalhado.`;
                            const cleanPhone = phone.replace(/\D/g, '');
                            window.open(`https://wa.me/258${cleanPhone}?text=${encodeURIComponent(message)}`, "_blank");
                          }}
                        >
                          <MessageCircle className="h-5 w-5 mr-2" />
                          Solicitar Orçamento WhatsApp
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {showKit && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="font-medium text-green-700">
                      Kit adicionado ao carrinho!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="mt-4">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-[#FF3131]" />
                    <span className="text-sm">Garantia 12 meses</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-[#FF3131]" />
                    <span className="text-sm">Entrega em 24-48h</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <RotateCcw className="h-5 w-5 text-[#FF3131]" />
                    <span className="text-sm">Devolução 7 dias</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-[#FF3131]" />
                    <span className="text-sm">Suporte técnico incluído</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CCTVKitBuilder;
