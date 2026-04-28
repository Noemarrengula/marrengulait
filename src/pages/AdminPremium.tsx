import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Loader2, Package, ShoppingCart, Users, DollarSign, TrendingUp, TrendingDown,
  Eye, Star, AlertTriangle, CheckCircle, XCircle, Clock, RefreshCw,
  Plus, Edit2, Trash2, Search, Filter, Download, MoreVertical,
  BarChart3, Settings, Bell, Megaphone, CreditCard, MessageSquare,
  ChevronLeft, ChevronRight, LayoutDashboard, FileText, Zap, Shield,
  Activity, PackageX, UserPlus, Crown, ArrowUpRight, ArrowDownRight,
  Calendar, FilterX
} from "lucide-react";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/context/SettingsContext";
import { useToast } from "@/hooks/use-toast";
import {
  exportProductsPDF, exportOrdersPDF, exportUsersPDF,
  exportSalesSummaryPDF, exportAlertsPDF
} from "@/utils/exportPDF";

interface Product {
  id: string;
  title?: string;
  name?: string;
  price: number;
  old_price?: number;
  compare_at_price?: number;
  stock: number;
  category?: string;
  category_id?: string;
  brand?: string;
  brand_id?: string;
  store_name?: string;
  image_url?: string;
  images?: string[];
  description?: string;
  featured?: boolean;
  is_featured?: boolean;
  on_sale?: boolean;
  is_on_sale?: boolean;
  is_active?: boolean;
  rating?: number;
  view_count?: number;
  sale_count?: number;
  created_at?: string;
}

interface Order {
  id: string;
  order_number?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  total_amount: number;
  subtotal?: number;
  shipping_cost?: number;
  status: string;
  payment_status?: string;
  payment_method?: string;
  created_at: string;
  shipping_address?: Record<string, unknown>;
  items?: Record<string, unknown>[];
  payment_proof_url?: string;
  payment_proof_data?: { method: string; reference: string; message: string };
  payment_reference?: string;
}

interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  created_at: string;
  last_login_at?: string;
}

interface Question {
  id: string;
  question: string;
  answer?: string;
  product_id: string;
  user_id?: string;
  created_at?: string;
}

