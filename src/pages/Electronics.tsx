import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cpu, Smartphone, Zap, Wifi, Radio, Gauge } from "lucide-react";

const Electronics = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("arduino");

  const arduinoProducts = [
    { id: 1, name: "Arduino Uno R3", price: "2.500", image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=400", specs: "ATmega328P, 14 I/O digitais" },
    { id: 2, name: "Arduino Mega 2560", price: "4.200", image: "https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=400", specs: "ATmega2560, 54 I/O digitais" },
    { id: 3, name: "Arduino Nano", price: "1.800", image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=400", specs: "Compacto, ATmega328" },
    { id: 4, name: "ESP32 DevKit", price: "3.500", image: "https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=400", specs: "WiFi + Bluetooth, Dual Core" },
    { id: 5, name: "Raspberry Pi 4", price: "12.500", image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=400", specs: "4GB RAM, Quad Core" },
    { id: 6, name: "NodeMCU ESP8266", price: "2.200", image: "https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=400", specs: "WiFi integrado, IoT" },
  ];

  const sensorsProducts = [
    { id: 7, name: "Sensor Ultrassônico HC-SR04", price: "450", image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=400", specs: "Distância 2-400cm" },
    { id: 8, name: "Sensor DHT22", price: "850", image: "https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=400", specs: "Temperatura e Umidade" },
    { id: 9, name: "Sensor PIR HC-SR501", price: "380", image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=400", specs: "Movimento/Presença" },
    { id: 10, name: "Módulo RFID RC522", price: "650", image: "https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=400", specs: "13.56MHz, NFC" },
    { id: 11, name: "Sensor de Gás MQ-2", price: "520", image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=400", specs: "Detecta fumaça e gases" },
    { id: 12, name: "Giroscópio MPU6050", price: "780", image: "https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=400", specs: "6 eixos, I2C" },
  ];

  const smartphonesProducts = [
    { id: 13, name: "Ver Todos os Smartphones", price: "A partir de 32.000", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400", specs: "Acesse nossa loja completa de celulares", link: "/celulares" },
  ];

  const categories = [
    { id: "arduino", name: "Arduino & IoT", icon: Cpu, products: arduinoProducts },
    { id: "sensors", name: "Sensores & Módulos", icon: Gauge, products: sensorsProducts },
    { id: "smartphones", name: "Smartphones", icon: Smartphone, products: smartphonesProducts },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="cyber-grid py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black mb-4">
              <span className="gradient-text">Eletrônicos & IoT</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Arduino, Sensores, Smartphones e muito mais
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 glass p-2">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white"
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.products.map((product) => (
                    <Card key={product.id} className="card-modern hover-lift overflow-hidden group">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                          Novo
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">{product.specs}</p>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold text-primary">
                              {product.price} MT
                            </span>
                          </div>
                          <Button
                            className="bg-gradient-to-r from-primary to-accent glow-primary"
                            onClick={() => navigate(`/produto/${product.id}`)}
                          >
                            Ver Detalhes
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Info Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <Card className="glass p-6 text-center">
              <Zap className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-bold text-lg mb-2">Entrega Rápida</h3>
              <p className="text-sm text-muted-foreground">
                Componentes eletrônicos entregues em 24-48h
              </p>
            </Card>
            
            <Card className="glass p-6 text-center">
              <Wifi className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-bold text-lg mb-2">Suporte Técnico</h3>
              <p className="text-sm text-muted-foreground">
                Ajuda com projetos Arduino e IoT
              </p>
            </Card>
            
            <Card className="glass p-6 text-center">
              <Radio className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-bold text-lg mb-2">Garantia Original</h3>
              <p className="text-sm text-muted-foreground">
                Produtos originais com garantia do fabricante
              </p>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Electronics;
