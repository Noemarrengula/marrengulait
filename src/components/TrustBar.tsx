import { Shield, Truck, RefreshCw, Headphones, CreditCard, Award } from "lucide-react";

interface TrustItem {
  icon: React.ElementType;
  title: string;
  description: string;
}

const trustItems: TrustItem[] = [
  {
    icon: Shield,
    title: "Pagamento Seguro",
    description: "M-Pesa, e-Mola, Transferência"
  },
  {
    icon: Truck,
    title: "Entrega Rápida",
    description: "Maputo 24h, Províncias 3-5 dias"
  },
  {
    icon: RefreshCw,
    title: "Devolução Fácil",
    description: "7 dias para devolver"
  },
  {
    icon: Headphones,
    title: "Suporte 24/7",
    description: "WhatsApp, Email, Telefone"
  },
  {
    icon: CreditCard,
    title: "Parcelamento",
    description: "Até 3x sem juros"
  },
  {
    icon: Award,
    title: "Garantia Oficial",
    description: "6 meses a 3 anos"
  }
];

export default function TrustBar() {
  return (
    <section className="py-8 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {trustItems.map((item, index) => (
            <div
              key={item.title}
              className="flex items-center gap-3 group cursor-default animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
