import { User, Menu, Heart, LogOut, Settings, ShoppingBag, Phone, Mail, HelpCircle, Package, X, Home, ShoppingCart, Tag, Laptop, Smartphone, Wrench, Users, FileText, Search, ChevronDown, Loader2 } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
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
import { memo, useState } from "react";
import { useLockedBody } from "@/hooks/useLockedBody";

const Header = () => {
  const { user, isAdmin, signOut, loading } = useAuth();
  const { locale, currency, setLocale, setCurrency } = useSettings();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useLockedBody(mobileMenuOpen);

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
        toast({ title: 'Erro ao fazer logout', description: error.message, variant: 'destructive' });
        return;
      }
      toast({ title: 'Logout realizado!' });
      scrollAndNavigate('/');
    } catch (error) {
      toast({ title: 'Erro inesperado', variant: 'destructive' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-xl shadow-sm">
      {/* Top Bar - Escondida no mobile */}
      <div className="border-b border-border/50 bg-gradient-to-r from-[#FF3131]/5 via-transparent to-[#FF5555]/5 hidden md:block">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm text-foreground/70">
            <div className="flex items-center gap-6">
              <a href="tel:+258864738133" className="flex items-center gap-1.5 hover:text-[#FF3131] transition-all">
                <Phone className="h-3.5 w-3.5" />
                <span>+258 864738133</span>
              </a>
              <a href="mailto:marrengulait@gmail.com" className="flex items-center gap-1.5 hover:text-[#FF3131] transition-all">
                <Mail className="h-3.5 w-3.5" />
                <span className="hidden lg:inline">marrengulait@gmail.com</span>
              </a>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => scrollAndNavigate('/rastrear')} className="flex items-center gap-1.5 hover:text-[#FF3131] font-medium">
                <Package className="h-4 w-4" />
                <span className="hidden lg:inline">Rastrear</span>
              </button>
              <button onClick={() => scrollAndNavigate('/sobre')} className="flex items-center gap-1.5 hover:text-[#FF3131] font-medium">
                <HelpCircle className="h-4 w-4" />
                <span className="hidden xl:inline">Ajuda</span>
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="px-2 text-xs">
                    {currency} <ChevronDown className="h-3 w-3 ml-1" />
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="px-2 text-xs">
                    {locale === 'pt-MZ' ? '🇲🇿 PT' : '🇺🇸 EN'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setLocale('pt-MZ')}>🇲🇿 Português</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocale('en-US')}>🇺🇸 English</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocale('es-MX')}>🇪🇸 Español</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Mobile Optimizado */}
      <div className="container mx-auto px-3 py-2 md:py-4">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          {/* Mobile: Logo compacta, Desktop: Logo completa */}
          <Link to="/" className="flex-shrink-0">
            <Logo showText={false} className="h-8 w-auto md:h-10" />
          </Link>

          {/* Search - Desktop only */}
          <SearchAutocomplete 
            className="hidden md:flex flex-1 max-w-2xl"
            placeholder="Pesquisar produtos..."
          />

          {/* Actions - Mobile Optimizado */}
          <div className="flex items-center gap-1 md:gap-3">
            {/* Search Button - Mobile only */}
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden hover:bg-accent/10"
              onClick={() => scrollAndNavigate('/produtos')}
            >
              <Search className="h-5 w-5" />
            </Button>

            <div className="hidden md:block"><ThemeToggle /></div>
            
            {/* Favoritos - Desktop only */}
            <Button 
              variant="ghost" 
              size="icon"
              className="hidden md:flex hover:bg-accent/10"
              onClick={() => scrollAndNavigate('/favoritos')}
            >
              <Heart className="h-5 w-5" />
            </Button>

            {/* Notificações - Desktop only */}
            <div className="hidden md:block">
              <NotificationBell />
            </div>
            
            {/* Carrinho */}
            <CartButton />
            
            {/* User Menu */}
            {loading ? (
              <div className="flex items-center gap-2 px-3 py-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-xs text-muted-foreground hidden md:inline">A carregar...</span>
              </div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Menu do utilizador" className="hover:bg-accent/10">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-semibold truncate">
                    {user.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => scrollAndNavigate('/pedidos')}>
                    <ShoppingBag className="mr-2 h-4 w-4" /> Meus Pedidos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => scrollAndNavigate('/favoritos')}>
                    <Heart className="mr-2 h-4 w-4" /> Favoritos
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => scrollAndNavigate('/admin')}>
                      <Settings className="mr-2 h-4 w-4" /> Painel Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" /> Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                size="sm"
                className="hidden md:flex text-xs px-3"
                onClick={() => scrollAndNavigate('/auth')}
              >
                Entrar
              </Button>
            )}
            
            {/* Menu Mobile - Desktop: esconde, Mobile: mostra */}
            <Button 
              variant="ghost" 
              size="icon"
              aria-label="Abrir menu"
              className="md:hidden hover:bg-[#FF3131]/10"
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
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          <div className="absolute right-0 top-0 h-full w-[85vw] max-w-[320px] bg-background shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <Logo showText={true} />
              <Button variant="ghost" size="icon" aria-label="Fechar menu" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
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

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <a href="tel:+258864738133">+258 864738133</a>
              </div>
              {user ? (
                <Button variant="destructive" className="w-full" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                  <LogOut className="h-4 w-4 mr-2" /> Sair
                </Button>
              ) : (
                <Button className="w-full bg-gradient-to-r from-[#FF3131] to-[#FF5555]" onClick={() => { scrollAndNavigate('/auth'); setMobileMenuOpen(false); }}>
                  <User className="h-4 w-4 mr-2" /> Entrar / Criar Conta
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default memo(Header);
