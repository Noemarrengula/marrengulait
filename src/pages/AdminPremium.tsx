import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/contexts/SettingsContext";
import { AdminProvider, useAdmin } from "@/components/admin/AdminContext";
import {
  DashboardTab, ProductsTab, OrdersTab, InventoryTab, UsersTab,
  CouponsTab, ContentTab, PaymentsTab, ReportsTab, SupportTab,
  ActivityTab, SettingsTab
} from "@/components/admin/AdminTabContent";
import { formatDate } from "@/components/admin/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useLockedBody } from "@/hooks/useLockedBody";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Loader2, RefreshCw, Menu, X, ChevronsLeft, ChevronsRight, Moon, Sun,
  LayoutDashboard, ShoppingCart, Package, ClipboardList, Users,
  Tag, Globe, CreditCard, BarChart3, HelpCircle, Settings,
  FileText as FileTextIcon
} from "lucide-react";

const navSections = [
  { label: "Principal", items: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Pedidos", icon: ShoppingCart },
    { id: "products", label: "Produtos", icon: Package },
    { id: "inventory", label: "Inventário", icon: ClipboardList },
    { id: "users", label: "Clientes", icon: Users },
  ]},
  { label: "Marketing", items: [
    { id: "coupons", label: "Cupões", icon: Tag },
    { id: "content", label: "Conteúdo", icon: Globe },
  ]},
  { label: "Financeiro", items: [
    { id: "payments", label: "Pagamentos", icon: CreditCard },
    { id: "reports", label: "Relatórios", icon: BarChart3 },
  ]},
  { label: "Suporte", items: [
    { id: "support", label: "Suporte", icon: HelpCircle },
    { id: "activity", label: "Log de Atividade", icon: FileTextIcon },
  ]},
  { label: "Sistema", items: [
    { id: "settings", label: "Configurações", icon: Settings },
  ]},
];

