import { User, Menu, Heart, LogOut, Settings, ShoppingBag, Phone, Mail, HelpCircle, Package, X, Home, ShoppingCart, Tag, Laptop, Smartphone, Wrench, Users, FileText } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ThemeToggle from "./ThemeToggle";
import CartButton from "@/components/CartButton";
import Logo from "@/components/Logo";
import SearchAutocomplete from "@/components/SearchAutocomplete";
import NotificationBell from "@/components/NotificationBell";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const { locale, currency, setLocale, setCurrency, isSystemPreference } = useSettings();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollAndNavigate = (path: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(path);
  };

  const mobileNavItems = [
    { icon: Home, label: 'Início', path: '/' },
    { icon: ShoppingCart, label: 'Produtos', path: '/produtos' },
    { icon: Smartphone, label: 'Smartphones', path: '/celulares' },
    { icon: Laptop, label: 'Electrónica', path: '/eletronicos' },
    { icon: Wrench, label: 'Serviços', path: '/servicos' },
    { icon: Tag, label: 'Afiliados', path: '/afiliados' },
    { icon: Users, label: 'Sobre Nós', path: '/sobre' },
  ].map(item => ({
    ...item,
    onClick: () => scrollAndNavigate(item.path)
  }));

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast({
          title: 'Erro ao fazer logout',
          description: error.message,
          variant: 'destructive'
        });
        return;
      }
      
      toast({
        title: 'Logout realizado!',
        description: 'Você foi desconectado com sucesso'
      });
      
      // Redirecionar para home após logout
      scrollAndNavigate('/');
    } catch (error) {
      toast({
        title: 'Erro inesperado',
        description: 'Tente novamente mais tarde',
        variant: 'destructive'
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      {/* Top Bar */}
      <div className="border-b border-border/50 bg-gradient-to-r from-[#FF3131]/5 via-transparent to-[#FF5555]/5">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm text-foreground/70">
            <div className="flex items-center gap-6">
              <a href="tel:+258864738133" className="flex items-center gap-1.5 hover:text-[#FF3131] transition-all hover:scale-105">
                <Phone className="h-3.5 w-3.5" />
                <span>+258 864738133</span>
              </a>
              <a href="mailto:marrengulait@gmail.com" className="flex items-center gap-1.5 hover:text-[#FF3131] transition-all hover:scale-105">
                <Mail className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">marrengulait@gmail.com</span>
              </a>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => scrollAndNavigate('/rastrear')} className="flex items-center gap-1.5 hover:text-[#FF3131] transition-all hover:scale-105 font-medium">
                <Package className="h-4 w-4" />
                <span className="hidden md:inline">Rastrear</span>
              </button>
              <button onClick={() => scrollAndNavigate('/sobre')} className="flex items-center gap-1.5 hover:text-[#FF3131] transition-all hover:scale-105 font-medium">
                <HelpCircle className="h-4 w-4" />
                <span className="hidden md:inline">Ajuda</span>
              </button>
              {/* currency menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="px-2">
                    {currency}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {['MT','USD','EUR','ZAR'].map(c => (
                    <DropdownMenuItem key={c} onClick={() => setCurrency(c)}>
                      {c}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {/* language menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="px-2 relative">
                    {locale === 'pt-MZ' ? '🇲🇿 PT' : locale === 'en-US' ? '🇺🇸 EN' : '🇪🇸 ES'}
                    {isSystemPreference && (
                      <span className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                    Idioma
                  </div>
                  <DropdownMenuItem onClick={() => setLocale('pt-MZ')}>
                    <span className="mr-2">🇲🇿</span> Português
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocale('en-US')}>
                    <span className="mr-2">🇺🇸</span> English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocale('es-MX')}>
                    <span className="mr-2">🇪🇸</span> Español
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="group relative">
            <div className="absolute inset-0 bg-[#FF3131]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 transition-all duration-300 group-hover:scale-105">
              <Logo showText={true} />
            </div>
          </Link>

          {/* Search Bar */}
          <SearchAutocomplete 
            className="flex-1 max-w-2xl"
            placeholder="Pesquisar produtos, categorias ou serviços..."
          />

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            {/* Favoritos */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-accent/10 hover:scale-110 transition-all group"
              onClick={() => scrollAndNavigate('/favoritos')}
              title="Favoritos"
            >
              <Heart className="h-5 w-5 group-hover:fill-red-500 group-hover:text-red-500 transition-all" />
            </Button>

            {/* Notificações */}
            <NotificationBell />
            
            {/* Carrinho */}
            <CartButton />
            
            {/* Menu do Usuário */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-accent/10 hover:scale-110 transition-all relative group">
                    <User className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background animate-pulse" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-effect">
                  <div className="px-2 py-1.5 text-sm font-semibold">
                    {user.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => scrollAndNavigate('/pedidos')} className="cursor-pointer">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Meus Pedidos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => scrollAndNavigate('/favoritos')} className="cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" />
                    Favoritos
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => scrollAndNavigate('/admin')} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Painel Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-accent/10 hover:scale-110 transition-all"
                onClick={() => scrollAndNavigate('/auth')}
                title="Entrar"
              >
                <User className="h-5 w-5" />
              </Button>
            )}
            
            {/* Menu Mobile */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden hover:bg-[#FF3131]/10 hover:text-[#FF3131] transition-all"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-background shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <Logo showText={true} />
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Navigation */}
            <nav className="p-4 space-y-1">
              {mobileNavItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    scrollAndNavigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full p-3 rounded-lg text-muted-foreground hover:text-[#FF3131] hover:bg-[#FF3131]/5 transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Quick Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background">
              <div className="space-y-2">
                {user ? (
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-gradient-to-r from-[#FF3131] to-[#FF5555]"
                    onClick={() => {
                      scrollAndNavigate('/auth');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Entrar / Criar Conta
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