interface Alert {
  id: string;
  user_id: string;
  product_id: string;
  target_price?: number;
  created_at?: string;
}

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  lowStockProducts: number;
  pendingOrders: number;
  recentOrders: Order[];
  topProducts: Product[];
  salesByDay: { date: string; total: number }[];
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, loading, roles, initialized } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loadingData, setLoadingData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  
  // Filter states
  const [productSearch, setProductSearch] = useState("");
  const [productCategory, setProductCategory] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState("all");
  const [userSearch, setUserSearch] = useState("");
  
  // Edit states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    title: "", price: 0, compare_at_price: 0, stock: 0,
    category: "", brand: "", image_url: "", description: "",
    is_featured: false, is_on_sale: false, is_active: true
  });
  
  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<{type: string; id: string} | null>(null);
  
  // Categories from products
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return Array.from(cats) as string[];
  }, [products]);

  // Dashboard stats
  const stats: DashboardStats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const pendingOrders = orders.filter(o => o.status === "pending" || o.status === "confirmed").length;
    const lowStockProducts = products.filter(p => p.stock <= 10).length;
    
    // Last 7 days sales
    const now = new Date();
    const salesByDay = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split("T")[0];
      const dayOrders = orders.filter(o => 
        o.created_at?.startsWith(dateStr) && 
        (o.payment_status === "paid" || o.status === "delivered")
      );
      return { date: dateStr, total: dayOrders.reduce((s, o) => s + (o.total_amount || 0), 0) };
    });
    
    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalUsers: users.length,
      totalRevenue,
      lowStockProducts,
      pendingOrders,
      recentOrders: orders.slice(0, 5),
      topProducts: [...products].sort((a, b) => (b.sale_count || 0) - (a.sale_count || 0)).slice(0, 5),
      salesByDay
    };
  }, [products, orders, users]);

  useEffect(() => {
    if (loading || !initialized) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!roles?.includes("admin")) {
      navigate("/auth");
      return;
    }
    loadData();
  }, [loading, user, roles, initialized]);

  const loadData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoadingData(true);
    
    try {
      const [productsRes, ordersRes, profilesRes, questionsRes, alertsRes] = await Promise.all([
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("product_questions").select("*").order("created_at", { ascending: false }),
        supabase.from("price_alerts").select("*").order("created_at", { ascending: false }),
      ]);

      if (productsRes.data) setProducts(productsRes.data);
      if (ordersRes.data) setOrders(ordersRes.data);
      if (profilesRes.data) {
        const usersData: User[] = profilesRes.data.map((p: Record<string, unknown>) => ({
          id: p.id,
          email: p.email || p.full_name || "User",
          full_name: p.full_name,
          phone: p.phone,
          created_at: p.created_at,
          last_login_at: p.last_login_at
        }));
        setUsers(usersData);
      }
      if (questionsRes.data) setQuestions(questionsRes.data);
      if (alertsRes.data) setAlerts(alertsRes.data);
      
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      toast({ title: "Erro ao carregar dados", description: message, variant: "destructive" });
    } finally {
      setLoadingData(false);
      setRefreshing(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const name = p.title || p.name || "";
      const matchesSearch = name.toLowerCase().includes(productSearch.toLowerCase());
      const matchesCategory = productCategory === "all" || p.category === productCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, productSearch, productCategory]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = 
        o.customer_name.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customer_email.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.order_number?.toLowerCase().includes(orderSearch.toLowerCase());
      const matchesStatus = orderStatus === "all" || o.status === orderStatus;
      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearch, orderStatus]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const searchLower = userSearch.toLowerCase();
      return u.email?.toLowerCase().includes(searchLower) || 
             u.full_name?.toLowerCase().includes(searchLower);
    });
  }, [users, userSearch]);

  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        title: product.title || product.name || "",
        price: product.price,
        compare_at_price: product.compare_at_price || product.old_price || 0,
        stock: product.stock,
        category: product.category || "",
        brand: product.brand || "",
        image_url: product.image_url || "",
        description: product.description || "",
        is_featured: product.is_featured || product.featured || false,
        is_on_sale: product.is_on_sale || product.on_sale || false,
        is_active: product.is_active !== false
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        title: "", price: 0, compare_at_price: 0, stock: 0,
        category: "", brand: "", image_url: "", description: "",
        is_featured: false, is_on_sale: false, is_active: true
      });
    }
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async () => {
    if (!productForm.title || productForm.price <= 0) {
      toast({ title: "Preencha o título e preço", variant: "destructive" });
      return;
    }

    try {
      const productData: Record<string, unknown> = {
        title: productForm.title,
        name: productForm.title,
        slug: productForm.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        price: productForm.price,
        compare_at_price: productForm.compare_at_price || null,
        old_price: productForm.is_on_sale ? productForm.compare_at_price : null,
        stock: productForm.stock,
        category: productForm.category,
        brand: productForm.brand || null,
        image_url: productForm.image_url || null,
        description: productForm.description || null,
        is_featured: productForm.is_featured,
        is_on_sale: productForm.is_on_sale,
        is_active: productForm.is_active,
        store_name: "MarrengulaIT",
        updated_at: new Date().toISOString()
      };

      if (editingProduct) {
        const { error } = await supabase.from("products").update(productData).eq("id", editingProduct.id);
        if (error) throw error;
        toast({ title: "✅ Produto atualizado com sucesso!" });
      } else {
        productData.created_at = new Date().toISOString();
        const { error } = await supabase.from("products").insert([productData]);
        if (error) throw error;
        toast({ title: "✅ Produto criado com sucesso!" });
      }

      setIsProductModalOpen(false);
      loadData(true);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      toast({ title: "Erro ao guardar produto", description: message, variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      const { error } = await supabase.from(deleteConfirm.type).delete().eq("id", deleteConfirm.id);
      if (error) throw error;
      
      toast({ title: `✅ ${deleteConfirm.type === "products" ? "Produto" : "Item"} eliminado!` });
      setDeleteConfirm(null);
      loadData(true);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      toast({ title: "Erro ao eliminar", description: message, variant: "destructive" });
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from("orders").update({ status: newStatus, updated_at: new Date().toISOString() }).eq("id", orderId);
      if (error) throw error;
      toast({ title: "✅ Status atualizado!" });
      loadData(true);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      toast({ title: "Erro ao atualizar", description: message, variant: "destructive" });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-MZ", { style: "currency", currency: "MZN" }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800"
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100"}`}>{status}</span>;
  };

  if (loading || loadingData || !initialized) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Painel de Administração</h1>
            <p className="text-gray-500 mt-1">Gestão completa da MarrengulaIT</p>
          </div>
          <Button onClick={() => loadData(true)} disabled={refreshing} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Receita Total</p>
                  <p className="text-3xl font-bold mt-1">{formatCurrency(stats.totalRevenue)}</p>
                  <p className="text-blue-100 text-xs mt-2">+12.5% vs mês anterior</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <DollarSign className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total de Pedidos</p>
                  <p className="text-3xl font-bold mt-1">{stats.totalOrders}</p>
                  <p className="text-green-100 text-xs mt-2">{stats.pendingOrders} pendentes</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <ShoppingCart className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Produtos</p>
                  <p className="text-3xl font-bold mt-1">{stats.totalProducts}</p>
                  <p className="text-purple-100 text-xs mt-2">{stats.lowStockProducts} com stock baixo</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <Package className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Clientes</p>
                  <p className="text-3xl font-bold mt-1">{stats.totalUsers}</p>
                  <p className="text-orange-100 text-xs mt-2">+{Math.floor(stats.totalUsers * 0.1)} este mês</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <Users className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border-b-0 p-1 rounded-lg inline-flex flex-wrap h-auto gap-1">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Package className="h-4 w-4 mr-2" />
              Produtos
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Clientes
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <CreditCard className="h-4 w-4 mr-2" />
              Pagamentos
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Relatórios
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Pedidos Recentes</CardTitle>
                  <Button size="sm" variant="ghost" onClick={() => setActiveTab("orders")}>
                    Ver Todos <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.recentOrders.map(order => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{order.customer_name}</p>
                          <p className="text-sm text-gray-500">{order.order_number || order.id.slice(0, 8)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(order.total_amount)}</p>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                    ))}
                    {stats.recentOrders.length === 0 && (
                      <p className="text-center text-gray-500 py-4">Nenhum pedido ainda</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Produtos Mais Vendidos</CardTitle>
                  <Button size="sm" variant="ghost" onClick={() => setActiveTab("products")}>
                    Ver Todos <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.topProducts.map((product, index) => (
                      <div key={product.id} className="flex items-center gap-4">
                        <div className="bg-primary/10 text-primary font-bold w-8 h-8 rounded-full flex items-center justify-center">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium truncate">{product.title || product.name}</p>
                          <p className="text-sm text-gray-500">{product.sale_count || 0} vendas</p>
                        </div>
                        <p className="font-bold">{formatCurrency(product.price)}</p>
                      </div>
                    ))}
                    {stats.topProducts.length === 0 && (
                      <p className="text-center text-gray-500 py-4">Nenhum produto ainda</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Sales Chart Placeholder */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Vendas dos Últimos 7 Dias</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-end justify-between gap-2">
                    {stats.salesByDay.map((day, i) => {
                      const maxSale = Math.max(...stats.salesByDay.map(d => d.total), 1);
                      const height = (day.total / maxSale) * 100;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                          <div className="w-full bg-primary/20 rounded-t-md relative" style={{ height: `${Math.max(height, 5)}%` }}>
                            <div 
                              className="absolute bottom-0 w-full bg-primary rounded-t-md transition-all"
                              style={{ height: `${Math.max(height, 5)}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(day.date).toLocaleDateString("pt-PT", { weekday: "short" })}
                          </span>
                          <span className="text-xs font-medium">{formatCurrency(day.total)}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Alertas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <span className="font-medium">Stock Baixo</span>
                    </div>
                    <Badge variant="destructive">{stats.lowStockProducts}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium">Pedidos Pendentes</span>
                    </div>
                    <Badge variant="secondary">{stats.pendingOrders}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Perguntas</span>
                    </div>
                    <Badge variant="outline">{questions.length}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Perguntas de Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {questions.slice(0, 5).map(q => (
                      <div key={q.id} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium">{q.question?.slice(0, 100)}...</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {q.created_at ? formatDate(q.created_at) : "Recente"}
                        </p>
                      </div>
                    ))}
                    {questions.length === 0 && (
                      <p className="text-center text-gray-500 py-4">Nenhuma pergunta</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Gestão de Produtos</CardTitle>
                  <CardDescription>{filteredProducts.length} produtos</CardDescription>
                </div>
                <Button onClick={() => openProductModal()} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Produto
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Pesquisar produtos..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    className="px-4 py-2 border rounded-lg bg-white"
                  >
                    <option value="all">Todas Categorias</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {(productSearch || productCategory !== "all") && (
                    <Button variant="ghost" onClick={() => { setProductSearch(""); setProductCategory("all"); }}>
                      <FilterX className="h-4 w-4 mr-2" />
                      Limpar
                    </Button>
                  )}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                      <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-12 w-12 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold truncate flex-1">{product.title || product.name}</h3>
                          <div className="flex gap-1">
                            {product.is_featured && <Badge variant="default" className="text-xs">Destaque</Badge>}
                            {product.is_on_sale && <Badge variant="destructive" className="text-xs">Promo</Badge>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-primary">{formatCurrency(product.price)}</span>
                          {(product.old_price || product.compare_at_price) && (
                            <span className="text-sm text-gray-400 line-through">
                              {formatCurrency(product.old_price || product.compare_at_price || 0)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className={`${product.stock <= 10 ? "text-red-600 font-medium" : "text-gray-500"}`}>
                            Stock: {product.stock}
                          </span>
                          <span className="text-gray-500">{product.category || "Sem categoria"}</span>
                        </div>
                        <div className="flex items-center gap-2 pt-2 border-t">
                          <Button size="sm" variant="outline" className="flex-1" onClick={() => openProductModal(product)}>
                            <Edit2 className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => setDeleteConfirm({ type: "products", id: product.id })}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>Nenhum produto encontrado</p>
                    <Button variant="link" onClick={() => openProductModal()}>Criar primeiro produto</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Gestão de Pedidos</CardTitle>
                  <CardDescription>{filteredOrders.length} pedidos</CardDescription>
                </div>
                <Button variant="outline" onClick={() => exportOrdersPDF(orders)} className="gap-2">
                  <Download className="h-4 w-4" />
                  Exportar PDF
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Pesquisar por nome, email ou nº pedido..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                    className="px-4 py-2 border rounded-lg bg-white"
                  >
                    <option value="all">Todos Status</option>
                    <option value="pending">Pendente</option>
                    <option value="confirmed">Confirmado</option>
                    <option value="processing">Em Processamento</option>
                    <option value="shipped">Enviado</option>
                    <option value="delivered">Entregue</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>

                {/* Orders Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium">Pedido</th>
                        <th className="text-left py-3 px-4 font-medium">Cliente</th>
                        <th className="text-left py-3 px-4 font-medium">Total</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Data</th>
                        <th className="text-left py-3 px-4 font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map(order => (
                        <tr key={order.id} className="border-t hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono text-sm">
                            {order.order_number || order.id.slice(0, 8)}
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{order.customer_name}</p>
                              <p className="text-sm text-gray-500">{order.customer_email}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-bold">{formatCurrency(order.total_amount)}</td>
                          <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                          <td className="py-3 px-4 text-sm text-gray-500">
                            {formatDate(order.created_at)}
                          </td>
                          <td className="py-3 px-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "confirmed")}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Confirmar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "processing")}>
                                  <Activity className="h-4 w-4 mr-2" />
                                  Processar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "shipped")}>
                                  <Package className="h-4 w-4 mr-2" />
                                  Enviar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "delivered")}>
                                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                  Entregar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => updateOrderStatus(order.id, "cancelled")}
                                  className="text-red-600"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Cancelar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredOrders.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>Nenhum pedido encontrado</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Gestão de Clientes</CardTitle>
                  <CardDescription>{filteredUsers.length} clientes</CardDescription>
                </div>
                <Button variant="outline" onClick={() => exportUsersPDF(users)} className="gap-2">
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Pesquisar clientes..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium">Cliente</th>
                        <th className="text-left py-3 px-4 font-medium">Email</th>
                        <th className="text-left py-3 px-4 font-medium">Desde</th>
                        <th className="text-left py-3 px-4 font-medium">Último Login</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(u => (
                        <tr key={u.id} className="border-t hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-medium">
                                  {u.full_name?.[0] || u.email?.[0]?.toUpperCase() || "U"}
                                </span>
                              </div>
                              <span className="font-medium">{u.full_name || "Sem nome"}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-500">{u.email}</td>
                          <td className="py-3 px-4 text-sm">{u.created_at ? formatDate(u.created_at) : "-"}</td>
                          <td className="py-3 px-4 text-sm text-gray-500">
                            {u.last_login_at ? formatDate(u.last_login_at) : "Nunca"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>Nenhum cliente encontrado</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => exportSalesSummaryPDF(orders, products, users)}>
                <CardContent className="p-6 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">Resumo de Vendas</h3>
                  <p className="text-sm text-gray-500">Relatório completo com estatísticas</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => exportProductsPDF(products)}>
                <CardContent className="p-6 text-center">
                  <Package className="h-12 w-12 mx-auto mb-4 text-green-600" />
                  <h3 className="font-semibold mb-2">Catálogo de Produtos</h3>
                  <p className="text-sm text-gray-500">Lista completa em PDF</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => exportOrdersPDF(orders)}>
                <CardContent className="p-6 text-center">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-orange-600" />
                  <h3 className="font-semibold mb-2">Relatório de Pedidos</h3>
                  <p className="text-sm text-gray-500">Todas as vendas detalhadas</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => exportUsersPDF(users)}>
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                  <h3 className="font-semibold mb-2">Base de Clientes</h3>
                  <p className="text-sm text-gray-500">Lista de todos os clientes</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => exportAlertsPDF(alerts, questions)}>
                <CardContent className="p-6 text-center">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-red-600" />
                  <h3 className="font-semibold mb-2">Alertas e Perguntas</h3>
                  <p className="text-sm text-gray-500">Interações de clientes</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => loadData(true)}>
                <CardContent className="p-6 text-center">
                  <RefreshCw className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                  <h3 className="font-semibold mb-2">Recarregar Dados</h3>
                  <p className="text-sm text-gray-500">Atualizar todas as informações</p>
                </CardContent>
              </Card>
            </div>

            {/* Export CSV Section */}
            <Card>
              <CardHeader>
                <CardTitle>Exportar em CSV</CardTitle>
                <CardDescription>Downloads rápidos em formato spreadsheet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" onClick={() => {
                    const csv = products.map(p => `${p.id},${p.title || p.name},${p.price},${p.stock},${p.category}`).join("\n");
                    downloadCSV(products, ["id", "title", "price", "stock", "category"], "produtos.csv");
                  }}>
                    <Download className="h-4 w-4 mr-2" />
                    Produtos
                  </Button>
                  <Button variant="outline" onClick={() => downloadCSV(orders, ["id", "customer_name", "customer_email", "total_amount", "status"], "pedidos.csv")}>
                    <Download className="h-4 w-4 mr-2" />
                    Pedidos
                  </Button>
                  <Button variant="outline" onClick={() => downloadCSV(users, ["id", "email", "created_at"], "clientes.csv")}>
                    <Download className="h-4 w-4 mr-2" />
                    Clientes
                  </Button>
                  <Button variant="outline" onClick={() => downloadCSV(alerts, ["id", "user_id", "product_id", "target_price"], "alertas.csv")}>
                    <Download className="h-4 w-4 mr-2" />
                    Alertas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Verificação de Pagamentos</CardTitle>
                  <CardDescription>
                    {orders.filter(o => o.payment_method === 'mpesa' || o.payment_method === 'emola').filter(o => o.payment_status === 'pending').length} pagamentos pendentes
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders
                    .filter(o => o.payment_method === 'mpesa' || o.payment_method === 'emola')
                    .filter(o => o.payment_status === 'pending' || o.payment_status === 'processing')
                    .map(order => (
                      <div key={order.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="font-bold">{order.customer_name}</p>
                            <p className="text-sm text-gray-500">{order.customer_email}</p>
                            <p className="text-sm text-gray-500">Tel: {order.customer_phone}</p>
                            <p className="font-mono text-sm">Pedido: {order.order_number}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-primary">{formatCurrency(order.total_amount)}</p>
                            <Badge variant="outline" className={order.payment_method === 'mpesa' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                              {order.payment_method === 'mpesa' ? 'M-Pesa' : 'E-Mola'}
                            </Badge>
                          </div>
                        </div>
                        
                        {order.payment_proof_url && (
                          <div className="mb-4">
                            <p className="text-sm font-medium mb-2">Comprovativo:</p>
                            <img 
                              src={order.payment_proof_url} 
                              alt="Comprovativo" 
                              className="max-w-xs rounded-lg border"
                            />
                          </div>
                        )}
                        
                        {order.payment_proof_data && (
                          <div className="mb-4 p-3 bg-white rounded-lg">
                            <p className="text-sm font-medium mb-1">Dados do pagamento:</p>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap">{order.payment_proof_data.message}</p>
                            {order.payment_proof_data.reference && (
                              <p className="text-sm font-medium mt-1">Ref: {order.payment_proof_data.reference}</p>
                            )}
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={async () => {
                              try {
                                await supabase.from('orders').update({ 
                                  payment_status: 'paid',
                                  status: 'confirmed'
                                }).eq('id', order.id);
                                toast({ title: '✅ Pagamento confirmado!' });
                                loadData(true);
                              } catch (error) {
                                toast({ title: 'Erro ao confirmar', variant: 'destructive' });
                              }
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Confirmar Pagamento
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={async () => {
                              try {
                                await supabase.from('orders').update({ 
                                  status: 'cancelled'
                                }).eq('id', order.id);
                                toast({ title: 'Pedido cancelado' });
                                loadData(true);
                              } catch (error) {
                                toast({ title: 'Erro', variant: 'destructive' });
                              }
                            }}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rejeitar
                          </Button>
                        </div>
                      </div>
                    ))}
                  
                  {orders.filter(o => o.payment_method === 'mpesa' || o.payment_method === 'emola').filter(o => o.payment_status === 'pending' || o.payment_status === 'processing').length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                      <p>Nenhum pagamento pendente</p>
                      <p className="text-sm">Todos os pagamentos foram verificados</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-white border-b">
              <CardTitle>{editingProduct ? "Editar Produto" : "Novo Produto"}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsProductModalOpen(false)}>✕</Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Título/Nome *</Label>
                  <Input value={productForm.title} onChange={(e) => setProductForm({...productForm, title: e.target.value})} placeholder="Nome do produto" />
                </div>
                <div>
                  <Label>Preço (MZN) *</Label>
                  <Input type="number" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: Number(e.target.value)})} />
                </div>
                <div>
                  <Label>Preço Anterior</Label>
                  <Input type="number" value={productForm.compare_at_price} onChange={(e) => setProductForm({...productForm, compare_at_price: Number(e.target.value)})} />
                </div>
                <div>
                  <Label>Stock</Label>
                  <Input type="number" value={productForm.stock} onChange={(e) => setProductForm({...productForm, stock: Number(e.target.value)})} />
                </div>
                <div>
                  <Label>Categoria</Label>
                  <Input value={productForm.category} onChange={(e) => setProductForm({...productForm, category: e.target.value})} placeholder="Ex: Hardware" />
                </div>
                <div>
                  <Label>Marca</Label>
                  <Input value={productForm.brand} onChange={(e) => setProductForm({...productForm, brand: e.target.value})} placeholder="Ex: Hikvision" />
                </div>
                <div className="col-span-2">
                  <Label>URL da Imagem</Label>
                  <Input value={productForm.image_url} onChange={(e) => setProductForm({...productForm, image_url: e.target.value})} placeholder="https://..." />
                </div>
                <div className="col-span-2">
                  <Label>Descrição</Label>
                  <textarea
                    className="w-full p-3 border rounded-lg min-h-[100px]"
                    value={productForm.description}
                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    placeholder="Descrição do produto..."
                  />
                </div>
                <div className="col-span-2 flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={productForm.is_featured} onChange={(e) => setProductForm({...productForm, is_featured: e.target.checked})} />
                    Produto em Destaque
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={productForm.is_on_sale} onChange={(e) => setProductForm({...productForm, is_on_sale: e.target.checked})} />
                    Em Promoção
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={productForm.is_active} onChange={(e) => setProductForm({...productForm, is_active: e.target.checked})} />
                    Ativo
                  </label>
                </div>
              </div>
              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={handleProductSubmit} className="flex-1">
                  {editingProduct ? "Guardar Alterações" : "Criar Produto"}
                </Button>
                <Button variant="outline" onClick={() => setIsProductModalOpen(false)}>Cancelar</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Eliminação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza que deseja eliminar este item? Esta ação não pode ser revertida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

// Helper function for CSV download
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function downloadCSV(data: any[], columns: string[], filename: string) {
  if (data.length === 0) return;
  const headers = columns.join(",");
  const rows = data.map(row => columns.map(col => {
    const val = row[col] ?? "";
    return `"${String(val).replace(/"/g, '""')}"`;
  }).join(",")).join("\n");
  const csv = `${headers}\n${rows}`;
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default AdminPanel;
