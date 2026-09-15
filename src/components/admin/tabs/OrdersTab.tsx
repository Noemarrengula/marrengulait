import { Search, MoreVertical, Activity, CheckCircle, XCircle, ChevronLeft, ChevronRight, Download, ShoppingCart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAdmin } from "../AdminContext";
import { formatCurrency, formatDate, getStatusBadge } from "../utils";
import { exportOrdersPDF } from "@/utils/exportPDF";

export function OrdersTab() {
  const { filteredOrders, paginatedOrders, orderSearch, setOrderSearch, orderStatus, setOrderStatus, orderPage, setOrderPage, ITEMS_PER_PAGE, totalOrderPages, orders, updateOrderStatus } = useAdmin();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h3 className="text-xl font-bold">Gestão de Pedidos</h3><p className="text-sm text-gray-500 dark:text-gray-400">{filteredOrders.length} pedidos</p></div>
        <Button variant="outline" onClick={async () => { await exportOrdersPDF(orders); }} className="gap-2"><Download className="h-4 w-4" /> Exportar PDF</Button>
      </div>
      <Card><CardContent className="pt-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><Input placeholder="Pesquisar..." value={orderSearch} onChange={e => { setOrderSearch(e.target.value); setOrderPage(1); }} className="pl-10" /></div>
          <select value={orderStatus} onChange={e => { setOrderStatus(e.target.value); setOrderPage(1); }} className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 text-sm">
            <option value="all">Todos Status</option><option value="pending">Pendente</option><option value="confirmed">Confirmado</option><option value="processing">Em Processamento</option><option value="shipped">Enviado</option><option value="delivered">Entregue</option><option value="cancelled">Cancelado</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-950"><tr><th className="text-left py-3 px-4 font-medium">Pedido</th><th className="text-left py-3 px-4 font-medium">Cliente</th><th className="text-left py-3 px-4 font-medium">Total</th><th className="text-left py-3 px-4 font-medium">Status</th><th className="text-left py-3 px-4 font-medium hidden md:table-cell">Data</th><th className="text-left py-3 px-4 font-medium">Ações</th></tr></thead>
            <tbody>
              {paginatedOrders.map(order => (
                <tr key={order.id} className="border-t dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 dark:bg-gray-950/50">
                  <td className="py-3 px-4 font-mono text-xs">{order.order_number || order.id.slice(0, 8)}</td>
                  <td className="py-3 px-4"><p className="font-medium text-sm">{order.customer_name}</p><p className="text-xs text-gray-500 dark:text-gray-400">{order.customer_email}</p></td>
                  <td className="py-3 px-4 font-bold text-sm">{formatCurrency(order.total_amount)}</td>
                  <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                  <td className="py-3 px-4 text-xs text-gray-500 dark:text-gray-400 hidden md:table-cell">{formatDate(order.created_at)}</td>
                  <td className="py-3 px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button size="sm" variant="ghost" aria-label="Ações do pedido"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "confirmed")}><CheckCircle className="h-4 w-4 mr-2" />Confirmar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "processing")}><Activity className="h-4 w-4 mr-2" />Processar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "shipped")}><Package className="h-4 w-4 mr-2" />Enviar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "delivered")}><CheckCircle className="h-4 w-4 mr-2 text-green-600" />Entregar</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "cancelled")} className="text-red-600"><XCircle className="h-4 w-4 mr-2" />Cancelar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalOrderPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">{(orderPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(orderPage * ITEMS_PER_PAGE, filteredOrders.length)} de {filteredOrders.length}</p>
            <div className="flex items-center gap-1">
              <Button size="sm" variant="outline" aria-label="Página anterior" disabled={orderPage === 1} onClick={() => setOrderPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
              <Button size="sm" variant="outline" aria-label="Próxima página" disabled={orderPage === totalOrderPages} onClick={() => setOrderPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        )}
        {filteredOrders.length === 0 && (<div className="text-center py-12 text-gray-500 dark:text-gray-400"><ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-300" /><p>Nenhum pedido encontrado</p></div>)}
      </CardContent></Card>
    </div>
  );
}