function AdminPanelInner() {
  const { user } = useAuth();
  const { isDarkMode, setTheme } = useSettings();
  const {
    activeTab, loadingData, refreshing,
    sidebarOpen, setSidebarOpen, mobileSidebarOpen, setMobileSidebarOpen,
    handleNavClick, stats, unansweredQuestions, loadData,
    isProductModalOpen, setIsProductModalOpen,
    editingProduct, productForm, setProductForm,
    handleProductSubmit,
    deleteConfirm, setDeleteConfirm, handleDelete,
  } = useAdmin();

  useLockedBody(mobileSidebarOpen || isProductModalOpen, "admin");

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:sticky top-0 left-0 h-screen z-50 lg:z-0 bg-gray-900 text-gray-300 flex flex-col transition-all duration-300 ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} ${sidebarOpen ? "w-64" : "w-[72px]"}`}>
        <div className="h-16 flex items-center gap-3 px-4 border-b border-gray-800">
          <div className="w-8 h-8 rounded-lg bg-[#FF3131] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-sm">M</span>
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <h1 className="text-white font-bold text-sm truncate">Marrengula ERP</h1>
              <p className="text-[10px] text-gray-500 truncate">Painel de Gestão</p>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
          {navSections.map(section => (
            <div key={section.label}>
              {sidebarOpen && (
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 px-3 mb-2">{section.label}</p>
              )}
              <div className="space-y-1">
                {section.items.map(item => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                        isActive
                          ? "bg-[#FF3131] text-white shadow-lg shadow-[#FF3131]/20"
                          : "text-gray-200 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {sidebarOpen && <span className="truncate">{item.label}</span>}
                      {sidebarOpen && item.id === "support" && unansweredQuestions.length > 0 && (
                        <Badge className="ml-auto bg-yellow-500 text-[10px] h-5 px-1.5">{unansweredQuestions.length}</Badge>
                      )}
                      {sidebarOpen && item.id === "inventory" && stats.lowStockProducts > 0 && (
                        <Badge className="ml-auto bg-red-600 text-[10px] h-5 px-1.5">{stats.lowStockProducts}</Badge>
                      )}
                      {sidebarOpen && item.id === "orders" && stats.pendingOrders > 0 && (
                        <Badge className="ml-auto bg-blue-600 text-[10px] h-5 px-1.5">{stats.pendingOrders}</Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-gray-800 p-2 hidden lg:block space-y-1">
          <button
            onClick={() => setTheme(isDarkMode ? "light" : "dark")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-gray-800 text-gray-300 transition-all"
            title={isDarkMode ? "Modo Claro" : "Modo Escuro"}
          >
            {isDarkMode ? <Sun className="h-4 w-4 flex-shrink-0" /> : <Moon className="h-4 w-4 flex-shrink-0" />}
            {sidebarOpen && <span>{isDarkMode ? "Modo Claro" : "Modo Escuro"}</span>}
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 text-sm transition-all"
          >
            {sidebarOpen ? <ChevronsLeft className="h-4 w-4" /> : <ChevronsRight className="h-4 w-4" />}
            {sidebarOpen && <span>Recolher</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setMobileSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                {navSections.flatMap(s => s.items).find(n => n.id === activeTab)?.label || activeTab}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                {formatDate(new Date().toISOString())}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" onClick={() => loadData(true)} disabled={refreshing} className="hidden sm:flex">
              <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 rounded-full bg-[#FF3131]/10 flex items-center justify-center">
                <span className="text-[#FF3131] font-bold text-xs">{user?.email?.[0]?.toUpperCase()}</span>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">{user?.email?.split("@")[0]}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {activeTab === "dashboard" && <DashboardTab />}
          {activeTab === "products" && <ProductsTab />}
          {activeTab === "orders" && <OrdersTab />}
          {activeTab === "inventory" && <InventoryTab />}
          {activeTab === "users" && <UsersTab />}
          {activeTab === "coupons" && <CouponsTab />}
          {activeTab === "content" && <ContentTab />}
          {activeTab === "payments" && <PaymentsTab />}
          {activeTab === "reports" && <ReportsTab />}
          {activeTab === "support" && <SupportTab />}
          {activeTab === "activity" && <ActivityTab />}
          {activeTab === "settings" && <SettingsTab />}
        </main>
      </div>

      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-[60] p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-white dark:bg-gray-900 border-b dark:border-gray-800 z-10">
              <CardTitle>{editingProduct ? "Editar Produto" : "Novo Produto"}</CardTitle>
              <Button variant="ghost" size="sm" aria-label="Fechar modal" onClick={() => setIsProductModalOpen(false)}><X className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><Label>Título *</Label><Input value={productForm.title} onChange={e => setProductForm({ ...productForm, title: e.target.value })} placeholder="Nome do produto" /></div>
                <div><Label>Preço (MZN) *</Label><Input type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: Number(e.target.value) })} /></div>
                <div><Label>Preço Anterior</Label><Input type="number" value={productForm.compare_at_price} onChange={e => setProductForm({ ...productForm, compare_at_price: Number(e.target.value) })} /></div>
                <div><Label>Stock</Label><Input type="number" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: Number(e.target.value) })} /></div>
                <div><Label>Categoria</Label><Input value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} placeholder="Ex: Hardware" /></div>
                <div><Label>Marca</Label><Input value={productForm.brand} onChange={e => setProductForm({ ...productForm, brand: e.target.value })} placeholder="Ex: Hikvision" /></div>
                <div className="col-span-2"><Label>URL da Imagem</Label><Input value={productForm.image_url} onChange={e => setProductForm({ ...productForm, image_url: e.target.value })} placeholder="https://..." /></div>
                <div className="col-span-2"><Label>Descrição</Label><Textarea value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} placeholder="Descrição do produto..." className="min-h-[80px]" /></div>
                <div className="col-span-2 flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-sm"><input type="checkbox" checked={productForm.is_featured} onChange={e => setProductForm({ ...productForm, is_featured: e.target.checked })} /> Destaque</label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm"><input type="checkbox" checked={productForm.is_on_sale} onChange={e => setProductForm({ ...productForm, is_on_sale: e.target.checked })} /> Promoção</label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm"><input type="checkbox" checked={productForm.is_active} onChange={e => setProductForm({ ...productForm, is_active: e.target.checked })} /> Ativo</label>
                </div>
              </div>
              <div className="flex gap-2 pt-2 border-t dark:border-gray-800">
                <Button onClick={handleProductSubmit} className="flex-1">{editingProduct ? "Guardar Alterações" : "Criar Produto"}</Button>
                <Button variant="outline" onClick={() => setIsProductModalOpen(false)}>Cancelar</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Eliminação</AlertDialogTitle>
            <AlertDialogDescription>Tem a certeza que deseja eliminar este item? Esta ação não pode ser revertida.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function AdminPanel() {
  return (
    <AdminProvider>
      <AdminPanelInner />
    </AdminProvider>
  );
}
