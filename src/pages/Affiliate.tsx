import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, TrendingUp, DollarSign, Users, MousePointerClick, Check } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Affiliate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [affiliate, setAffiliate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    loadAffiliateData();
  }, [user]);

  const loadAffiliateData = async () => {
    try {
      const { data, error } = await supabase
        .from("affiliates")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      setAffiliate(data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const createAffiliate = async () => {
    try {
      const { data, error } = await supabase.rpc("create_affiliate", {
        target_user_id: user?.id,
      });

      if (error) throw error;
      toast.success("Conta de afiliado criada com sucesso!");
      loadAffiliateData();
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar conta de afiliado");
    }
  };

  const copyAffiliateLink = () => {
    const link = `${window.location.origin}?ref=${affiliate?.affiliate_code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <p>Carregando...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!affiliate) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl">🤝 Programa de Afiliados</CardTitle>
              <CardDescription>
                Ganhe comissões promovendo produtos da MarrengulaIT
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Comissão de 5%</h3>
                    <p className="text-sm text-muted-foreground">
                      Ganhe 5% em cada venda realizada através do seu link
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Dashboard Completo</h3>
                    <p className="text-sm text-muted-foreground">
                      Acompanhe cliques, conversões e ganhos em tempo real
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Sem Limite</h3>
                    <p className="text-sm text-muted-foreground">
                      Promova quantos produtos quiser, sem restrições
                    </p>
                  </div>
                </div>
              </div>
              <Button onClick={createAffiliate} size="lg" className="w-full">
                Tornar-me Afiliado
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const affiliateLink = `${window.location.origin}?ref=${affiliate.affiliate_code}`;
  const conversionRate = affiliate.total_clicks > 0 
    ? ((affiliate.total_conversions / affiliate.total_clicks) * 100).toFixed(2)
    : "0.00";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Painel de Afiliado</h1>
          <p className="text-muted-foreground">
            Acompanhe suas estatísticas e ganhos
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Cliques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <MousePointerClick className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold">{affiliate.total_clicks}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Conversões
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold">{affiliate.total_conversions}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taxa de Conversão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="text-2xl font-bold">{conversionRate}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Comissões Totais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-bold">
                  {affiliate.total_commission.toLocaleString('pt-MZ')} MT
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Affiliate Link */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Seu Link de Afiliado</CardTitle>
            <CardDescription>
              Compartilhe este link para ganhar comissões
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input value={affiliateLink} readOnly className="font-mono text-sm" />
              <Button onClick={copyAffiliateLink} variant="outline">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Código: <span className="font-mono font-bold">{affiliate.affiliate_code}</span>
            </p>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Como Funciona</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium">Compartilhe seu link</p>
                  <p className="text-sm text-muted-foreground">
                    Divulgue em redes sociais, blog ou WhatsApp
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium">Cliente compra</p>
                  <p className="text-sm text-muted-foreground">
                    Quando alguém compra através do seu link
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium">Você ganha comissão</p>
                  <p className="text-sm text-muted-foreground">
                    Receba {affiliate.commission_rate}% do valor da venda
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dicas para Vender Mais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <p className="text-sm">Compartilhe produtos específicos que você recomenda</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <p className="text-sm">Crie conteúdo sobre tecnologia e inclua seus links</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <p className="text-sm">Aproveite promoções para divulgar ofertas</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <p className="text-sm">Seja transparente sobre ser afiliado</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Affiliate;
