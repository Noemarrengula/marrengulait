import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";
import MegaMenu from "@/components/MegaMenu";
import Footer from "@/components/Footer";
import ProductFilters from "@/components/ProductFilters";
import Breadcrumbs from "@/components/Breadcrumbs";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid3x3, LayoutGrid, Loader2 } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { ProductFilters as FilterType } from "@/services/productService";

interface CategoryPageProps {
  categoryId: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  heroGradient?: string;
  featuredBrands?: string[];
}

const CategoryPage = ({
  categoryId,
  title,
  subtitle,
  icon: Icon,
  heroGradient = "from-primary/10 via-accent/5 to-primary/10",
}: CategoryPageProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState<FilterType>({
    categories: [categoryId],
    priceRange: [0, 200000],
    brands: [],
    ratings: []
  });

  const { data: result, isLoading, error, refetch } = useProducts(filters);
  
  const products = result?.data || [];
  const totalItems = result?.count ?? products.length;

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
    refetch();
  }, [categoryId]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ 
      ...prev, 
      ...newFilters,
      categories: [categoryId]
    }));
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  const activeFiltersCount = 
    (filters.brands?.length || 0) + 
    (filters.ratings?.length || 0) + 
    (filters.priceRange && (filters.priceRange[0] > 0 || filters.priceRange[1] < 200000) ? 1 : 0);

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return (a.price || 0) - (b.price || 0);
      case 'price-desc':
        return (b.price || 0) - (a.price || 0);
      case 'newest':
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MegaMenu />
      
      <div className="container mx-auto px-4 py-4">
        <Breadcrumbs 
          items={[
            { label: 'Início', href: '/' },
            { label: title }
          ]} 
        />
      </div>
      
      <div className={`bg-gradient-to-r ${heroGradient} border-b border-border`}>
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-4 animate-slide-up">
            <div className="p-4 bg-primary/10 rounded-2xl">
              <Icon className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                {title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 p-4 bg-card rounded-lg border border-border">
          <div className="flex items-center gap-4">
            <ProductFilters 
              onFilterChange={handleFilterChange}
              activeFiltersCount={activeFiltersCount}
            />
            <span className="text-sm text-muted-foreground">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Carregando...
                </span>
              ) : (
                `${totalItems} produtos`
              )}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevância</SelectItem>
                <SelectItem value="price-asc">Menor Preço</SelectItem>
                <SelectItem value="price-desc">Maior Preço</SelectItem>
                <SelectItem value="newest">Mais Recentes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && (
          <div className="text-center py-12">
            <p className="text-destructive">Erro ao carregar produtos. Tente novamente.</p>
            <Button onClick={() => refetch()} className="mt-4">
              Tentar Novamente
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <EmptyState icon={Icon as never} title="Nenhum produto encontrado" description="Ainda não temos produtos nesta categoria, mas em breve teremos!" actionLabel="Ver Todos os Produtos" onAction={() => navigate('/produtos')} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <a 
                key={product.id} 
                href={`/produto/${product.id}`}
                className="group block"
              >
                <div className="card-modern hover-lift overflow-hidden bg-card/80 backdrop-blur-sm border-2 h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.old_price && product.old_price > product.price && (
                      <div className="absolute top-2 left-2 bg-[#FF3131] text-white px-2 py-1 rounded-md text-xs font-bold">
                        -{Math.round((1 - product.price / product.old_price) * 100)}%
                      </div>
                    )}
                    {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
                      <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                        Últimas {product.stock} unidades
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2 hover:text-[#FF3131] transition-colors">
                      {product.name}
                    </h3>
                    
                    {product.short_description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                        {product.short_description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-[#FF3131]">
                        {product.price?.toLocaleString('pt-MZ')} MT
                      </span>
                      {product.old_price && product.old_price > product.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          {product.old_price?.toLocaleString('pt-MZ')} MT
                        </span>
                      )}
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-[#FF3131] to-[#FF5555] hover:opacity-90"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/produto/${product.id}`);
                      }}
                    >
                      Ver Produto
                    </Button>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CategoryPage;
