import { useState, useEffect, lazy, Suspense } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import MegaMenu from "@/components/MegaMenu";
import Footer from "@/components/Footer";
import DynamicSEO from "@/components/DynamicSEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import StockBadge from "@/components/StockBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { useSettings } from "@/context/SettingsContext";
import { toast } from "sonner";
import {
  ShoppingCart,
  Heart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Store,
  MessageCircle,
  Share2,
  ChevronLeft,
  Check,
  Minus,
  Plus,
  Loader2,
  Package,
  Clock,
  MapPin,
  Zap
} from "lucide-react";

const RelatedProducts = lazy(() => import("@/components/RelatedProducts"));
const ProductReviews = lazy(() => import("@/components/ProductReviews"));

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: product, isLoading, error, refetch } = useProduct(id || '');
  const { addItem } = useCart();
  const { locale, currency, convertPrice } = useSettings();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageKey, setImageKey] = useState(0);
  
  const convertedPrice = product ? convertPrice(product.price) : 0;
  const convertedOldPrice = product?.old_price ? convertPrice(product.old_price) : undefined;
  const priceSavings = product?.old_price ? convertPrice(product.old_price - product.price) : 0;

  useEffect(() => {
    refetch();
    setImageKey(prev => prev + 1);
  }, [location.pathname]);

  const getImageUrl = (url: string | undefined) => {
    if (!url) return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800";
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${Date.now()}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-24 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#FF3131]" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
          <p className="text-muted-foreground mb-6">O produto que procura não existe ou foi removido.</p>
          <Button onClick={() => navigate('/produtos')} className="bg-[#FF3131]">
            Voltar aos Produtos
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.name,
      price: product.price,
      image: product.images?.[0] || "",
      storeName: "Marrengula-IT",
    });
    toast.success("Produto adicionado ao carrinho!");
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos");
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.name,
        text: product.short_description || product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado!");
    }
  };

  const discount = product.old_price 
    ? Math.round((1 - product.price / product.old_price) * 100) 
    : 0;

  const specs = product.specifications as Record<string, string> || {};
  const features = product.features || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MegaMenu />
      
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumbs items={[
          { label: "Produtos", href: "/produtos" },
          { label: product.name }
        ]} />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                key={imageKey}
                src={getImageUrl(product.images?.[selectedImage])}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discount > 0 && (
                <Badge className="absolute top-4 left-4 bg-[#FF3131] text-white text-lg font-bold px-3 py-1">
                  -{discount}%
                </Badge>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive" className="text-lg">Esgotado</Badge>
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-[#FF3131]' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title & Rating */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.brand && (
                  <Badge variant="outline">{product.brand}</Badge>
                )}
                {product.featured && (
                  <Badge className="bg-[#FF3131]">Destaque</Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium">{product.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({product.reviews_count} avaliações)</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-[#FF3131]">
                  {convertedPrice.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                </span>
                {product.old_price && (
                  <span className="text-xl text-muted-foreground line-through">
                    {convertedOldPrice!.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                  </span>
                )}
              </div>
              {discount > 0 && (
                <p className="text-green-600 font-medium">
                  Poupa {currency} {priceSavings.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              )}
            </div>

            {/* Short Description */}
            {product.short_description && (
              <p className="text-muted-foreground">{product.short_description}</p>
            )}

            <Separator />

            {/* Stock & Delivery */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Package className={`h-5 w-5 ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`} />
                <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                  {product.stock > 0 ? `Em Stock (${product.stock})` : 'Esgotado'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-blue-500" />
                <span>Entrega em 24-48h</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-500" />
                <span>Maputo, Moçambique</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-500" />
                <span>Garantia 12 meses</span>
              </div>
            </div>

            <Separator />

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <StockBadge stock={product.stock} />
              
              {product.stock > 0 && (
                <div className="flex items-center gap-4">
                  <span className="font-medium">Quantidade:</span>
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  onClick={() => {
                    handleAddToCart();
                    navigate('/checkout');
                  }}
                  disabled={product.stock === 0}
                  className="flex-1 bg-gradient-to-r from-[#FF3131] via-[#FF5555] to-[#FF7B7B] hover:opacity-90 shadow-lg"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  {product.stock > 0 ? 'Comprar Agora' : 'Esgotado'}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 border-2 border-[#FF3131] text-[#FF3131] hover:bg-[#FF3131] hover:text-white"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Adicionar
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleToggleFavorite}
                  className={`w-14 shrink-0 ${isFavorite ? 'bg-red-50 border-red-200 text-red-500' : ''}`}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                </Button>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Partilhar
                </Button>
                <Button variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Perguntar
                </Button>
              </div>
            </div>

            <Separator />

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center gap-1 p-3 bg-muted/50 rounded-lg">
                <Truck className="h-6 w-6 text-[#FF3131]" />
                <span className="text-xs">Frete Grátis +5000MT</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-3 bg-muted/50 rounded-lg">
                <RotateCcw className="h-6 w-6 text-[#FF3131]" />
                <span className="text-xs">Devolução 7 dias</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-3 bg-muted/50 rounded-lg">
                <Shield className="h-6 w-6 text-[#FF3131]" />
                <span className="text-xs">Garantia 12 meses</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
              <TabsTrigger 
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF3131] data-[state=active]:bg-transparent"
              >
                Descrição
              </TabsTrigger>
              <TabsTrigger 
                value="specs"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF3131] data-[state=active]:bg-transparent"
              >
                Especificações
              </TabsTrigger>
              <TabsTrigger 
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF3131] data-[state=active]:bg-transparent"
              >
                Avaliações ({product.reviews_count})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <p>{product.description || "Descrição não disponível."}</p>
                
                {features.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-bold mb-3">Características:</h3>
                    <ul className="space-y-2">
                      {features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="specs" className="mt-6">
              <Card className="p-6">
                <table className="w-full">
                  <tbody>
                    {Object.entries(specs).map(([key, value]) => (
                      <tr key={key} className="border-b last:border-0">
                        <td className="py-3 font-medium text-muted-foreground">{key}</td>
                        <td className="py-3">{value}</td>
                      </tr>
                    ))}
                    {Object.keys(specs).length === 0 && (
                      <tr>
                        <td className="py-3 text-muted-foreground">Especificações não disponíveis.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Suspense fallback={<div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>}>
                <ProductReviews productId={product.id} />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Suspense fallback={null}>
        <RelatedProducts
          productId={product.id}
          category={product.category}
          title="Produtos Relacionados"
        />
      </Suspense>

      <Footer />
    </div>
  );
};

export default Product;
