import { useState } from 'react';
import { Bell, BellRing, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useCreatePriceAlert, useCheckProductAlert, useDeletePriceAlert } from '@/hooks/usePriceAlerts';
import { useToast } from '@/hooks/use-toast';

interface PriceAlertButtonProps {
  productId: string;
  productName: string;
  currentPrice: number;
  className?: string;
}

export function PriceAlertButton({ productId, productName, currentPrice, className }: PriceAlertButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState('');
  
  const { data: existingAlert, isLoading } = useCheckProductAlert(user?.id, productId);
  const createAlert = useCreatePriceAlert();
  const deleteAlert = useDeletePriceAlert();
  
  const hasActiveAlert = existingAlert && existingAlert.is_active && !existingAlert.is_triggered;
  
  const handleCreateAlert = async () => {
    if (!user || !targetPrice) return;
    
    const price = parseFloat(targetPrice.replace(',', '.'));
    if (isNaN(price) || price <= 0) {
      toast({
        title: 'Preço inválido',
        description: 'Por favor, insira um preço válido.',
        variant: 'destructive',
      });
      return;
    }
    
    if (price >= currentPrice) {
      toast({
        title: 'Preço muito alto',
        description: 'O preço alvo deve ser menor que o preço atual.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await createAlert.mutateAsync({
        userId: user.id,
        productId,
        targetPrice: price,
        currentPrice,
      });
      
      toast({
        title: 'Alerta criado!',
        description: `Será notificado quando o preço de "${productName}" baixar para ${price.toLocaleString('pt-MZ')} MT`,
      });
      
      setDialogOpen(false);
      setTargetPrice('');
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o alerta. Tente novamente.',
        variant: 'destructive',
      });
    }
  };
  
  const handleDeleteAlert = async () => {
    if (!user || !existingAlert) return;
    
    try {
      await deleteAlert.mutateAsync({
        userId: user.id,
        alertId: existingAlert.id,
      });
      
      toast({
        title: 'Alerta removido',
        description: 'O alerta de preço foi removido com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o alerta.',
        variant: 'destructive',
      });
    }
  };
  
  if (!user) {
    return null;
  }
  
  if (hasActiveAlert) {
    return (
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 ${className}`}>
          <Check className="h-4 w-4" />
          <span className="text-sm font-medium">
            Alerta: {existingAlert.target_price.toLocaleString('pt-MZ')} MT
          </span>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleDeleteAlert}
          className="text-destructive"
        >
          Remover
        </Button>
      </div>
    );
  }
  
  if (existingAlert?.is_triggered) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FF3131]/10 text-[#FF3131] ${className}`}>
        <BellRing className="h-4 w-4" />
        <span className="text-sm font-medium">Preço caiu! Clique para criar novo alerta</span>
      </div>
    );
  }
  
  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setDialogOpen(true)}
        className={`gap-2 ${className}`}
      >
        <Bell className="h-4 w-4" />
        Avisar-me quando baixar
      </Button>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Definir Alerta de Preço</DialogTitle>
            <DialogDescription>
              Será notificado quando o preço de "{productName}" baixar para o valor desejado.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <span className="text-sm text-muted-foreground">Preço atual:</span>
              <p className="text-lg font-bold">{currentPrice.toLocaleString('pt-MZ')} MT</p>
            </div>
            
            <label className="text-sm font-medium mb-2 block">
              Preço alvo (será notificado quando atingir):
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Ex: 15000"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value.replace(/[^0-9,.]/g, ''))}
                className="flex-1"
              />
              <span className="flex items-center px-3 text-muted-foreground">MT</span>
            </div>
            
            {targetPrice && (
              <p className="text-sm text-green-600 mt-2">
                {((1 - parseFloat(targetPrice.replace(',', '.')) / currentPrice) * 100).toFixed(0)}% de desconto!
              </p>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateAlert}
              disabled={!targetPrice || createAlert.isPending}
              className="bg-[#FF3131] hover:bg-[#FF5555]"
            >
              Criar Alerta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PriceAlertButton;
