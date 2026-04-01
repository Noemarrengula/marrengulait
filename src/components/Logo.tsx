import { cn } from "@/lib/utils";
import logoImage from "@/assets/marrengula-logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LogoProps {
  className?: string;
  imageClassName?: string;
  showText?: boolean;
  variant?: "default" | "white" | "dark";
  animated?: boolean;
  asLink?: boolean;
}

const Logo = ({ className, imageClassName, showText = true, variant = "default", animated = true, asLink = false }: LogoProps) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (asLink) {
      navigate('/');
    }
  };
  
  const getColors = () => {
    switch (variant) {
      case "white":
        return { primary: "#ffffff", secondary: "#f0f0f0", text: "#ffffff" };
      case "dark":
        return { primary: "#000000", secondary: "#333333", text: "#000000" };
      default:
        return { primary: "#FF3131", secondary: "#FF5555", text: "currentColor" };
    }
  };

  const colors = getColors();
  const sizeClass = imageClassName ?? "h-10 w-10";

  return (
    <div className={cn("flex items-center gap-2", className)} onClick={handleClick} role={asLink ? "link" : undefined} style={{ cursor: 'pointer' }}>
      {!imageError ? (
        <img
          src={logoImage}
          alt="Marrengula IT logo"
          className={cn(
            "flex-shrink-0 rounded-md object-contain",
            animated && "animate-in fade-in duration-500",
            sizeClass
          )}
          onError={() => {
            console.error("Logo image failed to load, showing fallback");
            setImageError(true);
          }}
        />
      ) : (
        /* SVG logo: M (rosa) + T (preto) em quadrado com cantos arredondados */
        <svg 
          className={cn(
            "flex-shrink-0",
            animated && "animate-in fade-in duration-500",
            sizeClass
          )}
          viewBox="0 0 200 200" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Fundo branco com cantos arredondados e borda preta */}
          <rect x="20" y="20" width="160" height="160" rx="30" ry="30" fill="#ffffff" stroke="#313241" strokeWidth="15"/>
          
          {/* M em vermelho (#FF3131) - canto inferior esquerdo */}
          <g>
            <path d="M 50 160 L 50 80 L 70 110 L 90 80 L 90 160" fill="none" stroke="#FF3131" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
          
          {/* T em preto (#000000) - canto superior direito */}
          <g>
            <path d="M 110 60 L 150 60 M 130 60 L 130 140" fill="none" stroke="#000000" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
        </svg>
      )}

      {/* Text Logo */}
      {showText && (
        <div className={cn("flex flex-col leading-none", animated && "animate-in slide-in-from-left duration-700")}>
          <span className="text-xl font-bold tracking-tight text-[#FF3131] drop-shadow-[0_2px_4px_rgba(255,49,49,0.3)]">
            Marrengula<span className="font-black">IT</span>
          </span>
          <span className={cn("text-[10px] text-muted-foreground font-medium tracking-wider uppercase", animated && "animate-in fade-in duration-1000 delay-300")}>
            Tech & Innovation
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
