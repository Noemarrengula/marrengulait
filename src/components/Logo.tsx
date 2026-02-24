import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: "default" | "white" | "dark";
  animated?: boolean;
}

const Logo = ({ className, showText = true, variant = "default", animated = true }: LogoProps) => {
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

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Icon/Caricature */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("flex-shrink-0", animated && "animate-in fade-in duration-500")}
      >
        <style>
          {`
            @keyframes pulse-glow {
              0%, 100% { opacity: 0.1; }
              50% { opacity: 0.2; }
            }
            @keyframes chip-pulse {
              0%, 100% { opacity: 0.9; }
              50% { opacity: 1; }
            }
            @keyframes pin-blink {
              0%, 100% { opacity: 0.8; }
              50% { opacity: 0.4; }
            }
            .pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
            .chip-pulse { animation: chip-pulse 2s ease-in-out infinite; }
            .pin-blink { animation: pin-blink 1.5s ease-in-out infinite; }
          `}
        </style>
        {/* Background Circle with Gradient */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: colors.primary, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: colors.secondary, stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="chipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#60A5FA", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#3B82F6", stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        {/* Main Circle */}
        <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" className={animated ? "pulse-glow" : ""} opacity="0.1" />
        
        {/* Microchip Design */}
        <g transform="translate(10, 10)">
          {/* Chip Body */}
          <rect x="4" y="4" width="12" height="12" rx="1.5" fill="url(#chipGradient)" className={animated ? "chip-pulse" : ""} />
          
          {/* Chip Pins - Left */}
          <rect x="1" y="6" width="3" height="1.5" fill={colors.primary} className={animated ? "pin-blink" : ""} opacity="0.8" style={{ animationDelay: '0s' }} />
          <rect x="1" y="9" width="3" height="1.5" fill={colors.primary} className={animated ? "pin-blink" : ""} opacity="0.8" style={{ animationDelay: '0.2s' }} />
          <rect x="1" y="12" width="3" height="1.5" fill={colors.primary} className={animated ? "pin-blink" : ""} opacity="0.8" style={{ animationDelay: '0.4s' }} />
          
          {/* Chip Pins - Right */}
          <rect x="16" y="6" width="3" height="1.5" fill={colors.primary} className={animated ? "pin-blink" : ""} opacity="0.8" style={{ animationDelay: '0.6s' }} />
          <rect x="16" y="9" width="3" height="1.5" fill={colors.primary} className={animated ? "pin-blink" : ""} opacity="0.8" style={{ animationDelay: '0.8s' }} />
          <rect x="16" y="12" width="3" height="1.5" fill={colors.primary} className={animated ? "pin-blink" : ""} opacity="0.8" style={{ animationDelay: '1s' }} />
          
          {/* Chip Pins - Top */}
          <rect x="6" y="1" width="1.5" height="3" fill={colors.primary} className={animated ? "pin-blink" : ""} opacity="0.8" style={{ animationDelay: '0.3s' }} />
          <rect x="9" y="1" width="1.5" height="3" fill={colors.primary} className={animated ? "pin-blink" : ""} opacity="0.8" style={{ animationDelay: '0.5s' }} />
          <rect x="12" y="1" width="1.5" height="3" fill={colors.primary} className={animated ? "pin-blink" : ""} opacity="0.8" style={{ animationDelay: '0.7s' }} />
          
          {/* Chip Pins - Bottom */}
          <rect x="6" y="16" width="1.5" height="3" fill={colors.primary} className={animated ? "pin-blink" : ""} opacity="0.8" style={{ animationDelay: '0.9s' }} />
          <rect x="9" y="16" width="1.5" height="3" fill={colors.primary} className={animated ? "pin-blink" : ""} opacity="0.8" style={{ animationDelay: '1.1s' }} />
          <rect x="12" y="16" width="1.5" height="3" fill={colors.primary} className={animated ? "pin-blink" : ""} opacity="0.8" style={{ animationDelay: '1.3s' }} />
          
          {/* Inner Circuit Pattern */}
          <circle cx="10" cy="10" r="2" fill="white" className={animated ? "chip-pulse" : ""} opacity="0.9" />
          <path d="M 8 10 L 12 10 M 10 8 L 10 12" stroke="url(#chipGradient)" strokeWidth="0.8" className={animated ? "chip-pulse" : ""} />
        </g>

        {/* Decorative Tech Elements */}
        <circle cx="32" cy="8" r="1.5" fill={colors.primary} opacity="0.3" />
        <circle cx="8" cy="32" r="1.5" fill={colors.secondary} opacity="0.3" />
      </svg>

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
