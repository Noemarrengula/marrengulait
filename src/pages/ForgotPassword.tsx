import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, CheckCircle2, AlertCircle, Loader2, Send, RefreshCw } from "lucide-react";
import Logo from "@/components/Logo";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [emailError, setEmailError] = useState("");
  const [emailValid, setEmailValid] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    if (isSuccess) {
      setCanResend(false);
      setCountdown(60);
      
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isSuccess]);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (value) {
      if (validateEmail(value)) {
        setEmailValid(true);
        setEmailError("");
      } else {
        setEmailValid(false);
        setEmailError("");
      }
    } else {
      setEmailValid(false);
      setEmailError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setEmailError("Por favor, insira um email válido");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Erro ao enviar link",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setIsSuccess(true);
      toast({
        title: "Link enviado!",
        description: `Verifique seu email em ${email}. O link expira em 1 hora.`
      });
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Tente novamente mais tarde",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    setCanResend(false);
    setCountdown(60);
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Erro ao reenviar",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Link reenviado!",
        description: "Verifique seu email novamente"
      });

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Tente novamente mais tarde",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF3131]/5 via-background to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/auth')}
              className="hover:bg-[#FF3131]/10 hover:text-[#FF3131]"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Logo imageClassName="h-8 w-auto" showText={false} animated={false} />
            <div className="w-10" />
          </div>
          <CardTitle className="text-2xl font-bold">Recuperar Senha</CardTitle>
          <CardDescription>
            Digite seu email para receber um link de redefinição
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isSuccess ? (
            <div className="text-center py-8 animate-bounce-in">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-green-100 p-4">
                  <Mail className="h-12 w-12 text-green-500" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-green-600">Email Enviado!</h3>
              <p className="text-muted-foreground mb-2">
                Enviamos um link de redefinição para
              </p>
              <p className="font-semibold text-foreground mb-4">{email}</p>
              <p className="text-sm text-muted-foreground mb-6">
                O link expira em 1 hora. Se não receber, verifique a pasta de spam.
              </p>
              
              <div className="space-y-3">
                {canResend ? (
                  <Button
                    onClick={handleResend}
                    variant="outline"
                    className="w-full hover:bg-[#FF3131]/10 hover:border-[#FF3131] hover:text-[#FF3131]"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Reenviar Email
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled
                  >
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Reenviar em {countdown}s
                  </Button>
                )}
                
                <Button
                  onClick={() => {
                    navigate('/auth');
                    setEmail("");
                    setIsSuccess(false);
                  }}
                  className="w-full bg-gradient-to-r from-[#FF3131] to-[#FF5555] hover:opacity-90"
                >
                  Voltar para Login
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  Email
                  {emailValid && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    onBlur={() => {
                      if (email && !validateEmail(email)) {
                        setEmailError("Por favor, insira um email válido");
                      }
                    }}
                    required
                    className={`pl-10 transition-all ${
                      emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 
                      emailValid ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20' : 
                      'focus:border-[#FF3131] focus:ring-[#FF3131]/20'
                    }`}
                  />
                  <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                    emailError ? 'text-red-500' : 
                    emailValid ? 'text-green-500' : 
                    'text-muted-foreground'
                  }`} />
                </div>
                {emailError && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {emailError}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Você receberá um link para redefinir sua senha em alguns minutos.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FF3131] to-[#FF5555] hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] btn-gradient-animated"
                disabled={loading || (email && !validateEmail(email))}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Link
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full hover:bg-[#FF3131]/10 hover:border-[#FF3131] hover:text-[#FF3131]"
                onClick={() => navigate('/auth')}
              >
                Voltar para Login
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
