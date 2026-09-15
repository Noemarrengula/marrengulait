import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdmin } from "../AdminContext";
import { formatCurrency } from "../utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function PaymentsTab() {
  const { orders, loadData, logActivity } = useAdmin();
  const { toast } = useToast();
  const pendingPayments = orders.filter(o => (o.payment_method === "mpesa" || o.payment_method === "emola") && (o.payment_status === "pending" || o.payment_status === "processing"));
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Verificação de Pagamentos</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{pendingPayments.length} pagamentos pendentes</p>
      <div className="space-y-4">
        {pendingPayments.map(order => (
          <Card key={order.id}><CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div><p className="font-bold">{order.customer_name}</p><p className="text-sm text-gray-500 dark:text-gray-400">{order.customer_email}</p><p className="text-sm text-gray-500 dark:text-gray-400">Tel: {order.customer_phone}</p><p className="font-mono text-xs">Pedido: {order.order_number || order.id.slice(0, 8)}</p></div>
              <div className="text-right"><p className="text-xl font-bold text-primary">{formatCurrency(order.total_amount)}</p><Badge variant="outline" className={order.payment_method === "mpesa" ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300" : "bg-orange-100 text-orange-800"}>{order.payment_method === "mpesa" ? "M-Pesa" : "E-Mola"}</Badge></div>
            </div>
            {order.payment_proof_url && <div className="mb-4"><p className="text-sm font-medium mb-2">Comprovativo:</p><img src={order.payment_proof_url} alt="Comprovativo de pagamento" width="320" height="240" className="max-w-xs rounded-lg border" /></div>}
            {order.payment_proof_data && (
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-950 rounded-lg"><p className="text-sm font-medium mb-1">Dados do pagamento:</p><p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{order.payment_proof_data.message}</p>{order.payment_proof_data.reference && <p className="text-sm font-medium mt-1">Ref: {order.payment_proof_data.reference}</p>}</div>
            )}
            <div className="flex gap-2">
              <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={async () => { try { await supabase.from("orders").update({ payment_status: "paid", status: "confirmed" }).eq("id", order.id); logActivity("payment_confirm", "order", order.id, "Pagamento confirmado"); toast({ title: "✅ Pagamento confirmado!" }); loadData(true); } catch { toast({ title: "Erro ao confirmar", variant: "destructive" }); } }}><CheckCircle className="h-4 w-4 mr-1" /> Confirmar Pagamento</Button>
              <Button size="sm" variant="outline" className="text-red-600" onClick={async () => { try { await supabase.from("orders").update({ payment_status: "failed", status: "cancelled" }).eq("id", order.id); logActivity("payment_reject", "order", order.id, "Pagamento rejeitado"); toast({ title: "Pedido cancelado" }); loadData(true); } catch { toast({ title: "Erro", variant: "destructive" }); } }}><XCircle className="h-4 w-4 mr-1" /> Rejeitar</Button>
            </div>
          </CardContent></Card>
        ))}
        {pendingPayments.length === 0 && <Card><CardContent className="py-12 text-center text-gray-500 dark:text-gray-400"><CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" /><p>Nenhum pagamento pendente</p></CardContent></Card>}
      </div>
    </div>
  );
}