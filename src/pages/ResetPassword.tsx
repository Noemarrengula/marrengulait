import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import logo from "@/assets/marrengula-logo.png";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [isValidLink, setIsValidLink] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const initializeReset = async () => {
      try {
        // Verificar se o usuário já foi processado pelo Supabase Auth
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setIsValidLink(true);
        } else {
          // Tentar obter a sessão do hash
          const hash = window.location.hash;
          if (hash.includes("type=recovery")) {
            // Deixar o Supabase processar o hash automaticamente
            const { data: { session: hashSession } } = await supabase.auth.getSession();
            if (hashSession) {
              setIsValidLink(true);
            } else {
              // Aguardar um pouco para o Supabase processar
              setTimeout(() => {
                setIsValidLink(true);
              }, 1000);
            }
          } else {
            setIsValidLink(false);
            toast({
              title: "Link inválido",
              description: "O link de redefinição de senha expirou ou é inválido.",
              variant: "destructive"
            });
          }
        }
      } catch (error) {
        console.error("Erro ao processar link:", error);
        setIsValidLink(false);
      } finally {
        setLoading(false);
      }
    };

    initializeReset();
  }, [toast]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        toast({
          title: "Erro ao redefinir senha",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setIsSuccess(true);
      toast({
        title: "Sucesso!",
        description: "Senha redefinida com sucesso. Redirecionando..."
      });

      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        navigate("/auth");
      }, 2000);
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Tente novamente mais tarde",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-accent/10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <img src={logo} alt="Marrengula-IT" className="h-8" />
            <div className="w-10" />
          </div>
          <CardTitle className="text-2xl font-bold">Redefinir Senha</CardTitle>
          <CardDescription>
            Digite sua nova senha para recuperar acesso à sua conta
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : isSuccess ? (
            <div className="text-center py-8">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Senha Redefinida!</h3>
              <p className="text-muted-foreground mb-4">
                Sua senha foi alterada com sucesso. Você será redirecionado para fazer login.
              </p>
            </div>
          ) : !isValidLink ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold mb-2">Link Expirado</h3>
              <p className="text-muted-foreground mb-4">
                O link de redefinição de senha expirou. Solicite um novo link.
              </p>
              <Button
                onClick={() => navigate("/auth")}
                className="w-full"
              >
                Voltar para Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Mínimo 6 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Senha</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Redefinindo..." : "Redefinir Senha"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
