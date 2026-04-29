import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/context/SettingsContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Loader2, Package, ShoppingCart, Users, DollarSign, TrendingUp, TrendingDown,
  Eye, Star, AlertTriangle, CheckCircle, XCircle, Clock, RefreshCw,
  Plus, Edit2, Trash2, Search, Filter, Download, MoreVertical,
  BarChart3, Settings, Bell, CreditCard, MessageSquare,
  ChevronLeft, ChevronRight, LayoutDashboard, FileText, Zap, Shield,
  Activity, PackageX, UserPlus, Crown, ArrowUpRight, ArrowDownRight,
  Calendar, FilterX, Tag, Menu, X, Globe, HelpCircle,
  ClipboardList, ChevronDown, ChevronsLeft, ChevronsRight,
  Receipt, Percent, Truck, Phone, Mail, MapPin, Globe2,
  Save, ArrowUpDown, ArrowDown, ArrowUp, EyeOff, Eye as EyeIcon,
  Copy, FileSpreadsheet, Image, Moon, Sun, FileText as FileTextIcon
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";
import {
  exportProductsPDF, exportOrdersPDF, exportUsersPDF,
  exportSalesSummaryPDF, exportAlertsPDF
} from "@/utils/exportPDF";

/* ===================== INTERFACES ===================== */

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

interface PriceAlert {
  id: string;
  user_id: string;
  product_id: string;
  target_price?: number;
  created_at?: string;
}

interface Coupon {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  min_order: number;
  max_uses: number;
  used_count: number;
  expiry_date: string | null;
  active: boolean;
  created_at: string;
}

interface ActivityLog {
  id: string;
  action: string;
  entity: string;
  entity_id: string | null;
  details: string;
  user_email: string | null;
  created_at: string;
}

interface SiteSettings {
  siteName: string;
  whatsappNumber: string;
  email: string;
  address: string;
  freeShippingThreshold: number;
  currency: string;
  taxRate: number;
  mpesaEnabled: boolean;
  emolaEnabled: boolean;
  cashEnabled: boolean;
  heroTitle: string;
  heroSubtitle: string;
  showMayBanner: boolean;
}

interface ContentBanner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  active: boolean;
  order: number;
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

/* ===================== HELPERS ===================== */

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-MZ", { style: "currency", currency: "MZN" }).format(value);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" });

const formatDateTime = (date: string) =>
  new Date(date).toLocaleString("pt-PT", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
    confirmed: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
    processing: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300",
    shipped: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300",
    delivered: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    cancelled: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
    refunded: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
  };
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 dark:bg-gray-800"}`}>{status}</span>;
};

