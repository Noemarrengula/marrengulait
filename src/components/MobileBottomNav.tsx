import { Home, Search, Heart, ShoppingCart, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import { useSettings } from "@/context/SettingsContext";

interface NavItem {
  icon: typeof Home;
  label: string;
  href: string;
  badge?: number;
  requiresAuth?: boolean;
}

export function MobileBottomNav() {
  const location = useLocation();
  const { items } = useCart();
  const { user } = useAuth();
  const { wishlist } = useWishlist(user?.id);
  const { locale, currency } = useSettings();
  
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;
  
  const navItems: NavItem[] = [
    { icon: Home, label: "Início", href: "/" },
    { icon: Search, label: "Explorar", href: "/produtos" },
    { icon: Heart, label: "Favoritos", href: "/favoritos", badge: wishlistCount, requiresAuth: false },
    { icon: ShoppingCart, label: "Carrinho", href: "/carrinho", badge: cartCount },
    { icon: User, label: "Conta", href: user ? "/pedidos" : "/auth", requiresAuth: false },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-lg border-t border-border",
        "pb-safe"
      )}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== "/" && location.pathname.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={scrollToTop}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200",
                "min-w-[60px]",
                isActive 
                  ? "text-[#FF3131]" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon 
                  className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    isActive && "scale-110"
                  )} 
                  fill={isActive ? "currentColor" : "none"}
                />
                
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-[#FF3131] text-white rounded-full px-1 animate-in zoom-in duration-200">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              
              <span className={cn(
                "text-[10px] font-medium transition-all",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
              
              {isActive && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#FF3131] rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileBottomNav;
