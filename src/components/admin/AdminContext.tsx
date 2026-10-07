import { createContext, useContext, useEffect, useState, useMemo, useCallback, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { uploadSeasonalBannerImage } from "@/lib/storage";
import {
  fetchAllAdminData,
  deleteRows,
  saveProductRecord,
  updateProductFieldRecord,
  bulkDeleteProducts,
  bulkUpdateProducts,
  updateOrderStatusRecord,
  updatePaymentStatusRecord,
  insertCouponRecord,
  toggleCouponActive,
  removeCoupon,
  insertBannerRecord,
  toggleBannerActive,
  removeBanner,
  answerQuestionRecord,
  saveSiteSettingsRecord,
  insertActivityLogEntry,
} from "@/services/adminDataService";
import {
  computeCategories, computeStats, filterProducts,
  filterOrders, filterUsers, filterUnanswered, paginate
} from "./adminSelectors";
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
  productImageFile: File | null; setProductImageFile: (v: File | null) => void;
  bannerImageFile: File | null; setBannerImageFile: (v: File | null) => void;
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
  const { user } = useAuth();
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
    showAugustBanner: true,
    seasonalBannerUrl: "",
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
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
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

  const categories = useMemo(() => computeCategories(products), [products]);
  const stats: DashboardStats = useMemo(() => computeStats(products, orders, users), [products, orders, users]);
  const filteredProducts = useMemo(() => filterProducts(products, productSearch, productCategory), [products, productSearch, productCategory]);
  const paginatedProducts = useMemo(() => paginate(filteredProducts, productPage, ITEMS_PER_PAGE), [filteredProducts, productPage]);
  const filteredOrders = useMemo(() => filterOrders(orders, orderSearch, orderStatus), [orders, orderSearch, orderStatus]);
  const paginatedOrders = useMemo(() => paginate(filteredOrders, orderPage, ITEMS_PER_PAGE), [filteredOrders, orderPage]);
  const filteredUsers = useMemo(() => filterUsers(users, userSearch), [users, userSearch]);
  const unansweredQuestions = useMemo(() => filterUnanswered(questions), [questions]);

  useEffect(() => { loadData(); }, []);

  const loadData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoadingData(true);
    try {
      const data = await fetchAllAdminData();
      setProducts(data.products);
      setOrders(data.orders);
      setUsers(data.users);
      setQuestions(data.questions);
      setAlerts(data.alerts);
      setCoupons(data.coupons);
      setContentBanners(data.banners);
      setActivityLog(data.activityLog);
      for (const row of data.settingsRows) {
        if (row.key === "site_settings" && row.value) {
          const merged = { ...siteSettings, ...(row.value as Partial<SiteSettings>) };
          setSiteSettings(merged);
          setEditingSettings(merged);
        }
      }
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
    await insertActivityLogEntry({
      action, entity, entity_id: entityId, details, user_email: user?.email || "admin"
    });
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
    setProductImageFile(null);
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async () => {
    if (!productForm.title || productForm.price <= 0) {
      toast({ title: "Preencha o título e preço", variant: "destructive" }); return;
    }
    try {
      const result = await saveProductRecord({
        editingId: editingProduct?.id ?? null,
        form: productForm,
        imageFile: productImageFile,
      });
      const verb = result.created ? "criado" : "atualizado";
      logActivity(result.created ? "create" : "update", "product", result.id, `Produto "${productForm.title}" ${verb}`);
      toast({ title: `✅ Produto ${verb}!` });
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
      await updateProductFieldRecord(productId, field, num);
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, [field]: num } : p));
      logActivity("inline_edit", "product", productId, `${field} alterado para ${num}`);
      toast({ title: `✅ ${field === "stock" ? "Stock" : "Preço"} atualizado!` });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      toast({ title: "Erro ao atualizar", description: message, variant: "destructive" });
    }
    setInlineEdit(null);
  };

  const ALLOWED_TABLES = ["products", "coupons", "content_banners", "price_alerts", "product_questions"];

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    if (!ALLOWED_TABLES.includes(deleteConfirm.type)) {
      toast({ title: "Tipo de item inválido", variant: "destructive" });
      return;
    }
    try {
      await deleteRows(deleteConfirm.type as "products" | "coupons" | "content_banners" | "price_alerts" | "product_questions", deleteConfirm.id);
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
        await bulkDeleteProducts(ids);
        logActivity("bulk_delete", "products", ids.join(","), `${ids.length} produtos eliminados`);
      } else if (bulkAction === "featured") {
        await bulkUpdateProducts(ids, { is_featured: true });
        logActivity("bulk_featured", "products", ids.join(","), `${ids.length} produtos em destaque`);
      } else if (bulkAction === "unfeatured") {
        await bulkUpdateProducts(ids, { is_featured: false });
      } else if (bulkAction === "active") {
        await bulkUpdateProducts(ids, { is_active: true });
      } else if (bulkAction === "inactive") {
        await bulkUpdateProducts(ids, { is_active: false });
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
      await updateOrderStatusRecord(orderId, newStatus);
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
      const newCoupon = await insertCouponRecord({
        code: couponForm.code.toUpperCase(), type: couponForm.type, value: couponForm.value,
        min_order: couponForm.minOrder, max_uses: couponForm.maxUses, used_count: 0,
        expiry_date: couponForm.expiryDate || null, active: true,
      });
      setCoupons(prev => [...prev, newCoupon]);
      logActivity("create", "coupon", newCoupon.id, `Cupão "${couponForm.code.toUpperCase()}" criado`);
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
      await toggleCouponActive(id, !coupon.active);
      setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
    } catch { toast({ title: "Erro ao atualizar cupão", variant: "destructive" }); }
  };

  const deleteCoupon = async (id: string) => {
    try {
      await removeCoupon(id);
      setCoupons(prev => prev.filter(c => c.id !== id));
      logActivity("delete", "coupon", id, "Cupão eliminado");
    } catch { toast({ title: "Erro ao eliminar cupão", variant: "destructive" }); }
  };

  const handleAddBanner = async () => {
    if (!bannerForm.title) { toast({ title: "Preencha o título", variant: "destructive" }); return; }
    try {
      const newBanner = await insertBannerRecord({
        title: bannerForm.title, subtitle: bannerForm.subtitle || null,
        image_url: bannerForm.imageUrl || null, link_url: bannerForm.linkUrl || null,
        active: true, sort_order: contentBanners.length + 1,
      });
      setContentBanners(prev => [...prev, newBanner]);
      logActivity("create", "banner", newBanner.id, `Banner "${bannerForm.title}" criado`);
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
      await toggleBannerActive(id, !banner.active);
      setContentBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
    } catch { toast({ title: "Erro ao atualizar banner", variant: "destructive" }); }
  };

  const deleteBanner = async (id: string) => {
    try {
      await removeBanner(id);
      setContentBanners(prev => prev.filter(b => b.id !== id));
      logActivity("delete", "banner", id, "Banner eliminado");
    } catch { toast({ title: "Erro ao eliminar banner", variant: "destructive" }); }
  };

  const handleAnswerQuestion = async (questionId: string) => {
    const answer = answerForm[questionId];
    if (!answer?.trim()) return;
    try {
      await answerQuestionRecord(questionId, answer);
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
      let settingsToSave = editingSettings;
      if (bannerImageFile) {
        const url = await uploadSeasonalBannerImage(bannerImageFile);
        settingsToSave = { ...editingSettings, seasonalBannerUrl: url };
        setEditingSettings(settingsToSave);
        setBannerImageFile(null);
      }
      setSiteSettings(settingsToSave);
      await saveSiteSettingsRecord("site_settings", settingsToSave, user?.id);
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
    productImageFile, setProductImageFile,
    bannerImageFile, setBannerImageFile,
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