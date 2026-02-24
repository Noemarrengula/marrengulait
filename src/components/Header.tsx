import { User, Search, Menu, Heart, LogOut, Settings, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ThemeToggle from "./ThemeToggle";
import CartButton from "@/components/CartButton";
import Logo from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/produtos?search=${encodeURIComponent(searchQuery)}`);
    }
  };

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
      navigate('/');
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
      <div className="border-b border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-accent/5">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-6">
              <span className="hover:text-primary transition-colors cursor-pointer">📞 +258 84 123 4567</span>
              <span className="hover:text-primary transition-colors cursor-pointer">✉️ info@marrengula-it.co.mz</span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/pedidos')} className="hover:text-primary transition-all hover:scale-105">Rastrear Encomenda</button>
              <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="hover:text-primary transition-all hover:scale-105">Ajuda</button>
              <span className="hover:text-primary transition-colors cursor-default font-semibold">🇲🇿 PT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="group relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 transition-all duration-300 group-hover:scale-105">
              <Logo showText={true} />
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-primary transition-colors" />
              <Input
                type="search"
                placeholder="Pesquisar produtos, categorias ou serviços..."
                className="pl-10 bg-secondary border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            {/* Favoritos */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-accent/10 hover:scale-110 transition-all group"
              onClick={() => navigate('/favoritos')}
              title="Favoritos"
            >
              <Heart className="h-5 w-5 group-hover:fill-red-500 group-hover:text-red-500 transition-all" />
            </Button>
            
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
                  <DropdownMenuItem onClick={() => navigate('/pedidos')} className="cursor-pointer">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Meus Pedidos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/favoritos')} className="cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" />
                    Favoritos
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer">
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
                onClick={() => navigate('/auth')}
                title="Entrar"
              >
                <User className="h-5 w-5" />
              </Button>
            )}
            
            {/* Menu Mobile */}
            <Button variant="ghost" size="icon" className="md:hidden hover:bg-accent/10 hover:scale-110 transition-all">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
