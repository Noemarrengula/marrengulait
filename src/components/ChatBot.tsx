import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface Message {
  id: string;
  text: string;
  sender: "bot" | "user";
  timestamp: Date;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Olá! 👋 Sou o assistente virtual da MarrengulaIT. Como posso ajudar?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickReplies = [
    { text: "Ver produtos", response: "Temos laptops, hardware, periféricos e muito mais! Que categoria te interessa?" },
    { text: "Rastrear pedido", response: "Para rastrear seu pedido, acesse 'Meus Pedidos' no menu ou me informe o número do pedido." },
    { text: "Formas de pagamento", response: "Aceitamos M-Pesa, cartão de crédito/débito e pagamento na entrega. Parcelamos em até 12x sem juros!" },
    { text: "Falar com humano", response: "Conectando você com nossa equipe... Por favor, aguarde um momento. 📞" },
  ];

  const getBotResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();

    if (msg.includes("preço") || msg.includes("quanto custa")) {
      return "Os preços variam por produto. Posso te ajudar a encontrar algo específico? Digite o nome do produto que procura! 💰";
    }
    if (msg.includes("entrega") || msg.includes("frete")) {
      return "Entregamos em todo Moçambique! Frete grátis para compras acima de 5.000 MT. Prazo: 2-5 dias úteis. 📦";
    }
    if (msg.includes("garantia")) {
      return "Todos os produtos têm garantia do fabricante. Notebooks: 1 ano, Hardware: 2-3 anos. Trocas em até 7 dias! ✅";
    }
    if (msg.includes("notebook") || msg.includes("laptop")) {
      return "Temos ótimas opções de notebooks! Dell, HP, Lenovo, Apple... Qual sua faixa de preço? 💻";
    }
    if (msg.includes("gpu") || msg.includes("placa de video")) {
      return "Placas de vídeo NVIDIA e AMD disponíveis! RTX 4060, 4070, 4090... Qual seu orçamento? 🎮";
    }
    if (msg.includes("monte") || msg.includes("montar pc")) {
      return "Temos um configurador de PC! Acesse 'Monte Seu PC' no menu e escolha cada componente. Ou posso te ajudar aqui! 🖥️";
    }
    if (msg.includes("desconto") || msg.includes("promoção")) {
      return "Temos ofertas relâmpago diárias e cupons exclusivos! Confira a seção 'Promoções' no menu. Use o cupom BEMVINDO para 5% OFF! 🎁";
    }
    if (msg.includes("afiliado")) {
      return "Quer ser afiliado? Ganhe 5% de comissão em cada venda! Acesse 'Programa de Afiliados' no menu. 🤝";
    }
    if (msg.includes("obrigado") || msg.includes("valeu")) {
      return "Por nada! Estou sempre aqui para ajudar. Boa compra! 😊";
    }

    return "Interessante! Posso te ajudar com produtos, pedidos, pagamentos ou qualquer dúvida. O que você gostaria de saber? 🤔";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(input),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickReply = (reply: { text: string; response: string }) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: reply.text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: reply.response,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl bg-gradient-to-r from-primary to-accent hover:scale-110 transition-all z-50 glow-primary"
          size="icon"
        >
          <MessageCircle className="h-8 w-8 animate-bounce" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <>
          {/* Overlay para fechar ao clicar fora */}
          <div 
            className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col glass border-2 border-primary/20 animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-accent p-4 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">Assistente Virtual</h3>
                <p className="text-xs text-white/80">Online • Responde em segundos</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50 backdrop-blur-sm">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] p-3 rounded-2xl ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-primary to-accent text-white"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString("pt-MZ", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {message.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-accent" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div className="bg-secondary p-3 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 2 && (
            <div className="p-3 border-t bg-background/50 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground mb-2">Respostas rápidas:</p>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickReply(reply)}
                    className="text-xs hover:bg-primary hover:text-white transition-all"
                  >
                    {reply.text}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Digite sua mensagem..."
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                size="icon"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>
        </>
      )}
    </>
  );
};

export default ChatBot;
