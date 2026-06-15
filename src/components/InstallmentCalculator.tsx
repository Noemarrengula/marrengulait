import { Calculator } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

interface InstallmentCalculatorProps {
  price: number;
  maxInstallments?: number;
}

const InstallmentCalculator = ({ price, maxInstallments = 12 }: InstallmentCalculatorProps) => {
  const calculateInstallment = (installments: number) => {
    return (price / installments).toFixed(2);
  };

  const { locale, currency } = useSettings();
  const bestOption = maxInstallments;
  const installmentValue = calculateInstallment(bestOption);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calculator className="w-4 h-4" />
        <span>ou em até</span>
      </div>
      <div className="text-2xl font-bold text-primary">
        {bestOption}x de {Number(installmentValue).toLocaleString(locale)} {currency}
      </div>
      <p className="text-xs text-muted-foreground">sem juros no cartão</p>
    </div>
  );
};

export default InstallmentCalculator;
