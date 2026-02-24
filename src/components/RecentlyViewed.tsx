import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
}

const RecentlyViewed = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const viewed = localStorage.getItem('recentlyViewed');
    if (viewed) {
      setProducts(JSON.parse(viewed).slice(0, 6));
    }
  }, []);

  if (products.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold whitespace-nowrap">
            <Eye className="w-4 h-4 text-primary" />
            Vistos Recentemente
          </div>
          
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex gap-3">
              {products.map((product) => (
                <Card
                  key={product.id}
                  onClick={() => navigate(`/produto/${product.id}`)}
                  className="flex-shrink-0 w-32 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <img src={product.image} alt={product.name} className="w-full h-20 object-cover rounded-t" />
                  <div className="p-2">
                    <p className="text-xs font-medium line-clamp-1">{product.name}</p>
                    <p className="text-sm font-bold text-primary">{product.price} MT</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              localStorage.removeItem('recentlyViewed');
              setProducts([]);
            }}
            className="whitespace-nowrap"
          >
            Limpar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewed;
