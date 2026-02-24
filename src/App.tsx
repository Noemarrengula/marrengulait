import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/contexts/CartContext";
import ChatBot from "@/components/ChatBot";
import Index from "./pages/Index";
import Product from "./pages/Product";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Admin from "./pages/Admin";
import Products from "./pages/Products";
import Services from "./pages/Services";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Favorites from "./pages/Favorites";
import Orders from "./pages/Orders";
import About from "./pages/About";
import Affiliate from "./pages/Affiliate";
import PCBuilder from "./pages/PCBuilder";
import Electronics from "./pages/Electronics";
import Smartphones from "./pages/Smartphones";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <ChatBot />
          <BrowserRouter>
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
              <Route path="/auth" element={<Auth />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/admin" element={<Admin />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
