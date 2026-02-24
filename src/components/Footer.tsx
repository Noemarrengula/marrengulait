import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/Logo";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Obrigado por subscrever à nossa newsletter!');
      setEmail('');
    }
  };

  const handleSocialClick = (platform: string) => {
    toast.info(`Redirecionando para ${platform}...`);
  };

  return (
    <footer id="footer" className="bg-card border-t border-border relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.05),transparent_50%)]" />
      
      {/* Newsletter */}
      <div className="border-b border-border relative">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center animate-slide-up">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Receba as <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Melhores Ofertas</span>
            </h3>
            <p className="text-muted-foreground mb-6">
              Subscreva à nossa newsletter e fique por dentro das novidades e promoções exclusivas
            </p>
            <form onSubmit={handleNewsletter} className="flex gap-2 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Seu melhor email"
                className="bg-background border-border/50 focus:border-primary transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all">
                Subscrever
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 relative">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Logo showText={true} />
            </div>
            <p className="text-muted-foreground mb-4">
              A sua loja online de confiança para produtos de tecnologia, 
              hardware e serviços de TI em Moçambique.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Maputo, Moçambique</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+258 84 123 4567</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@marrengula-it.co.mz</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('/sobre')} className="text-muted-foreground hover:text-primary transition-colors">Sobre Nós</button></li>
              <li><button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="text-muted-foreground hover:text-primary transition-colors">Contacto</button></li>
              <li><button onClick={() => navigate('/')} className="text-muted-foreground hover:text-primary transition-colors">Blog</button></li>
              <li><button onClick={() => navigate('/')} className="text-muted-foreground hover:text-primary transition-colors">Carreiras</button></li>
              <li><button onClick={() => navigate('/auth')} className="text-muted-foreground hover:text-primary transition-colors">Parcerias</button></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Atendimento</h4>
            <ul className="space-y-2">
              <li><button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="text-muted-foreground hover:text-primary transition-colors">Central de Ajuda</button></li>
              <li><button onClick={() => navigate('/pedidos')} className="text-muted-foreground hover:text-primary transition-colors">Rastrear Encomenda</button></li>
              <li><button onClick={() => navigate('/pedidos')} className="text-muted-foreground hover:text-primary transition-colors">Devoluções</button></li>
              <li><button onClick={() => navigate('/')} className="text-muted-foreground hover:text-primary transition-colors">Garantias</button></li>
              <li><button onClick={() => navigate('/')} className="text-muted-foreground hover:text-primary transition-colors">FAQ</button></li>
            </ul>
          </div>

          {/* For Business */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Para Negócios</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('/auth')} className="text-muted-foreground hover:text-primary transition-colors">Vender no Marketplace</button></li>
              <li><button onClick={() => navigate('/afiliados')} className="text-muted-foreground hover:text-primary transition-colors">Programa de Afiliados</button></li>
              <li><button onClick={() => navigate('/servicos')} className="text-muted-foreground hover:text-primary transition-colors">Serviços Corporativos</button></li>
              <li><button onClick={() => navigate('/produtos')} className="text-muted-foreground hover:text-primary transition-colors">Compras em Massa</button></li>
              <li><button onClick={() => navigate('/servicos')} className="text-muted-foreground hover:text-primary transition-colors">Soluções B2B</button></li>
            </ul>
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Marrengula-IT. Todos os direitos reservados.
            </p>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" className="hover:bg-primary/20 hover:text-primary hover:scale-110 transition-all" onClick={() => handleSocialClick('Facebook')}>
                <Facebook className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-primary/20 hover:text-primary hover:scale-110 transition-all" onClick={() => handleSocialClick('Instagram')}>
                <Instagram className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-primary/20 hover:text-primary hover:scale-110 transition-all" onClick={() => handleSocialClick('Twitter')}>
                <Twitter className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-primary/20 hover:text-primary hover:scale-110 transition-all" onClick={() => handleSocialClick('Youtube')}>
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
