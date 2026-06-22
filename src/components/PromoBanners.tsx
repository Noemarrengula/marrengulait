import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Zap, Percent, Gift, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  discount?: string;
  image: string;
  gradient: string;
  icon: React.ReactNode;
  cta: string;
  link: string;
}

const PromoBanners = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners: Banner[] = [
    {
      id: 1,
      title: "BLACK FRIDAY",
      subtitle: "Até 70% OFF em Hardware",
      discount: "70%",
      image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1200&q=80",
      gradient: "from-red-600 via-red-500 to-orange-500",
      icon: <Zap className="w-8 h-8" />,
      cta: "Aproveitar Agora",
      link: "/produtos?category=Hardware"
    },
    {
      id: 2,
      title: "SUPER OFERTA",
      subtitle: "Notebooks a partir de 45.000 MT",
      discount: "50%",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80",
      gradient: "from-blue-600 via-blue-500 to-cyan-500",
      icon: <Percent className="w-8 h-8" />,
      cta: "Ver Ofertas",
      link: "/produtos?category=Laptops"
    },
    {
      id: 3,
      title: "FRETE GRÁTIS",
      subtitle: "Em compras acima de 5.000 MT",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
      gradient: "from-green-600 via-green-500 to-emerald-500",
      icon: <Gift className="w-8 h-8" />,
      cta: "Comprar Agora",
      link: "/produtos"
    },
    {
      id: 4,
      title: "LANÇAMENTO",
      subtitle: "RTX 4090 - O Poder Supremo",
      discount: "NEW",
      image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=1200&q=80",
      gradient: "from-purple-600 via-purple-500 to-pink-500",
      icon: <TrendingUp className="w-8 h-8" />,
      cta: "Conhecer",
      link: "/produtos?search=RTX"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden group">
      {/* Banners */}
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={cn(
            "absolute inset-0 transition-all duration-700 ease-in-out",
            index === currentSlide ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
          )}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className={cn("absolute inset-0 bg-gradient-to-r opacity-90", banner.gradient)} />
          </div>

          {/* Content */}
          <div className="relative h-full container mx-auto px-4 flex items-center">
            <div className="max-w-2xl text-white animate-in slide-in-from-left duration-700">
              {/* Icon */}
              <div className="mb-4 animate-bounce-subtle">
                {banner.icon}
              </div>

              {/* Title */}
              <h2 className="text-5xl md:text-7xl font-black mb-4 tracking-tight">
                {banner.title}
              </h2>

              {/* Discount Badge */}
              {banner.discount && (
                <div className="inline-block bg-white text-black px-6 py-3 rounded-full text-2xl font-bold mb-4 animate-pulse-glow">
                  {banner.discount === "NEW" ? "🆕 NOVO" : `${banner.discount} OFF`}
                </div>
              )}

              {/* Subtitle */}
              <p className="text-xl md:text-2xl mb-8 font-medium">
                {banner.subtitle}
              </p>

              {/* CTA Button */}
              <Button
                size="lg"
                onClick={() => navigate(banner.link)}
                className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-6 rounded-full font-bold shadow-2xl hover:scale-110 transition-all"
              >
                {banner.cta} →
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all"
      >
        <ChevronLeft className="w-8 h-8" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all"
      >
        <ChevronRight className="w-8 h-8" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((banner, index) => (
          <button
            key={banner.id}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all",
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default PromoBanners;
