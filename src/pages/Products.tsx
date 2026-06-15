import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";
import MegaMenu from "@/components/MegaMenu";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import ProductFilters from "@/components/ProductFilters";
import ProductPagination from "@/components/ProductPagination";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid3x3, LayoutGrid, Loader2, Camera } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { ProductFilters as FilterType } from "@/services/productService";

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const promoQuery = searchParams.get('promo');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterType>({
    categories: [],
    priceRange: [0, 200000],
    brands: [],
    ratings: [],
    search: searchQuery,
    onSale: promoQuery === 'true' ? true : undefined
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const { data: products, isLoading, error, refetch } = useProducts(filters);
  
  const totalItems = products?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
    refetch();
  }, [location.pathname, searchQuery, promoQuery]);

  useEffect(() => {
    setFilters(prev => ({ ...prev, search: searchQuery, onSale: promoQuery === 'true' ? true : undefined }));
    setCurrentPage(1);
  }, [searchQuery, promoQuery]);

  const activeFiltersCount = 
    (filters.categories?.length || 0) + 
    (filters.brands?.length || 0) + 
    (filters.ratings?.length || 0) + 
    (filters.priceRange && (filters.priceRange[0] > 0 || filters.priceRange[1] < 200000) ? 1 : 0);

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MegaMenu />
      
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumbs 
          items={[
            { label: promoQuery ? 'Promoções' : searchQuery ? `Pesquisa: ${searchQuery}` : 'Todos os Produtos' }
          ]} 
        />
      </div>
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {promoQuery ? '🔥 Promoções Especiais' : searchQuery ? `Resultados para "${searchQuery}"` : 'Todos os Produtos'}
            </h1>
            <p className="text-lg text-muted-foreground">
              {promoQuery ? 'As melhores ofertas em tecnologia' : 'Explore o nosso catálogo completo de tecnologia'}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Sort Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 p-4 bg-card rounded-lg border border-border">
          <div className="flex items-center gap-2">
            <ProductFilters 
              onFilterChange={handleFilterChange}
              activeFiltersCount={activeFiltersCount}
            />
            <span className="text-sm text-muted-foreground">
              {isLoading ? 'Carregando...' : `${totalItems} produtos encontrados`}
            </span>
            <Button
              variant="outline"
              className="border-[#FF3131] text-[#FF3131] hover:bg-[#FF3131] hover:text-white ml-4"
              onClick={() => navigate('/kit-cctv')}
            >
              <Camera className="h-4 w-4 mr-2" />
              Monte seu Kit CCTV
            </Button>
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
                <SelectItem value="popular">Mais Populares</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-1 border border-border rounded-md p-1">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('list')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500">Erro ao carregar produtos</p>
          </div>
        ) : (
          <ProductGrid 
            title="" 
            subtitle=""
            products={products || []}
            loading={isLoading}
          />
        )}

        {!isLoading && !error && totalItems > 0 && (
          <ProductPagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Products;
