import ProductCard from "./ProductCard";

interface ProductGridProps {
  title: string;
  subtitle?: string;
}

const ProductGrid = ({ title, subtitle }: ProductGridProps) => {
  // Mock product data
  const products = [
    {
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
      title: "NVIDIA GeForce RTX 4070 Ti - 12GB GDDR6X",
      price: "72.500,00 MT",
      image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400",
      rating: 5,
      reviews: 189,
      badge: "Novo",
      storeName: "Hardware Pro"
    },
    {
      title: "Samsung 27\" Monitor Curvo 144Hz Gaming",
      price: "18.900,00 MT",
      oldPrice: "22.000,00 MT",
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400",
      rating: 4,
      reviews: 567,
      storeName: "Display Tech"
    },
    {
      title: "Teclado Mecânico RGB Logitech G915 TKL Wireless",
      price: "12.500,00 MT",
      image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400",
      rating: 5,
      reviews: 342,
      badge: "Popular",
      storeName: "Periféricos MZ"
    },
    {
      title: "Apple MacBook Pro 14\" M3 Pro, 18GB RAM, 512GB SSD",
      price: "185.000,00 MT",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
      rating: 5,
      reviews: 891,
      storeName: "Apple Store MZ"
    },
    {
      title: "Router Wi-Fi 6 TP-Link Archer AX73 - Dual Band",
      price: "8.900,00 MT",
      image: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=400",
      rating: 4,
      reviews: 156,
      storeName: "Network Solutions"
    },
    {
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
      title: "Headset Gamer HyperX Cloud III Wireless - 7.1 Surround",
      price: "14.900,00 MT",
      image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=400",
      rating: 5,
      reviews: 678,
      storeName: "Gaming Gear"
    },
  ];

  return (
    <section className="py-12 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground">{title}</h2>
          {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
