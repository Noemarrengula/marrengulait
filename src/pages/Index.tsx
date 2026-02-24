import Header from "@/components/Header";
import MegaMenu from "@/components/MegaMenu";
import HeroSection from "@/components/HeroSection";
import PromoBanners from "@/components/PromoBanners";
import RecentlyViewed from "@/components/RecentlyViewed";
import LoyaltyProgram from "@/components/LoyaltyProgram";
import Categories from "@/components/Categories";
import ProductGrid from "@/components/ProductGrid";
import ServicesSection from "@/components/ServicesSection";
import MarketplaceSection from "@/components/MarketplaceSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MegaMenu />
      <HeroSection />
      <Categories />
      <ProductGrid 
        title="🔥 Mais Vendidos" 
        subtitle="Os produtos mais populares entre os nossos clientes"
      />
      <ServicesSection />
      <ProductGrid 
        title="⚡ Novidades" 
        subtitle="Acabaram de chegar ao nosso marketplace"
      />
      <MarketplaceSection />
      <div className="container mx-auto px-4 py-12">
        <LoyaltyProgram />
      </div>
      <Footer />
      <RecentlyViewed />
    </div>
  );
};

export default Index;
