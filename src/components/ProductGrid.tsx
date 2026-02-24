import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

interface ProductGridProps {
  title: string;
  subtitle?: string;
  loading?: boolean;
}

const ProductGrid = ({ title, subtitle, loading = false }: ProductGridProps) => {
  // Mock product data
  const products = [
    {
      id: "prod-1",
      title: "Laptop Dell XPS 15 - Intel i7 13th Gen, 16GB RAM, 512GB SSD",
      price: "95.000,00 MT",
      oldPrice: "110.000,00 MT",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
      rating: 5,
      reviews: 234,
      badge: "-15%",
      storeName: "TechStore MZ"
    },
    {
      id: "prod-2",
      title: "NVIDIA GeForce RTX 4070 Ti - 12GB GDDR6X",
      price: "72.500,00 MT",
      image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400",
      rating: 5,
      reviews: 189,
      badge: "Novo",
      storeName: "Hardware Pro"
    },
    {
      id: "prod-3",
      title: "Samsung 27\" Monitor Curvo 144Hz Gaming",
      price: "18.900,00 MT",
      oldPrice: "22.000,00 MT",
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400",
      rating: 4,
      reviews: 567,
      storeName: "Display Tech"
    },
    {
      id: "prod-4",
      title: "Teclado Mecânico RGB Logitech G915 TKL Wireless",
      price: "12.500,00 MT",
      image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400",
      rating: 5,
      reviews: 342,
      badge: "Popular",
      storeName: "Periféricos MZ"
    },
    {
      id: "prod-5",
      title: "Apple MacBook Pro 14\" M3 Pro, 18GB RAM, 512GB SSD",
      price: "185.000,00 MT",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
      rating: 5,
      reviews: 891,
      storeName: "Apple Store MZ"
    },
    {
      id: "prod-6",
      title: "Router Wi-Fi 6 TP-Link Archer AX73 - Dual Band",
      price: "8.900,00 MT",
      image: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=400",
      rating: 4,
      reviews: 156,
      storeName: "Network Solutions"
    },
    {
      id: "prod-7",
      title: "SSD Kingston NV2 1TB M.2 NVMe PCIe 4.0",
      price: "6.500,00 MT",
      oldPrice: "7.800,00 MT",
      image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400",
      rating: 5,
      reviews: 423,
      badge: "-17%",
      storeName: "Storage Pro"
    },
    {
      id: "prod-8",
      title: "Headset Gamer HyperX Cloud III Wireless - 7.1 Surround",
      price: "14.900,00 MT",
      image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=400",
      rating: 5,
      reviews: 678,
      storeName: "Gaming Gear"
    },
  ];

  return (
    <section className="py-16 cyber-grid relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-3">
            <span className="gradient-text">{title}</span>
          </h2>
          {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={`skeleton-${index}`} />
            ))
          ) : (
            products.map((product, index) => (
              <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                <ProductCard {...product} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
