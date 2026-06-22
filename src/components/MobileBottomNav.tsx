import { memo } from "react";
import { Home, Search, Heart, ShoppingCart, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";

interface NavItem {
  icon: typeof Home;
  label: string;
  href: string;
  badge?: number;
}

export function MobileBottomNav() {
  const location = useLocation();
  const { items } = useCart();
  const { user } = useAuth();
  const { wishlist } = useWishlist(user?.id);
  
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;
  
  const navItems: NavItem[] = [
    { icon: Home, label: "Início", href: "/" },
    { icon: Search, label: "Explorar", href: "/produtos" },
    { icon: Heart, label: "Favoritos", href: "/favoritos", badge: wishlistCount },
    { icon: ShoppingCart, label: "Carrinho", href: "/carrinho", badge: cartCount },
    { icon: User, label: "Conta", href: user ? "/pedidos" : "/auth" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 md:hidden",
        "bg-background/95 backdrop-blur-lg border-t border-border",
        "pb-env-safe"
      )}
      style={{
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
      }}
    >
      <div className="flex items-center justify-around h-14 px-1">
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
                "relative flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-lg transition-all duration-200",
                "min-w-[56px] flex-shrink-0",
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
                />
                
                {item.badge !== undefined && item.badge > 0 && (
                  <span 
                    className={cn(
                      "absolute -top-1 -right-1.5",
                      "min-w-[16px] h-4 flex items-center justify-center",
                      "text-[9px] font-bold bg-[#FF3131] text-white rounded-full px-0.5",
                      "animate-in zoom-in duration-200"
                    )}
                  >
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              
              <span className={cn(
                "text-[10px] font-medium leading-tight",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
              
              {isActive && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#FF3131] rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default memo(MobileBottomNav);
