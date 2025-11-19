import Header from "@/components/Header";
import MegaMenu from "@/components/MegaMenu";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";

const Products = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MegaMenu />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Todos os Produtos</h1>
          <p className="text-muted-foreground">Explore o nosso catálogo completo de tecnologia</p>
        </div>
        
        <ProductGrid 
          title="Catálogo Completo" 
          subtitle="Todos os produtos disponíveis no marketplace"
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default Products;
