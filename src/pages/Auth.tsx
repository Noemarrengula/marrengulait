import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, Check, Mail, Sparkles } from "lucide-react";
import Logo from "@/components/Logo";

const Auth = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginPasswordError, setLoginPasswordError] = useState("");
  const [loginShake, setLoginShake] = useState(false);

  const handleRecaptcha = async (action: string) => {
    if (!executeRecaptcha) {
      return null;
    }
    try {
      const token = await executeRecaptcha(action);
      return token;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupFullName, setSignupFullName] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [signupShake, setSignupShake] = useState(false);

  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

  const passwordStrength = getPasswordStrength(signupPassword);

  const triggerShake = (setShake: React.Dispatch<React.SetStateAction<boolean>>) => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginPasswordError("");
    setIsLoading(true);
    
    try {
      await handleRecaptcha('login');
      const { error } = await signIn(loginEmail, loginPassword);
      
      if (!error) {
        toast({ title: 'Login realizado com sucesso!' });
        navigate('/');
      } else {
        triggerShake(setLoginShake);
        toast({ title: 'Erro ao fazer login', description: error.message, variant: 'destructive' });
      }
    } catch (error) {
      triggerShake(setLoginShake);
      toast({ title: 'Erro inesperado', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(loginEmail)) {
      toast({ title: 'Email inválido', description: 'Por favor, insira um email válido', variant: 'destructive' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await handleRecaptcha('magic_link');
      const { error } = await signIn(loginEmail);
      
      if (error) {
        toast({ title: 'Erro ao enviar link', description: error.message, variant: 'destructive' });
      } else {
        setMagicLinkSent(true);
        toast({ title: 'Link enviado!', description: 'Verifique seu email para fazer login' });
      }
    } catch (error) {
      toast({ title: 'Erro inesperado', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupPassword !== signupConfirmPassword) {
      triggerShake(setSignupShake);
      toast({ title: 'Erro', description: 'As senhas não coincidem', variant: 'destructive' });
      return;
    }

    if (passwordStrength < 2) {
      triggerShake(setSignupShake);
      toast({ title: 'Senha muito fraca', description: 'Use pelo menos 8 caracteres com letras e números', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    
    try {
      await handleRecaptcha('signup');
      const { error } = await signUp(signupEmail, signupPassword, signupFullName);
      
      if (!error) {
        toast({ title: 'Conta criada com sucesso!', description: 'Verifique seu email para confirmar a conta' });
        navigate('/');
      } else {
        triggerShake(setSignupShake);
        toast({ title: 'Erro ao criar conta', description: error.message, variant: 'destructive' });
      }
    } catch (error) {
      triggerShake(setSignupShake);
      toast({ title: 'Erro inesperado', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF3131]/5 via-background to-background flex items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" onClick={() => navigate('/')} className="gap-2 hover:bg-[#FF3131]/10 hover:text-[#FF3131]">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>
      
      <Card className={`w-full max-w-md shadow-xl ${loginShake || signupShake ? 'animate-shake' : ''}`}>
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Logo imageClassName="h-16 w-auto" showText={false} animated={false} />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Bem-vindo</CardTitle>
            <CardDescription>Entre ou crie uma conta para continuar</CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#FF3131]/10">
              <TabsTrigger value="login" className="data-[state=active]:bg-[#FF3131] data-[state=active]:text-white">
                Entrar
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-[#FF3131] data-[state=active]:text-white">
                Criar Conta
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              {magicLinkSent ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                    <Mail className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold">Verifique seu email!</h3>
                  <p className="text-muted-foreground">
                    Enviamos um link de acesso para <strong>{loginEmail}</strong>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Clique no link para fazer login. Verifique também a pasta de spam.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setMagicLinkSent(false)}
                    className="mt-4"
                  >
                    Voltar ao login
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="flex items-center gap-2">
                      Email
                      {emailValid && (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        setEmailValid(validateEmail(e.target.value));
                      }}
                      required
                      className="focus:border-[#FF3131] focus:ring-[#FF3131]/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => {
                          setLoginPassword(e.target.value);
                          setLoginPasswordError("");
                        }}
                        required
                        className={`pr-10 ${loginPasswordError ? 'border-red-500 focus:border-red-500' : 'focus:border-[#FF3131] focus:ring-[#FF3131]/20'}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent hover:text-[#FF3131]"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                      >
                        {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {loginPasswordError && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {loginPasswordError}
                      </p>
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full bg-gradient-to-r from-[#FF3131] to-[#FF5555] hover:opacity-90 transition-all hover:scale-[1.02]" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Entrando...
                      </>
                    ) : "Entrar"}
                  </Button>
                  
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm text-muted-foreground hover:text-[#FF3131]"
                      onClick={() => navigate('/forgot-password')}
                    >
                      Esqueci a senha
                    </Button>
                  </div>
                  
                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">ou</span>
                    </div>
                  </div>
                  
                  {/* Magic Link Button */}
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleMagicLink}
                    disabled={isLoading || !emailValid}
                    className="w-full hover:bg-[#FF3131]/5 hover:border-[#FF3131]"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Entrar com Link Mágico
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground">
                    Enviaremos um link para seu email - sem senha necessária!
                  </p>
                </form>
              )}
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nome Completo</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Seu Nome"
                    value={signupFullName}
                    onChange={(e) => setSignupFullName(e.target.value)}
                    required
                    className="focus:border-[#FF3131] focus:ring-[#FF3131]/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="flex items-center gap-2">
                    Email
                    {signupEmail && validateEmail(signupEmail) && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={signupEmail}
                    onChange={(e) => {
                      setSignupEmail(e.target.value);
                      if (e.target.value) {
                        setEmailValid(validateEmail(e.target.value));
                      }
                    }}
                    required
                    className="focus:border-[#FF3131] focus:ring-[#FF3131]/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showSignupPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      minLength={6}
                      className="pr-10 focus:border-[#FF3131] focus:ring-[#FF3131]/20"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent hover:text-[#FF3131]"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                    >
                      {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  {signupPassword && (
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
                  
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="flex items-center gap-1">
                      {signupPassword.length >= 8 ? <Check className="h-3 w-3 text-green-500" /> : <span className="w-3 h-3">•</span>}
                      Mínimo 8 caracteres
                    </p>
                    <p className="flex items-center gap-1">
                      {/[A-Z]/.test(signupPassword) ? <Check className="h-3 w-3 text-green-500" /> : <span className="w-3 h-3">•</span>}
                      Uma letra maiúscula
                    </p>
                    <p className="flex items-center gap-1">
                      {/[0-9]/.test(signupPassword) ? <Check className="h-3 w-3 text-green-500" /> : <span className="w-3 h-3">•</span>}
                      Um número
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">Confirmar Senha</Label>
                  <div className="relative">
                    <Input
                      id="signup-confirm"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className={`pr-10 ${
                        signupConfirmPassword && signupPassword !== signupConfirmPassword 
                          ? 'border-red-500 focus:border-red-500' 
                          : signupConfirmPassword && signupPassword === signupConfirmPassword 
                            ? 'border-green-500 focus:border-green-500' 
                            : 'focus:border-[#FF3131] focus:ring-[#FF3131]/20'
                      }`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent hover:text-[#FF3131]"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {signupConfirmPassword && signupPassword !== signupConfirmPassword && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      As senhas não coincidem
                    </p>
                  )}
                  {signupConfirmPassword && signupPassword === signupConfirmPassword && (
                    <p className="text-xs text-green-500 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      As senhas coincidem
                    </p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-[#FF3131] to-[#FF5555] hover:opacity-90 transition-all hover:scale-[1.02]" 
                  disabled={isLoading || (signupConfirmPassword && signupPassword !== signupConfirmPassword) || passwordStrength < 2}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Criando conta...
                    </>
                  ) : "Criar Conta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
