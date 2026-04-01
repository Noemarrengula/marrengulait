import { useState, useEffect } from "react";
import { Zap, Clock } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface FlashSaleProps {
  productId: string;
  productName: string;
  originalPrice: number;
  salePrice: number;
  endTime: Date;
  stockLimit: number;
  soldCount: number;
}

const FlashSale = ({ productName, originalPrice, salePrice, endTime, stockLimit, soldCount }: FlashSaleProps) => {
  const { locale, currency, convertPrice } = useSettings();
  const [timeLeft, setTimeLeft] = useState("");
  
  const convertedSalePrice = convertPrice(salePrice);
  const convertedOriginalPrice = convertPrice(originalPrice);
  const discount = Math.round(((convertedOriginalPrice - convertedSalePrice) / convertedOriginalPrice) * 100);
  const stockPercentage = (soldCount / stockLimit) * 100;

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(endTime).getTime() - now;

      if (distance < 0) {
        setTimeLeft("ENCERRADO");
        clearInterval(timer);
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <Card className="relative overflow-hidden border-2 border-red-500 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950">
      <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-1 rounded-bl-lg font-bold flex items-center gap-1">
        <Zap className="w-4 h-4" />
        -{discount}%
      </div>
      
      <div className="p-6 pt-12">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
          <Zap className="w-5 h-5 animate-pulse" />
          <span className="font-bold text-lg">OFERTA RELÂMPAGO</span>
        </div>
        
        <h3 className="text-xl font-bold mb-4">{productName}</h3>
        
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-3xl font-bold text-red-600">{convertedSalePrice.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}</span>
          <span className="text-lg text-muted-foreground line-through">{convertedOriginalPrice.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}</span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Termina em:</span>
            </div>
            <span className="font-mono font-bold text-red-600">{timeLeft}</span>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Vendidos: {soldCount}/{stockLimit}</span>
              <span>{Math.round(stockPercentage)}%</span>
            </div>
            <Progress value={stockPercentage} className="h-2" />
          </div>
          
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold" size="lg">
            <Zap className="w-4 h-4 mr-2" />
            COMPRAR AGORA
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FlashSale;
