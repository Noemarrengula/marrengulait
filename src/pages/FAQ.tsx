import { useState } from "react";
import Header from "@/components/Header";
import MegaMenu from "@/components/MegaMenu";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ChevronDown, ChevronUp, Search, HelpCircle, MessageCircle, Phone, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]));

  const toggleItem = (index: number) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const faqCategories = [
    {
      title: "Encomendas e Entregas",
      icon: "📦",
      questions: [
        {
          q: "Como posso rastrear a minha encomenda?",
          a: "Após a confirmação do pagamento, receberá um email/SMS com o número de rastreamento. Pode acompanhar o estado da entrega na secção 'Os Meus Pedidos' ou contacting-nos via WhatsApp."
        },
        {
          q: "Quanto tempo demora a entrega?",
          a: "Para Maputo: 2-5 dias úteis. Para outras provinces: 5-10 dias úteis. Entregas urgentes podem ser solicitadas com custo adicional."
        },
        {
          q: "Quais são os custos de envio?",
          a: "Os custos variam conforme a localização e peso do produto. Para encomendas acima de 5.000 MT, oferecemos frete grátis em Maputo! Os custos exatos são calculados durante o checkout."
        },
        {
          q: "Posso recolher a encomenda pessoalmente?",
          a: "Sim! Oferecemos a opção de recolha na nossa loja em Maputo. Após fazer o pedido, receberá uma confirmação quando estiver pronto para recolha."
        },
        {
          q: "A transportadora pode entregar num horário específico?",
          a: "As entregas são feitas durante o horário comercial (8h-17h). Para pedidos especiais, contacte-nos antes para verificar disponibilidade."
        }
      ]
    },
    {
      title: "Pagamentos",
      icon: "💳",
      questions: [
        {
          q: "Que métodos de pagamento são aceites?",
          a: "Aceitamos M-Pesa, E-Mola, transferência bancária e pagamento na entrega (apenas em Maputo para encomendas até 10.000 MT)."
        },
        {
          q: "Como faço o pagamento por M-Pesa?",
          a: "Após selecionar M-Pesa no checkout, receberá um código no seu telemóvel. Vá a qualquer ATM M-Pesa ou use *150# e insira o código fornecido. O pagamento será confirmado automaticamente."
        },
        {
          q: "O pagamento é seguro?",
          a: "Sim! Utilizamos processamento de pagamentos seguro através do Supabase. Os seus dados financeiros nunca são armazenados nos nossos servidores."
        },
        {
          q: "Posso pagar em prestações?",
          a: "Atualmente não oferecemos pagamento em prestações, mas estamos a trabalhar nessa funcionalidade. Por enquanto, pode pagar via M-Pesa em qualquer valor."
        },
        {
          q: "Recebi um comprovativo de pagamento, e agora?",
          a: "O comprovativo é opcional. Após o pagamento, aguarde 15-30 minutos para a confirmação automática. Se não receber confirmação, contacte-nos via WhatsApp com o comprovativo."
        }
      ]
    },
    {
      title: "Devoluções e Garantias",
      icon: "🔄",
      questions: [
        {
          q: "Qual é a política de devolução?",
          a: "Tem 7 dias para devolver qualquer produto, desde que esteja em perfeito estado e na embalagem original. Produtos personalizados ou danificados não são elegíveis para devolução."
        },
        {
          q: "Como solicito uma devolução?",
          a: "Contacte-nos via WhatsApp ou email com o número do pedido. Iremos providenciar a recolha do produto (custos de devolução são do cliente, exceto em caso de defeito)."
        },
        {
          q: "Em quanto tempo recebo o reembolso?",
          a: "Após receção e verificação do produto devolvido, o reembolso é processado em até 14 dias úteis para a mesma forma de pagamento utilizada."
        },
        {
          q: "O meu produto chegou danificado. O que fazer?",
          a: "Abra o produto na presença do entregador e, se notar qualquer dano, recuse a entrega ou anote no recibo. Contacte-nos imediatamente com fotos do produto danificado."
        },
        {
          q: "Qual é o período de garantia?",
          a: "A garantia varia conforme o produto: equipamentos eletrónicos geralmente têm 12 meses de garantia do fabricante. A garantia não cobre danos por uso indevido."
        }
      ]
    },
    {
      title: "Conta e Login",
      icon: "👤",
      questions: [
        {
          q: "Como crio uma conta?",
          a: "Clique em 'Entrar' no topo da página e depois em 'Criar Conta'. Preencha os seus dados e confirme o email. O registo é gratuito."
        },
        {
          q: "Esqueci-me da palavra-passe. Como recupero?",
          a: "Clique em 'Esqueci-me da palavra-passe' na página de login. Introduza o seu email e receberá um link para redefinir a palavra-passe."
        },
        {
          q: "Posso alterar os meus dados pessoais?",
          a: "Sim! Aceda à sua conta, clique no seu nome e selecione 'Definições de Conta' para atualizar os seus dados."
        },
        {
          q: "Eliminem a minha conta",
          a: "Pode solicitar a eliminação da conta contactando-nos por email. Os seus dados serão removidos em conformidade com a nossa política de privacidade."
        }
      ]
    },
    {
      title: "Produtos e Stock",
      icon: "🛍️",
      questions: [
        {
          q: "Como sei se um produto está em stock?",
          a: "A disponibilidade é mostrada em cada página de produto. Se mostrar 'Esgotado', pode deixar o seu email para ser notificado quando estiver disponível."
        },
        {
          q: "O preço que vi é o preço final?",
          a: "Sim! Os preços apresentados já incluem IVA. Não há custos adicionais além do frete, a menos que opte por serviços extras."
        },
        {
          q: "Encontram-se o produto que procuro?",
          a: "Se não encontrou o que procura, contacte-nos! Temos acesso a um vasto catálogo e podemos encomendar produtos específicos sob pedido."
        },
        {
          q: "Os produtos são originais?",
          a: "Sim! Trabalhamos apenas com fornecedores autorizados. Todos os nossos produtos são 100% originais com garantia do fabricante."
        },
        {
          q: "Posso ver o produto antes de comprar?",
          a: "Para clientes em Maputo, oferecemos a possibilidade de ver/experimentar alguns produtos antes da compra final. Contacte-nos para agendar."
        }
      ]
    },
    {
      title: "Serviços de TI",
      icon: "🖥️",
      questions: [
        {
          q: "Que serviços de TI oferecem?",
          a: "Oferecemos instalação de redes, configuração de servidores, manutenção de computadores, instalação de CCTV, desenvolvimento web e consultoria de TI."
        },
        {
          q: "Como solicito um orçamento para serviços?",
          a: "Contacte-nos via WhatsApp, email ou preencha o formulário na página de Serviços. A nossa equipa responde em até 24 horas com um orçamento personalizado."
        },
        {
          q: "Oferecem suporte técnico pós-venda?",
          a: "Sim! Clientes com produtos adquiridos na Marrengula-IT têm prioridade no suporte técnico. Oferecemos suporte por telefone, WhatsApp e acesso remoto."
        },
        {
          q: "Fazem instalações fora de Maputo?",
          a: "Sim, mas会有 custos adicionais de deslocação. Para provinces, contacte-nos para verificar disponibilidade e custos."
        }
      ]
    }
  ];

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MegaMenu />
      
      <div className="container mx-auto px-4 py-4">
        <Breadcrumbs items={[{ label: 'FAQ - Perguntas Frequentes' }]} />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Perguntas Frequentes</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Encontre respostas para as dúvidas mais comuns sobre encomendas, pagamentos, 
            devoluções e os nossos serviços.
          </p>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Pesquisar perguntas..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-lg"
          />
        </div>

        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Não encontrámos resultados para "{searchQuery}"</p>
            <p className="text-sm text-muted-foreground mt-2">
              Tente uma pesquisa diferente ou{" "}
              <a href="/contacto" className="text-primary hover:underline">contacte-nos</a>.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredCategories.map((category, catIndex) => (
              <div key={category.title}>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span>{category.icon}</span>
                  {category.title}
                </h2>
                <div className="space-y-2">
                  {category.questions.map((question, qIndex) => {
                    const globalIndex = catIndex * 100 + qIndex;
                    const isOpen = openItems.has(globalIndex);
                    return (
                      <Card key={globalIndex} className={isOpen ? 'border-primary/50' : ''}>
                        <CardContent className="p-0">
                          <button
                            onClick={() => toggleItem(globalIndex)}
                            className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-muted/50 transition-colors"
                          >
                            <span className="font-medium">{question.q}</span>
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="px-4 pb-4 text-muted-foreground">
                              {question.a}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 p-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl text-center">
          <h3 className="text-2xl font-bold mb-4">Não encontrou a resposta?</h3>
          <p className="text-muted-foreground mb-6">
            A nossa equipa está pronta para ajudar. Entre em contacto connosco!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://wa.me/258864738133" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
            <a 
              href="tel:+258864738133"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Ligar Agora
            </a>
            <a 
              href="mailto:marrengulait@gmail.com"
              className="inline-flex items-center justify-center gap-2 border border-input bg-background px-6 py-3 rounded-lg hover:bg-muted transition-colors"
            >
              <Mail className="w-5 h-5" />
              Email
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
