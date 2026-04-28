import { lazy, Suspense, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";
import MegaMenu from "@/components/MegaMenu";
import HeroSection from "@/components/HeroSection";
import PromoBanners from "@/components/PromoBanners";
import MayBanner from "@/components/MayBanner";
import PartnersSection from "@/components/PartnersSection";
import Categories from "@/components/Categories";
import ProductGrid from "@/components/ProductGrid";
import ServicesSection from "@/components/ServicesSection";
import MarketplaceSection from "@/components/MarketplaceSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import { useProducts } from "@/hooks/useProducts";
import { Loader2 } from "lucide-react";

const RecentlyViewed = lazy(() => import("@/components/RecentlyViewed"));
const LoyaltyProgram = lazy(() => import("@/components/LoyaltyProgram"));

const LoadingFallback = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-[#FF3131]" />
    </div>
  </div>
);

const Index = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const { data: featuredProducts, isLoading: loadingFeatured, refetch: refetchFeatured } = useProducts({ featured: true });
  const { data: latestProducts, isLoading: loadingLatest, refetch: refetchLatest } = useProducts();

  useEffect(() => {
    if (location.pathname === '/') {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
      refetchFeatured();
      refetchLatest();
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MegaMenu />
      <MayBanner />
      <HeroSection />
      <Categories />
      <ProductGrid 
        title="Mais Vendidos" 
        subtitle="Os produtos mais populares entre os nossos clientes"
        loading={loadingFeatured}
        products={featuredProducts || []}
        showViewAll
        viewAllLink="/produtos"
      />
      <ServicesSection />
      <ProductGrid 
        title="Novidades" 
        subtitle="Acabaram de chegar ao nosso marketplace"
        loading={loadingLatest}
        products={latestProducts?.slice(0, 8) || []}
        showViewAll
        viewAllLink="/produtos"
      />
      <MarketplaceSection />
      <TestimonialsSection />
      <PartnersSection />
      <div className="container mx-auto px-4 py-12">
        <Suspense fallback={<LoadingFallback />}>
          <LoyaltyProgram />
        </Suspense>
      </div>
      <Footer />
      <Suspense fallback={null}>
        <RecentlyViewed />
      </Suspense>
    </div>
  );
};

export default Index;
