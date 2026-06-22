import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, Tag, X, Check, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EmptyState from '@/components/EmptyState';
import { useState } from 'react';

const Cart = () => {
  const navigate = useNavigate();
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    totalItems,
    subtotal,
    discount,
    total,
    coupon,
    applyCoupon,
    removeCoupon 
  } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    await applyCoupon(couponCode);
    setIsApplyingCoupon(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyCoupon();
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-12">
          <EmptyState
            icon={ShoppingBag}
            title="Carrinho vazio"
            description="Adicione produtos ao carrinho para começar suas compras"
            actionLabel="Ver Produtos"
            onAction={() => navigate('/produtos')}
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Carrinho de Compras</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <Card key={item.id} className="p-4">
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    {item.storeName && (
                      <p className="text-sm text-muted-foreground mb-2">
                        Por: {item.storeName}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Remover item"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      MT {(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      MT {item.price.toFixed(2)} cada
                    </p>
                  </div>
                </div>
              </Card>
            ))}
            
            <Button
              variant="outline"
              className="w-full"
              onClick={clearCart}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar Carrinho
            </Button>
          </div>
          
          <div>
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>MT {subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      Desconto ({coupon?.code})
                    </span>
                    <span>-MT {discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span>Entrega</span>
                  <span className="text-green-600 font-medium flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Grátis
                  </span>
                </div>
                
                {coupon ? (
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <Check className="h-4 w-4" />
                        <span className="text-sm font-medium">{coupon.code}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Remover cupão"
                        className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                        onClick={removeCoupon}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 border-t">
                    <label className="text-sm font-medium mb-2 block">Código de Cupão</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ex: BEMVINDO10"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        onKeyDown={handleKeyDown}
                        className="uppercase"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon || !couponCode.trim()}
                      >
                        {isApplyingCoupon ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Aplicar'
                        )}
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-[#FF3131]">MT {total.toFixed(2)}</span>
                </div>
              </div>
              
              <Link to="/checkout">
                <Button className="w-full bg-[#FF3131] hover:bg-[#FF5555]" size="lg">
                  Finalizar Compra
                </Button>
              </Link>
              
              <Link to="/produtos">
                <Button variant="outline" className="w-full mt-2">
                  Continuar Comprando
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Cart;
