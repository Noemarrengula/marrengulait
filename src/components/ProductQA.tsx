import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, ThumbsUp } from "lucide-react";

interface QA {
  id: number;
  question: string;
  answer?: string;
  user: string;
  date: string;
  helpful: number;
}

const ProductQA = ({ productId }: { productId: string }) => {
  const [question, setQuestion] = useState("");
  const [qas] = useState<QA[]>([
    {
      id: 1,
      question: "Este produto é compatível com Windows 11?",
      answer: "Sim, totalmente compatível com Windows 11 e todas as versões anteriores.",
      user: "João Silva",
      date: "2 dias atrás",
      helpful: 12
    },
    {
      id: 2,
      question: "Qual o prazo de entrega para Maputo?",
      answer: "Entrega em 24-48h para Maputo. Frete grátis acima de 5.000 MT.",
      user: "Maria Costa",
      date: "5 dias atrás",
      helpful: 8
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary" />
        <h3 className="text-2xl font-bold">Perguntas & Respostas</h3>
      </div>

      {/* Ask Question */}
      <Card className="p-4">
        <Textarea
          placeholder="Faça uma pergunta sobre este produto..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="mb-3"
        />
        <Button className="w-full sm:w-auto">Enviar Pergunta</Button>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        {qas.map((qa) => (
          <Card key={qa.id} className="p-4">
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-lg mb-1">P: {qa.question}</p>
                <p className="text-sm text-muted-foreground">
                  por {qa.user} • {qa.date}
                </p>
              </div>
              
              {qa.answer && (
                <div className="pl-4 border-l-2 border-primary">
                  <p className="font-medium text-primary mb-1">R:</p>
                  <p>{qa.answer}</p>
                </div>
              )}
              
              <Button variant="ghost" size="sm" className="gap-2">
                <ThumbsUp className="w-4 h-4" />
                Útil ({qa.helpful})
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductQA;
