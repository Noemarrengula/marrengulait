import { createContext, useContext, useEffect, useState, useMemo, useCallback, useRef, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/contexts/SettingsContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type {
  Product, Order, User, Question, PriceAlert,
  Coupon, ActivityLog, SiteSettings, ContentBanner, DashboardStats,
  ProductForm, CouponForm, BannerForm
} from "./types";

interface AdminContextType {
  activeTab: string; setActiveTab: (tab: string) => void;
  loadingData: boolean; refreshing: boolean;
  sidebarOpen: boolean; setSidebarOpen: (v: boolean) => void;
  mobileSidebarOpen: boolean; setMobileSidebarOpen: (v: boolean) => void;
  products: Product[]; orders: Order[]; users: User[];
  questions: Question[]; alerts: PriceAlert[];
  coupons: Coupon[]; setCoupons: (v: Coupon[]) => void;
  activityLog: ActivityLog[]; siteSettings: SiteSettings; setSiteSettings: (v: SiteSettings) => void;
  editingSettings: SiteSettings; setEditingSettings: (v: SiteSettings) => void;
  contentBanners: ContentBanner[]; setContentBanners: (v: ContentBanner[]) => void;
  productSearch: string; setProductSearch: (v: string) => void;
  productCategory: string; setProductCategory: (v: string) => void;
  orderSearch: string; setOrderSearch: (v: string) => void;
  orderStatus: string; setOrderStatus: (v: string) => void;
  userSearch: string; setUserSearch: (v: string) => void;
  productPage: number; setProductPage: (v: number) => void;
  orderPage: number; setOrderPage: (v: number) => void;
  ITEMS_PER_PAGE: number;
  editingProduct: Product | null;
  isProductModalOpen: boolean; setIsProductModalOpen: (v: boolean) => void;
  productForm: ProductForm; setProductForm: (v: ProductForm) => void;
  inlineEdit: { productId: string; field: "stock" | "price"; value: string } | null;
  setInlineEdit: (v: { productId: string; field: "stock" | "price"; value: string } | null) => void;
  selectedProducts: Set<string>; setSelectedProducts: (v: Set<string>) => void;
  bulkAction: string; setBulkAction: (v: string) => void;
  couponForm: CouponForm; setCouponForm: (v: CouponForm) => void;
  editingCoupon: Coupon | null; setEditingCoupon: (v: Coupon | null) => void;
  bannerForm: BannerForm; setBannerForm: (v: BannerForm) => void;
  editingBanner: ContentBanner | null; setEditingBanner: (v: ContentBanner | null) => void;
  answerForm: Record<string, string>; setAnswerForm: (v: Record<string, string>) => void;
  deleteConfirm: { type: string; id: string } | null;
  setDeleteConfirm: (v: { type: string; id: string } | null) => void;
  stats: DashboardStats;
  filteredProducts: Product[]; paginatedProducts: Product[];
  filteredOrders: Order[]; paginatedOrders: Order[];
  filteredUsers: User[]; unansweredQuestions: Question[];
  categories: string[];
  totalProductPages: number; totalOrderPages: number;
  loadData: (showRefresh?: boolean) => Promise<void>;
  logActivity: (action: string, entity: string, entityId: string, details: string) => Promise<void>;
  openProductModal: (product?: Product) => void;
  handleProductSubmit: () => Promise<void>;
  handleInlineEditSave: (productId: string, field: "stock" | "price", value: string) => Promise<void>;
  handleDelete: () => Promise<void>;
  handleBulkAction: () => Promise<void>;
  updateOrderStatus: (orderId: string, newStatus: string) => Promise<void>;
  handleAddCoupon: () => Promise<void>;
  toggleCoupon: (id: string) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
  handleAddBanner: () => Promise<void>;
  toggleBanner: (id: string) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  handleAnswerQuestion: (questionId: string) => Promise<void>;
  handleSaveSettings: () => Promise<void>;
  handleNavClick: (tabId: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { isDarkMode, setTheme, theme } = useSettings();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [loadingData, setLoadingData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: "Marrengula-IT", whatsappNumber: "+258840000000",
    email: "info@marrengula.co.mz", address: "Maputo, Moçambique",
    freeShippingThreshold: 5000, currency: "MZN", taxRate: 17,
    mpesaEnabled: true, emolaEnabled: true, cashEnabled: true,
    heroTitle: "TECNOLOGIA DE PONTA",
    heroSubtitle: "Monte seu PC gamer, encontre os melhores smartphones e componentes com entrega rápida em Moçambique",
    showJuneBanner: true,
  });
  const [contentBanners, setContentBanners] = useState<ContentBanner[]>([
    { id: "1", title: "Ofertas Relâmpago", subtitle: "Até 50% OFF", imageUrl: "", linkUrl: "/produtos?promo=true", active: true, order: 1 },
  ]);

  const [productSearch, setProductSearch] = useState("");
  const [productCategory, setProductCategory] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState("all");
  const [userSearch, setUserSearch] = useState("");
  const [productPage, setProductPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    title: "", price: 0, compare_at_price: 0, stock: 0,
    category: "", brand: "", image_url: "", description: "",
    is_featured: false, is_on_sale: false, is_active: true
  });
  const [inlineEdit, setInlineEdit] = useState<{ productId: string; field: "stock" | "price"; value: string } | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState("");
  const [couponForm, setCouponForm] = useState({
    code: "", type: "percent" as "percent" | "fixed", value: 0,
    minOrder: 0, maxUses: 100, expiryDate: ""
  });
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [editingSettings, setEditingSettings] = useState<SiteSettings>({ ...siteSettings });
  const [bannerForm, setBannerForm] = useState({ title: "", subtitle: "", imageUrl: "", linkUrl: "" });
  const [editingBanner, setEditingBanner] = useState<ContentBanner | null>(null);
  const [answerForm, setAnswerForm] = useState<Record<string, string>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string } | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return Array.from(cats) as string[];
  }, [products]);

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
      totalProducts: products.length, totalOrders: orders.length,
      totalUsers: users.length, totalRevenue, lowStockProducts,
      pendingOrders, recentOrders: orders.slice(0, 5),
      topProducts: [...products].sort((a, b) => (b.sale_count || 0) - (a.sale_count || 0)).slice(0, 5),
      salesByDay
    };
  }, [products, orders, users]);

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

  useEffect(() => { loadData(); }, []);

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
        setUsers(profilesRes.data.map((p: Record<string, unknown>) => ({
          id: p.id as string, email: (p.email as string) || (p.full_name as string) || "User",
          full_name: p.full_name as string, phone: p.phone as string,
          created_at: p.created_at as string, last_login_at: p.last_login_at as string
        })));
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

  const logActivity = useCallback(async (action: string, entity: string, entityId: string, details: string) => {
    const entry: ActivityLog = {
      id: Date.now().toString(), action, entity, entity_id: entityId,
      details, user_email: user?.email || "admin", created_at: new Date().toISOString()
    };
    setActivityLog(prev => [entry, ...prev].slice(0, 500));
    try {
      await supabase.from("activity_log").insert({
        action, entity, entity_id: entityId, details, user_email: user?.email || "admin"
      });
    } catch (e) { console.error("[Admin] Failed to log activity:", e); }
  }, [user]);

  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        title: product.title || product.name || "", price: product.price,
        compare_at_price: product.compare_at_price || product.old_price || 0,
        stock: product.stock, category: product.category || "", brand: product.brand || "",
        image_url: product.image_url || "", description: product.description || "",
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
      toast({ title: "Preencha o título e preço", variant: "destructive" }); return;
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
      toast({ title: "✅ Item eliminado!" });
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
      toast({ title: "✅ Acção em massa aplicada!" });
      setSelectedProducts(new Set()); setBulkAction(""); loadData(true);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      toast({ title: "Erro", description: message, variant: "destructive" });
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from("orders").update({ status: newStatus, updated_at: new Date().toISOString() }).eq("id", orderId);
      if (error) throw error;
      logActivity("update", "order", orderId, `Status alterado para ${newStatus}`);
      toast({ title: "✅ Status atualizado!" }); loadData(true);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      toast({ title: "Erro ao atualizar", description: message, variant: "destructive" });
    }
  };

  const handleAddCoupon = async () => {
    if (!couponForm.code || couponForm.value <= 0) {
      toast({ title: "Preencha código e valor", variant: "destructive" }); return;
    }
    try {
      const couponData = {
        code: couponForm.code.toUpperCase(), type: couponForm.type, value: couponForm.value,
        min_order: couponForm.minOrder, max_uses: couponForm.maxUses, used_count: 0,
        expiry_date: couponForm.expiryDate || null, active: true,
      };
      const { data, error } = await supabase.from("coupons").insert([couponData]).select().single();
      if (error) throw error;
      const newCoupon: Coupon = {
        id: data.id, code: data.code, type: data.type,
        value: Number(data.value), min_order: Number(data.min_order) || 0,
        max_uses: Number(data.max_uses) || 100, used_count: 0,
        expiry_date: data.expiry_date, active: data.active, created_at: data.created_at
      };
      setCoupons(prev => [...prev, newCoupon]);
      logActivity("create", "coupon", data.id, `Cupão "${couponForm.code.toUpperCase()}" criado`);
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
    } catch { toast({ title: "Erro ao atualizar cupão", variant: "destructive" }); }
  };

  const deleteCoupon = async (id: string) => {
    try {
      await supabase.from("coupons").delete().eq("id", id);
      setCoupons(prev => prev.filter(c => c.id !== id));
      logActivity("delete", "coupon", id, "Cupão eliminado");
    } catch { toast({ title: "Erro ao eliminar cupão", variant: "destructive" }); }
  };

  const handleAddBanner = async () => {
    if (!bannerForm.title) { toast({ title: "Preencha o título", variant: "destructive" }); return; }
    try {
      const bannerData = {
        title: bannerForm.title, subtitle: bannerForm.subtitle || null,
        image_url: bannerForm.imageUrl || null, link_url: bannerForm.linkUrl || null,
        active: true, sort_order: contentBanners.length + 1,
      };
      const { data, error } = await supabase.from("content_banners").insert([bannerData]).select().single();
      if (error) throw error;
      const newBanner: ContentBanner = {
        id: data.id, title: data.title, subtitle: data.subtitle || "",
        imageUrl: data.image_url || "", linkUrl: data.link_url || "",
        active: data.active, order: data.sort_order
      };
      setContentBanners(prev => [...prev, newBanner]);
      logActivity("create", "banner", data.id, `Banner "${bannerForm.title}" criado`);
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
    } catch { toast({ title: "Erro ao atualizar banner", variant: "destructive" }); }
  };

  const deleteBanner = async (id: string) => {
    try {
      await supabase.from("content_banners").delete().eq("id", id);
      setContentBanners(prev => prev.filter(b => b.id !== id));
      logActivity("delete", "banner", id, "Banner eliminado");
    } catch { toast({ title: "Erro ao eliminar banner", variant: "destructive" }); }
  };

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

  const handleSaveSettings = async () => {
    try {
      setSiteSettings(editingSettings);
      await supabase.from("admin_settings").upsert({
        key: "site_settings", value: editingSettings, updated_by: user?.id
      });
      logActivity("update", "settings", "global", "Configurações atualizadas");
      toast({ title: "✅ Configurações guardadas!" });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      toast({ title: "Erro ao guardar", description: message, variant: "destructive" });
    }
  };

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId); setMobileSidebarOpen(false);
    setProductPage(1); setOrderPage(1);
  };

  const totalProductPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const totalOrderPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  const value: AdminContextType = {
    activeTab, setActiveTab, loadingData, refreshing,
    sidebarOpen, setSidebarOpen, mobileSidebarOpen, setMobileSidebarOpen,
    products, orders, users, questions, alerts,
    coupons, setCoupons, activityLog, siteSettings, setSiteSettings,
    editingSettings, setEditingSettings,
    contentBanners, setContentBanners,
    productSearch, setProductSearch, productCategory, setProductCategory,
    orderSearch, setOrderSearch, orderStatus, setOrderStatus,
    userSearch, setUserSearch, productPage, setProductPage, orderPage, setOrderPage,
    ITEMS_PER_PAGE, editingProduct, isProductModalOpen, setIsProductModalOpen,
    productForm, setProductForm, inlineEdit, setInlineEdit,
    selectedProducts, setSelectedProducts, bulkAction, setBulkAction,
    couponForm, setCouponForm, editingCoupon, setEditingCoupon,
    bannerForm, setBannerForm, editingBanner, setEditingBanner,
    answerForm, setAnswerForm, deleteConfirm, setDeleteConfirm,
    stats, filteredProducts, paginatedProducts,
    filteredOrders, paginatedOrders, filteredUsers, unansweredQuestions,
    categories, totalProductPages, totalOrderPages,
    loadData, logActivity, openProductModal, handleProductSubmit,
    handleInlineEditSave, handleDelete, handleBulkAction, updateOrderStatus,
    handleAddCoupon, toggleCoupon, deleteCoupon,
    handleAddBanner, toggleBanner, deleteBanner,
    handleAnswerQuestion, handleSaveSettings, handleNavClick,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
