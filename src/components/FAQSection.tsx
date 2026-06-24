import { useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Como faço uma encomenda?",
    answer: "Pode fazer uma encomenda directamente pelo nosso site, adicionando produtos ao carrinho e finalizando o checkout. Também pode encomendar via WhatsApp no número +258 864 738 133."
  },
  {
    question: "Quais são as formas de pagamento?",
    answer: "Aceitamos: M-Pesa, e-Mola, Mkesh, transferência bancária (BIM, BCI, Standard Bank), pagamento na entrega (Maputo cidade) e PayPal para clientes internacionais."
  },
  {
    question: "Quanto tempo demora a entrega?",
    answer: "Maputo cidade: 1-2 dias úteis. Outras províncias: 3-5 dias úteis através de parceiros de transporte. Entrega gratuita para compras acima de 5.000 MT em Maputo."
  },
  {
    question: "Os produtos têm garantia?",
    answer: "Sim! Todos os produtos têm garantia mínima de 6 meses. Produtos de marcas como HP, Dell e Lenovo podem ter garantia estendida de até 3 anos."
  },
  {
    question: "Posso devolver um produto?",
    answer: "Sim, pode devolver produtos em até 7 dias após a receção, desde que estejam na embalagem original e sem sinais de uso."
  },
  {
    question: "Oferecem serviço de instalação?",
    answer: "Sim! Oferecemos serviços de instalação de CCTV, redes, configuração de servidores e muito mais. Consulte a nossa secção de Serviços de TI para mais detalhes."
  },
  {
    question: "Como posso rastrear o meu pedido?",
    answer: "Após a confirmação do pagamento, receberá um código de rastreamento. Pode usar esse código na secção 'Rastrear Pedido' do nosso site ou via WhatsApp."
  },
  {
    question: "Vocês fazem montagem de PCs personalizados?",
    answer: "Sim! Use a nossa ferramenta 'Monte Seu PC' para escolher os componentes e nós montamos o PC para si. Também aceitamos pedidos personalizados via WhatsApp."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = faqData.filter(faq => {
    if (!searchQuery) return true;
    return faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
           faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Perguntas <span className="gradient-text">Frequentes</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Encontre respostas rápidas para as suas dúvidas
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar perguntas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto space-y-2">
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Nenhuma pergunta encontrada</p>
              </CardContent>
            </Card>
          ) : (
            filtered.slice(0, 6).map((faq, index) => (
              <Card
                key={faq.question}
                className={`transition-all ${
                  openIndex === index ? "border-primary/50" : "border-border"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium text-foreground pr-4">{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-4 pb-4 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </Card>
            ))
          )}
        </div>

        {/* View all link */}
        <div className="text-center mt-8">
          <a
            href="/faq"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF3131] to-[#FF5555] text-white font-semibold rounded-lg hover:opacity-90 transition-all hover:scale-105"
          >
            Ver Todas as Perguntas
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
