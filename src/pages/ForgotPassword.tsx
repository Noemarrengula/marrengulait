import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import logo from "@/assets/marrengula-logo.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        description: `Verifique seu email em ${email}. O link expira em 24 horas.`
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/auth')}
              className="hover:bg-accent/10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <img src={logo} alt="Marrengula-IT" className="h-8" />
            <div className="w-10" />
          </div>
          <CardTitle className="text-2xl font-bold">Recuperar Senha</CardTitle>
          <CardDescription>
            Digite seu email para receber um link de redefinição
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-green-100 p-3">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Verifique seu email</h3>
              <p className="text-muted-foreground mb-4">
                Enviamos um link de redefinição para <span className="font-semibold text-foreground">{email}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                O link expira em 24 horas. Se não receber o email, verifique sua pasta de spam.
              </p>
              <Button
                onClick={() => {
                  navigate('/auth');
                  setEmail("");
                  setIsSuccess(false);
                }}
                className="w-full"
              >
                Voltar para Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Você receberá um link para redefinir sua senha em alguns minutos.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar Link"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
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
