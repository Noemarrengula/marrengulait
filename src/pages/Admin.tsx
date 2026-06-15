import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2, Plus, Trash2, Edit2, AlertCircle, Check, FileText, Download, RefreshCw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/contexts/SettingsContext";
import { useToast } from "@/hooks/use-toast";
import {
  exportProductsPDF,
  exportOrdersPDF,
  exportUsersPDF,
  exportSalesSummaryPDF,
  exportAlertsPDF,
} from "@/utils/exportPDF";

interface Product {
  id: string;
  name?: string;
  title?: string;
  price: number;
  old_price?: number;
  stock: number;
  category: string;
  brand?: string;
  store_name?: string;
  images?: string[];
  image_url?: string;
  description?: string;
  short_description?: string;
  featured?: boolean;
  on_sale?: boolean;
  is_active?: boolean;
  vendor_id?: string;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface User {
  id: string;
  email: string;
  created_at: string;
}

// additional resource types for admin panel
interface Question {
  id: string;
  question: string;
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

interface Affiliate {
  id: string;
  email: string;
  balance?: number;
  created_at?: string;
}

interface LoyaltyPoint {
  id: string;
  user_id: string;
  points: number;
  created_at?: string;
}

interface BadgeItem {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAdmin, loading, roles, forceSync } = useAuth();
  const { toast } = useToast();
  const { locale } = useSettings();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // extra resources
  const [questions, setQuestions] = useState<Question[]>([]);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loyalty, setLoyalty] = useState<LoyaltyPoint[]>([]);
  const [badges, setBadges] = useState<BadgeItem[]>([]);

  // filter/search terms for each tab
  const [productFilter, setProductFilter] = useState<string>("");
  const [orderFilter, setOrderFilter] = useState<string>("");
  const [userFilter, setUserFilter] = useState<string>("");
  const [questionFilter, setQuestionFilter] = useState<string>("");
  const [alertFilter, setAlertFilter] = useState<string>("");
  const [affiliateFilter, setAffiliateFilter] = useState<string>("");
  const [badgeFilter, setBadgeFilter] = useState<string>("");

  // confirmation dialog state
  const [confirmDelete, setConfirmDelete] = useState<
    | { type: 'product'; id: string }
    | { type: 'question'; id: string }
    | null
  >(null);


