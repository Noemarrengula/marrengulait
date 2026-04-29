import { useRef, useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Brand {
  name: string;
  logo: string;
}

const brands: Brand[] = [
  { name: "HP", logo: "https://img.icons8.com/color/96/hp.png" },
  { name: "Dell", logo: "https://img.icons8.com/color/96/dell.png" },
  { name: "Lenovo", logo: "https://img.icons8.com/color/96/lenovo.png" },
  { name: "Asus", logo: "https://img.icons8.com/color/96/asus.png" },
  { name: "Samsung", logo: "https://img.icons8.com/color/96/samsung.png" },
  { name: "Logitech", logo: "https://img.icons8.com/color/96/logitech-g.png" },
  { name: "Cisco", logo: "https://img.icons8.com/color/96/cisco.png" },
  { name: "TP-Link", logo: "https://img.icons8.com/color/96/tplink.png" },
  { name: "Hikvision", logo: "https://img.icons8.com/color/96/hikvision.png" },
  { name: "Microsoft", logo: "https://img.icons8.com/color/96/microsoft.png" },
  { name: "Apple", logo: "https://img.icons8.com/color/96/mac-client.png" },
  { name: "AMD", logo: "https://img.icons8.com/color/96/amd.png" },
  { name: "Intel", logo: "https://img.icons8.com/color/96/intel.png" },
  { name: "Nvidia", logo: "https://img.icons8.com/color/96/nvidia.png" },
  { name: "Dahua", logo: "https://img.icons8.com/external-flat-icons-inmotus-design/67/external-dahua-cctv-flat-icons-inmotus-design.png" },
];

function BrandLogo({ name, logo }: { name: string; logo: string }) {
  const [hasError, setHasError] = useState(false);
  const handleError = useCallback(() => setHasError(true), []);

  if (hasError) {
    return (
      <div className="text-xs font-bold text-muted-foreground tracking-wider uppercase">
        {name}
      </div>
    );
  }

  return (
    <img
      src={logo}
      alt={name}
      className="max-w-full max-h-full object-contain grayscale transition-all group-hover:grayscale-0"
      loading="lazy"
      onError={handleError}
    />
  );
}

export default function BrandCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState({ left: false, right: true });

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowArrows({
      left: scrollLeft > 0,
      right: scrollLeft < scrollWidth - clientWidth - 10
    });
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -400 : 400,
      behavior: "smooth",
    });
    setTimeout(checkScroll, 300);
  };

  return (
    <section className="py-12 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.05),transparent_50%)]" />
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-foreground">
            Marcas <span className="gradient-text">Disponíveis</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Trabalhamos com as melhores marcas do mercado</p>
        </div>

        <div className="relative">
          {showArrows.left && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-card border border-border rounded-full shadow-md hover:bg-primary/5 hover:border-primary/30 transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-4 overflow-x-auto py-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {brands.map((brand, index) => (
              <div
                key={brand.name}
                className="flex-shrink-0 w-[120px] h-[70px] flex items-center justify-center p-3 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group grayscale hover:grayscale-0 animate-slide-up"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
              <BrandLogo name={brand.name} logo={brand.logo} />
              </div>
            ))}
          </div>

          {showArrows.right && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-card border border-border rounded-full shadow-md hover:bg-primary/5 hover:border-primary/30 transition-all"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
