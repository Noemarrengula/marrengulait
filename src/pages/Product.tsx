import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import MegaMenu from "@/components/MegaMenu";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Truck, 
  Shield, 
  RotateCcw,
  Store,
  MessageCircle,
  Share2,
  ChevronLeft,
  Check
} from "lucide-react";

const Product = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Mock data
  const product = {
    id: 1,
    name: "Laptop HP ProBook 450 G10 - Intel Core i7 13th Gen",
    price: "89.999,00",
    oldPrice: "105.000,00",
    discount: "-14%",
    rating: 4.5,
    reviews: 127,
    sold: 342,
    stock: 15,
    storeName: "TechStore Maputo",
    storeRating: 4.8,
    storeFollowers: "2.3k",
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800",
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800"
    ],
    specs: {
      "Processador": "Intel Core i7-1355U (13ª Geração)",
      "RAM": "16GB DDR4",
      "Armazenamento": "512GB SSD NVMe",
      "Tela": "15.6\" Full HD IPS",
      "Placa Gráfica": "Intel Iris Xe Graphics",
      "Sistema Operativo": "Windows 11 Pro",
      "Bateria": "Até 8 horas",
      "Peso": "1.79 kg",
      "Garantia": "12 meses"
    },
    features: [
      "Design profissional e portátil",
      "Processador de última geração",
      "Teclado retroiluminado",
      "Webcam HD com privacidade",
      "Conectividade USB-C",
      "Wi-Fi 6 e Bluetooth 5.2"
    ]
  };

  const reviews = [
    {
      id: 1,
      user: "João Silva",
      rating: 5,
      date: "2 dias atrás",
      comment: "Excelente laptop! Muito rápido e perfeito para trabalho. A entrega foi rápida.",
      verified: true,
      images: []
    },
    {
      id: 2,
      user: "Maria Costa",
      rating: 4,
      date: "1 semana atrás",
      comment: "Ótima qualidade, apenas a bateria poderia durar um pouco mais.",
      verified: true,
      images: []
    },
    {
      id: 3,
      user: "António Pereira",
      rating: 5,
      date: "2 semanas atrás",
      comment: "Melhor compra que fiz este ano. Recomendo totalmente!",
      verified: true,
      images: []
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <MegaMenu />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Início</Link>
            <ChevronLeft className="h-4 w-4 rotate-180" />
            <Link to="/" className="hover:text-foreground transition-colors">Computadores</Link>
            <ChevronLeft className="h-4 w-4 rotate-180" />
            <span className="text-foreground">Laptops</span>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 animate-slide-up">
            {/* Gallery */}
            <div>
              <div className="sticky top-24">
                <div className="aspect-square bg-secondary rounded-lg overflow-hidden mb-4">
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
                        selectedImage === index ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="flex items-start gap-2 mb-2">
                <Badge className="bg-primary">{product.discount}</Badge>
                <Badge variant="outline">Em Stock</Badge>
              </div>

              <h1 className="text-3xl font-bold text-foreground mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{product.rating}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-sm text-muted-foreground">{product.reviews} Avaliações</span>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-sm text-muted-foreground">{product.sold} Vendidos</span>
              </div>

              <div className="bg-gradient-to-br from-secondary/50 to-secondary/30 p-6 rounded-lg mb-6 border border-primary/20">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-primary">{product.price} MZN</span>
                  <span className="text-xl text-muted-foreground line-through">{product.oldPrice} MZN</span>
                </div>
                <p className="text-sm text-muted-foreground">IVA incluído · Envio grátis</p>
              </div>

              {/* Store Info */}
              <Card className="p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Store className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{product.storeName}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-primary text-primary" />
                        <span>{product.storeRating}</span>
                        <span>·</span>
                        <span>{product.storeFollowers} seguidores</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4 mr-2" />
                    Seguir
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" size="sm">
                    <Store className="h-4 w-4 mr-2" />
                    Ver Loja
                  </Button>
                  <Button variant="outline" className="flex-1" size="sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                </div>
              </Card>

              {/* Quantity and Actions */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Quantidade:</span>
                  <div className="flex items-center border border-border rounded">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="px-4">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    >
                      +
                    </Button>
                  </div>
                  <span className="text-sm text-muted-foreground">{product.stock} disponíveis</span>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 h-12 text-lg bg-gradient-to-r from-primary to-primary-glow hover:scale-105 transition-all shadow-lg">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Adicionar ao Carrinho
                  </Button>
                  <Button variant="outline" size="icon" className="h-12 w-12 hover:bg-primary/10 hover:border-primary transition-all">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-12 w-12 hover:bg-primary/10 hover:border-primary transition-all">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="space-y-3 border border-border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Envio Grátis</p>
                    <p className="text-sm text-muted-foreground">Entrega em 2-5 dias úteis</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Garantia de 12 meses</p>
                    <p className="text-sm text-muted-foreground">Assistência técnica autorizada</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <RotateCcw className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Devolução em 7 dias</p>
                    <p className="text-sm text-muted-foreground">Reembolso garantido</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="description" className="mb-8">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="description">Descrição</TabsTrigger>
              <TabsTrigger value="specs">Especificações</TabsTrigger>
              <TabsTrigger value="reviews">Avaliações ({product.reviews})</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Descrição do Produto</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  O HP ProBook 450 G10 é o laptop perfeito para profissionais que exigem desempenho,
                  portabilidade e segurança. Equipado com o mais recente processador Intel Core i7 de
                  13ª geração, este laptop oferece poder de processamento excepcional para multitarefas
                  e aplicações exigentes.
                </p>
                <h3 className="text-xl font-semibold mb-3">Características Principais</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </TabsContent>

            <TabsContent value="specs" className="mt-6">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Especificações Técnicas</h2>
                <div className="grid gap-4">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex border-b border-border pb-3 last:border-0">
                      <span className="font-medium w-48">{key}</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Avaliações de Clientes</h2>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-primary text-primary" />
                        <span className="text-2xl font-bold">{product.rating}</span>
                      </div>
                      <span className="text-muted-foreground">baseado em {product.reviews} avaliações</span>
                    </div>
                  </div>
                  <Button>Escrever Avaliação</Button>
                </div>

                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-border pb-6 last:border-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{review.user}</span>
                            {review.verified && (
                              <Badge variant="outline" className="text-xs">
                                <Check className="h-3 w-3 mr-1" />
                                Verificado
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < review.rating ? "fill-primary text-primary" : "text-muted"}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Product;
