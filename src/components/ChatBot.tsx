import { useState, useRef, useEffect } from "react";
import { useLockedBody } from "@/hooks/useLockedBody";
import { useNavigate } from "react-router-dom";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  text: string;
  sender: "bot" | "user";
  timestamp: Date;
  showQuickReplies?: boolean;
}

const WHATSAPP_NUMBER = "845807880";

const ChatBot = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  useLockedBody(isOpen, "chatbot");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Olá! 👋 Bem-vindo à MarrengulaIT!\n\nPosso ajudá-lo com:\n• Produtos e preços\n• Promoções\n• Entregas\n• Pagamentos\n• Suporte técnico\n\nComo posso ajudar?",
      sender: "bot",
      timestamp: new Date(),
      showQuickReplies: true,
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
    { text: "🛒 Ver Produtos", action: () => { navigate("/produtos"); setIsOpen(false); } },
    { text: "🔥 Promoções", action: () => { navigate("/produtos?promo=true"); setIsOpen(false); } },
    { text: "🚚 Entregas", action: () => sendBotMessage("📦 Entregamos em todo Moçambique!\n\n• Maputo/Matola: 1-2 dias\n• Outras cidades: 3-5 dias\n• Frete grátis: >5.000 MT") },
    { text: "💳 Pagamentos", action: () => sendBotMessage("💳 Formas de pagamento:\n\n• M-Pesa: 845 807 880\n• E-Mola: 864 738 133\n• Transferência bancária\n• Pagamento na entrega") },
    { text: "📱 WhatsApp", action: () => window.open(`https://wa.me/258${WHATSAPP_NUMBER.replace(/\s/g, "")}`, "_blank") },
    { text: "🖥️ Montar PC", action: () => { navigate("/monte-seu-pc"); setIsOpen(false); } },
  ];

  const sendBotMessage = (text: string, showReplies = true) => {
    const botMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "bot",
      timestamp: new Date(),
      showQuickReplies: showReplies,
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  const getBotResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();

    if (msg.includes("preço") || msg.includes("quanto") || msg.includes("custa")) {
      return "💰 Os preços variam por produto.\n\nQuer ver nossa lista completa?";
    }
    if (msg.includes("entrega") || msg.includes("frete") || msg.includes("envio")) {
      return "📦 Entregamos em todo Moçambique!\n\n• Maputo/Matola: 1-2 dias\n• Outras cidades: 3-5 dias\n• Frete grátis: >5.000 MT";
    }
    if (msg.includes("garantia") || msg.includes("troca")) {
      return "🛡️ Garantia:\n\n• Eletrónicos: 12 meses\n• Hardware: 2-3 anos\n• Troca: até 7 dias";
    }
    if (msg.includes("notebook") || msg.includes("laptop") || msg.includes("portátil")) {
      return "💻 Temos notebooks Dell, HP, Lenovo, ASUS e mais!\n\nQuer ver as opções?";
    }
    if (msg.includes("gpu") || msg.includes("placa") || msg.includes("rtx")) {
      return "🎮 Placas de vídeo disponíveis:\n\n• RTX 4060, 4070, 4080, 4090\n• AMD RX 6600, 6700, 6800";
    }
    if (msg.includes("cctv") || msg.includes("câmera") || msg.includes("camera") || msg.includes("segurança")) {
      return "📹 Sistemas CCTV Hikvision e Dahua!\n\n• Câmaras IP e HD\n• DVRs e NVRs\n• Kits completos\n• Instalação disponível";
    }
    if (msg.includes("montar") || msg.includes("configurar")) {
      return "🖥️ Temos um configurador de PC!\n\nAcesse 'Monte Seu PC' para escolher cada componente.";
    }
    if (msg.includes("desconto") || msg.includes("promoção")) {
      return "🎁 Promoções:\n\n• Frete grátis >5.000 MT\n• Cupom BEMVINDO: 5% OFF\n• Ofertas diárias!";
    }
    if (msg.includes("afiliad") || msg.includes("ganhar") || msg.includes("comissão")) {
      return "🤝 Programa de Afiliados!\n\n• Ganhe 5% por venda\n• Links personalizados\n• Pagamentos mensais";
    }
    if (msg.includes("contacto") || msg.includes("telefone") || msg.includes("whatsapp")) {
      return `📞 Contactos:\n\n• WhatsApp: +258 ${WHATSAPP_NUMBER}\n• Email: contacto@marrengulait.co.mz\n\nHorário: Seg-Sáb 8h-18h`;
    }
    if (msg.includes("obrigado") || msg.includes("valeu")) {
      return "😊 Por nada! Estou sempre aqui para ajudar.\n\nBoa compra! 🛒";
    }
    if (msg.includes("oi") || msg.includes("olá") || msg.includes("hello")) {
      return "Olá! 👋 Como posso ajudá-lo hoje?";
    }

    return "🤔 Posso ajudá-lo com:\n\n• Produtos e preços\n• Promoções\n• Entregas\n• Pagamentos\n• Suporte técnico\n\nO que precisa?";
  };

  const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const history = messages
        .filter((m) => m.id !== "1" && m.sender !== "bot_ai")
        .slice(-10)
        .map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          text: m.text,
        }));

      const { data, error } = await supabase.functions.invoke("chat-ai", {
        body: { message: userMessage, history },
      });

      if (error) throw error;
      return data.reply || getBotResponse(userMessage);
    } catch {
      return getBotResponse(userMessage);
    }
  };

  const handleSend = async () => {
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

    const reply = await getAIResponse(input);

    sendBotMessage(reply);
    setIsTyping(false);
  };

  const handleQuickReply = (reply: { text: string; action: () => void }) => {
    reply.action();
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: reply.text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
  };

  const lastMessage = messages[messages.length - 1];
  const showQuickReplies = lastMessage?.sender === "bot" && lastMessage?.showQuickReplies;

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl bg-gradient-to-r from-[#FF3131] to-[#FF5555] hover:scale-110 transition-all z-50"
          size="icon"
        >
          <MessageCircle className="h-8 w-8 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col border-2 border-[#FF3131]/20">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#FF3131] to-[#FF5555] p-4 rounded-t-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Assistente MarrengulaIT</h3>
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
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-[#FF3131]/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-[#FF3131]" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl whitespace-pre-line ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-[#FF3131] to-[#FF5555] text-white"
                        : "bg-white border shadow-sm"
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
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2 justify-start">
                  <div className="w-8 h-8 rounded-full bg-[#FF3131]/10 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-[#FF3131]" />
                  </div>
                  <div className="bg-white border shadow-sm p-3 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-[#FF3131] rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-[#FF3131] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      <div className="w-2 h-2 bg-[#FF3131] rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {showQuickReplies && (
              <div className="p-3 border-t bg-white">
                <p className="text-xs text-muted-foreground mb-2">Respostas rápidas:</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply, index) => (
                    <Button
                      key={reply.text}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs hover:bg-[#FF3131] hover:text-white hover:border-[#FF3131] transition-all"
                    >
                      {reply.text}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  className="bg-gradient-to-r from-[#FF3131] to-[#FF5555] hover:opacity-90"
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
