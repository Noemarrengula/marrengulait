import Header from "@/components/Header";
import MegaMenu from "@/components/MegaMenu";
import HeroSection from "@/components/HeroSection";
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
      <Footer />
    </div>
  );
};

export default Index;
