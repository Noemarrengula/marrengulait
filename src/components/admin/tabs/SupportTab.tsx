import { AlertTriangle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAdmin } from "../AdminContext";
import { formatDateTime } from "../utils";

export function SupportTab() {
  const { unansweredQuestions, answerForm, setAnswerForm, handleAnswerQuestion, questions } = useAdmin();
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Suporte ao Cliente</h3>
      <Card className="border-yellow-200">
        <CardHeader><CardTitle className="flex items-center gap-2 text-yellow-700"><AlertTriangle className="h-5 w-5" />Perguntas Sem Resposta ({unansweredQuestions.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {unansweredQuestions.map(q => (
              <div key={q.id} className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950/20/50">
                <p className="font-medium text-sm mb-2">{q.question}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{q.created_at ? formatDateTime(q.created_at) : "Recente"}</p>
                <Textarea value={answerForm[q.id] || ""} onChange={e => setAnswerForm(prev => ({ ...prev, [q.id]: e.target.value }))} placeholder="Escreva a resposta..." className="mb-2 text-sm" />
                <Button size="sm" onClick={() => handleAnswerQuestion(q.id)} disabled={!answerForm[q.id]?.trim()}><MessageSquare className="h-4 w-4 mr-1" /> Responder</Button>
              </div>
            ))}
            {unansweredQuestions.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">Todas as perguntas foram respondidas</p>}
          </div>
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle className="text-base">Todas as Perguntas ({questions.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {questions.slice(0, 20).map(q => (
              <div key={q.id} className={`p-4 rounded-lg border ${q.answer ? "bg-green-50 dark:bg-green-950/20/50 border-green-200" : "bg-gray-50 dark:bg-gray-950"}`}>
                <div className="flex items-start justify-between"><p className="font-medium text-sm flex-1">{q.question}</p>{q.answer ? <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 flex-shrink-0 ml-2">Respondida</Badge> : <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 flex-shrink-0 ml-2">Pendente</Badge>}</div>
                {q.answer && <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 pl-4 border-l-2 border-green-300">{q.answer}</p>}
              </div>
            ))}
            {questions.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">Nenhuma pergunta recebida</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}