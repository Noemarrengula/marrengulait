import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowRight, Star, Clock } from "lucide-react";

interface Deal {
  id: string;
  title: string;
  subtitle: string;
  discount: number;
  originalPrice: number;
  salePrice: number;
  image: string;
  endTime: Date;
  stockLeft: number;
  category: string;
  tag?: string;
}

const deals: Deal[] = [
  {
    id: "1",
    title: "Laptop HP ProBook 450 G8",
    subtitle: "Intel i5, 8GB RAM, 256GB SSD",
    discount: 25,
    originalPrice: 35000,
    salePrice: 26250,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
    endTime: new Date(Date.now() + 86400000 * 2),
    stockLeft: 12,
    category: "Laptops",
    tag: "Mais Vendido"
  },
  {
    id: "2",
    title: "Kit CCTV 4 Câmaras Hikvision",
    subtitle: "DVR + 4 Câmaras + Disco 1TB",
    discount: 30,
    originalPrice: 18000,
    salePrice: 12600,
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&h=300&fit=crop",
    endTime: new Date(Date.now() + 86400000 * 3),
    stockLeft: 5,
    category: "CCTV",
    tag: "Oferta Especial"
  },
  {
    id: "3",
    title: "Monitor Samsung 24\" FHD",
    subtitle: "IPS, 75Hz, HDMI + VGA",
    discount: 20,
    originalPrice: 12000,
    salePrice: 9600,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop",
    endTime: new Date(Date.now() + 86400000 * 1),
    stockLeft: 8,
    category: "Monitores"
  },
  {
    id: "4",
    title: "Router TP-Link AX3000",
    subtitle: "WiFi 6, Dual Band, MU-MIMO",
    discount: 15,
    originalPrice: 6500,
    salePrice: 5525,
    image: "https://images.unsplash.com/photo-1544197150-b98a46852258?w=400&h=300&fit=crop",
    endTime: new Date(Date.now() + 86400000 * 4),
    stockLeft: 20,
    category: "Redes"
  }
];

function CountdownTimer({ endTime }: { endTime: Date }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime.getTime() - now;

      if (distance < 0) {
        setTimeLeft("ENCERRADO");
        clearInterval(timer);
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return <span className="font-mono font-bold text-[#FF3131]">{timeLeft}</span>;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency: 'MZN',
    minimumFractionDigits: 0
  }).format(price);
}

export default function DailyDeals() {
  const navigate = useNavigate();
  const [activeDeal, setActiveDeal] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveDeal((prev) => (prev + 1) % deals.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 cyber-grid relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF3131]/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gradient-to-r from-[#FF3131] to-[#FF5555] text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-[#FF3131]/20">
              <Zap className="w-5 h-5 animate-pulse" />
              OFERTAS DO DIA
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <CountdownTimer endTime={deals[activeDeal].endTime} />
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/produtos?promo=true')}
            className="hover:bg-primary hover:text-white transition-colors"
          >
            Ver Todas <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.map((deal, index) => (
            <div
              key={deal.id}
              onClick={() => navigate(`/produto/${deal.id}`)}
              className={`cursor-pointer group transition-all duration-300 animate-slide-up ${
                index === activeDeal ? "scale-105" : "opacity-90 hover:opacity-100"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`relative bg-card rounded-lg border-2 overflow-hidden transition-all ${
                index === activeDeal ? "border-primary shadow-xl shadow-primary/10" : "border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
              }`}>
                {/* Discount Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <Badge className="bg-[#FF3131] text-white">
                    -{deal.discount}%
                  </Badge>
                </div>

                {/* Tag */}
                {deal.tag && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge className="bg-yellow-500 text-black flex items-center gap-1">
                      <Star className="w-3 h-3" /> {deal.tag}
                    </Badge>
                  </div>
                )}

                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-muted">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-4">
                  <span className="text-xs text-primary font-medium">{deal.category}</span>
                  <h3 className="font-semibold text-sm mt-1 mb-1 line-clamp-1 text-foreground">{deal.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{deal.subtitle}</p>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xl font-bold text-[#FF3131]">
                      {formatPrice(deal.salePrice)}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(deal.originalPrice)}
                    </span>
                  </div>

                  {/* Stock Progress */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Restam {deal.stockLeft}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#FF3131] to-[#FF5555] rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((deal.stockLeft / 20) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* CTA */}
                  <Button
                    className="w-full mt-4 bg-gradient-to-r from-[#FF3131] to-[#FF5555] hover:opacity-90 text-white text-sm shadow-lg shadow-[#FF3131]/20 hover:shadow-xl hover:shadow-[#FF3131]/30 hover:scale-105 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/produto/${deal.id}`);
                    }}
                  >
                    <Zap className="w-4 h-4 mr-2" /> Comprar Agora
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {deals.map((deal, index) => (
            <button
              key={deal.id}
              onClick={() => setActiveDeal(index)}
              className={`rounded-full transition-all ${
                index === activeDeal ? "w-8 h-3 bg-[#FF3131]" : "w-3 h-3 bg-muted hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
