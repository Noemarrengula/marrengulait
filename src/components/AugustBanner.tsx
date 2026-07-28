import { ArrowRight, Snowflake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAdminSettings } from "@/hooks/useAdminSettings";

const AugustBanner = () => {
  const navigate = useNavigate();
  const { settings } = useAdminSettings();

  if (!settings.showAugustBanner) return null;

  return (
    <section className="relative w-full bg-white">
      <div className="relative w-full mx-auto" style={{ maxWidth: '1400px' }}>
        {/* Banner image — native aspect ratio */}
        <img
          src="/assets/banner-agosto.png"
          alt="Ofertas de Agosto — Marrengula-IT"
          width={1913}
          height={822}
          className="w-full h-auto block"
        />

        {/* CTA overlay — bottom-right corner */}
        <div className="absolute bottom-4 right-4 md:bottom-6 md:right-8 flex items-center gap-2">
          <Button
            onClick={() => navigate('/produtos?promo=true')}
            className="bg-[#FF3131] hover:bg-[#E02D2D] text-white font-bold px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <Snowflake className="w-4 h-4" />
            Ver Ofertas
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AugustBanner;
