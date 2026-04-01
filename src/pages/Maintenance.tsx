import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock, Wrench, Mail, Phone, Facebook, Instagram, Send, Check, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Logo from "@/components/Logo";

interface MaintenancePageProps {
  title?: string;
  message?: string;
  expectedReturn?: Date;
}

const Maintenance = ({ 
  title = "Em Manutenção", 
  message = "Estamos a trabalhar para melhorar a sua experiência. Voltamos em breve!",
  expectedReturn 
}: MaintenancePageProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (expectedReturn) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = expectedReturn.getTime() - now;
        
        if (distance < 0) {
          clearInterval(timer);
          window.location.reload();
        } else {
          setCountdown({
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000),
          });
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [expectedReturn]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.rpc('subscribe_newsletter', {
        p_email: email
      });
      
      if (error) throw error;
      
      setIsSubscribed(true);
      toast({
        title: "Inscrição realizada!",
        description: "Será notificado quando voltarmos.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível realizar a inscrição. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF3131]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF3131]/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      {/* Content */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <div className="mb-8">
          <Logo imageClassName="h-20 w-auto" showText={false} animated={true} />
        </div>
        
        {/* Icon */}
        <div className="mb-6 relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FF3131] to-[#FF5555] flex items-center justify-center shadow-lg shadow-[#FF3131]/30 animate-bounce">
            <Wrench className="h-12 w-12 text-white" />
          </div>
          <div className="absolute -inset-4 border-2 border-dashed border-[#FF3131]/30 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
        </div>
        
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
          {title}
        </h1>
        
        {/* Message */}
        <p className="text-lg text-gray-400 mb-8 text-center max-w-md">
          {message}
        </p>
        
        {/* Countdown */}
        {expectedReturn && (
          <div className="mb-10">
            <p className="text-sm text-gray-500 mb-4 text-center">Tempo restante</p>
            <div className="flex gap-4">
              {[
                { value: countdown.days, label: "Dias" },
                { value: countdown.hours, label: "Horas" },
                { value: countdown.minutes, label: "Min" },
                { value: countdown.seconds, label: "Seg" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-[#FF3131]/20 to-[#FF3131]/5 border border-[#FF3131]/30 flex items-center justify-center">
                    <span className="text-2xl md:text-3xl font-bold text-white">{item.value}</span>
                  </div>
                  <span className="text-xs text-gray-500 mt-2 block">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Notify Form */}
        <Card className="w-full max-w-md bg-gray-900/50 border-gray-800 backdrop-blur-sm mb-10">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-5 w-5 text-[#FF3131]" />
              <h3 className="font-semibold text-white">Seja notificado quando voltarmos</h3>
            </div>
            
            {isSubscribed ? (
              <div className="flex items-center gap-2 text-green-500 justify-center py-4">
                <Check className="h-5 w-5" />
                <span>Obrigado! Será notificado por email.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#FF3131]"
                />
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-[#FF3131] hover:bg-[#FF5555]"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
        
        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 w-full max-w-2xl">
          <div className="flex items-center gap-3 text-gray-400">
            <div className="w-10 h-10 rounded-full bg-[#FF3131]/10 flex items-center justify-center">
              <Phone className="h-5 w-5 text-[#FF3131]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">WhatsApp</p>
              <p className="font-medium text-white">+258 86 473 8133</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-gray-400">
            <div className="w-10 h-10 rounded-full bg-[#FF3131]/10 flex items-center justify-center">
              <Mail className="h-5 w-5 text-[#FF3131]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-white">suporte@marrengulait.com</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-gray-400">
            <div className="w-10 h-10 rounded-full bg-[#FF3131]/10 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-[#FF3131]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Localização</p>
              <p className="font-medium text-white">Maputo, Moçambique</p>
            </div>
          </div>
        </div>
        
        {/* Social Links */}
        <div className="flex items-center gap-4 mb-10">
          <a 
            href="https://facebook.com/marrengulait" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-gray-800 hover:bg-[#FF3131]/20 flex items-center justify-center transition-colors group"
          >
            <Facebook className="h-5 w-5 text-gray-400 group-hover:text-[#FF3131] transition-colors" />
          </a>
          <a 
            href="https://instagram.com/marrengulait" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-gray-800 hover:bg-[#FF3131]/20 flex items-center justify-center transition-colors group"
          >
            <Instagram className="h-5 w-5 text-gray-400 group-hover:text-[#FF3131] transition-colors" />
          </a>
        </div>
        
        {/* Back to Home */}
        <Link to="/">
          <Button variant="outline" className="border-gray-700 text-gray-400 hover:text-white hover:border-gray-500">
            Voltar ao Início
          </Button>
        </Link>
      </div>
      
      {/* Footer */}
      <footer className="relative py-6 text-center text-sm text-gray-600">
        <p>© 2026 Marrengula-IT. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Maintenance;
