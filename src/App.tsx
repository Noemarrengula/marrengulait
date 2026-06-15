import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { Loader2 } from "lucide-react";
import MobileBottomNav from "@/components/MobileBottomNav";
import { CaptchaProvider } from "@/providers/CaptchaProvider";
import WhatsAppBanner from "@/components/WhatsAppBanner";
import AdminRoute from "@/components/AdminRoute";

const Index = lazy(() => import("./pages/Index"));
const Product = lazy(() => import("./pages/Product"));
const Products = lazy(() => import("./pages/Products"));
const Services = lazy(() => import("./pages/Services"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Orders = lazy(() => import("./pages/Orders"));
const About = lazy(() => import("./pages/About"));
const Affiliate = lazy(() => import("./pages/Affiliate"));
const Tracking = lazy(() => import("./pages/Tracking"));
const Auth = lazy(() => import("./pages/Auth"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Maintenance = lazy(() => import("./pages/Maintenance"));
const NotFound = lazy(() => import("./pages/NotFound"));

const Admin = lazy(() => import("./pages/AdminPremium"));
const PCBuilder = lazy(() => import("./pages/PCBuilder"));
const Electronics = lazy(() => import("./pages/Electronics"));
const Smartphones = lazy(() => import("./pages/Smartphones"));
const ProductCompare = lazy(() => import("./pages/ProductCompare"));
const CCTVKitBuilder = lazy(() => import("./pages/CCTVKitBuilder"));
const StorageCalculator = lazy(() => import("./pages/StorageCalculator"));
const CCTVTutorial = lazy(() => import("./pages/CCTVTutorial"));
const AutomationIA = lazy(() => import("./pages/AutomationIA"));
const Switches = lazy(() => import("./pages/Switches"));
const Perifericos = lazy(() => import("./pages/Perifericos"));
const Computadores = lazy(() => import("./pages/Computadores"));
const Armazenamento = lazy(() => import("./pages/Armazenamento"));
const Redes = lazy(() => import("./pages/Redes"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const FAQ = lazy(() => import("./pages/FAQ"));
const PublicWishlist = lazy(() => import("./pages/PublicWishlist"));
const DownloadApp = lazy(() => import("./pages/DownloadApp"));
const ServicosTI = lazy(() => import("./pages/ServicosTI"));

const ChatBot = lazy(() => import("@/components/ChatBot"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-12 w-12 animate-spin text-[#FF3131]" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SettingsProvider>
      <TooltipProvider>
        <CartProvider>
          <CaptchaProvider>
            <BrowserRouter>
              <Toaster />
              <Sonner />
              <Suspense fallback={<LoadingFallback />}>
                <ChatBot />
              </Suspense>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/produto/:id" element={<Product />} />
                  <Route path="/produtos" element={<Products />} />
                  <Route path="/servicos" element={<Services />} />
                  <Route path="/carrinho" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/pedido/:id" element={<OrderConfirmation />} />
                  <Route path="/favoritos" element={<Favorites />} />
                  <Route path="/pedidos" element={<Orders />} />
                  <Route path="/sobre" element={<About />} />
                  <Route path="/afiliados" element={<Affiliate />} />
                  <Route path="/monte-seu-pc" element={<PCBuilder />} />
                  <Route path="/eletronicos" element={<Electronics />} />
                  <Route path="/celulares" element={<Smartphones />} />
                  <Route path="/comparar" element={<ProductCompare />} />
                  <Route path="/kit-cctv" element={<CCTVKitBuilder />} />
                  <Route path="/calculadora-cctv" element={<StorageCalculator />} />
                  <Route path="/guia-cctv" element={<CCTVTutorial />} />
                  <Route path="/rastrear" element={<Tracking />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/manutencao" element={<Maintenance />} />
                  <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
                  <Route path="/automacao-ia" element={<AutomationIA />} />
                  <Route path="/switches" element={<Switches />} />
                  <Route path="/perifericos" element={<Perifericos />} />
                  <Route path="/computadores" element={<Computadores />} />
                  <Route path="/armazenamento" element={<Armazenamento />} />
                  <Route path="/redes" element={<Redes />} />
                  <Route path="/termos" element={<Terms />} />
                  <Route path="/privacidade" element={<Privacy />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/wishlist/:id" element={<PublicWishlist />} />
                  <Route path="/download-app" element={<DownloadApp />} />
                  <Route path="/servicos-ti" element={<ServicosTI />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <MobileBottomNav />
                <WhatsAppBanner />
              </Suspense>
            </BrowserRouter>
          </CaptchaProvider>
        </CartProvider>
      </TooltipProvider>
    </SettingsProvider>
  </QueryClientProvider>
);

export default App;
