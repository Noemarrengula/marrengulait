import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2, Plus, Trash2, Edit2, AlertCircle } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  title: string;
  price: number;
  stock: number;
  category: string;
  store_name: string;
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

interface Badge {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // extra resources
  const [questions, setQuestions] = useState<Question[]>([]);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loyalty, setLoyalty] = useState<LoyaltyPoint[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);

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

  // deletion confirmation
  const [confirmDelete, setConfirmDelete] = useState<
    | { type: 'product'; id: string }
    | { type: 'question'; id: string }
    | null
  >(null);


  const [loadingData, setLoadingData] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  
  const [newProduct, setNewProduct] = useState({
    title: "",
    price: 0,
    stock: 0,
    category: "Hardware",
    store_name: "MarrengulaIT",
  });

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/auth');
      return;
    }
    if (!loading && isAdmin) {
      loadAllData();
    }
  }, [loading, isAdmin, navigate]);

  const loadAllData = async () => {
    setLoadingData(true);
    try {
      // Carregar produtos
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
        .select('id, user_id')
        .order('created_at', { ascending: false });

      if (uError) throw uError;

      // Parse users (lookup emails from auth)
      let usersData:any[] = [];
      if (userData) {
        const { data: authUsers } = await supabase.auth.admin.listUsers();
        usersData = userData.map(u => {
          const au = authUsers?.users?.find(a => a.id === u.id);
          return {
            id: u.id,
            email: au?.email || 'Desconhecido',
            created_at: new Date().toISOString(),
          };
        });
      }
      
      setUsers(usersData);

      // carregar recursos adicionais
      const [qRes, aRes, fRes, lRes, bRes] = await Promise.all([
        supabase.from('product_questions').select('*'),
        supabase.from('price_alerts').select('*'),
        supabase.from('affiliates').select('*'),
        supabase.from('loyalty_points').select('*'),
        supabase.from('product_badges').select('*'),
      ]);

      if (qRes.error) throw qRes.error;
      if (aRes.error) throw aRes.error;
      if (fRes.error) throw fRes.error;
      if (lRes.error) throw lRes.error;
      if (bRes.error) throw bRes.error;

      setQuestions(qRes.data || []);
      setAlerts(aRes.data || []);
      setAffiliates(fRes.data || []);
      setLoyalty(lRes.data || []);
      setBadges(bRes.data || []);

      const now = new Date().toLocaleString();
      setLastUpdated(now);
      toast({ title: '✅ Dados carregados!', description: `Última atualização: ${now}` });
    } catch (error: any) {
      console.error('Erro:', error);
      toast({ title: '❌ Erro ao carregar', description: error.message, variant: 'destructive' });
    } finally {
      setLoadingData(false);
    }
  };

  const addProduct = async () => {
    if (!newProduct.title || newProduct.price <= 0) {
      toast({ title: 'Preencha os campos obrigatórios', variant: 'destructive' });
      return;
    }

    try {
      const { error } = await supabase.from('products').insert([
        {
          title: newProduct.title,
          price: newProduct.price,
          stock: newProduct.stock,
          category: newProduct.category,
          store_name: newProduct.store_name,
          featured: false,
        },
      ]);

      if (error) throw error;
      
      toast({ title: '✅ Produto adicionado!' });
      setNewProduct({ title: '', price: 0, stock: 0, category: 'Hardware', store_name: 'MarrengulaIT' });
      await loadAllData();
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    }
  };

  const updateProduct = async () => {
    if (!editingProduct) return;

    try {
      const { error } = await supabase
        .from('products')
        .update({
          title: editingProduct.title,
          price: editingProduct.price,
          stock: editingProduct.stock,
          category: editingProduct.category,
          store_name: editingProduct.store_name,
        })
        .eq('id', editingProduct.id);

      if (error) throw error;
      
      toast({ title: '✅ Produto atualizado!' });
      setEditingProduct(null);
      await loadAllData();
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
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
      } else if (confirmDelete.type === 'question') {
        const { error } = await supabase.from('product_questions').delete().eq('id', confirmDelete.id);
        if (error) throw error;
        toast({ title: '✅ Pergunta eliminada!' });
      }
      await loadAllData();
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
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

  if (loading || loadingData) {
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
        <div>
          <h1 className="text-3xl font-bold">Painel de Administração</h1>
          <p className="text-muted-foreground">Bem-vindo, {user?.email}</p>
          {lastUpdated && (
            <p className="text-sm text-muted-foreground">Última atualização: {lastUpdated}</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Produtos</p>
              <p className="text-2xl font-bold">{products.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Pedidos</p>
              <p className="text-2xl font-bold">{orders.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Utilizadores</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Vendas Totais</p>
              <p className="text-2xl font-bold">MT {orders.reduce((sum, o) => sum + (o.total_amount || 0), 0).toFixed(0)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Perguntas</p>
              <p className="text-2xl font-bold">{questions.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Alertas de Preço</p>
              <p className="text-2xl font-bold">{alerts.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Badges</p>
              <p className="text-2xl font-bold">{badges.length}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="produtos" className="w-full">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="produtos">Produtos</TabsTrigger>
            <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
            <TabsTrigger value="usuarios">Utilizadores</TabsTrigger>
            <TabsTrigger value="perguntas">Perguntas</TabsTrigger>
            <TabsTrigger value="alertas">Alertas</TabsTrigger>
            <TabsTrigger value="afiliados">Afiliações</TabsTrigger>
            <TabsTrigger value="fidelidade">Fidelidade</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="ferramentas">Ferramentas</TabsTrigger>
          </TabsList>

          {/* PRODUTOS */}
          <TabsContent value="produtos" className="space-y-4">
            <Card>
              <CardHeader className="justify-between">
                <CardTitle>Adicionar Novo Produto</CardTitle>
                <Button size="sm" variant="secondary" onClick={() => downloadCSV(productFilter?
                    products.filter(p=>p.title.toLowerCase().includes(productFilter.toLowerCase()))
                    : products,
                  ["id","title","price","stock","category","store_name"],
                  "produtos.csv")}
                >Exportar CSV</Button>
              </CardHeader>
              <CardContent>
                {!editingProduct ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Título</Label>
                        <Input
                          value={newProduct.title}
                          onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                          placeholder="Nome do produto"
                        />
                      </div>
                      <div>
                        <Label>Preço (MT)</Label>
                        <Input
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label>Stock</Label>
                        <Input
                          type="number"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label>Categoria</Label>
                        <Input
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                          placeholder="Hardware"
                        />
                      </div>
                    </div>
                    <Button onClick={addProduct} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Produto
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Título</Label>
                        <Input
                          value={editingProduct.title}
                          onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Preço</Label>
                        <Input
                          type="number"
                          value={editingProduct.price}
                          onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label>Stock</Label>
                        <Input
                          type="number"
                          value={editingProduct.stock}
                          onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label>Categoria</Label>
                        <Input
                          value={editingProduct.category}
                          onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={updateProduct} className="flex-1">Salvar Alterações</Button>
                      <Button onClick={() => setEditingProduct(null)} variant="outline" className="flex-1">Cancelar</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Produtos ({products.length})</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Input
                  placeholder="Filtrar produtos..."
                  value={productFilter}
                  onChange={(e) => setProductFilter(e.target.value)}
                  className="mb-2"
                />
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2">Produto</th>
                      <th className="text-left py-2">Preço</th>
                      <th className="text-left py-2">Stock</th>
                      <th className="text-left py-2">Categoria</th>
                      <th className="text-left py-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .filter(p => p.title.toLowerCase().includes(productFilter.toLowerCase()))
                      .map((product) => (
                      <tr key={product.id} className="border-b hover:bg-muted">
                        <td className="py-3">{product.title.substring(0, 40)}</td>
                        <td className="py-3">MT {product.price.toFixed(2)}</td>
                        <td className="py-3">{product.stock}</td>
                        <td className="py-3">{product.category}</td>
                        <td className="py-3 flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingProduct(product)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteProduct(product.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PEDIDOS */}
          <TabsContent value="pedidos">
            <Card>
              <CardHeader className="justify-between">
                <CardTitle>Pedidos ({orders.length})</CardTitle>
                <Button size="sm" variant="secondary" onClick={() => downloadCSV(orderFilter?
                    orders.filter(o=>
                        o.customer_name.toLowerCase().includes(orderFilter.toLowerCase()) ||
                        o.customer_email.toLowerCase().includes(orderFilter.toLowerCase())
                      )
                    : orders,
                  ["id","customer_name","customer_email","total_amount","status","created_at"],
                  "pedidos.csv")}
                >Exportar CSV</Button>
              </CardHeader>
              <CardContent className="overflow-x-auto">
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
                        <td className="py-3">{new Date(order.created_at).toLocaleDateString('pt-PT')}</td>
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
              <CardHeader className="justify-between">
                <CardTitle>Utilizadores ({users.length})</CardTitle>
                <Button size="sm" variant="secondary" onClick={() => downloadCSV(userFilter?
                    users.filter(u=>u.email.toLowerCase().includes(userFilter.toLowerCase()))
                    : users,
                  ["id","email","created_at"],
                  "usuarios.csv")}
                >Exportar CSV</Button>
              </CardHeader>
              <CardContent className="overflow-x-auto">
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
                        <td className="py-3">{new Date(u.created_at).toLocaleDateString('pt-PT')}</td>
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
                <CardTitle>Ferramentas e Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Button onClick={loadAllData} variant="outline" className="w-full">
                    🔄 Recarregar Dados
                  </Button>
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
      </div>
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
  );
};

export default AdminPanel;
