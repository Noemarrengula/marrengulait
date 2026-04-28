import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import MegaMenu from '@/components/MegaMenu';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Smartphone, Monitor, Shield, Bell, Camera, MapPin, CheckCircle2, Loader2, ExternalLink } from 'lucide-react';
import { useCapacitorNative } from '@/hooks/useCapacitorNative';

const DownloadApp = () => {
  const { isCapacitor, requestNotificationPermission, isLoading } = useCapacitorNative();
  const [isAndroid, setIsAndroid] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [appVersion] = useState('1.0.0');
  const [appSize] = useState('45 MB');

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    setIsAndroid(userAgent.includes('android'));
  }, []);

  const handleDownload = () => {
    setDownloadStarted(true);
    const link = document.createElement('a');
    link.href = '/downloads/MarrengulaIT-v1.0.0.apk';
    link.download = 'MarrengulaIT-v1.0.0.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEnableNotifications = async () => {
    await requestNotificationPermission();
  };

  const features = [
    {
      icon: Bell,
      title: 'Notificações Push',
      description: 'Receba alertas de pedidos, promoções e novidades em tempo real',
    },
    {
      icon: Camera,
      title: 'Câmera Integrada',
      description: 'Tire fotos e envie comprovativos de pagamento facilmente',
    },
    {
      icon: MapPin,
      title: 'GPS & Tracking',
      description: 'Acompanhe suas entregas em tempo real',
    },
    {
      icon: Shield,
      title: 'Seguro & Rápido',
      description: 'Autenticação biométrica e carregamento instantâneo',
    },
  ];

  const installSteps = isAndroid ? [
    {
      step: 1,
      title: 'Download',
      description: 'Toque no botão abaixo para baixar o APK',
    },
    {
      step: 2,
      title: 'Permitir Fontes Desconhecidas',
      description: 'Vá em Configurações > Segurança > Fontes Desconhecidas > Permitir',
    },
    {
      step: 3,
      title: 'Instalar',
      description: 'Abra o arquivo APK baixado e toque em Instalar',
    },
    {
      step: 4,
      title: 'Pronto!',
      description: 'Abra o app e faça login com sua conta',
    },
  ] : [
    {
      step: 1,
      title: 'Escolha seu dispositivo',
      description: 'Disponible para Android. Visite num dispositivo Android para baixar.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MegaMenu />
      
      <div className="container mx-auto px-4 py-4">
        <Breadcrumbs items={[{ label: 'Download do App' }]} />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#FF3131] to-[#FF5555] rounded-2xl mb-6 shadow-lg shadow-[#FF3131]/30">
            <Smartphone className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            App <span className="text-[#FF3131]">MarrengulaIT</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            A melhor experiência de compras no seu telemóvel
          </p>
          <div className="flex items-center justify-center gap-4 mb-8">
            <Badge variant="outline" className="text-sm px-4 py-1">
              v{appVersion}
            </Badge>
            <Badge variant="outline" className="text-sm px-4 py-1">
              {appSize}
            </Badge>
            <Badge variant="outline" className="text-sm px-4 py-1 bg-green-100 text-green-700 border-green-200">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              100% Gratuito
            </Badge>
          </div>
        </div>

        {/* Download Card */}
        <Card className="mb-12 overflow-hidden">
          <div className="bg-gradient-to-r from-[#FF3131] to-[#FF5555] p-8 text-center text-white">
            <Download className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h2 className="text-3xl font-bold mb-2">Download Rápido</h2>
            <p className="opacity-90 mb-6">
              Instale o app em poucos passos
            </p>
            <Button
              onClick={handleDownload}
              disabled={downloadStarted}
              size="lg"
              className="bg-white text-[#FF3131] hover:bg-white/90 shadow-xl text-lg px-8"
            >
              {downloadStarted ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  A descarregar...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Descarregar APK
                </>
              )}
            </Button>
            <p className="text-sm mt-4 opacity-75">
              Compatível com Android 6.0+
            </p>
          </div>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 bg-[#FF3131]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="w-6 h-6 text-[#FF3131]" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Installation Steps */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Como Instalar</CardTitle>
            <CardDescription>
              Siga estes passos simples para instalar o app no seu Android
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {installSteps.map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#FF3131] text-white rounded-full flex items-center justify-center font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {isAndroid && (
              <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-800 text-sm">
                  <strong>Nota:</strong> Se vir um aviso de segurança ao instalar, 
                  toque em "Configurações" e habilite "Instalar apps de fontes desconhecidas".
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enable Notifications */}
        {isCapacitor && (
          <Card className="mb-12 border-green-200 bg-green-50/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Bell className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Ativar Notificações</h3>
                    <p className="text-sm text-muted-foreground">
                      Receba alertas de novos pedidos e promoções
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleEnableNotifications}
                  disabled={isLoading}
                  variant="outline"
                  className="border-green-500 text-green-600 hover:bg-green-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Ativar'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Monitor className="w-6 h-6" />
              Website vs App
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  Website (marrengula-it.co.mz)
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Funciona em qualquer navegador
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Atualizações automáticas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Sem instalação
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <span className="w-4 h-4">-</span>
                    Sem notificações push
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <span className="w-4 h-4">-</span>
                    Sem acesso à câmera
                  </li>
                </ul>
              </div>
              <div className="p-4 border-2 border-[#FF3131] rounded-lg bg-[#FF3131]/5">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-[#FF3131]" />
                  App MarrengulaIT
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Melhor desempenho
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Notificações push
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Acesso à câmera
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    GPS integrado
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Funciona offline (parcialmente)
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-8">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold mb-2">Precisa de ajuda?</h3>
            <p className="text-muted-foreground mb-4">
              Entre em contacto conosco se tiver problemas com a instalação
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="outline">
                <a href="https://wa.me/258864738133" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href="mailto:marrengulait@gmail.com">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Email
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default DownloadApp;
