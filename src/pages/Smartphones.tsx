import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, Zap, Shield, Truck } from "lucide-react";

const Smartphones = () => {
  const navigate = useNavigate();

  const smartphones = [
    {
      id: 1,
      name: "Samsung Galaxy S24 Ultra",
      price: "95.000",
      image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80",
      specs: "12GB RAM, 256GB, Snapdragon 8 Gen 3, 200MP",
      brand: "Samsung"
    },
    {
      id: 2,
      name: "iPhone 15 Pro Max",
      price: "135.000",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80",
      specs: "8GB RAM, 256GB, A17 Pro, Titanium",
      brand: "Apple"
    },
    {
      id: 3,
      name: "Xiaomi 14 Pro",
      price: "68.000",
      image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80",
      specs: "12GB RAM, 256GB, Snapdragon 8 Gen 3, Leica",
      brand: "Xiaomi"
    },
    {
      id: 4,
      name: "Google Pixel 8 Pro",
      price: "78.000",
      image: "https://images.unsplash.com/photo-1598618443855-232ee0f819f2?w=600&q=80",
      specs: "12GB RAM, 256GB, Tensor G3, AI Camera",
      brand: "Google"
    },
    {
      id: 5,
      name: "OnePlus 12",
      price: "62.000",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
      specs: "16GB RAM, 512GB, Snapdragon 8 Gen 3",
      brand: "OnePlus"
    },
    {
      id: 6,
      name: "Samsung Galaxy Z Fold 5",
      price: "115.000",
      image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&q=80",
      specs: "12GB RAM, 512GB, Dobrável, S Pen",
      brand: "Samsung"
    },
    {
      id: 7,
      name: "iPhone 14 Pro",
      price: "98.000",
      image: "https://images.unsplash.com/photo-1663499482523-1c0d8c17d8ca?w=600&q=80",
      specs: "6GB RAM, 256GB, A16 Bionic, Dynamic Island",
      brand: "Apple"
    },
    {
      id: 8,
      name: "Motorola Edge 40 Pro",
      price: "48.000",
      image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80",
      specs: "12GB RAM, 256GB, Snapdragon 8 Gen 2",
      brand: "Motorola"
    },
    {
      id: 9,
      name: "Xiaomi Redmi Note 13 Pro",
      price: "32.000",
      image: "https://images.unsplash.com/photo-1592286927505-2fd0f2f0b7d9?w=600&q=80",
      specs: "8GB RAM, 256GB, MediaTek Dimensity 7200",
      brand: "Xiaomi"
    },
    {
      id: 10,
      name: "Samsung Galaxy A54",
      price: "38.000",
      image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80",
      specs: "8GB RAM, 256GB, Exynos 1380, 50MP",
      brand: "Samsung"
    },
    {
      id: 11,
      name: "iPhone 13",
      price: "72.000",
      image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=600&q=80",
      specs: "4GB RAM, 128GB, A15 Bionic, Dual Camera",
      brand: "Apple"
    },
    {
      id: 12,
      name: "Realme GT 5 Pro",
      price: "42.000",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
      specs: "12GB RAM, 256GB, Snapdragon 8 Gen 3",
      brand: "Realme"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="cyber-grid py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Smartphone className="w-12 h-12 text-primary" />
              <h1 className="text-5xl font-black">
                <span className="gradient-text">Smartphones</span>
              </h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Os melhores smartphones do mercado com garantia e entrega rápida
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {smartphones.map((phone) => (
              <Card key={phone.id} className="card-modern hover-lift overflow-hidden group">
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                  <img
                    src={phone.image}
                    alt={phone.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                    {phone.brand}
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {phone.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {phone.specs}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-primary">
                        {phone.price}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">MT</span>
                    </div>
                    <Button
                      className="bg-gradient-to-r from-primary to-accent glow-primary"
                      onClick={() => navigate(`/produto/${phone.id}`)}
                    >
                      Ver
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Info Section */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="glass p-6 text-center">
              <Truck className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-bold text-lg mb-2">Entrega Grátis</h3>
              <p className="text-sm text-muted-foreground">
                Frete grátis para Maputo em compras acima de 50.000 MT
              </p>
            </Card>
            
            <Card className="glass p-6 text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-bold text-lg mb-2">Garantia Original</h3>
              <p className="text-sm text-muted-foreground">
                Todos os smartphones com garantia oficial do fabricante
              </p>
            </Card>
            
            <Card className="glass p-6 text-center">
              <Zap className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-bold text-lg mb-2">Parcelamento</h3>
              <p className="text-sm text-muted-foreground">
                Parcele em até 12x sem juros no cartão de crédito
              </p>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Smartphones;
