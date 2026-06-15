import { useState } from 'react';
import { Send, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface NewsletterFormProps {
  variant?: 'default' | 'compact' | 'inline';
  className?: string;
  showName?: boolean;
  placeholder?: string;
}

export function NewsletterForm({ 
  variant = 'default', 
  className,
  showName = false,
  placeholder = 'seu@email.com'
}: NewsletterFormProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: 'Email inválido',
        description: 'Por favor, insira um email válido.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.rpc('subscribe_newsletter', {
        p_email: email,
        p_full_name: showName ? name : null,
      });
      
      if (error) throw error;
      
      if (data.success) {
        setIsSubscribed(true);
        toast({
          title: 'Inscrito com sucesso!',
          description: 'Receberá as melhores ofertas no seu email.',
        });
        
        setTimeout(() => {
          setIsSubscribed(false);
          setEmail('');
          setName('');
        }, 3000);
      } else {
        toast({
          title: 'Ops!',
          description: data.message || 'Não foi possível realizar a inscrição.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível realizar a inscrição. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <Input
          type="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 min-w-0"
          disabled={isLoading || isSubscribed}
        />
        <Button 
          type="submit"
          size="sm"
          disabled={isLoading || isSubscribed}
          className="bg-[#FF3131] hover:bg-[#FF5555]"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isSubscribed ? (
            <Check className="h-4 w-4" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    );
  }
  
  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 items-center ${className}`}>
        <Input
          type="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
          disabled={isLoading || isSubscribed}
        />
        <Button 
          type="submit"
          variant="secondary"
          disabled={isLoading || isSubscribed}
          className="bg-white text-[#FF3131] hover:bg-white/90"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isSubscribed ? (
            <Check className="h-4 w-4" />
          ) : (
            'Inscrever'
          )}
        </Button>
      </form>
    );
  }
  
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold mb-2">Newsletter</h3>
          <p className="text-sm text-muted-foreground">
            Receba as melhores ofertas e novidades diretamente no seu email.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          {showName && (
            <Input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading || isSubscribed}
            />
          )}
          
          <Input
            type="email"
            placeholder={placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading || isSubscribed}
          />
          
          <Button 
            type="submit"
            className="w-full bg-gradient-to-r from-[#FF3131] to-[#FF5555] hover:from-[#FF2222] hover:to-[#FF4444]"
            disabled={isLoading || isSubscribed}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                A inscrever...
              </>
            ) : isSubscribed ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Inscrito com sucesso!
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Quero receber ofertas
              </>
            )}
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            Sem spam. Pode cancelar a qualquer momento.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

export default NewsletterForm;