  const [loadingData, setLoadingData] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  
  const [newProduct, setNewProduct] = useState({
    title: "",
    price: 0,
    old_price: 0,
    stock: 0,
    category: "",
    brand: "",
    store_name: "MarrengulaIT",
    image_url: "",
    description: "",
    featured: false,
    on_sale: false,
    is_active: true,
  });

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      navigate('/auth');
      return;
    }
    
    const hasAdminRole = roles?.includes('admin');
    
    if (!hasAdminRole) {
      navigate('/auth');
      return;
    }
    
    if (!dataLoaded) {
      loadAllData();
    }
  }, [loading, isAdmin, roles, user, navigate, dataLoaded]);

  const loadAllData = async () => {
    setLoadingData(true);
    try {
      const { data: productsData, error: pError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (pError) throw pError;
      
      setProducts(productsData || []);
      setProductFilter("");

      // Carregar pedidos
      const { data: ordersData, error: oError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (oError) throw oError;
      setOrders(ordersData || []);

      // Carregar utilizadores via profiles
      const { data: userData, error: uError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (uError) throw uError;

      // Parse users - mapear profiles para formato de usuário
      const usersData:any[] = (userData || []).map(u => ({
        id: u.id,
        email: u.full_name || 'Utilizador',
        created_at: u.created_at,
      }));
      
      setUsers(usersData);

      // carregar recursos adicionais
      const [qRes, aRes, fRes, lRes] = await Promise.all([
        supabase.from('product_questions').select('*'),
        supabase.from('price_alerts').select('*'),
        supabase.from('affiliates').select('*'),
        supabase.from('loyalty_points').select('*'),
      ]);

      if (qRes.error) throw qRes.error;
      if (aRes.error) throw aRes.error;
      if (fRes.error) throw fRes.error;
      if (lRes.error) throw lRes.error;

      setQuestions(qRes.data || []);
      setAlerts(aRes.data || []);
      setAffiliates(fRes.data || []);
      setLoyalty(lRes.data || []);
      setBadges([]);

      const now = new Date().toLocaleString();
      setLastUpdated(now);
      setDataLoaded(true);
    } catch (error: unknown) {
      console.error('Erro:', error);
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({ title: '❌ Erro ao carregar', description: message, variant: 'destructive' });
    } finally {
      setLoadingData(false);
    }
  };

  const addProduct = async () => {
    if (!newProduct.title || newProduct.price <= 0) {
      toast({ title: 'Preencha o nome e preço do produto', variant: 'destructive' });
      return;
    }
    
    if (!newProduct.category) {
      toast({ title: 'Selecione uma categoria', variant: 'destructive' });
      return;
    }

    try {
      const { error } = await supabase.from('products').insert([
        {
          name: newProduct.title,
          slug: newProduct.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          price: newProduct.price,
          old_price: newProduct.old_price || null,
          stock: newProduct.stock,
          category: newProduct.category,
          brand: newProduct.brand || null,
          store_name: newProduct.store_name,
          images: newProduct.image_url ? [newProduct.image_url] : [],
          description: newProduct.description || null,
          short_description: newProduct.description?.substring(0, 200) || null,
          featured: newProduct.featured,
          on_sale: newProduct.on_sale,
          is_active: newProduct.is_active,
        },
      ]);

      if (error) throw error;
      
      toast({ title: '✅ Produto adicionado com sucesso!' });
      setNewProduct({ 
        title: '', 
        price: 0, 
        old_price: 0,
        stock: 0, 
        category: '', 
        brand: '',
        store_name: 'MarrengulaIT',
        image_url: '',
        description: '',
        featured: false,
        on_sale: false,
        is_active: true,
      });
      
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.invalidateQueries({ queryKey: ['product'] });
      await loadAllData();
      
      setTimeout(() => window.location.href = '/', 1500);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({ title: 'Erro', description: message, variant: 'destructive' });
    }
  };

  const updateProduct = async () => {
    if (!editingProduct) return;

    if (!editingProduct.name && !editingProduct.title) {
      toast({ title: '❌ Erro', description: 'Nome do produto é obrigatório', variant: 'destructive' });
      return;
    }

    if (editingProduct.price <= 0) {
      toast({ title: '❌ Erro', description: 'Preço deve ser maior que 0', variant: 'destructive' });
      return;
    }

    const newImages = editingProduct.images?.length ? editingProduct.images : (editingProduct.image_url ? [editingProduct.image_url] : []);

    try {
      const { error, status } = await supabase
        .from('products')
        .update({
          name: editingProduct.name || editingProduct.title,
          slug: (editingProduct.name || editingProduct.title || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          price: editingProduct.price,
          old_price: editingProduct.old_price || null,
          stock: editingProduct.stock,
          category: editingProduct.category,
          brand: editingProduct.brand || null,
          store_name: editingProduct.store_name,
          images: newImages,
          description: editingProduct.description || null,
          short_description: editingProduct.description?.substring(0, 200) || null,
          featured: editingProduct.featured || false,
          on_sale: editingProduct.on_sale || false,
          is_active: editingProduct.is_active !== false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingProduct.id);

      if (error) {
        toast({ title: '❌ Erro', description: error.message, variant: 'destructive' });
        return;
      }
      
      toast({ 
        title: '✅ Produto atualizado!', 
        description: 'A aparecer no site em segundos...' 
      });
      setEditingProduct(null);
      
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.invalidateQueries({ queryKey: ['product'] });
      await loadAllData();
      
      setTimeout(() => window.location.href = '/', 1500);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({ title: '❌ Erro ao atualizar', description: message, variant: 'destructive' });
    }
  };

  const deleteProduct = (id: string) => {
    setConfirmDelete({ type: 'product', id });
  };

  const performDelete = async () => {
    if (!confirmDelete) return;
    try {
      if (confirmDelete.type === 'product') {
        const { error } = await supabase.from('products').delete().eq('id', confirmDelete.id);
        if (error) throw error;
        toast({ title: '✅ Produto eliminado!' });
        await queryClient.invalidateQueries({ queryKey: ['products'] });
      } else if (confirmDelete.type === 'question') {
        const { error } = await supabase.from('product_questions').delete().eq('id', confirmDelete.id);
        if (error) throw error;
        toast({ title: '✅ Pergunta eliminada!' });
      }
      await loadAllData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      toast({ title: 'Erro', description: message, variant: 'destructive' });
    } finally {
      setConfirmDelete(null);
    }
  };

  // -- csv export helper -------------------------------------------------
  const downloadCSV = (rows: any[], columns: string[], filename: string) => {
    if (rows.length === 0) return;
    const headerLine = columns.join(",");
    const body = rows
      .map(r =>
        columns
          .map(c => {
            const v = r[c as keyof typeof r];
            if (v === null || v === undefined) return "";
            // escape quotes
            return String(v).replace(/"/g, '""');
          })
          .map(v => `"${v}"`)
          .join(",")
      )
      .join("\n");
    const csv = headerLine + "\n" + body;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // initial block loader: only when auth is pending
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-700 flex gap-2">
                <AlertCircle className="h-5 w-5" />
                ❌ Acesso Negado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Você não tem permissão para acessar este painel.</p>
              <Button onClick={() => navigate('/')} className="mt-4">Voltar</Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-4 space-y-6 mb-20">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Painel de Administração</h1>
            <p className="text-muted-foreground">Bem-vindo, {user?.email}</p>
            {lastUpdated && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <span>Última atualização: {lastUpdated}</span>
                {loadingData && <Loader2 className="h-3 w-3 animate-spin" />}
              </p>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={async () => {
              await queryClient.invalidateQueries({ queryKey: ['products'] });
              await loadAllData();
            }}
            disabled={loadingData}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loadingData ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {[
            {label:'Produtos', value: products.length},
            {label:'Pedidos', value: orders.length},
            {label:'Utilizadores', value: users.length},
            {label:'Vendas Totais', value: orders.reduce((sum, o) => sum + (o.total_amount || 0), 0).toFixed(0)},
            {label:'Perguntas', value: questions.length},
            {label:'Alertas de Preço', value: alerts.length},
            {label:'Badges', value: badges.length},
          ].map((stat, idx) => (
            <Card key={idx}>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                {loadingData ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <p className="text-2xl font-bold">
                    {stat.label === 'Vendas Totais' ? `MT ${stat.value}` : stat.value}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="produtos" className="w-full">
          <div className="relative">
            <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
              <TabsList className="inline-flex min-w-full whitespace-nowrap bg-muted/50">
                <TabsTrigger value="produtos" className="data-[state=active]:bg-[#FF3131] data-[state=active]:text-white">Produtos</TabsTrigger>
                <TabsTrigger value="pedidos" className="data-[state=active]:bg-[#FF3131] data-[state=active]:text-white">Pedidos</TabsTrigger>
                <TabsTrigger value="usuarios" className="data-[state=active]:bg-[#FF3131] data-[state=active]:text-white">Utilizadores</TabsTrigger>
                <TabsTrigger value="perguntas" className="data-[state=active]:bg-[#FF3131] data-[state=active]:text-white">Perguntas</TabsTrigger>
                <TabsTrigger value="alertas" className="data-[state=active]:bg-[#FF3131] data-[state=active]:text-white">Alertas</TabsTrigger>
                <TabsTrigger value="afiliados" className="data-[state=active]:bg-[#FF3131] data-[state=active]:text-white">Afiliações</TabsTrigger>
                <TabsTrigger value="fidelidade" className="data-[state=active]:bg-[#FF3131] data-[state=active]:text-white">Fidelidade</TabsTrigger>
                <TabsTrigger value="badges" className="data-[state=active]:bg-[#FF3131] data-[state=active]:text-white">Badges</TabsTrigger>
                <TabsTrigger value="ferramentas" className="data-[state=active]:bg-[#FF3131] data-[state=active]:text-white">Ferramentas</TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* PRODUTOS */}
          <TabsContent value="produtos" className="space-y-4">
            {/* Formulário de Adicionar/Editar Produto */}
            <Card className="border-2 border-[#FF3131]">
              <CardHeader className="justify-between flex-row items-center gap-2">
                <CardTitle>{editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}</CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => exportProductsPDF(productFilter?
                      products.filter(p=>(p.name||p.title||'').toLowerCase().includes(productFilter.toLowerCase()))
                      : products)}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => downloadCSV(productFilter?
                      products.filter(p=>p.title?.toLowerCase().includes(productFilter.toLowerCase()))
                      : products,
                    ["id","name","price","stock","category","store_name"],
                    "produtos.csv")}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Nome do Produto *</Label>
                      <Input
                        value={editingProduct ? (editingProduct.name || editingProduct.title || '') : newProduct.title}
                        onChange={(e) => editingProduct 
                          ? setEditingProduct({ ...editingProduct, name: e.target.value })
                          : setNewProduct({ ...newProduct, title: e.target.value })
                        }
                        placeholder="Nome do produto"
                      />
                    </div>
                    <div>
                      <Label>Marca</Label>
                      <Input
                        value={editingProduct ? (editingProduct.brand || '') : newProduct.brand}
                        onChange={(e) => editingProduct 
                          ? setEditingProduct({ ...editingProduct, brand: e.target.value })
                          : setNewProduct({ ...newProduct, brand: e.target.value })
                        }
                        placeholder="Ex: Hikvision"
                      />
                    </div>
                    <div>
                      <Label>Preço (MT) *</Label>
                      <Input
                        type="number"
                        value={editingProduct ? editingProduct.price : newProduct.price}
                        onChange={(e) => editingProduct 
                          ? setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })
                          : setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })
                        }
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label>Preço Antigo (MT)</Label>
                      <Input
                        type="number"
                        value={editingProduct ? (editingProduct.old_price || '') : newProduct.old_price}
                        onChange={(e) => editingProduct 
                          ? setEditingProduct({ ...editingProduct, old_price: parseFloat(e.target.value) || 0 })
                          : setNewProduct({ ...newProduct, old_price: parseFloat(e.target.value) })
                        }
                        placeholder="Deixe vazio se não tem"
                      />
                    </div>
                    <div>
                      <Label>Stock *</Label>
                      <Input
                        type="number"
                        value={editingProduct ? editingProduct.stock : newProduct.stock}
                        onChange={(e) => editingProduct 
                          ? setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })
                          : setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })
                        }
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label>Categoria</Label>
                      <select
                        value={editingProduct ? editingProduct.category : newProduct.category}
                        onChange={(e) => editingProduct 
                          ? setEditingProduct({ ...editingProduct, category: e.target.value })
                          : setNewProduct({ ...newProduct, category: e.target.value })
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">Selecionar categoria...</option>
                        <optgroup label="Computadores">
                          <option value="Laptops">Laptops</option>
                          <option value="Desktops">Desktops</option>
                          <option value="Workstations">Workstations</option>
                          <option value="All-in-One">All-in-One</option>
                          <option value="Mini PCs">Mini PCs</option>
                        </optgroup>
                        <optgroup label="Hardware">
                          <option value="GPUs">GPUs / Placas Gráficas</option>
                          <option value="CPUs">CPUs / Processadores</option>
                          <option value="RAM">RAM / Memórias</option>
                          <option value="Armazenamento">SSDs / HDDs</option>
                          <option value="Motherboards">Motherboards</option>
                          <option value="Fontes">Fontes de Alimentação</option>
                          <option value="Caixas">Caixas / Chassis</option>
                        </optgroup>
                        <optgroup label="Redes">
                          <option value="Routers">Routers</option>
                          <option value="Switches">Switches</option>
                          <option value="Access Points">Access Points</option>
                          <option value="Cabos">Cabos de Rede</option>
                          <option value="Adaptadores">Adaptadores WiFi</option>
                        </optgroup>
                        <optgroup label="CCTV">
                          <option value="Câmaras">Câmaras de Segurança</option>
                          <option value="Gravadores">Gravadores NVR/DVR</option>
                          <option value="Kits CCTV">Kits CCTV</option>
                          <option value="Discos CCTV">Discos para CCTV</option>
                          <option value="Cabos CCTV">Cabos e Conectores</option>
                        </optgroup>
                        <optgroup label="Smartphones">
                          <option value="Smartphones">Smartphones</option>
                          <option value="Tablets">Tablets</option>
                          <option value="Acessórios Mobile">Acessórios Mobile</option>
                        </optgroup>
                        <optgroup label="Periféricos">
                          <option value="Monitores">Monitores</option>
                          <option value="Teclados">Teclados</option>
                          <option value="Ratos">Ratos</option>
                          <option value="Headsets">Headsets / Auscultadores</option>
                          <option value="Webcams">Webcams</option>
                          <option value="Impressoras">Impressoras</option>
                        </optgroup>
                        <optgroup label="Eletrónica">
                          <option value="Componentes">Componentes Eletrónicos</option>
                          <option value="Arduino">Arduino</option>
                          <option value="Raspberry Pi">Raspberry Pi</option>
                          <option value="IoT">IoT / Smart Home</option>
                        </optgroup>
                        <optgroup label="Serviços">
                          <option value="Consultoria TI">Consultoria TI</option>
                          <option value="Instalação de Rede">Instalação de Rede</option>
                          <option value="Manutenção">Manutenção de Computadores</option>
                          <option value="Backup">Soluções de Backup</option>
                        </optgroup>
                        <optgroup label="Walkie Talkie / Rádios">
                          <option value="Rádios PMR">Rádios PMR446</option>
                          <option value="Rádios UHF">Rádios UHF</option>
                          <option value="Rádios VHF">Rádios VHF</option>
                          <option value="Rádios Táticos">Rádios Táticos/Militares</option>
                          <option value="Rádios Marítimos">Rádios Marítimos (VHF)</option>
                          <option value="Acessórios Rádio">Acessórios (Antenas, Baterias, Microfones)</option>
                          <option value="Configuração Rádio">Serviço de Configuração de Rádios</option>
                          <option value="Programação Rádio">Programação e Repetidores</option>
                        </optgroup>
                        <optgroup label="Inteligência Artificial / Automação">
                          <option value="N8N">N8N - Automação de Workflows</option>
                          <option value="Chatbot IA">Chatbots e Assistentes Virtuais</option>
                          <option value="Automação N8N">Configuração N8N</option>
                          <option value="Integração IA">Integração com APIs de IA</option>
                          <option value="RPA">Automação de Processos (RPA)</option>
                          <option value="Gestão IA">Gestão e Monitorização de IA</option>
                        </optgroup>
                        <optgroup label="Outros">
                          <option value="Software">Software</option>
                          <option value="Licenças">Licenças</option>
                          <option value="Cabos">Cabos e Adaptadores</option>
                          <option value="UPS">UPS / Energia</option>
                          <option value="Outros">Outros</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label>URL da Imagem Principal</Label>
                    <Input
                      value={editingProduct ? (editingProduct.images?.[0] || '') : newProduct.image_url}
                      onChange={(e) => editingProduct 
                        ? setEditingProduct({ ...editingProduct, images: [e.target.value] })
                        : setNewProduct({ ...newProduct, image_url: e.target.value })
                      }
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                    {(editingProduct ? editingProduct.images?.[0] : newProduct.image_url) && (
                      <div className="mt-2">
                        <img 
                          src={(editingProduct ? editingProduct.images?.[0] : newProduct.image_url) || ''} 
                          alt="Preview" 
                          className="h-32 rounded-lg object-cover border-2 border-[#FF3131]" 
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                        <p className="text-xs text-muted-foreground mt-1">Pré-visualização da imagem</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Descrição do Produto</Label>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={editingProduct ? (editingProduct.description || '') : newProduct.description}
                      onChange={(e) => editingProduct 
                        ? setEditingProduct({ ...editingProduct, description: e.target.value })
                        : setNewProduct({ ...newProduct, description: e.target.value })
                      }
                      placeholder="Descrição detalhada do produto..."
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={editingProduct ? (editingProduct.featured || false) : newProduct.featured}
                        onChange={(e) => editingProduct 
                          ? setEditingProduct({ ...editingProduct, featured: e.target.checked })
                          : setNewProduct({ ...newProduct, featured: e.target.checked })
                        }
                        className="w-4 h-4"
                      />
                      <Label htmlFor="featured">Destaque</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="on_sale"
                        checked={editingProduct ? (editingProduct.on_sale || false) : newProduct.on_sale}
                        onChange={(e) => editingProduct 
                          ? setEditingProduct({ ...editingProduct, on_sale: e.target.checked })
                          : setNewProduct({ ...newProduct, on_sale: e.target.checked })
                        }
                        className="w-4 h-4"
                      />
                      <Label htmlFor="on_sale">Em Promoção</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={editingProduct ? (editingProduct.is_active !== false) : newProduct.is_active}
                        onChange={(e) => editingProduct 
                          ? setEditingProduct({ ...editingProduct, is_active: e.target.checked })
                          : setNewProduct({ ...newProduct, is_active: e.target.checked })
                        }
                        className="w-4 h-4"
                      />
                      <Label htmlFor="is_active">Ativo</Label>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {editingProduct ? (
                      <>
                        <Button onClick={updateProduct} className="flex-1 bg-[#FF3131] hover:bg-[#FF5555]">
                          <Check className="h-4 w-4 mr-2" />
                          Guardar Alterações
                        </Button>
                        <Button onClick={() => setEditingProduct(null)} variant="outline" className="flex-1">
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <Button onClick={addProduct} className="w-full bg-[#FF3131] hover:bg-[#FF5555]">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Produto
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Produtos ({products.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingData && <Skeleton className="h-6 mb-4" />}
                <Input
                  placeholder="Filtrar produtos..."
                  value={productFilter}
                  onChange={(e) => setProductFilter(e.target.value)}
                  className="mb-4"
                />
                <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                  <table className="w-full text-sm min-w-[640px]">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left py-2 px-2">Imagem</th>
                        <th className="text-left py-2">Produto</th>
                        <th className="text-left py-2 hidden sm:table-cell">Marca</th>
                        <th className="text-left py-2">Preço</th>
                        <th className="text-left py-2 hidden md:table-cell">Stock</th>
                        <th className="text-left py-2 hidden lg:table-cell">Status</th>
                        <th className="text-left py-2">Ações</th>
                      </tr>
                    </thead>
                  <tbody>
                    {products
                      .filter(p => (p.name || p.title || '').toLowerCase().includes(productFilter.toLowerCase()))
                      .map((product) => (
                      <tr key={product.id} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-2">
                          {product.images?.[0] ? (
                            <img 
                              src={product.images[0]} 
                              alt="" 
                              className="w-12 h-12 object-cover rounded" 
                            />
                          ) : (
                            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-xs">Sem foto</div>
                          )}
                        </td>
                        <td className="py-3">
                          <span className="font-medium">{(product.name || product.title || '').substring(0, 30)}</span>
                          <div className="flex gap-1 mt-1">
                            {product.featured && <Badge variant="outline" className="text-xs">Destaque</Badge>}
                            {product.on_sale && <Badge variant="outline" className="text-xs text-red-500">Promo</Badge>}
                          </div>
                        </td>
                        <td className="py-3">{product.brand || '-'}</td>
                        <td className="py-3">
                          <div>
                            <span className="font-bold text-[#FF3131]">MT {product.price.toLocaleString()}</span>
                            {product.old_price && product.old_price > 0 && (
                              <span className="text-xs text-muted-foreground line-through ml-2">
                                MT {product.old_price.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="py-3">
                          <Badge variant={product.is_active !== false ? "default" : "secondary"}>
                            {product.is_active !== false ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingProduct(product)}
                              title="Editar"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteProduct(product.id)}
                              className="text-red-600"
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PEDIDOS */}
          <TabsContent value="pedidos">
            <Card>
              <CardHeader className="justify-between flex-row items-center gap-2">
                <CardTitle>Pedidos ({orders.length})</CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => exportOrdersPDF(orderFilter?
                      orders.filter(o=>
                          o.customer_name.toLowerCase().includes(orderFilter.toLowerCase()) ||
                          o.customer_email.toLowerCase().includes(orderFilter.toLowerCase())
                        )
                      : orders)}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => downloadCSV(orderFilter?
                      orders.filter(o=>
                          o.customer_name.toLowerCase().includes(orderFilter.toLowerCase()) ||
                          o.customer_email.toLowerCase().includes(orderFilter.toLowerCase())
                        )
                      : orders,
                    ["id","customer_name","customer_email","total_amount","status","created_at"],
                    "pedidos.csv")}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                {loadingData && <Skeleton className="h-6 mb-4" />}
                <Input
                  placeholder="Filtrar pedidos por cliente/email..."
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="mb-2"
                />
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2">Cliente</th>
                      <th className="text-left py-2">Email</th>
                      <th className="text-left py-2">Total</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .filter(o =>
                        o.customer_name.toLowerCase().includes(orderFilter.toLowerCase()) ||
                        o.customer_email.toLowerCase().includes(orderFilter.toLowerCase())
                      )
                      .map((order) => (
                      <tr key={order.id} className="border-b hover:bg-muted">
                        <td className="py-3">{order.customer_name}</td>
                        <td className="py-3">{order.customer_email}</td>
                        <td className="py-3 font-bold">MT {order.total_amount?.toFixed(2) || '0.00'}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3">{new Date(order.created_at).toLocaleDateString(locale)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* UTILIZADORES */}
          <TabsContent value="usuarios">
            <Card>
              <CardHeader className="justify-between flex-row items-center gap-2">
                <CardTitle>Utilizadores ({users.length})</CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => exportUsersPDF(userFilter?
                      users.filter(u=>u.email.toLowerCase().includes(userFilter.toLowerCase()))
                      : users)}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => downloadCSV(userFilter?
                      users.filter(u=>u.email.toLowerCase().includes(userFilter.toLowerCase()))
                      : users,
                    ["id","email","created_at"],
                    "usuarios.csv")}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                {loadingData && <Skeleton className="h-6 mb-4" />}
                <Input
                  placeholder="Filtrar utilizadores por email..."
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="mb-2"
                />
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2">ID</th>
                      <th className="text-left py-2">Email</th>
                      <th className="text-left py-2">Data de Registo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter(u => u.email.toLowerCase().includes(userFilter.toLowerCase()))
                      .map((u) => (
                      <tr key={u.id} className="border-b hover:bg-muted">
                        <td className="py-3 font-mono text-xs">{u.id.substring(0, 8)}</td>
                        <td className="py-3">{u.email}</td>
                        <td className="py-3">{new Date(u.created_at).toLocaleDateString(locale)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
          {/* PERGUNTAS */}
          <TabsContent value="perguntas">
            <Card>
              <CardHeader className="justify-between">
                <CardTitle>Perguntas ({questions.length})</CardTitle>
                <Button size="sm" variant="secondary" onClick={() => downloadCSV(questionFilter?
                    questions.filter(q=>q.question.toLowerCase().includes(questionFilter.toLowerCase()))
                    : questions,
                  ["id","question","product_id","user_id","created_at"],
                  "perguntas.csv")}
                >Exportar CSV</Button>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                {loadingData && <Skeleton className="h-6 mb-4" />}
                <Input
                  placeholder="Filtrar perguntas..."
                  value={questionFilter}
                  onChange={(e) => setQuestionFilter(e.target.value)}
                  className="mb-2"
                />
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2">ID</th>
                      <th className="text-left py-2">Texto</th>
                      <th className="text-left py-2">Produto</th>
                      <th className="text-left py-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions
                      .filter(q => q.question.toLowerCase().includes(questionFilter.toLowerCase()))
                      .map((q) => (
                      <tr key={q.id} className="border-b hover:bg-muted">
                        <td className="py-3 font-mono text-xs">{q.id.substring(0,8)}</td>
                        <td className="py-3">{q.question.substring(0,50)}</td>
                        <td className="py-3 font-mono text-xs">{q.product_id.substring(0,8)}</td>
                        <td className="py-3">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setConfirmDelete({ type: 'question', id: q.id })}
                          >
                            Apagar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
          {/* ALERTAS */}
          <TabsContent value="alertas">
            <Card>
              <CardHeader className="justify-between">
                <CardTitle>Alertas ({alerts.length})</CardTitle>
                <Button size="sm" variant="secondary" onClick={() => downloadCSV(alertFilter?
                    alerts.filter(a=>
                        a.user_id.toLowerCase().includes(alertFilter.toLowerCase()) ||
                        a.product_id.toLowerCase().includes(alertFilter.toLowerCase())
                      )
                    : alerts,
                  ["id","user_id","product_id","target_price","created_at"],
                  "alertas.csv")}
                >Exportar CSV</Button>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                {loadingData && <Skeleton className="h-6 mb-4" />}
                <Input
                  placeholder="Filtrar alertas por usuário/ID..."
                  value={alertFilter}
                  onChange={(e) => setAlertFilter(e.target.value)}
                  className="mb-2"
                />
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2">ID</th>
                      <th className="text-left py-2">Utilizador</th>
                      <th className="text-left py-2">Produto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alerts
                      .filter(a =>
                        a.user_id.toLowerCase().includes(alertFilter.toLowerCase()) ||
                        a.product_id.toLowerCase().includes(alertFilter.toLowerCase())
                      )
                      .map((a) => (
                      <tr key={a.id} className="border-b hover:bg-muted">
                        <td className="py-3 font-mono text-xs">{a.id.substring(0,8)}</td>
                        <td className="py-3 font-mono text-xs">{a.user_id.substring(0,8)}</td>
                        <td className="py-3 font-mono text-xs">{a.product_id.substring(0,8)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
          {/* AFILIADOS */}
          <TabsContent value="afiliados">
            <Card>
              <CardHeader className="justify-between">
                <CardTitle>Afiliações ({affiliates.length})</CardTitle>
                <Button size="sm" variant="secondary" onClick={() => downloadCSV(affiliateFilter?
                    affiliates.filter(a=>a.email.toLowerCase().includes(affiliateFilter.toLowerCase()))
                    : affiliates,
                  ["id","email","balance","created_at"],
                  "afiliados.csv")}
                >Exportar CSV</Button>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                {loadingData && <Skeleton className="h-6 mb-4" />}
                <Input
                  placeholder="Filtrar afiliados por email..."
                  value={affiliateFilter}
                  onChange={(e) => setAffiliateFilter(e.target.value)}
                  className="mb-2"
                />
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2">ID</th>
                      <th className="text-left py-2">Email</th>
                      <th className="text-left py-2">Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {affiliates
                      .filter(a => a.email.toLowerCase().includes(affiliateFilter.toLowerCase()))
                      .map((a) => (
                      <tr key={a.id} className="border-b hover:bg-muted">
                        <td className="py-3 font-mono text-xs">{a.id.substring(0,8)}</td>
                        <td className="py-3">{a.email}</td>
                        <td className="py-3">MT {a.balance?.toFixed(2) || '0.00'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
          {/* FIDELIDADE */}
          <TabsContent value="fidelidade">
            <Card>
              <CardHeader>
                <CardTitle>Pontos de Fidelidade ({loyalty.length})</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2">ID</th>
                      <th className="text-left py-2">Utilizador</th>
                      <th className="text-left py-2">Pontos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loyalty.map((l) => (
                      <tr key={l.id} className="border-b hover:bg-muted">
                        <td className="py-3 font-mono text-xs">{l.id.substring(0,8)}</td>
                        <td className="py-3 font-mono text-xs">{l.user_id.substring(0,8)}</td>
                        <td className="py-3">{l.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
          {/* BADGES */}
          <TabsContent value="badges">
            <Card>
              <CardHeader className="justify-between">
                <CardTitle>Badges ({badges.length})</CardTitle>
                <Button size="sm" variant="secondary" onClick={() => downloadCSV(badgeFilter?
                    badges.filter(b=>b.name.toLowerCase().includes(badgeFilter.toLowerCase()))
                    : badges,
                  ["id","name","description","created_at"],
                  "badges.csv")}
                >Exportar CSV</Button>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                {loadingData && <Skeleton className="h-6 mb-4" />}
                <Input
                  placeholder="Filtrar badges por nome..."
                  value={badgeFilter}
                  onChange={(e) => setBadgeFilter(e.target.value)}
                  className="mb-2"
                />
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2">ID</th>
                      <th className="text-left py-2">Nome</th>
                      <th className="text-left py-2">Descrição</th>
                    </tr>
                  </thead>
                  <tbody>
                    {badges
                      .filter(b => b.name.toLowerCase().includes(badgeFilter.toLowerCase()))
                      .map((b) => (
                      <tr key={b.id} className="border-b hover:bg-muted">
                        <td className="py-3 font-mono text-xs">{b.id.substring(0,8)}</td>
                        <td className="py-3">{b.name}</td>
                        <td className="py-3">{b.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FERRAMENTAS */}
          <TabsContent value="ferramentas">
            <Card>
              <CardHeader>
                <CardTitle>Ferramentas e Relatórios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button onClick={() => exportSalesSummaryPDF(orders, products, users)} className="bg-[#FF3131] hover:bg-[#FF5555] h-auto py-4 flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    <span>Resumo de Vendas</span>
                    <span className="text-xs opacity-80">Relatório completo com estatísticas</span>
                  </Button>
                  <Button onClick={() => exportProductsPDF(products)} variant="outline" className="h-auto py-4 flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    <span>Lista de Produtos</span>
                    <span className="text-xs text-muted-foreground">Catálogo completo em PDF</span>
                  </Button>
                  <Button onClick={() => exportOrdersPDF(orders)} variant="outline" className="h-auto py-4 flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    <span>Relatório de Pedidos</span>
                    <span className="text-xs text-muted-foreground">Todas as vendas em PDF</span>
                  </Button>
                  <Button onClick={() => exportUsersPDF(users)} variant="outline" className="h-auto py-4 flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    <span>Lista de Utilizadores</span>
                    <span className="text-xs text-muted-foreground">Base de clientes em PDF</span>
                  </Button>
                  <Button onClick={() => exportAlertsPDF(alerts, questions)} variant="outline" className="h-auto py-4 flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    <span>Alertas e Perguntas</span>
                    <span className="text-xs text-muted-foreground">Interações de clientes</span>
                  </Button>
                  <Button onClick={loadAllData} variant="secondary" className="h-auto py-4 flex-col gap-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Recarregar Dados</span>
                    <span className="text-xs text-muted-foreground">Atualizar informações</span>
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-bold mb-3">Exportar Tudo (CSV)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Button size="sm" variant="outline" onClick={() => downloadCSV(products, ["id","name","price","stock","category","brand"], "todos-produtos.csv")}>
                      <Download className="h-4 w-4 mr-1" />
                      Produtos
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => downloadCSV(orders, ["id","customer_name","customer_email","total_amount","status","created_at"], "todos-pedidos.csv")}>
                      <Download className="h-4 w-4 mr-1" />
                      Pedidos
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => downloadCSV(users, ["id","email","created_at"], "todos-usuarios.csv")}>
                      <Download className="h-4 w-4 mr-1" />
                      Utilizadores
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => downloadCSV(affiliates, ["id","email","balance"], "afiliados.csv")}>
                      <Download className="h-4 w-4 mr-1" />
                      Afiliados
                    </Button>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <p className="font-bold">Informações da Conta</p>
                  <p className="text-sm">Email: {user?.email}</p>
                  <p className="text-sm break-all">User ID: {user?.id}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        {/* delete confirmation dialog */}
        <AlertDialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Eliminação</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDelete?.type === 'product' && 'Tem certeza que deseja apagar este produto?'}
              {confirmDelete?.type === 'question' && 'Tem certeza que deseja apagar esta pergunta?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={performDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Footer />
      </div>
    </div>
  );
};

export default AdminPanel;
