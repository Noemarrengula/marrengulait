import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Smartphone, Building2, Plus } from "lucide-react";
import { useState } from "react";

const PaymentMethods = () => {
  const [selected, setSelected] = useState("mpesa");

  const methods = [
    {
      id: "mpesa",
      name: "M-Pesa",
      icon: Smartphone,
      description: "Pagamento instantâneo via M-Pesa",
      details: "84 XXX XXXX"
    },
    {
      id: "card",
      name: "Cartão de Crédito",
      icon: CreditCard,
      description: "Visa, Mastercard - Parcele em até 12x",
      details: "**** **** **** 4532"
    },
    {
      id: "bank",
      name: "Transferência Bancária",
      icon: Building2,
      description: "BCI, Millennium BIM, Standard Bank",
      details: "Confirmação em 24h"
    }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Método de Pagamento</h3>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Adicionar
        </Button>
      </div>

      <RadioGroup value={selected} onValueChange={setSelected} className="space-y-3">
        {methods.map((method) => {
          const Icon = method.icon;
          return (
            <Label
              key={method.id}
              htmlFor={method.id}
              className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selected === method.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <RadioGroupItem value={method.id} id={method.id} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="font-semibold">{method.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">{method.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{method.details}</p>
              </div>
            </Label>
          );
        })}
      </RadioGroup>

      {/* Installment Info */}
      {selected === "card" && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            💳 Parcele sem juros
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>3x de 10.000 MT</div>
            <div>6x de 5.000 MT</div>
            <div>12x de 2.500 MT</div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PaymentMethods;
