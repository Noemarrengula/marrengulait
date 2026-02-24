import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, Gift, Star, Crown } from "lucide-react";

const LoyaltyProgram = () => {
  const userPoints = 2450;
  const currentTier = "silver";
  const nextTier = "gold";
  const pointsToNextTier = 5000 - userPoints;
  const progress = (userPoints / 5000) * 100;

  const tiers = [
    { name: "Bronze", icon: Award, color: "text-orange-600", min: 0 },
    { name: "Silver", icon: Star, color: "text-gray-400", min: 1000 },
    { name: "Gold", icon: Gift, color: "text-yellow-500", min: 5000 },
    { name: "Platinum", icon: Crown, color: "text-purple-500", min: 10000 }
  ];

  const benefits = {
    silver: ["5% Cashback", "Frete Grátis", "Suporte Prioritário"],
    gold: ["10% Cashback", "Frete Grátis", "Garantia Estendida", "Acesso Antecipado"],
    platinum: ["15% Cashback", "Frete Grátis Premium", "Garantia Vitalícia", "Gerente Dedicado"]
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold mb-1">Programa de Fidelidade</h3>
          <p className="text-muted-foreground">Ganhe pontos e desbloqueie benefícios</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-primary">{userPoints}</div>
          <div className="text-sm text-muted-foreground">pontos</div>
        </div>
      </div>

      {/* Tier Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold capitalize">{currentTier}</span>
          <span className="text-muted-foreground">
            Faltam {pointsToNextTier} pts para {nextTier}
          </span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      {/* Tiers */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {tiers.map((tier) => {
          const Icon = tier.icon;
          const isActive = tier.name.toLowerCase() === currentTier;
          const isUnlocked = userPoints >= tier.min;
          
          return (
            <div
              key={tier.name}
              className={`text-center p-3 rounded-lg border-2 transition-all ${
                isActive
                  ? "border-primary bg-primary/10"
                  : isUnlocked
                  ? "border-border bg-background"
                  : "border-border/50 bg-muted/50 opacity-50"
              }`}
            >
              <Icon className={`w-6 h-6 mx-auto mb-1 ${isActive ? "text-primary" : tier.color}`} />
              <div className="text-xs font-semibold">{tier.name}</div>
            </div>
          );
        })}
      </div>

      {/* Current Benefits */}
      <div>
        <h4 className="font-semibold mb-3">Seus Benefícios Atuais:</h4>
        <div className="grid grid-cols-2 gap-2">
          {benefits[currentTier as keyof typeof benefits].map((benefit) => (
            <div key={benefit} className="flex items-center gap-2 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              {benefit}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default LoyaltyProgram;
