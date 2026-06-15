import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Check, Minus, ShoppingCart } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { toast } from "sonner";

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string;
  rating: number;
  brand: string;
  category: string;
}

const ProductCompare = () => {
  const navigate = useNavigate();
  const { locale, currency } = useSettings();
  const [products, setProducts] = useState<Product[]>([]);

  const removeProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const addToCart = (product: Product) => {
    toast.success(`${product.title} adicionado ao carrinho!`);
  };

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Comparador de Produtos</h1>
          <p className="text-muted-foreground mb-8">
            Adicione produtos para comparar especificações lado a lado
          </p>
          <Button onClick={() => navigate('/produtos')}>
            Ir para Produtos
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Comparar Produtos</h1>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-4 text-left bg-secondary">Característica</th>
                {products.map(product => (
                  <th key={product.id} className="p-4 bg-secondary relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => removeProduct(product.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <img src={product.image_url} alt={product.title} className="w-32 h-32 object-cover mx-auto mb-2" />
                    <p className="font-semibold text-sm">{product.title}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 font-semibold border-t">Preço</td>
                {products.map(product => (
                  <td key={product.id} className="p-4 border-t text-center">
                    <span className="text-2xl font-bold text-primary">
                      {product.price.toLocaleString(locale)} {currency}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold border-t">Avaliação</td>
                {products.map(product => (
                  <td key={product.id} className="p-4 border-t text-center">
                    {product.rating}/5
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold border-t">Marca</td>
                {products.map(product => (
                  <td key={product.id} className="p-4 border-t text-center">
                    {product.brand}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold border-t">Categoria</td>
                {products.map(product => (
                  <td key={product.id} className="p-4 border-t text-center">
                    {product.category}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold border-t">Ação</td>
                {products.map(product => (
                  <td key={product.id} className="p-4 border-t text-center">
                    <Button onClick={() => addToCart(product)} className="w-full">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductCompare;
