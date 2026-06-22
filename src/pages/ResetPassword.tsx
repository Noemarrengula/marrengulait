import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Logo from "@/components/Logo";

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
  const [passwordError, setPasswordError] = useState("");
  const [shake, setShake] = useState(false);

  const getPasswordStrength = useCallback((pwd: string) => {
    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return Math.min(strength, 4);
  }, []);

  const getStrengthColor = (strength: number) => {
    if (strength <= 1) return "bg-red-500";
    if (strength <= 2) return "bg-orange-500";
    if (strength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthLabel = (strength: number) => {
    if (strength <= 1) return "Fraca";
    if (strength <= 2) return "Média";
    if (strength <= 3) return "Forte";
    return "Muito Forte";
  };

  const passwordStrength = getPasswordStrength(password);

  useEffect(() => {
    const initializeReset = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session?.user) {
          setIsValidLink(true);
        } else {
          const hash = window.location.hash;
          if (hash.includes("type=recovery") || hash.includes("access_token")) {
            const { data: { session: hashSession } } = await supabase.auth.getSession();
            if (hashSession?.user) {
              setIsValidLink(true);
            } else {
              setTimeout(async () => {
                const { data: { session: finalSession } } = await supabase.auth.getSession();
                if (finalSession?.user) {
                  setIsValidLink(true);
                } else {
                  setIsValidLink(false);
                  toast({
                    title: "Link expirado",
                    description: "O link de redefinição expirou. Solicite um novo link.",
                    variant: "destructive"
                  });
                }
                setLoading(false);
              }, 2000);
              return;
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
        if (loading) setLoading(false);
      }
    };

    initializeReset();
  }, [toast, loading]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      triggerShake();
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 6) {
      triggerShake();
      setPasswordError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (passwordStrength < 2) {
      triggerShake();
      setPasswordError("Use uma senha mais forte (mínimo 8 caracteres, letras e números)");
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
    <div className="min-h-screen bg-gradient-to-br from-[#FF3131]/5 via-background to-background flex items-center justify-center p-4">
      <Card className={`w-full max-w-md shadow-xl ${shake ? 'animate-shake' : ''}`}>
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-[#FF3131]/10 hover:text-[#FF3131]"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Logo imageClassName="h-8 w-auto" showText={false} animated={false} />
            <div className="w-10" />
          </div>
          <CardTitle className="text-2xl font-bold">Redefinir Senha</CardTitle>
          <CardDescription>
            Digite sua nova senha para recuperar acesso à sua conta
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 className="h-12 w-12 text-[#FF3131] animate-spin" />
              <p className="text-muted-foreground animate-pulse">A verificar link...</p>
            </div>
          ) : isSuccess ? (
            <div className="text-center py-8 animate-bounce-in">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-green-100 p-4">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-green-600">Senha Redefinida!</h3>
              <p className="text-muted-foreground mb-4">
                Sua senha foi alterada com sucesso. Você será redirecionado para fazer login.
              </p>
              <div className="flex justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            </div>
          ) : !isValidLink ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-red-100 p-4">
                  <AlertCircle className="h-12 w-12 text-red-500" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-red-600">Link Expirado</h3>
              <p className="text-muted-foreground mb-6">
                O link de redefinição de senha expirou. Solicite um novo link.
              </p>
              <Button
                onClick={() => navigate("/auth")}
                className="w-full bg-gradient-to-r from-[#FF3131] to-[#FF5555] hover:opacity-90"
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
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                    }}
                    required
                    minLength={6}
                    className="pr-10 focus:border-[#FF3131] focus:ring-[#FF3131]/20"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent hover:text-[#FF3131]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                {password && (
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            i < passwordStrength ? getStrengthColor(passwordStrength) : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs ${
                      passwordStrength <= 1 ? "text-red-500" : 
                      passwordStrength <= 2 ? "text-orange-500" : 
                      passwordStrength <= 3 ? "text-yellow-600" : "text-green-500"
                    }`}>
                      Força: {getStrengthLabel(passwordStrength)}
                    </p>
                  </div>
                )}
                
                {passwordError && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {passwordError}
                  </p>
                )}
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
                    className={`pr-10 focus:border-[#FF3131] focus:ring-[#FF3131]/20 ${
                      confirmPassword && password !== confirmPassword ? 'border-red-500' : ''
                    }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent hover:text-[#FF3131]"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    As senhas não coincidem
                  </p>
                )}
                {confirmPassword && password === confirmPassword && (
                  <p className="text-xs text-green-500 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    As senhas coincidem
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FF3131] to-[#FF5555] hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]"
                disabled={isSubmitting || (confirmPassword && password !== confirmPassword)}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Redefinindo...
                  </>
                ) : (
                  "Redefinir Senha"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
