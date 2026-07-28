import { ChevronRight, DollarSign, ShoppingCart, Package, Users, AlertTriangle, Clock, MessageSquare, Plus, Search, FilterX, Badge as BadgeIcon, Edit2, Trash2, ChevronLeft, ChevronRight as ChevronRightIcon, MoreVertical, Activity, CheckCircle, XCircle, Download, FileText, Image, Save, FileSpreadsheet, Bell, X, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { useAdmin } from "./AdminContext";
import { formatCurrency, formatDate, formatDateTime, getStatusBadge, downloadCSV } from "./utils";
import { exportOrdersPDF, exportUsersPDF, exportSalesSummaryPDF, exportProductsPDF, exportAlertsPDF } from "@/utils/exportPDF";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function DashboardTab() {
  const { stats, questions, handleNavClick, loadData, refreshing } = useAdmin();
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

export function ProductsTab() {
  const { filteredProducts, paginatedProducts, categories, productSearch, setProductSearch, productCategory, setProductCategory, productPage, setProductPage, ITEMS_PER_PAGE, totalProductPages, selectedProducts, setSelectedProducts, inlineEdit, setInlineEdit, bulkAction, setBulkAction, openProductModal, handleInlineEditSave, handleBulkAction, setDeleteConfirm } = useAdmin();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h3 className="text-xl font-bold">Gestão de Produtos</h3><p className="text-sm text-gray-500 dark:text-gray-400">{filteredProducts.length} produtos encontrados</p></div>
        <Button onClick={() => openProductModal()} className="gap-2"><Plus className="h-4 w-4" /> Novo Produto</Button>
      </div>
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><Input placeholder="Pesquisar produtos..." value={productSearch} onChange={e => { setProductSearch(e.target.value); setProductPage(1); }} className="pl-10" /></div>
            <select value={productCategory} onChange={e => { setProductCategory(e.target.value); setProductPage(1); }} className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 text-sm">
              <option value="all">Todas Categorias</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            {(productSearch || productCategory !== "all") && (
              <Button variant="ghost" size="sm" onClick={() => { setProductSearch(""); setProductCategory("all"); }}><FilterX className="h-4 w-4 mr-1" /> Limpar</Button>
            )}
          </div>
          {selectedProducts.size > 0 && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border dark:border-gray-800 border-blue-200">
              <span className="text-sm font-medium text-blue-700">{selectedProducts.size} selecionados</span>
              <select value={bulkAction} onChange={e => setBulkAction(e.target.value)} className="px-3 py-1.5 border rounded-lg bg-white dark:bg-gray-900 text-sm">
                <option value="">Acção...</option><option value="featured">Marcar Destaque</option><option value="unfeatured">Remover Destaque</option><option value="active">Ativar</option><option value="inactive">Desativar</option><option value="delete">Eliminar</option>
              </select>
              <Button size="sm" onClick={handleBulkAction} disabled={!bulkAction}>Aplicar</Button>
              <Button size="sm" variant="ghost" onClick={() => setSelectedProducts(new Set())}>Limpar</Button>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-950">
                <tr>
                  <th className="text-left py-3 px-3 w-10"><input type="checkbox" onChange={e => { if (e.target.checked) setSelectedProducts(new Set(paginatedProducts.map(p => p.id))); else setSelectedProducts(new Set()); }} className="rounded" /></th>
                  <th className="text-left py-3 px-3 font-medium">Produto</th><th className="text-left py-3 px-3 font-medium">Preço</th><th className="text-left py-3 px-3 font-medium">Stock</th>
                  <th className="text-left py-3 px-3 font-medium hidden md:table-cell">Categoria</th><th className="text-left py-3 px-3 font-medium hidden lg:table-cell">Estado</th><th className="text-left py-3 px-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map(product => (
                  <tr key={product.id} className="border-t dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 dark:bg-gray-950/50">
                    <td className="py-2.5 px-3"><input type="checkbox" checked={selectedProducts.has(product.id)} onChange={e => { setSelectedProducts(prev => { const next = new Set(prev); if (e.target.checked) next.add(product.id); else next.delete(product.id); return next; }); }} className="rounded" /></td>
                    <td className="py-2.5 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {product.image_url ? <img src={product.image_url} alt="" width="40" height="40" className="w-full h-full object-cover" /> : <Package className="h-5 w-5 text-gray-300" />}
                        </div>
                        <div className="min-w-0"><p className="font-medium truncate">{product.title || product.name}</p><div className="flex gap-1 mt-0.5">{product.is_featured && <Badge variant="default" className="text-[10px] h-4 px-1">Destaque</Badge>}{product.is_on_sale && <Badge variant="destructive" className="text-[10px] h-4 px-1">Promo</Badge>}</div></div>
                          </div>
                    </td>
                    <td className="py-2.5 px-3">
                      {inlineEdit?.productId === product.id && inlineEdit.field === "price" ? (
                        <Input type="number" defaultValue={product.price} className="w-28 h-7 text-sm" autoFocus onBlur={e => handleInlineEditSave(product.id, "price", e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleInlineEditSave(product.id, "price", (e.target as HTMLInputElement).value); if (e.key === "Escape") setInlineEdit(null); }} />
                      ) : (
                        <button onClick={() => setInlineEdit({ productId: product.id, field: "price", value: String(product.price) })} className="font-bold text-primary text-sm hover:underline" title="Clique para editar">{formatCurrency(product.price)}</button>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      {inlineEdit?.productId === product.id && inlineEdit.field === "stock" ? (
                        <Input type="number" defaultValue={product.stock} className="w-20 h-7 text-sm" autoFocus onBlur={e => handleInlineEditSave(product.id, "stock", e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleInlineEditSave(product.id, "stock", (e.target as HTMLInputElement).value); if (e.key === "Escape") setInlineEdit(null); }} />
                      ) : (
                        <button onClick={() => setInlineEdit({ productId: product.id, field: "stock", value: String(product.stock) })} className={`text-sm ${product.stock <= 10 ? "text-red-600 font-bold" : "hover:underline"}`} title="Clique para editar">{product.stock}</button>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400 hidden md:table-cell">{product.category || "—"}</td>
                    <td className="py-2.5 px-3 hidden lg:table-cell">{product.is_active === false ? <Badge variant="secondary" className="text-[10px]">Inativo</Badge> : <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 text-[10px]">Ativo</Badge>}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" aria-label="Editar produto" onClick={() => openProductModal(product)} className="h-7 w-7 p-0"><Edit2 className="h-3.5 w-3.5" /></Button>
                        <Button size="sm" variant="ghost" aria-label="Eliminar produto" className="h-7 w-7 p-0 text-red-600" onClick={() => setDeleteConfirm({ type: "products", id: product.id })}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalProductPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">{(productPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(productPage * ITEMS_PER_PAGE, filteredProducts.length)} de {filteredProducts.length}</p>
              <div className="flex items-center gap-1">
                <Button size="sm" variant="outline" aria-label="Página anterior" disabled={productPage === 1} onClick={() => setProductPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
                {Array.from({ length: Math.min(5, totalProductPages) }, (_, i) => {
                  let page: number;
                  if (totalProductPages <= 5) page = i + 1;
                  else if (productPage <= 3) page = i + 1;
                  else if (productPage >= totalProductPages - 2) page = totalProductPages - 4 + i;
                  else page = productPage - 2 + i;
                  return <Button key={page} size="sm" variant={productPage === page ? "default" : "outline"} onClick={() => setProductPage(page)} className={`h-8 w-8 p-0 ${productPage === page ? "bg-[#FF3131]" : ""}`}>{page}</Button>;
                })}
                <Button size="sm" variant="outline" aria-label="Próxima página" disabled={productPage === totalProductPages} onClick={() => setProductPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400"><Package className="h-12 w-12 mx-auto mb-3 text-gray-300" /><p>Nenhum produto encontrado</p><Button variant="link" onClick={() => openProductModal()}>Criar primeiro produto</Button></div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

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

export function InventoryTab() {
  const { products, stats, setInlineEdit, handleNavClick } = useAdmin();
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Gestão de Inventário</h3>
      <Card className="border-red-200">
        <CardHeader><CardTitle className="flex items-center gap-2 text-red-700"><AlertTriangle className="h-5 w-5" />Stock Baixo ({stats.lowStockProducts} produtos)</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-red-50 dark:bg-red-950/20"><tr><th className="text-left py-2 px-3 font-medium">Produto</th><th className="text-left py-2 px-3 font-medium">Stock Atual</th><th className="text-left py-2 px-3 font-medium">Categoria</th><th className="text-left py-2 px-3 font-medium">Ação Rápida</th></tr></thead>
              <tbody>
                {products.filter(p => p.stock <= 10).sort((a, b) => a.stock - b.stock).map(product => (
                  <tr key={product.id} className="border-t dark:border-gray-800">
                    <td className="py-2 px-3 font-medium">{product.title || product.name}</td>
                    <td className="py-2 px-3"><Badge variant={product.stock === 0 ? "destructive" : "outline"} className={product.stock === 0 ? "" : "bg-orange-100 text-orange-700 border-orange-200"}>{product.stock === 0 ? "Esgotado" : `${product.stock} un.`}</Badge></td>
                    <td className="py-2 px-3 text-gray-500 dark:text-gray-400">{product.category || "—"}</td>
                    <td className="py-2 px-3"><Button size="sm" variant="outline" onClick={() => { setInlineEdit({ productId: product.id, field: "stock", value: String(product.stock) }); }}><Edit2 className="h-3.5 w-3.5 mr-1" /> Repor</Button></td>
                  </tr>
                ))}
                {stats.lowStockProducts === 0 && <tr><td colSpan={4} className="py-8 text-center text-gray-500 dark:text-gray-400">Todos os produtos com stock adequado</td></tr>}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Visão Geral do Inventário</CardTitle><CardDescription>{products.length} produtos no catálogo</CardDescription></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg text-center"><p className="text-2xl font-bold text-green-700">{products.filter(p => p.is_active !== false).length}</p><p className="text-xs text-green-600">Ativos</p></div>
            <div className="p-4 bg-gray-50 dark:bg-gray-950 rounded-lg text-center"><p className="text-2xl font-bold text-gray-700 dark:text-gray-200">{products.filter(p => p.is_active === false).length}</p><p className="text-xs text-gray-600 dark:text-gray-300">Inativos</p></div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-center"><p className="text-2xl font-bold text-blue-700">{products.filter(p => p.is_featured || p.featured).length}</p><p className="text-xs text-blue-600">Em Destaque</p></div>
            <div className="p-4 bg-orange-50 rounded-lg text-center"><p className="text-2xl font-bold text-orange-700">{products.filter(p => p.is_on_sale || p.on_sale).length}</p><p className="text-xs text-orange-600">Em Promoção</p></div>
          </div>
          <h4 className="font-semibold mb-3">Atualização Rápida de Stock</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Clique no valor do stock na tabela de produtos para editar inline, ou use a acção em massa para atualizar vários produtos.</p>
          <Button variant="outline" onClick={() => handleNavClick("products")}><Package className="h-4 w-4 mr-2" /> Ir para Produtos</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function UsersTab() {
  const { filteredUsers, userSearch, setUserSearch, users } = useAdmin();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h3 className="text-xl font-bold">Gestão de Clientes</h3><p className="text-sm text-gray-500 dark:text-gray-400">{filteredUsers.length} clientes</p></div>
        <Button variant="outline" onClick={async () => { await exportUsersPDF(users); }} className="gap-2"><Download className="h-4 w-4" /> Exportar</Button>
      </div>
      <Card><CardContent className="pt-6 space-y-4">
        <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><Input placeholder="Pesquisar clientes..." value={userSearch} onChange={e => setUserSearch(e.target.value)} className="pl-10" /></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-950"><tr><th className="text-left py-3 px-4 font-medium">Cliente</th><th className="text-left py-3 px-4 font-medium">Email</th><th className="text-left py-3 px-4 font-medium hidden md:table-cell">Desde</th><th className="text-left py-3 px-4 font-medium hidden lg:table-cell">Último Login</th></tr></thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} className="border-t dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 dark:bg-gray-950/50">
                  <td className="py-3 px-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><span className="text-primary font-medium text-xs">{u.full_name?.[0] || u.email?.[0]?.toUpperCase() || "U"}</span></div><span className="font-medium">{u.full_name || "Sem nome"}</span></div></td>
                  <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{u.email}</td>
                  <td className="py-3 px-4 text-xs hidden md:table-cell">{u.created_at ? formatDate(u.created_at) : "-"}</td>
                  <td className="py-3 px-4 text-xs text-gray-500 dark:text-gray-400 hidden lg:table-cell">{u.last_login_at ? formatDate(u.last_login_at) : "Nunca"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (<div className="text-center py-12 text-gray-500 dark:text-gray-400"><Users className="h-12 w-12 mx-auto mb-3 text-gray-300" /><p>Nenhum cliente encontrado</p></div>)}
      </CardContent></Card>
    </div>
  );
}

export function CouponsTab() {
  const { couponForm, setCouponForm, coupons, handleAddCoupon, toggleCoupon, deleteCoupon } = useAdmin();
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Cupões & Promoções</h3>
      <Card>
        <CardHeader><CardTitle className="text-base">Novo Cupão</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div><Label>Código *</Label><Input value={couponForm.code} onChange={e => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })} placeholder="EX: PROMO20" /></div>
            <div><Label>Tipo</Label><select value={couponForm.type} onChange={e => setCouponForm({ ...couponForm, type: e.target.value as "percent" | "fixed" })} className="w-full px-3 py-2 border rounded-lg text-sm"><option value="percent">Percentagem (%)</option><option value="fixed">Valor Fixo (MZN)</option></select></div>
            <div><Label>Valor *</Label><Input type="number" value={couponForm.value} onChange={e => setCouponForm({ ...couponForm, value: Number(e.target.value) })} placeholder={couponForm.type === "percent" ? "10" : "500"} /></div>
            <div><Label>Pedido Mínimo (MZN)</Label><Input type="number" value={couponForm.minOrder} onChange={e => setCouponForm({ ...couponForm, minOrder: Number(e.target.value) })} placeholder="0" /></div>
            <div><Label>Usos Máximos</Label><Input type="number" value={couponForm.maxUses} onChange={e => setCouponForm({ ...couponForm, maxUses: Number(e.target.value) })} placeholder="100" /></div>
            <div><Label>Data de Expiração</Label><Input type="date" value={couponForm.expiryDate} onChange={e => setCouponForm({ ...couponForm, expiryDate: e.target.value })} /></div>
          </div>
          <Button onClick={handleAddCoupon} className="mt-4 gap-2"><Package className="h-4 w-4" /> Criar Cupão</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Cupões Ativos ({coupons.filter(c => c.active).length})</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-950"><tr><th className="text-left py-3 px-3 font-medium">Código</th><th className="text-left py-3 px-3 font-medium">Tipo</th><th className="text-left py-3 px-3 font-medium">Valor</th><th className="text-left py-3 px-3 font-medium hidden sm:table-cell">Mín.</th><th className="text-left py-3 px-3 font-medium hidden md:table-cell">Usos</th><th className="text-left py-3 px-3 font-medium hidden lg:table-cell">Expira</th><th className="text-left py-3 px-3 font-medium">Estado</th><th className="text-left py-3 px-3 font-medium">Ações</th></tr></thead>
              <tbody>
                {coupons.map(coupon => (
                  <tr key={coupon.id} className="border-t dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 dark:bg-gray-950/50">
                    <td className="py-2.5 px-3 font-mono font-bold">{coupon.code}</td>
                    <td className="py-2.5 px-3"><Badge variant="outline" className="text-[10px]">{coupon.type === "percent" ? "%" : "MZN"}</Badge></td>
                    <td className="py-2.5 px-3 font-medium">{coupon.type === "percent" ? `${coupon.value}%` : formatCurrency(coupon.value)}</td>
                    <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400 hidden sm:table-cell">{coupon.min_order > 0 ? formatCurrency(coupon.min_order) : "—"}</td>
                    <td className="py-2.5 px-3 hidden md:table-cell"><span className={coupon.used_count >= coupon.max_uses ? "text-red-600 font-bold" : "text-green-600"}>{coupon.used_count}/{coupon.max_uses}</span></td>
                    <td className="py-2.5 px-3 text-xs text-gray-500 dark:text-gray-400 hidden lg:table-cell">{coupon.expiry_date ? formatDate(coupon.expiry_date) : "Sem limite"}</td>
                    <td className="py-2.5 px-3"><Badge className={coupon.active ? "bg-green-100 dark:bg-green-900/30 text-green-700" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"}>{coupon.active ? "Ativo" : "Inativo"}</Badge></td>
                    <td className="py-2.5 px-3"><div className="flex items-center gap-1"><Switch checked={coupon.active} onCheckedChange={() => toggleCoupon(coupon.id)} /><Button size="sm" variant="ghost" aria-label="Eliminar cupão" className="h-7 w-7 p-0 text-red-600" onClick={() => deleteCoupon(coupon.id)}><Trash2 className="h-3.5 w-3.5" /></Button></div></td>
                  </tr>
                ))}
                {coupons.length === 0 && <tr><td colSpan={8} className="py-8 text-center text-gray-500 dark:text-gray-400">Nenhum cupão criado</td></tr>}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ContentTab() {
  const { editingSettings, setEditingSettings, bannerForm, setBannerForm, contentBanners, handleAddBanner, toggleBanner, deleteBanner, handleSaveSettings } = useAdmin();
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Gestão de Conteúdo</h3>
      <Card>
        <CardHeader><CardTitle className="text-base">Hero Section</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Título Principal</Label><Input value={editingSettings.heroTitle} onChange={e => setEditingSettings({ ...editingSettings, heroTitle: e.target.value })} /></div>
          <div><Label>Subtítulo</Label><Textarea value={editingSettings.heroSubtitle} onChange={e => setEditingSettings({ ...editingSettings, heroSubtitle: e.target.value })} /></div>
          <div className="flex items-center gap-3"><Switch checked={editingSettings.showAugustBanner} onCheckedChange={v => setEditingSettings({ ...editingSettings, showAugustBanner: v })} /><Label className="cursor-pointer">Mostrar Banner de Férias de Inverno (Agosto)</Label></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Banners Promocionais</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><Label>Título</Label><Input value={bannerForm.title} onChange={e => setBannerForm({ ...bannerForm, title: e.target.value })} placeholder="Ofertas Relâmpago" /></div>
            <div><Label>Subtítulo</Label><Input value={bannerForm.subtitle} onChange={e => setBannerForm({ ...bannerForm, subtitle: e.target.value })} placeholder="Até 50% OFF" /></div>
            <div><Label>URL da Imagem</Label><Input value={bannerForm.imageUrl} onChange={e => setBannerForm({ ...bannerForm, imageUrl: e.target.value })} placeholder="https://..." /></div>
            <div><Label>URL do Link</Label><Input value={bannerForm.linkUrl} onChange={e => setBannerForm({ ...bannerForm, linkUrl: e.target.value })} placeholder="/produtos?promo=true" /></div>
          </div>
          <Button onClick={handleAddBanner} className="gap-2"><Image className="h-4 w-4" /> Adicionar Banner</Button>
          <Separator />
          <div className="space-y-3">
            {contentBanners.map(banner => (
              <div key={banner.id} className="flex items-center justify-between p-4 border rounded-lg bg-white dark:bg-gray-900">
                <div><p className="font-medium">{banner.title}</p><p className="text-sm text-gray-500 dark:text-gray-400">{banner.subtitle || "Sem subtítulo"}</p><p className="text-xs text-gray-400 mt-1">{banner.linkUrl}</p></div>
                <div className="flex items-center gap-2"><Switch checked={banner.active} onCheckedChange={() => toggleBanner(banner.id)} /><Button size="sm" variant="ghost" aria-label="Eliminar banner" className="h-7 w-7 p-0 text-red-600" onClick={() => deleteBanner(banner.id)}><Trash2 className="h-3.5 w-3.5" /></Button></div>
              </div>
            ))}
            {contentBanners.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">Nenhum banner configurado</p>}
          </div>
        </CardContent>
      </Card>
      <Button onClick={handleSaveSettings} className="gap-2"><Save className="h-4 w-4" /> Guardar Alterações de Conteúdo</Button>
    </div>
  );
}

export function PaymentsTab() {
  const { orders, loadData, logActivity, updateOrderStatus } = useAdmin();
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

export function ReportsTab() {
  const { products, orders, users, alerts, questions } = useAdmin();
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Relatórios & Exportações</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => exportSalesSummaryPDF(orders, products, users)}><CardContent className="p-6 text-center"><FileText className="h-10 w-10 mx-auto mb-3 text-primary" /><h3 className="font-semibold text-sm">Resumo de Vendas</h3><p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Estatísticas completas</p></CardContent></Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => exportProductsPDF(products)}><CardContent className="p-6 text-center"><Package className="h-10 w-10 mx-auto mb-3 text-green-600" /><h3 className="font-semibold text-sm">Catálogo de Produtos</h3><p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Lista em PDF</p></CardContent></Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => exportOrdersPDF(orders)}><CardContent className="p-6 text-center"><ShoppingCart className="h-10 w-10 mx-auto mb-3 text-orange-600" /><h3 className="font-semibold text-sm">Relatório de Pedidos</h3><p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Vendas detalhadas</p></CardContent></Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => exportUsersPDF(users)}><CardContent className="p-6 text-center"><Users className="h-10 w-10 mx-auto mb-3 text-purple-600" /><h3 className="font-semibold text-sm">Base de Clientes</h3><p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Lista de clientes</p></CardContent></Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => exportAlertsPDF(alerts, questions)}><CardContent className="p-6 text-center"><Bell className="h-10 w-10 mx-auto mb-3 text-red-600" /><h3 className="font-semibold text-sm">Alertas e Perguntas</h3><p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Interações de clientes</p></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle className="text-base">Exportar CSV</CardTitle></CardHeader><CardContent><div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button variant="outline" size="sm" onClick={() => downloadCSV(products as unknown as Record<string, unknown>[], ["id", "title", "price", "stock", "category"], "produtos.csv")}><FileSpreadsheet className="h-4 w-4 mr-2" /> Produtos</Button>
        <Button variant="outline" size="sm" onClick={() => downloadCSV(orders as unknown as Record<string, unknown>[], ["id", "customer_name", "customer_email", "total_amount", "status"], "pedidos.csv")}><FileSpreadsheet className="h-4 w-4 mr-2" /> Pedidos</Button>
        <Button variant="outline" size="sm" onClick={() => downloadCSV(users as unknown as Record<string, unknown>[], ["id", "email", "created_at"], "clientes.csv")}><FileSpreadsheet className="h-4 w-4 mr-2" /> Clientes</Button>
        <Button variant="outline" size="sm" onClick={() => downloadCSV(alerts as unknown as Record<string, unknown>[], ["id", "user_id", "product_id", "target_price"], "alertas.csv")}><FileSpreadsheet className="h-4 w-4 mr-2" /> Alertas</Button>
      </div></CardContent></Card>
    </div>
  );
}

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

export function ActivityTab() {
  const { activityLog } = useAdmin();
  const { toast } = useToast();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Log de Atividade</h3>
        {activityLog.length > 0 && (
          <Button variant="outline" size="sm" onClick={async () => { if (confirm("Limpar todo o log?")) { /* setActivityLog([]); await supabase.from("activity_log").delete(); */ toast({ title: "Funcionalidade desativada temporariamente" }); } }}>
            <Trash2 className="h-4 w-4 mr-1" /> Limpar
          </Button>
        )}
      </div>
      <Card><CardContent className="pt-6">
        {activityLog.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8 text-sm">Nenhuma atividade registada ainda</p>
        ) : (
          <div className="space-y-2">
            {activityLog.slice(0, 50).map(log => (
              <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg border bg-white dark:bg-gray-900">
                <div className="w-2 h-2 rounded-full bg-[#FF3131] flex-shrink-0" />
                <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate"><span className="text-[#FF3131]">{log.action}</span> — {log.details}</p><p className="text-xs text-gray-500 dark:text-gray-400">{log.entity} • {log.user_email}</p></div>
                <span className="text-xs text-gray-400 flex-shrink-0">{formatDateTime(log.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent></Card>
    </div>
  );
}

export function SettingsTab() {
  const { editingSettings, setEditingSettings, handleSaveSettings } = useAdmin();
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Configurações do Sistema</h3>
      <Card><CardHeader><CardTitle className="text-base">Informações Gerais</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><Label>Nome do Site</Label><Input value={editingSettings.siteName} onChange={e => setEditingSettings({ ...editingSettings, siteName: e.target.value })} /></div>
            <div><Label>WhatsApp</Label><Input value={editingSettings.whatsappNumber} onChange={e => setEditingSettings({ ...editingSettings, whatsappNumber: e.target.value })} /></div>
            <div><Label>Email</Label><Input value={editingSettings.email} onChange={e => setEditingSettings({ ...editingSettings, email: e.target.value })} /></div>
            <div><Label>Endereço</Label><Input value={editingSettings.address} onChange={e => setEditingSettings({ ...editingSettings, address: e.target.value })} /></div>
          </div>
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle className="text-base">Comércio</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><Label>Moeda</Label><Input value={editingSettings.currency} onChange={e => setEditingSettings({ ...editingSettings, currency: e.target.value })} /></div>
            <div><Label>Taxa de IVA (%)</Label><Input type="number" value={editingSettings.taxRate} onChange={e => setEditingSettings({ ...editingSettings, taxRate: Number(e.target.value) })} /></div>
            <div><Label>Frete Grátis acima de (MZN)</Label><Input type="number" value={editingSettings.freeShippingThreshold} onChange={e => setEditingSettings({ ...editingSettings, freeShippingThreshold: Number(e.target.value) })} /></div>
          </div>
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle className="text-base">Métodos de Pagamento</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center"><HelpCircle className="h-4 w-4 text-green-600" /></div><div><p className="font-medium text-sm">M-Pesa</p><p className="text-xs text-gray-500 dark:text-gray-400">Vodacom</p></div></div><Switch checked={editingSettings.mpesaEnabled} onCheckedChange={v => setEditingSettings({ ...editingSettings, mpesaEnabled: v })} /></div>
            <div className="flex items-center justify-between p-3 border rounded-lg"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center"><HelpCircle className="h-4 w-4 text-orange-600" /></div><div><p className="font-medium text-sm">E-Mola</p><p className="text-xs text-gray-500 dark:text-gray-400">Movitel</p></div></div><Switch checked={editingSettings.emolaEnabled} onCheckedChange={v => setEditingSettings({ ...editingSettings, emolaEnabled: v })} /></div>
            <div className="flex items-center justify-between p-3 border rounded-lg"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"><DollarSign className="h-4 w-4 text-blue-600" /></div><div><p className="font-medium text-sm">Dinheiro / Transferência</p><p className="text-xs text-gray-500 dark:text-gray-400">Pagamento na entrega</p></div></div><Switch checked={editingSettings.cashEnabled} onCheckedChange={v => setEditingSettings({ ...editingSettings, cashEnabled: v })} /></div>
          </div>
        </CardContent>
      </Card>
      <Button onClick={handleSaveSettings} className="gap-2"><Save className="h-4 w-4" /> Guardar Configurações</Button>
    </div>
  );
}