function downloadCSV(data: Record<string, unknown>[], columns: string[], filename: string) {
  if (data.length === 0) return;
  const headers = columns.join(",");
  const rows = data.map(row => columns.map(col => {
    const val = row[col] ?? "";
    return `"${String(val).replace(/"/g, '""')}"`;
  }).join(",")).join("\n");
  const blob = new Blob([`${headers}\n${rows}`], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ===================== SIDEBAR NAV ITEMS ===================== */

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

/* ===================== MAIN COMPONENT ===================== */

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, loading, roles, initialized } = useAuth();
  const { isDarkMode, setTheme, theme } = useSettings();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [loadingData, setLoadingData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  /* Data */
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);

  /* ERP state — loaded from Supabase */
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: "Marrengula-IT",
    whatsappNumber: "+258840000000",
    email: "info@marrengula.co.mz",
    address: "Maputo, Moçambique",
    freeShippingThreshold: 5000,
    currency: "MZN",
    taxRate: 17,
    mpesaEnabled: true,
    emolaEnabled: true,
    cashEnabled: true,
    heroTitle: "TECNOLOGIA DE PONTA",
    heroSubtitle: "Monte seu PC gamer, encontre os melhores smartphones e componentes com entrega rápida em Moçambique",
    showMayBanner: true,
  });
  const [contentBanners, setContentBanners] = useState<ContentBanner[]>([
    { id: "1", title: "Ofertas Relâmpago", subtitle: "Até 50% OFF", imageUrl: "", linkUrl: "/produtos?promo=true", active: true, order: 1 },
  ]);

  /* Filters */
  const [productSearch, setProductSearch] = useState("");
  const [productCategory, setProductCategory] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState("all");
  const [userSearch, setUserSearch] = useState("");

  /* Pagination */
  const [productPage, setProductPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  /* Edit / Modal */
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    title: "", price: 0, compare_at_price: 0, stock: 0,
    category: "", brand: "", image_url: "", description: "",
    is_featured: false, is_on_sale: false, is_active: true
  });

  /* Inline edit */
  const [inlineEdit, setInlineEdit] = useState<{ productId: string; field: "stock" | "price"; value: string } | null>(null);

  /* Bulk */
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState("");

  /* Coupon form */
  const [couponForm, setCouponForm] = useState({
    code: "", type: "percent" as "percent" | "fixed", value: 0,
    minOrder: 0, maxUses: 100, expiryDate: ""
  });
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  /* Settings edit */
  const [editingSettings, setEditingSettings] = useState<SiteSettings>({ ...siteSettings });

  /* Content banner form */
  const [bannerForm, setBannerForm] = useState({ title: "", subtitle: "", imageUrl: "", linkUrl: "" });
  const [editingBanner, setEditingBanner] = useState<ContentBanner | null>(null);

  /* Support answer */
  const [answerForm, setAnswerForm] = useState<Record<string, string>>({});

  /* Delete */
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string } | null>(null);

  /* Refs */
  const mainRef = useRef<HTMLDivElement>(null);

  /* Categories */
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return Array.from(cats) as string[];
  }, [products]);

  /* Dashboard stats */
  const stats: DashboardStats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const pendingOrders = orders.filter(o => o.status === "pending" || o.status === "confirmed").length;
    const lowStockProducts = products.filter(p => p.stock <= 10).length;
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

  /* Filtered / paginated data */
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const name = p.title || p.name || "";
      const matchesSearch = name.toLowerCase().includes(productSearch.toLowerCase());
      const matchesCategory = productCategory === "all" || p.category === productCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, productSearch, productCategory]);

  const paginatedProducts = useMemo(() => {
    const start = (productPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, productPage]);

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

  const paginatedOrders = useMemo(() => {
    const start = (orderPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, orderPage]);

  const filteredUsers = useMemo(() => {
    const searchLower = userSearch.toLowerCase();
    return users.filter(u =>
      u.email?.toLowerCase().includes(searchLower) ||
      u.full_name?.toLowerCase().includes(searchLower)
    );
  }, [users, userSearch]);

  const unansweredQuestions = useMemo(() =>
    questions.filter(q => !q.answer || q.answer.trim() === ""),
    [questions]
  );

  /* Load on mount — AdminRoute already verified auth */
  useEffect(() => {
    loadData();
  }, []);

  /* Load data */
  const loadData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoadingData(true);
    try {
      const [productsRes, ordersRes, profilesRes, questionsRes, alertsRes, couponsRes, bannersRes, settingsRes, activityRes] = await Promise.all([
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("product_questions").select("*").order("created_at", { ascending: false }),
        supabase.from("price_alerts").select("*").order("created_at", { ascending: false }),
        supabase.from("coupons").select("*").order("created_at", { ascending: false }),
        supabase.from("content_banners").select("*").order("sort_order", { ascending: true }),
        supabase.from("admin_settings").select("key, value"),
        supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(500),
      ]);
      if (productsRes.data) setProducts(productsRes.data);
      if (ordersRes.data) setOrders(ordersRes.data);
      if (profilesRes.data) {
        const usersData: User[] = profilesRes.data.map((p: Record<string, unknown>) => ({
          id: p.id as string,
          email: (p.email as string) || (p.full_name as string) || "User",
          full_name: p.full_name as string,
          phone: p.phone as string,
          created_at: p.created_at as string,
          last_login_at: p.last_login_at as string
        }));
        setUsers(usersData);
      }
      if (questionsRes.data) setQuestions(questionsRes.data);
      if (alertsRes.data) setAlerts(alertsRes.data);
      if (couponsRes.data) setCoupons(couponsRes.data.map((c: Record<string, unknown>) => ({
        id: c.id as string, code: c.code as string, type: (c.type as "percent" | "fixed") || "percent",
        value: Number(c.value) || 0, min_order: Number(c.min_order) || 0,
        max_uses: Number(c.max_uses) || 100, used_count: Number(c.used_count) || 0,
        expiry_date: c.expiry_date as string | null, active: c.active !== false,
        created_at: c.created_at as string
      })));
      if (bannersRes.data) setContentBanners(bannersRes.data.map((b: Record<string, unknown>, i: number) => ({
        id: b.id as string, title: b.title as string, subtitle: (b.subtitle as string) || "",
        imageUrl: (b.image_url as string) || "", linkUrl: (b.link_url as string) || "",
        active: b.active !== false, order: (b.sort_order as number) ?? (i + 1)
      })));
      if (settingsRes.data) {
        for (const row of settingsRes.data) {
          if (row.key === "site_settings" && row.value) {
            setSiteSettings(prev => ({ ...prev, ...(row.value as Partial<SiteSettings>) }));
          }
        }
      }
      if (activityRes.data) setActivityLog(activityRes.data);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      toast({ title: "Erro ao carregar dados", description: message, variant: "destructive" });
    } finally {
      setLoadingData(false);
      setRefreshing(false);
    }
  };

  /* Activity log — write to Supabase */
  const logActivity = useCallback(async (action: string, entity: string, entityId: string, details: string) => {
    const entry: ActivityLog = {
      id: Date.now().toString(),
      action,
      entity,
      entity_id: entityId,
      details,
      user_email: user?.email || "admin",
      created_at: new Date().toISOString()
    };
    setActivityLog(prev => [entry, ...prev].slice(0, 500));
    try {
      await supabase.from("activity_log").insert({
        action, entity, entity_id: entityId, details, user_email: user?.email || "admin"
      });
    } catch (e) {
      console.error("[Admin] Failed to log activity:", e);
    }
  }, [user]);

  /* Product actions */
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
      setProductForm({ title: "", price: 0, compare_at_price: 0, stock: 0, category: "", brand: "", image_url: "", description: "", is_featured: false, is_on_sale: false, is_active: true });
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
        title: productForm.title, name: productForm.title,
        slug: productForm.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        price: productForm.price, compare_at_price: productForm.compare_at_price || null,
        old_price: productForm.is_on_sale ? productForm.compare_at_price : null,
        stock: productForm.stock, category: productForm.category,
        brand: productForm.brand || null, image_url: productForm.image_url || null,
        description: productForm.description || null,
        is_featured: productForm.is_featured, is_on_sale: productForm.is_on_sale,
        is_active: productForm.is_active, store_name: "MarrengulaIT",
        updated_at: new Date().toISOString()
      };
      if (editingProduct) {
        const { error } = await supabase.from("products").update(productData).eq("id", editingProduct.id);
        if (error) throw error;
        logActivity("update", "product", editingProduct.id, `Produto "${productForm.title}" atualizado`);
        toast({ title: "✅ Produto atualizado!" });
      } else {
        productData.created_at = new Date().toISOString();
        const { error } = await supabase.from("products").insert([productData]);
        if (error) throw error;
        logActivity("create", "product", "new", `Produto "${productForm.title}" criado`);
        toast({ title: "✅ Produto criado!" });
      }
      setIsProductModalOpen(false);
      loadData(true);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      toast({ title: "Erro ao guardar produto", description: message, variant: "destructive" });
    }
  };

  const handleInlineEditSave = async (productId: string, field: "stock" | "price", value: string) => {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) { setInlineEdit(null); return; }
    try {
      const { error } = await supabase.from("products").update({ [field]: num, updated_at: new Date().toISOString() }).eq("id", productId);
      if (error) throw error;
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, [field]: num } : p));
      logActivity("inline_edit", "product", productId, `${field} alterado para ${num}`);
      toast({ title: `✅ ${field === "stock" ? "Stock" : "Preço"} atualizado!` });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      toast({ title: "Erro ao atualizar", description: message, variant: "destructive" });
    }
    setInlineEdit(null);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const { error } = await supabase.from(deleteConfirm.type).delete().eq("id", deleteConfirm.id);
      if (error) throw error;
      logActivity("delete", deleteConfirm.type, deleteConfirm.id, "Item eliminado");
      toast({ title: `✅ Item eliminado!` });
      setDeleteConfirm(null);
      loadData(true);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      toast({ title: "Erro ao eliminar", description: message, variant: "destructive" });
    }
  };

  const handleBulkAction = async () => {
    if (selectedProducts.size === 0 || !bulkAction) return;
    const ids = Array.from(selectedProducts);
    try {
      if (bulkAction === "delete") {
        const { error } = await supabase.from("products").delete().in("id", ids);
        if (error) throw error;
        logActivity("bulk_delete", "products", ids.join(","), `${ids.length} produtos eliminados`);
      } else if (bulkAction === "featured") {
        const { error } = await supabase.from("products").update({ is_featured: true }).in("id", ids);
        if (error) throw error;
        logActivity("bulk_featured", "products", ids.join(","), `${ids.length} produtos em destaque`);
      } else if (bulkAction === "unfeatured") {
        const { error } = await supabase.from("products").update({ is_featured: false }).in("id", ids);
        if (error) throw error;
      } else if (bulkAction === "active") {
        const { error } = await supabase.from("products").update({ is_active: true }).in("id", ids);
        if (error) throw error;
      } else if (bulkAction === "inactive") {
        const { error } = await supabase.from("products").update({ is_active: false }).in("id", ids);
        if (error) throw error;
      }
      toast({ title: `✅ Acção em massa aplicada!` });
      setSelectedProducts(new Set());
      setBulkAction("");
      loadData(true);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      toast({ title: "Erro", description: message, variant: "destructive" });
    }
  };

  /* Order actions */
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from("orders").update({ status: newStatus, updated_at: new Date().toISOString() }).eq("id", orderId);
      if (error) throw error;
      logActivity("update", "order", orderId, `Status alterado para ${newStatus}`);
      toast({ title: "✅ Status atualizado!" });
      loadData(true);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      toast({ title: "Erro ao atualizar", description: message, variant: "destructive" });
    }
  };

  /* Coupon actions */
  const handleAddCoupon = async () => {
    if (!couponForm.code || couponForm.value <= 0) {
      toast({ title: "Preencha código e valor", variant: "destructive" });
      return;
    }
    try {
      const couponData = {
        code: couponForm.code.toUpperCase(),
        type: couponForm.type,
        value: couponForm.value,
        min_order: couponForm.minOrder,
        max_uses: couponForm.maxUses,
        used_count: 0,
        expiry_date: couponForm.expiryDate || null,
        active: true,
      };
      const { data, error } = await supabase.from("coupons").insert([couponData]).select().single();
      if (error) throw error;
      const newCoupon: Coupon = {
        id: data.id, code: data.code, type: data.type,
        value: Number(data.value), min_order: Number(data.min_order) || 0,
        max_uses: Number(data.max_uses) || 100, used_count: 0,
        expiry_date: data.expiry_date, active: data.active,
        created_at: data.created_at
      };
      setCoupons(prev => [...prev, newCoupon]);
      await logActivity("create", "coupon", data.id, `Cupão "${couponForm.code.toUpperCase()}" criado`);
      toast({ title: "✅ Cupão criado!" });
      setCouponForm({ code: "", type: "percent", value: 0, minOrder: 0, maxUses: 100, expiryDate: "" });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      toast({ title: "Erro ao criar cupão", description: message, variant: "destructive" });
    }
  };

  const toggleCoupon = async (id: string) => {
    const coupon = coupons.find(c => c.id === id);
    if (!coupon) return;
    try {
      await supabase.from("coupons").update({ active: !coupon.active }).eq("id", id);
      setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
    } catch {
      toast({ title: "Erro ao atualizar cupão", variant: "destructive" });
    }
  };

  const deleteCoupon = async (id: string) => {
    try {
      await supabase.from("coupons").delete().eq("id", id);
      setCoupons(prev => prev.filter(c => c.id !== id));
      await logActivity("delete", "coupon", id, "Cupão eliminado");
    } catch {
      toast({ title: "Erro ao eliminar cupão", variant: "destructive" });
    }
  };

  /* Content banner actions */
  const handleAddBanner = async () => {
    if (!bannerForm.title) {
      toast({ title: "Preencha o título", variant: "destructive" });
      return;
    }
    try {
      const bannerData = {
        title: bannerForm.title,
        subtitle: bannerForm.subtitle || null,
        image_url: bannerForm.imageUrl || null,
        link_url: bannerForm.linkUrl || null,
        active: true,
        sort_order: contentBanners.length + 1,
      };
      const { data, error } = await supabase.from("content_banners").insert([bannerData]).select().single();
      if (error) throw error;
      const newBanner: ContentBanner = {
        id: data.id, title: data.title, subtitle: data.subtitle || "",
        imageUrl: data.image_url || "", linkUrl: data.link_url || "",
        active: data.active, order: data.sort_order
      };
      setCoupons(prev => prev);
      setContentBanners(prev => [...prev, newBanner]);
      await logActivity("create", "banner", data.id, `Banner "${bannerForm.title}" criado`);
      toast({ title: "✅ Banner adicionado!" });
      setBannerForm({ title: "", subtitle: "", imageUrl: "", linkUrl: "" });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      toast({ title: "Erro ao criar banner", description: message, variant: "destructive" });
    }
  };

  const toggleBanner = async (id: string) => {
    const banner = contentBanners.find(b => b.id === id);
    if (!banner) return;
    try {
      await supabase.from("content_banners").update({ active: !banner.active }).eq("id", id);
      setContentBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
    } catch {
      toast({ title: "Erro ao atualizar banner", variant: "destructive" });
    }
  };

  const deleteBanner = async (id: string) => {
    try {
      await supabase.from("content_banners").delete().eq("id", id);
      setContentBanners(prev => prev.filter(b => b.id !== id));
      await logActivity("delete", "banner", id, "Banner eliminado");
    } catch {
      toast({ title: "Erro ao eliminar banner", variant: "destructive" });
    }
  };

  /* Support actions */
  const handleAnswerQuestion = async (questionId: string) => {
    const answer = answerForm[questionId];
    if (!answer?.trim()) return;
    try {
      const { error } = await supabase.from("product_questions").update({ answer }).eq("id", questionId);
      if (error) throw error;
      setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, answer } : q));
      logActivity("answer", "question", questionId, "Pergunta respondida");
      toast({ title: "✅ Resposta enviada!" });
      setAnswerForm(prev => ({ ...prev, [questionId]: "" }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      toast({ title: "Erro", description: message, variant: "destructive" });
    }
  };

  /* Settings actions */
  const handleSaveSettings = async () => {
    try {
      setSiteSettings(editingSettings);
      await supabase.from("admin_settings").upsert({
        key: "site_settings",
        value: editingSettings,
        updated_by: user?.id
      });
      await logActivity("update", "settings", "global", "Configurações atualizadas");
      toast({ title: "✅ Configurações guardadas!" });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      toast({ title: "Erro ao guardar", description: message, variant: "destructive" });
    }
  };

  /* Tab navigation */
  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileSidebarOpen(false);
    setProductPage(1);
    setOrderPage(1);
  };

  /* Loading */
  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  /* ===================== RENDER ===================== */
  const totalProductPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const totalOrderPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 dark:bg-gray-950 flex">
      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen z-50 lg:z-0 bg-gray-900 text-gray-300 flex flex-col transition-all duration-300 ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} ${sidebarOpen ? "w-64" : "w-[72px]"}`}>
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-4 border-b dark:border-gray-800 border-gray-800">
          <div className="w-8 h-8 rounded-lg bg-[#FF3131] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-sm">M</span>
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <h1 className="text-white font-bold text-sm truncate">Marrengula ERP</h1>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">Painel de Gestão</p>
            </div>
          )}
        </div>

        {/* Nav */}
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
                        <Badge className="ml-auto bg-yellow-50 dark:bg-yellow-950/200 text-[10px] h-5 px-1.5">{unansweredQuestions.length}</Badge>
                      )}
                      {sidebarOpen && item.id === "inventory" && stats.lowStockProducts > 0 && (
                        <Badge className="ml-auto bg-red-50 dark:bg-red-950/200 text-[10px] h-5 px-1.5">{stats.lowStockProducts}</Badge>
                      )}
                      {sidebarOpen && item.id === "orders" && stats.pendingOrders > 0 && (
                        <Badge className="ml-auto bg-blue-50 dark:bg-blue-950/200 text-[10px] h-5 px-1.5">{stats.pendingOrders}</Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Theme toggle + Collapse */}
        <div className="border-t dark:border-gray-800 border-gray-800 p-2 hidden lg:block space-y-1">
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

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 bg-white dark:bg-gray-900 dark:bg-gray-900 border-b dark:border-gray-800 border-gray-200 dark:border-gray-800 dark:border-gray-800 flex items-center justify-between px-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-800" onClick={() => setMobileSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white dark:text-white capitalize">
                {navSections.flatMap(s => s.items).find(n => n.id === activeTab)?.label || activeTab}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-400 hidden sm:block">
                {formatDate(new Date().toISOString())}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" onClick={() => loadData(true)} disabled={refreshing} className="hidden sm:flex">
              <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-gray-800 dark:border-gray-700">
              <div className="w-8 h-8 rounded-full bg-[#FF3131]/10 flex items-center justify-center">
                <span className="text-[#FF3131] font-bold text-xs">{user?.email?.[0]?.toUpperCase()}</span>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 dark:text-gray-300 hidden md:block">{user?.email?.split("@")[0]}</span>
            </div>
          </div>
        </header>

        {/* Content area */}
        <main ref={mainRef} className="flex-1 p-4 md:p-6 overflow-y-auto">
          {/* ==================== DASHBOARD ==================== */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-xs font-medium">Receita Total</p>
                        <p className="text-2xl font-bold mt-1">{formatCurrency(stats.totalRevenue)}</p>
                        <p className="text-blue-100 text-[10px] mt-1">+12.5% vs mês anterior</p>
                      </div>
                      <div className="bg-white dark:bg-gray-900/20 p-2.5 rounded-lg"><DollarSign className="h-6 w-6" /></div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-xs font-medium">Total de Pedidos</p>
                        <p className="text-2xl font-bold mt-1">{stats.totalOrders}</p>
                        <p className="text-green-100 text-[10px] mt-1">{stats.pendingOrders} pendentes</p>
                      </div>
                      <div className="bg-white dark:bg-gray-900/20 p-2.5 rounded-lg"><ShoppingCart className="h-6 w-6" /></div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-xs font-medium">Produtos</p>
                        <p className="text-2xl font-bold mt-1">{stats.totalProducts}</p>
                        <p className="text-purple-100 text-[10px] mt-1">{stats.lowStockProducts} stock baixo</p>
                      </div>
                      <div className="bg-white dark:bg-gray-900/20 p-2.5 rounded-lg"><Package className="h-6 w-6" /></div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-xs font-medium">Clientes</p>
                        <p className="text-2xl font-bold mt-1">{stats.totalUsers}</p>
                        <p className="text-orange-100 text-[10px] mt-1">+{Math.floor(stats.totalUsers * 0.1)} este mês</p>
                      </div>
                      <div className="bg-white dark:bg-gray-900/20 p-2.5 rounded-lg"><Users className="h-6 w-6" /></div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base">Pedidos Recentes</CardTitle>
                    <Button size="sm" variant="ghost" onClick={() => handleNavClick("orders")}>
                      Ver Todos <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stats.recentOrders.map(order => (
                        <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-950 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{order.customer_name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{order.order_number || order.id.slice(0, 8)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm">{formatCurrency(order.total_amount)}</p>
                            {getStatusBadge(order.status)}
                          </div>
                        </div>
                      ))}
                      {stats.recentOrders.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">Nenhum pedido</p>}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Products */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base">Mais Vendidos</CardTitle>
                    <Button size="sm" variant="ghost" onClick={() => handleNavClick("products")}>
                      Ver Todos <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stats.topProducts.map((product, index) => (
                        <div key={product.id} className="flex items-center gap-3">
                          <div className="bg-primary/10 text-primary font-bold w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{product.title || product.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{product.sale_count || 0} vendas</p>
                          </div>
                          <p className="font-bold text-sm flex-shrink-0">{formatCurrency(product.price)}</p>
                        </div>
                      ))}
                      {stats.topProducts.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">Nenhum produto</p>}
                    </div>
                  </CardContent>
                </Card>

                {/* Sales Chart */}
                <Card className="lg:col-span-2">
                  <CardHeader className="pb-2"><CardTitle className="text-base">Vendas — Últimos 7 Dias</CardTitle></CardHeader>
                  <CardContent>
                    <div className="h-40 flex items-end justify-between gap-2">
                      {stats.salesByDay.map((day, i) => {
                        const maxSale = Math.max(...stats.salesByDay.map(d => d.total), 1);
                        const height = (day.total / maxSale) * 100;
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <div className="w-full bg-primary/15 rounded-t-md relative" style={{ height: `${Math.max(height, 3)}%` }}>
                              <div className="absolute bottom-0 w-full bg-primary rounded-t-md transition-all" style={{ height: `${Math.max(height, 3)}%` }} />
                            </div>
                            <span className="text-[10px] text-gray-500 dark:text-gray-400">{new Date(day.date).toLocaleDateString("pt-PT", { weekday: "short" })}</span>
                            <span className="text-[10px] font-medium">{formatCurrency(day.total)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Alerts */}
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-base">Alertas</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <span className="font-medium text-sm">Stock Baixo</span>
                      </div>
                      <Badge variant="destructive">{stats.lowStockProducts}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-yellow-600" />
                        <span className="font-medium text-sm">Pedidos Pendentes</span>
                      </div>
                      <Badge variant="secondary">{stats.pendingOrders}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-sm">Perguntas</span>
                      </div>
                      <Badge variant="outline">{questions.length}</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Questions */}
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-base">Perguntas de Clientes</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {questions.slice(0, 5).map(q => (
                        <div key={q.id} className="p-3 bg-gray-50 dark:bg-gray-950 rounded-lg">
                          <p className="text-sm font-medium">{q.question?.slice(0, 100)}...</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{q.created_at ? formatDate(q.created_at) : "Recente"}</p>
                        </div>
                      ))}
                      {questions.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">Nenhuma pergunta</p>}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* ==================== PRODUCTS ==================== */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Gestão de Produtos</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{filteredProducts.length} produtos encontrados</p>
                </div>
                <Button onClick={() => openProductModal()} className="gap-2">
                  <Plus className="h-4 w-4" /> Novo Produto
                </Button>
              </div>

              <Card>
                <CardContent className="pt-6 space-y-4">
                  {/* Filters */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input placeholder="Pesquisar produtos..." value={productSearch} onChange={e => { setProductSearch(e.target.value); setProductPage(1); }} className="pl-10" />
                    </div>
                    <select value={productCategory} onChange={e => { setProductCategory(e.target.value); setProductPage(1); }} className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 text-sm">
                      <option value="all">Todas Categorias</option>
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    {(productSearch || productCategory !== "all") && (
                      <Button variant="ghost" size="sm" onClick={() => { setProductSearch(""); setProductCategory("all"); }}>
                        <FilterX className="h-4 w-4 mr-1" /> Limpar
                      </Button>
                    )}
                  </div>

                  {/* Bulk actions */}
                  {selectedProducts.size > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-b dark:border-gray-800lue-200">
                      <span className="text-sm font-medium text-blue-700">{selectedProducts.size} selecionados</span>
                      <select value={bulkAction} onChange={e => setBulkAction(e.target.value)} className="px-3 py-1.5 border rounded-lg bg-white dark:bg-gray-900 text-sm">
                        <option value="">Acção...</option>
                        <option value="featured">Marcar Destaque</option>
                        <option value="unfeatured">Remover Destaque</option>
                        <option value="active">Ativar</option>
                        <option value="inactive">Desativar</option>
                        <option value="delete">Eliminar</option>
                      </select>
                      <Button size="sm" onClick={handleBulkAction} disabled={!bulkAction}>Aplicar</Button>
                      <Button size="sm" variant="ghost" onClick={() => setSelectedProducts(new Set())}>Limpar</Button>
                    </div>
                  )}

                  {/* Products Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-950">
                        <tr>
                          <th className="text-left py-3 px-3 w-10">
                            <input type="checkbox" onChange={e => {
                              if (e.target.checked) setSelectedProducts(new Set(paginatedProducts.map(p => p.id)));
                              else setSelectedProducts(new Set());
                            }} className="rounded" />
                          </th>
                          <th className="text-left py-3 px-3 font-medium">Produto</th>
                          <th className="text-left py-3 px-3 font-medium">Preço</th>
                          <th className="text-left py-3 px-3 font-medium">Stock</th>
                          <th className="text-left py-3 px-3 font-medium hidden md:table-cell">Categoria</th>
                          <th className="text-left py-3 px-3 font-medium hidden lg:table-cell">Estado</th>
                          <th className="text-left py-3 px-3 font-medium">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedProducts.map(product => (
                          <tr key={product.id} className="border-t dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 dark:bg-gray-950/50">
                            <td className="py-2.5 px-3">
                              <input type="checkbox" checked={selectedProducts.has(product.id)} onChange={e => {
                                setSelectedProducts(prev => {
                                  const next = new Set(prev);
                                  if (e.target.checked) next.add(product.id); else next.delete(product.id);
                                  return next;
                                });
                              }} className="rounded" />
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                  {product.image_url ? <img src={product.image_url} alt="" className="w-full h-full object-cover" /> : <Package className="h-5 w-5 text-gray-300" />}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-medium truncate">{product.title || product.name}</p>
                                  <div className="flex gap-1 mt-0.5">
                                    {product.is_featured && <Badge variant="default" className="text-[10px] h-4 px-1">Destaque</Badge>}
                                    {product.is_on_sale && <Badge variant="destructive" className="text-[10px] h-4 px-1">Promo</Badge>}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-2.5 px-3">
                              {inlineEdit?.productId === product.id && inlineEdit.field === "price" ? (
                                <Input
                                  type="number"
                                  defaultValue={product.price}
                                  className="w-28 h-7 text-sm"
                                  autoFocus
                                  onBlur={e => handleInlineEditSave(product.id, "price", e.target.value)}
                                  onKeyDown={e => { if (e.key === "Enter") handleInlineEditSave(product.id, "price", (e.target as HTMLInputElement).value); if (e.key === "Escape") setInlineEdit(null); }}
                                />
                              ) : (
                                <button
                                  onClick={() => setInlineEdit({ productId: product.id, field: "price", value: String(product.price) })}
                                  className="font-bold text-primary text-sm hover:underline"
                                  title="Clique para editar"
                                >
                                  {formatCurrency(product.price)}
                                </button>
                              )}
                            </td>
                            <td className="py-2.5 px-3">
                              {inlineEdit?.productId === product.id && inlineEdit.field === "stock" ? (
                                <Input
                                  type="number"
                                  defaultValue={product.stock}
                                  className="w-20 h-7 text-sm"
                                  autoFocus
                                  onBlur={e => handleInlineEditSave(product.id, "stock", e.target.value)}
                                  onKeyDown={e => { if (e.key === "Enter") handleInlineEditSave(product.id, "stock", (e.target as HTMLInputElement).value); if (e.key === "Escape") setInlineEdit(null); }}
                                />
                              ) : (
                                <button
                                  onClick={() => setInlineEdit({ productId: product.id, field: "stock", value: String(product.stock) })}
                                  className={`text-sm ${product.stock <= 10 ? "text-red-600 font-bold" : "hover:underline"}`}
                                  title="Clique para editar"
                                >
                                  {product.stock}
                                </button>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400 hidden md:table-cell">{product.category || "—"}</td>
                            <td className="py-2.5 px-3 hidden lg:table-cell">
                              {product.is_active === false ? (
                                <Badge variant="secondary" className="text-[10px]">Inativo</Badge>
                              ) : (
                                <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 text-[10px]">Ativo</Badge>
                              )}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-1">
                                <Button size="sm" variant="ghost" onClick={() => openProductModal(product)} className="h-7 w-7 p-0">
                                  <Edit2 className="h-3.5 w-3.5" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-600" onClick={() => setDeleteConfirm({ type: "products", id: product.id })}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalProductPages > 1 && (
                    <div className="flex items-center justify-between pt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {(productPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(productPage * ITEMS_PER_PAGE, filteredProducts.length)} de {filteredProducts.length}
                      </p>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="outline" disabled={productPage === 1} onClick={() => setProductPage(p => p - 1)}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        {Array.from({ length: Math.min(5, totalProductPages) }, (_, i) => {
                          let page: number;
                          if (totalProductPages <= 5) page = i + 1;
                          else if (productPage <= 3) page = i + 1;
                          else if (productPage >= totalProductPages - 2) page = totalProductPages - 4 + i;
                          else page = productPage - 2 + i;
                          return (
                            <Button key={page} size="sm" variant={productPage === page ? "default" : "outline"} onClick={() => setProductPage(page)} className={`h-8 w-8 p-0 ${productPage === page ? "bg-[#FF3131]" : ""}`}>
                              {page}
                            </Button>
                          );
                        })}
                        <Button size="sm" variant="outline" disabled={productPage === totalProductPages} onClick={() => setProductPage(p => p + 1)}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {filteredProducts.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>Nenhum produto encontrado</p>
                      <Button variant="link" onClick={() => openProductModal()}>Criar primeiro produto</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* ==================== ORDERS ==================== */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Gestão de Pedidos</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{filteredOrders.length} pedidos</p>
                </div>
                <Button variant="outline" onClick={() => exportOrdersPDF(orders)} className="gap-2">
                  <Download className="h-4 w-4" /> Exportar PDF
                </Button>
              </div>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input placeholder="Pesquisar..." value={orderSearch} onChange={e => { setOrderSearch(e.target.value); setOrderPage(1); }} className="pl-10" />
                    </div>
                    <select value={orderStatus} onChange={e => { setOrderStatus(e.target.value); setOrderPage(1); }} className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 text-sm">
                      <option value="all">Todos Status</option>
                      <option value="pending">Pendente</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="processing">Em Processamento</option>
                      <option value="shipped">Enviado</option>
                      <option value="delivered">Entregue</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-950">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium">Pedido</th>
                          <th className="text-left py-3 px-4 font-medium">Cliente</th>
                          <th className="text-left py-3 px-4 font-medium">Total</th>
                          <th className="text-left py-3 px-4 font-medium">Status</th>
                          <th className="text-left py-3 px-4 font-medium hidden md:table-cell">Data</th>
                          <th className="text-left py-3 px-4 font-medium">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedOrders.map(order => (
                          <tr key={order.id} className="border-t dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 dark:bg-gray-950/50">
                            <td className="py-3 px-4 font-mono text-xs">{order.order_number || order.id.slice(0, 8)}</td>
                            <td className="py-3 px-4">
                              <p className="font-medium text-sm">{order.customer_name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{order.customer_email}</p>
                            </td>
                            <td className="py-3 px-4 font-bold text-sm">{formatCurrency(order.total_amount)}</td>
                            <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                            <td className="py-3 px-4 text-xs text-gray-500 dark:text-gray-400 hidden md:table-cell">{formatDate(order.created_at)}</td>
                            <td className="py-3 px-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button size="sm" variant="ghost"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
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
                        <Button size="sm" variant="outline" disabled={orderPage === 1} onClick={() => setOrderPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
                        <Button size="sm" variant="outline" disabled={orderPage === totalOrderPages} onClick={() => setOrderPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  )}

                  {filteredOrders.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>Nenhum pedido encontrado</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* ==================== INVENTORY ==================== */}
          {activeTab === "inventory" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Gestão de Inventário</h3>

              {/* Low stock alerts */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    Stock Baixo ({stats.lowStockProducts} produtos)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-red-50 dark:bg-red-950/20">
                        <tr>
                          <th className="text-left py-2 px-3 font-medium">Produto</th>
                          <th className="text-left py-2 px-3 font-medium">Stock Atual</th>
                          <th className="text-left py-2 px-3 font-medium">Categoria</th>
                          <th className="text-left py-2 px-3 font-medium">Ação Rápida</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.filter(p => p.stock <= 10).sort((a, b) => a.stock - b.stock).map(product => (
                          <tr key={product.id} className="border-t dark:border-gray-800">
                            <td className="py-2 px-3 font-medium">{product.title || product.name}</td>
                            <td className="py-2 px-3">
                              <Badge variant={product.stock === 0 ? "destructive" : "outline"} className={product.stock === 0 ? "" : "bg-orange-100 text-orange-700 border-orange-200"}>
                                {product.stock === 0 ? "Esgotado" : `${product.stock} un.`}
                              </Badge>
                            </td>
                            <td className="py-2 px-3 text-gray-500 dark:text-gray-400">{product.category || "—"}</td>
                            <td className="py-2 px-3">
                              <Button size="sm" variant="outline" onClick={() => { setInlineEdit({ productId: product.id, field: "stock", value: String(product.stock) }); }}>
                                <Edit2 className="h-3.5 w-3.5 mr-1" /> Repor
                              </Button>
                            </td>
                          </tr>
                        ))}
                        {stats.lowStockProducts === 0 && (
                          <tr><td colSpan={4} className="py-8 text-center text-gray-500 dark:text-gray-400">Todos os produtos com stock adequado</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Inventory overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Visão Geral do Inventário</CardTitle>
                  <CardDescription>{products.length} produtos no catálogo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-700">{products.filter(p => p.is_active !== false).length}</p>
                      <p className="text-xs text-green-600">Ativos</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-950 rounded-lg text-center">
                      <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">{products.filter(p => p.is_active === false).length}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">Inativos</p>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-700">{products.filter(p => p.is_featured || p.featured).length}</p>
                      <p className="text-xs text-blue-600">Em Destaque</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-orange-700">{products.filter(p => p.is_on_sale || p.on_sale).length}</p>
                      <p className="text-xs text-orange-600">Em Promoção</p>
                    </div>
                  </div>

                  {/* Quick stock update */}
                  <h4 className="font-semibold mb-3">Atualização Rápida de Stock</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Clique no valor do stock na tabela de produtos para editar inline, ou use a acção em massa para atualizar vários produtos.</p>
                  <Button variant="outline" onClick={() => handleNavClick("products")}>
                    <Package className="h-4 w-4 mr-2" /> Ir para Produtos
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ==================== USERS ==================== */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Gestão de Clientes</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{filteredUsers.length} clientes</p>
                </div>
                <Button variant="outline" onClick={() => exportUsersPDF(users)} className="gap-2"><Download className="h-4 w-4" /> Exportar</Button>
              </div>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="Pesquisar clientes..." value={userSearch} onChange={e => setUserSearch(e.target.value)} className="pl-10" />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-950">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium">Cliente</th>
                          <th className="text-left py-3 px-4 font-medium">Email</th>
                          <th className="text-left py-3 px-4 font-medium hidden md:table-cell">Desde</th>
                          <th className="text-left py-3 px-4 font-medium hidden lg:table-cell">Último Login</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map(u => (
                          <tr key={u.id} className="border-t dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 dark:bg-gray-950/50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                  <span className="text-primary font-medium text-xs">{u.full_name?.[0] || u.email?.[0]?.toUpperCase() || "U"}</span>
                                </div>
                                <span className="font-medium">{u.full_name || "Sem nome"}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{u.email}</td>
                            <td className="py-3 px-4 text-xs hidden md:table-cell">{u.created_at ? formatDate(u.created_at) : "-"}</td>
                            <td className="py-3 px-4 text-xs text-gray-500 dark:text-gray-400 hidden lg:table-cell">{u.last_login_at ? formatDate(u.last_login_at) : "Nunca"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>Nenhum cliente encontrado</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* ==================== COUPONS ==================== */}
          {activeTab === "coupons" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Cupões & Promoções</h3>

              {/* Create coupon */}
              <Card>
                <CardHeader><CardTitle className="text-base">Novo Cupão</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label>Código *</Label>
                      <Input value={couponForm.code} onChange={e => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })} placeholder="EX: PROMO20" />
                    </div>
                    <div>
                      <Label>Tipo</Label>
                      <select value={couponForm.type} onChange={e => setCouponForm({ ...couponForm, type: e.target.value as "percent" | "fixed" })} className="w-full px-3 py-2 border rounded-lg text-sm">
                        <option value="percent">Percentagem (%)</option>
                        <option value="fixed">Valor Fixo (MZN)</option>
                      </select>
                    </div>
                    <div>
                      <Label>Valor *</Label>
                      <Input type="number" value={couponForm.value} onChange={e => setCouponForm({ ...couponForm, value: Number(e.target.value) })} placeholder={couponForm.type === "percent" ? "10" : "500"} />
                    </div>
                    <div>
                      <Label>Pedido Mínimo (MZN)</Label>
                      <Input type="number" value={couponForm.minOrder} onChange={e => setCouponForm({ ...couponForm, minOrder: Number(e.target.value) })} placeholder="0" />
                    </div>
                    <div>
                      <Label>Usos Máximos</Label>
                      <Input type="number" value={couponForm.maxUses} onChange={e => setCouponForm({ ...couponForm, maxUses: Number(e.target.value) })} placeholder="100" />
                    </div>
                    <div>
                      <Label>Data de Expiração</Label>
                      <Input type="date" value={couponForm.expiryDate} onChange={e => setCouponForm({ ...couponForm, expiryDate: e.target.value })} />
                    </div>
                  </div>
                  <Button onClick={handleAddCoupon} className="mt-4 gap-2"><Tag className="h-4 w-4" /> Criar Cupão</Button>
                </CardContent>
              </Card>

              {/* Coupon list */}
              <Card>
                <CardHeader><CardTitle className="text-base">Cupões Ativos ({coupons.filter(c => c.active).length})</CardTitle></CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-950">
                        <tr>
                          <th className="text-left py-3 px-3 font-medium">Código</th>
                          <th className="text-left py-3 px-3 font-medium">Tipo</th>
                          <th className="text-left py-3 px-3 font-medium">Valor</th>
                          <th className="text-left py-3 px-3 font-medium hidden sm:table-cell">Mín.</th>
                          <th className="text-left py-3 px-3 font-medium hidden md:table-cell">Usos</th>
                          <th className="text-left py-3 px-3 font-medium hidden lg:table-cell">Expira</th>
                          <th className="text-left py-3 px-3 font-medium">Estado</th>
                          <th className="text-left py-3 px-3 font-medium">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {coupons.map(coupon => (
                          <tr key={coupon.id} className="border-t dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 dark:bg-gray-950/50">
                            <td className="py-2.5 px-3 font-mono font-bold">{coupon.code}</td>
                            <td className="py-2.5 px-3">
                              <Badge variant="outline" className="text-[10px]">{coupon.type === "percent" ? "%" : "MZN"}</Badge>
                            </td>
                            <td className="py-2.5 px-3 font-medium">{coupon.type === "percent" ? `${coupon.value}%` : formatCurrency(coupon.value)}</td>
                            <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400 hidden sm:table-cell">{coupon.min_order > 0 ? formatCurrency(coupon.min_order) : "—"}</td>
                            <td className="py-2.5 px-3 hidden md:table-cell">
                              <span className={coupon.used_count >= coupon.max_uses ? "text-red-600 font-bold" : "text-green-600"}>
                                {coupon.used_count}/{coupon.max_uses}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-xs text-gray-500 dark:text-gray-400 hidden lg:table-cell">{coupon.expiry_date ? formatDate(coupon.expiry_date) : "Sem limite"}</td>
                            <td className="py-2.5 px-3">
                              <Badge className={coupon.active ? "bg-green-100 dark:bg-green-900/30 text-green-700" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"}>
                                {coupon.active ? "Ativo" : "Inativo"}
                              </Badge>
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-1">
                                <Switch checked={coupon.active} onCheckedChange={() => toggleCoupon(coupon.id)} />
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-600" onClick={() => deleteCoupon(coupon.id)}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {coupons.length === 0 && (
                          <tr><td colSpan={8} className="py-8 text-center text-gray-500 dark:text-gray-400">Nenhum cupão criado</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ==================== CONTENT ==================== */}
          {activeTab === "content" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Gestão de Conteúdo</h3>

              {/* Hero settings */}
              <Card>
                <CardHeader><CardTitle className="text-base">Hero Section</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Título Principal</Label>
                    <Input value={editingSettings.heroTitle} onChange={e => setEditingSettings({ ...editingSettings, heroTitle: e.target.value })} />
                  </div>
                  <div>
                    <Label>Subtítulo</Label>
                    <Textarea value={editingSettings.heroSubtitle} onChange={e => setEditingSettings({ ...editingSettings, heroSubtitle: e.target.value })} />
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch checked={editingSettings.showMayBanner} onCheckedChange={v => setEditingSettings({ ...editingSettings, showMayBanner: v })} />
                    <Label className="cursor-pointer">Mostrar May Banner</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Banners */}
              <Card>
                <CardHeader><CardTitle className="text-base">Banners Promocionais</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Título</Label>
                      <Input value={bannerForm.title} onChange={e => setBannerForm({ ...bannerForm, title: e.target.value })} placeholder="Ofertas Relâmpago" />
                    </div>
                    <div>
                      <Label>Subtítulo</Label>
                      <Input value={bannerForm.subtitle} onChange={e => setBannerForm({ ...bannerForm, subtitle: e.target.value })} placeholder="Até 50% OFF" />
                    </div>
                    <div>
                      <Label>URL da Imagem</Label>
                      <Input value={bannerForm.imageUrl} onChange={e => setBannerForm({ ...bannerForm, imageUrl: e.target.value })} placeholder="https://..." />
                    </div>
                    <div>
                      <Label>URL do Link</Label>
                      <Input value={bannerForm.linkUrl} onChange={e => setBannerForm({ ...bannerForm, linkUrl: e.target.value })} placeholder="/produtos?promo=true" />
                    </div>
                  </div>
                  <Button onClick={handleAddBanner} className="gap-2"><Image className="h-4 w-4" /> Adicionar Banner</Button>

                  <Separator />

                  <div className="space-y-3">
                    {contentBanners.map(banner => (
                      <div key={banner.id} className="flex items-center justify-between p-4 border rounded-lg bg-white dark:bg-gray-900">
                        <div>
                          <p className="font-medium">{banner.title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{banner.subtitle || "Sem subtítulo"}</p>
                          <p className="text-xs text-gray-400 mt-1">{banner.linkUrl}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={banner.active} onCheckedChange={() => toggleBanner(banner.id)} />
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-600" onClick={() => deleteBanner(banner.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {contentBanners.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">Nenhum banner configurado</p>}
                  </div>
                </CardContent>
              </Card>

              <Button onClick={handleSaveSettings} className="gap-2"><Save className="h-4 w-4" /> Guardar Alterações de Conteúdo</Button>
            </div>
          )}

          {/* ==================== PAYMENTS ==================== */}
          {activeTab === "payments" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Verificação de Pagamentos</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {orders.filter(o => (o.payment_method === "mpesa" || o.payment_method === "emola") && (o.payment_status === "pending" || o.payment_status === "processing")).length} pagamentos pendentes
              </p>
              <div className="space-y-4">
                {orders
                  .filter(o => o.payment_method === "mpesa" || o.payment_method === "emola")
                  .filter(o => o.payment_status === "pending" || o.payment_status === "processing")
                  .map(order => (
                    <Card key={order.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="font-bold">{order.customer_name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{order.customer_email}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Tel: {order.customer_phone}</p>
                            <p className="font-mono text-xs">Pedido: {order.order_number || order.id.slice(0, 8)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-primary">{formatCurrency(order.total_amount)}</p>
                            <Badge variant="outline" className={order.payment_method === "mpesa" ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300" : "bg-orange-100 text-orange-800"}>
                              {order.payment_method === "mpesa" ? "M-Pesa" : "E-Mola"}
                            </Badge>
                          </div>
                        </div>
                        {order.payment_proof_url && (
                          <div className="mb-4">
                            <p className="text-sm font-medium mb-2">Comprovativo:</p>
                            <img src={order.payment_proof_url} alt="Comprovativo" className="max-w-xs rounded-lg border" />
                          </div>
                        )}
                        {order.payment_proof_data && (
                          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-950 rounded-lg">
                            <p className="text-sm font-medium mb-1">Dados do pagamento:</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{order.payment_proof_data.message}</p>
                            {order.payment_proof_data.reference && <p className="text-sm font-medium mt-1">Ref: {order.payment_proof_data.reference}</p>}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={async () => {
                            try {
                              await supabase.from("orders").update({ payment_status: "paid", status: "confirmed" }).eq("id", order.id);
                              logActivity("payment_confirm", "order", order.id, "Pagamento confirmado");
                              toast({ title: "✅ Pagamento confirmado!" });
                              loadData(true);
                            } catch { toast({ title: "Erro ao confirmar", variant: "destructive" }); }
                          }}>
                            <CheckCircle className="h-4 w-4 mr-1" /> Confirmar Pagamento
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600" onClick={async () => {
                            try {
                              await supabase.from("orders").update({ status: "cancelled" }).eq("id", order.id);
                              logActivity("payment_reject", "order", order.id, "Pagamento rejeitado");
                              toast({ title: "Pedido cancelado" });
                              loadData(true);
                            } catch { toast({ title: "Erro", variant: "destructive" }); }
                          }}>
                            <XCircle className="h-4 w-4 mr-1" /> Rejeitar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                {orders.filter(o => (o.payment_method === "mpesa" || o.payment_method === "emola") && (o.payment_status === "pending" || o.payment_status === "processing")).length === 0 && (
                  <Card><CardContent className="py-12 text-center text-gray-500 dark:text-gray-400">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                    <p>Nenhum pagamento pendente</p>
                  </CardContent></Card>
                )}
              </div>
            </div>
          )}

          {/* ==================== REPORTS ==================== */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Relatórios & Exportações</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => exportSalesSummaryPDF(orders, products, users)}>
                  <CardContent className="p-6 text-center">
                    <FileText className="h-10 w-10 mx-auto mb-3 text-primary" />
                    <h3 className="font-semibold text-sm">Resumo de Vendas</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Estatísticas completas</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => exportProductsPDF(products)}>
                  <CardContent className="p-6 text-center">
                    <Package className="h-10 w-10 mx-auto mb-3 text-green-600" />
                    <h3 className="font-semibold text-sm">Catálogo de Produtos</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Lista em PDF</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => exportOrdersPDF(orders)}>
                  <CardContent className="p-6 text-center">
                    <ShoppingCart className="h-10 w-10 mx-auto mb-3 text-orange-600" />
                    <h3 className="font-semibold text-sm">Relatório de Pedidos</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Vendas detalhadas</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => exportUsersPDF(users)}>
                  <CardContent className="p-6 text-center">
                    <Users className="h-10 w-10 mx-auto mb-3 text-purple-600" />
                    <h3 className="font-semibold text-sm">Base de Clientes</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Lista de clientes</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => exportAlertsPDF(alerts, questions)}>
                  <CardContent className="p-6 text-center">
                    <Bell className="h-10 w-10 mx-auto mb-3 text-red-600" />
                    <h3 className="font-semibold text-sm">Alertas e Perguntas</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Interações de clientes</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader><CardTitle className="text-base">Exportar CSV</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button variant="outline" size="sm" onClick={() => downloadCSV(products as unknown as Record<string, unknown>[], ["id", "title", "price", "stock", "category"], "produtos.csv")}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" /> Produtos
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => downloadCSV(orders as unknown as Record<string, unknown>[], ["id", "customer_name", "customer_email", "total_amount", "status"], "pedidos.csv")}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" /> Pedidos
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => downloadCSV(users as unknown as Record<string, unknown>[], ["id", "email", "created_at"], "clientes.csv")}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" /> Clientes
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => downloadCSV(alerts as unknown as Record<string, unknown>[], ["id", "user_id", "product_id", "target_price"], "alertas.csv")}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" /> Alertas
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ==================== SUPPORT ==================== */}
          {activeTab === "support" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Suporte ao Cliente</h3>

              {/* Unanswered */}
              <Card className="border-yellow-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-700">
                    <AlertTriangle className="h-5 w-5" />
                    Perguntas Sem Resposta ({unansweredQuestions.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {unansweredQuestions.map(q => (
                      <div key={q.id} className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950/20/50">
                        <p className="font-medium text-sm mb-2">{q.question}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{q.created_at ? formatDateTime(q.created_at) : "Recente"}</p>
                        <Textarea
                          value={answerForm[q.id] || ""}
                          onChange={e => setAnswerForm(prev => ({ ...prev, [q.id]: e.target.value }))}
                          placeholder="Escreva a resposta..."
                          className="mb-2 text-sm"
                        />
                        <Button size="sm" onClick={() => handleAnswerQuestion(q.id)} disabled={!answerForm[q.id]?.trim()}>
                          <MessageSquare className="h-4 w-4 mr-1" /> Responder
                        </Button>
                      </div>
                    ))}
                    {unansweredQuestions.length === 0 && (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">Todas as perguntas foram respondidas</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* All questions */}
              <Card>
                <CardHeader><CardTitle className="text-base">Todas as Perguntas ({questions.length})</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {questions.slice(0, 20).map(q => (
                      <div key={q.id} className={`p-4 rounded-lg border ${q.answer ? "bg-green-50 dark:bg-green-950/20/50 border-green-200" : "bg-gray-50 dark:bg-gray-950"}`}>
                        <div className="flex items-start justify-between">
                          <p className="font-medium text-sm flex-1">{q.question}</p>
                          {q.answer ? (
                            <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 flex-shrink-0 ml-2">Respondida</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 flex-shrink-0 ml-2">Pendente</Badge>
                          )}
                        </div>
                        {q.answer && <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 pl-4 border-l-2 border-green-300">{q.answer}</p>}
                      </div>
                    ))}
                    {questions.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">Nenhuma pergunta recebida</p>}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ==================== ACTIVITY LOG ==================== */}
          {activeTab === "activity" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Log de Atividade</h3>
                {activityLog.length > 0 && (
                  <Button variant="outline" size="sm" onClick={async () => { if (confirm("Limpar todo o log?")) { setActivityLog([]); await supabase.from("activity_log").delete(); } }}>
                    <Trash2 className="h-4 w-4 mr-1" /> Limpar
                  </Button>
                )}
              </div>
              <Card>
                <CardContent className="pt-6">
                  {activityLog.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8 text-sm">Nenhuma atividade registada ainda</p>
                  ) : (
                    <div className="space-y-2">
                      {activityLog.slice(0, 50).map(log => (
                        <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg border bg-white dark:bg-gray-900">
                          <div className="w-2 h-2 rounded-full bg-[#FF3131] flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              <span className="text-[#FF3131]">{log.action}</span> — {log.details}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{log.entity} • {log.user_email}</p>
                          </div>
                          <span className="text-xs text-gray-400 flex-shrink-0">{formatDateTime(log.created_at)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* ==================== SETTINGS ==================== */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Configurações do Sistema</h3>

              {/* General */}
              <Card>
                <CardHeader><CardTitle className="text-base">Informações Gerais</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><Label>Nome do Site</Label><Input value={editingSettings.siteName} onChange={e => setEditingSettings({ ...editingSettings, siteName: e.target.value })} /></div>
                    <div><Label>WhatsApp</Label><Input value={editingSettings.whatsappNumber} onChange={e => setEditingSettings({ ...editingSettings, whatsappNumber: e.target.value })} /></div>
                    <div><Label>Email</Label><Input value={editingSettings.email} onChange={e => setEditingSettings({ ...editingSettings, email: e.target.value })} /></div>
                    <div><Label>Endereço</Label><Input value={editingSettings.address} onChange={e => setEditingSettings({ ...editingSettings, address: e.target.value })} /></div>
                  </div>
                </CardContent>
              </Card>

              {/* Commerce */}
              <Card>
                <CardHeader><CardTitle className="text-base">Comércio</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div><Label>Moeda</Label><Input value={editingSettings.currency} onChange={e => setEditingSettings({ ...editingSettings, currency: e.target.value })} /></div>
                    <div><Label>Taxa de IVA (%)</Label><Input type="number" value={editingSettings.taxRate} onChange={e => setEditingSettings({ ...editingSettings, taxRate: Number(e.target.value) })} /></div>
                    <div><Label>Frete Grátis acima de (MZN)</Label><Input type="number" value={editingSettings.freeShippingThreshold} onChange={e => setEditingSettings({ ...editingSettings, freeShippingThreshold: Number(e.target.value) })} /></div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader><CardTitle className="text-base">Métodos de Pagamento</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center"><Phone className="h-4 w-4 text-green-600" /></div>
                        <div><p className="font-medium text-sm">M-Pesa</p><p className="text-xs text-gray-500 dark:text-gray-400">Vodacom</p></div>
                      </div>
                      <Switch checked={editingSettings.mpesaEnabled} onCheckedChange={v => setEditingSettings({ ...editingSettings, mpesaEnabled: v })} />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center"><Phone className="h-4 w-4 text-orange-600" /></div>
                        <div><p className="font-medium text-sm">E-Mola</p><p className="text-xs text-gray-500 dark:text-gray-400">Movitel</p></div>
                      </div>
                      <Switch checked={editingSettings.emolaEnabled} onCheckedChange={v => setEditingSettings({ ...editingSettings, emolaEnabled: v })} />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"><DollarSign className="h-4 w-4 text-blue-600" /></div>
                        <div><p className="font-medium text-sm">Dinheiro / Transferência</p><p className="text-xs text-gray-500 dark:text-gray-400">Pagamento na entrega</p></div>
                      </div>
                      <Switch checked={editingSettings.cashEnabled} onCheckedChange={v => setEditingSettings({ ...editingSettings, cashEnabled: v })} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button onClick={handleSaveSettings} className="gap-2"><Save className="h-4 w-4" /> Guardar Configurações</Button>
            </div>
          )}
        </main>
      </div>

      {/* ==================== PRODUCT MODAL ==================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-[60] p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-white dark:bg-gray-900 border-b dark:border-gray-800 z-10">
              <CardTitle>{editingProduct ? "Editar Produto" : "Novo Produto"}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsProductModalOpen(false)}><X className="h-4 w-4" /></Button>
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

      {/* ==================== DELETE DIALOG ==================== */}
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
};

export default AdminPanel;
