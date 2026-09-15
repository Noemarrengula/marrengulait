import { ChevronRight, DollarSign, ShoppingCart, Package, Users, AlertTriangle, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdmin } from "../AdminContext";
import { formatCurrency, formatDate, getStatusBadge } from "../utils";

export function DashboardTab() {
  const { stats, questions, handleNavClick } = useAdmin();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div><p className="text-blue-100 text-xs font-medium">Receita Total</p><p className="text-2xl font-bold mt-1">{formatCurrency(stats.totalRevenue)}</p><p className="text-blue-100 text-[10px] mt-1">+12.5% vs mês anterior</p></div>
              <div className="bg-white dark:bg-gray-900/20 p-2.5 rounded-lg"><DollarSign className="h-6 w-6" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div><p className="text-green-100 text-xs font-medium">Total de Pedidos</p><p className="text-2xl font-bold mt-1">{stats.totalOrders}</p><p className="text-green-100 text-[10px] mt-1">{stats.pendingOrders} pendentes</p></div>
              <div className="bg-white dark:bg-gray-900/20 p-2.5 rounded-lg"><ShoppingCart className="h-6 w-6" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div><p className="text-purple-100 text-xs font-medium">Produtos</p><p className="text-2xl font-bold mt-1">{stats.totalProducts}</p><p className="text-purple-100 text-[10px] mt-1">{stats.lowStockProducts} stock baixo</p></div>
              <div className="bg-white dark:bg-gray-900/20 p-2.5 rounded-lg"><Package className="h-6 w-6" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div><p className="text-orange-100 text-xs font-medium">Clientes</p><p className="text-2xl font-bold mt-1">{stats.totalUsers}</p><p className="text-orange-100 text-[10px] mt-1">+{Math.floor(stats.totalUsers * 0.1)} este mês</p></div>
              <div className="bg-white dark:bg-gray-900/20 p-2.5 rounded-lg"><Users className="h-6 w-6" /></div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Pedidos Recentes</CardTitle>
            <Button size="sm" variant="ghost" onClick={() => handleNavClick("orders")}>Ver Todos <ChevronRight className="h-4 w-4 ml-1" /></Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-950 rounded-lg">
                  <div><p className="font-medium text-sm">{order.customer_name}</p><p className="text-xs text-gray-500 dark:text-gray-400">{order.order_number || order.id.slice(0, 8)}</p></div>
                  <div className="text-right"><p className="font-bold text-sm">{formatCurrency(order.total_amount)}</p>{getStatusBadge(order.status)}</div>
                </div>
              ))}
              {stats.recentOrders.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">Nenhum pedido</p>}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Mais Vendidos</CardTitle>
            <Button size="sm" variant="ghost" onClick={() => handleNavClick("products")}>Ver Todos <ChevronRight className="h-4 w-4 ml-1" /></Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary font-bold w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0">{index + 1}</div>
                  <div className="flex-1 min-w-0"><p className="font-medium text-sm truncate">{product.title || product.name}</p><p className="text-xs text-gray-500 dark:text-gray-400">{product.sale_count || 0} vendas</p></div>
                  <p className="font-bold text-sm flex-shrink-0">{formatCurrency(product.price)}</p>
                </div>
              ))}
              {stats.topProducts.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">Nenhum produto</p>}
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-base">Vendas — Últimos 7 Dias</CardTitle></CardHeader>
          <CardContent>
            <div className="h-40 flex items-end justify-between gap-2">
              {stats.salesByDay.map((day) => {
                const maxSale = Math.max(...stats.salesByDay.map(d => d.total), 1);
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-primary/15 rounded-t-md relative" style={{ height: `${Math.max((day.total / maxSale) * 100, 3)}%` }}>
                      <div className="absolute bottom-0 w-full bg-primary rounded-t-md transition-all" style={{ height: `${Math.max((day.total / maxSale) * 100, 3)}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">{new Date(day.date).toLocaleDateString("pt-PT", { weekday: "short" })}</span>
                    <span className="text-[10px] font-medium">{formatCurrency(day.total)}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Alertas</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <div className="flex items-center gap-3"><AlertTriangle className="h-5 w-5 text-red-600" /><span className="font-medium text-sm">Stock Baixo</span></div><Badge variant="destructive">{stats.lowStockProducts}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
              <div className="flex items-center gap-3"><Clock className="h-5 w-5 text-yellow-600" /><span className="font-medium text-sm">Pedidos Pendentes</span></div><Badge variant="secondary">{stats.pendingOrders}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="flex items-center gap-3"><MessageSquare className="h-5 w-5 text-blue-600" /><span className="font-medium text-sm">Perguntas</span></div><Badge variant="outline">{questions.length}</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Perguntas de Clientes</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {questions.slice(0, 5).map(q => (
                <div key={q.id} className="p-3 bg-gray-50 dark:bg-gray-950 rounded-lg"><p className="text-sm font-medium">{q.question?.slice(0, 100)}...</p><p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{q.created_at ? formatDate(q.created_at) : "Recente"}</p></div>
              ))}
              {questions.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">Nenhuma pergunta</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}