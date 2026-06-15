import { cn } from "@/lib/utils";
import logoImage from "@/assets/marrengula-logo.png";
import { useState } from "react";

interface LogoProps {
  className?: string;
  imageClassName?: string;
  showText?: boolean;
  variant?: "default" | "white" | "dark";
  animated?: boolean;
}

const Logo = ({ className, imageClassName, showText = true, variant = "default", animated = true }: LogoProps) => {
  const [imageError, setImageError] = useState(false);
  
  const getColors = () => {
    switch (variant) {
      case "white":
        return { primary: "#ffffff", secondary: "#f0f0f0", text: "#ffffff" };
      case "dark":
        return { primary: "#000000", secondary: "#333333", text: "#000000" };
      default:
        return { primary: "hsl(var(--primary))", secondary: "hsl(var(--accent))", text: "currentColor" };
    }
  };

  const colors = getColors();
  const sizeClass = imageClassName ?? "h-10 w-10";

  return (
    <div className={cn("flex items-center gap-2", className)}>
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
          
          {/* M em rosa (#FF5577) - canto inferior esquerdo */}
          <g>
            <path d="M 50 160 L 50 80 L 70 110 L 90 80 L 90 160" fill="none" stroke="#FF5577" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
          
          {/* T em preto (#313241) - canto superior direito */}
          <g>
            <path d="M 110 60 L 150 60 M 130 60 L 130 140" fill="none" stroke="#313241" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
        </svg>
      )}

      {/* Text Logo */}
      {showText && (
        <div className={cn("flex flex-col leading-none", animated && "animate-in slide-in-from-left duration-700")}>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent animate-gradient">
            MarrengulaIT
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
