import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, Package, ShoppingCart, BarChart, Loader2, Plus, Trash2, Edit2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const StoresManagement = () => {
  const { toast } = useToast();
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadStores = async () => {
    try {
      const { data: products } = await supabase.from('products').select('store_name, price');
      
      const storesMap = new Map();
      products?.forEach(p => {
        if (!p.store_name) return;
        const current = storesMap.get(p.store_name) || { name: p.store_name, productsCount: 0, totalSales: 0, status: 'active' };
        current.productsCount++;
        current.totalSales += p.price || 0;
        storesMap.set(p.store_name, current);
      });
      
      setStores(Array.from(storesMap.values()));
    } catch (error) {
      console.error('Erro ao carregar lojas:', error);
      toast({ title: 'Erro ao carregar lojas', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleViewStore = (store: any) => {
    setSelectedStore(store);
    setDialogOpen(true);
  };

  const handleApprove = (storeName: string) => {
    toast({ title: `Loja "${storeName}" aprovada` });
  };

  const handleSuspend = (storeName: string) => {
    if (!confirm(`Suspender loja "${storeName}"?`)) return;
    toast({ title: `Loja "${storeName}" suspensa` });
  };

  useEffect(() => {
    loadStores();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (stores.length === 0) {
    return <p className="text-muted-foreground">Nenhuma loja encontrada</p>;
  }

  return (
    <>
      <StoresTable
        stores={stores}
        onViewStore={handleViewStore}
        onApprove={handleApprove}
        onSuspend={handleSuspend}
      />
      <StoreDetailsDialog
        store={selectedStore}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
};

const UsersManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Erro ao carregar utilizadores:', error);
      toast({ title: 'Erro ao carregar utilizadores', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleUpdateRoles = async (userId: string, roles: string[]) => {
    try {
      await userService.updateUserRoles(userId, roles);
      toast({ title: 'Roles atualizadas com sucesso' });
      loadUsers();
    } catch (error) {
      toast({ title: 'Erro ao atualizar roles', variant: 'destructive' });
      throw error;
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (users.length === 0) {
    return <p className="text-muted-foreground">Nenhum utilizador encontrado</p>;
  }

  return (
    <>
      <UsersTable users={users} onViewUser={handleViewUser} />
      <UserDetailsDialog
        user={selectedUser}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onUpdateRoles={handleUpdateRoles}
      />
    </>
  );
};

const ProductsManagement = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast({ title: 'Erro ao carregar produtos', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setDialogOpen(true);
  };

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return;
    
    try {
      await productService.deleteProduct(id);
      toast({ title: 'Produto deletado com sucesso' });
      loadProducts();
    } catch (error) {
      toast({ title: 'Erro ao deletar produto', variant: 'destructive' });
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedProduct) {
        await productService.updateProduct(selectedProduct.id, data);
        toast({ title: 'Produto atualizado com sucesso' });
      } else {
        await productService.createProduct(data);
        toast({ title: 'Produto criado com sucesso' });
      }
      loadProducts();
    } catch (error) {
      toast({ title: 'Erro ao salvar produto', variant: 'destructive' });
      throw error;
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Button onClick={handleCreate}>
        <Plus className="h-4 w-4 mr-2" />
        Novo Produto
      </Button>
      <CardContent className="pt-6">
        {products.length === 0 ? (
          <p className="text-muted-foreground">Nenhum produto encontrado</p>
        ) : (
          <ProductsTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </CardContent>
      <ProductFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        product={selectedProduct}
      />
    </>
  );
};

const OrdersManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (orderId: string) => {
    try {
      const order = await getOrderById(orderId);
      setSelectedOrder(order);
      setDialogOpen(true);
    } catch (error) {
      console.error('Erro ao carregar pedido:', error);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return <p className="text-muted-foreground">Nenhum pedido encontrado</p>;
  }

  return (
    <>
      <OrdersTable
        orders={orders}
        onOrderUpdate={loadOrders}
        onViewOrder={handleViewOrder}
      />
      <OrderDetailsDialog
        order={selectedOrder}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
};

const StatsCards = memo(() => {
  const [stats, setStats] = useState({
    usersCount: 0,
    productsCount: 0,
    storesCount: 0,
    todayOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const data = await adminService.getDashboardStats();
      setStats(data);
      setLoading(false);
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Utilizadores</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.usersCount}</div>
          <p className="text-xs text-muted-foreground">Utilizadores registados</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Produtos</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.productsCount}</div>
          <p className="text-xs text-muted-foreground">Produtos no marketplace</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Lojas</CardTitle>
          <Store className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.storesCount}</div>
          <p className="text-xs text-muted-foreground">Lojas ativas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Vendas Hoje</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.todayOrders}</div>
          <p className="text-xs text-muted-foreground">Encomendas processadas</p>
        </CardContent>
      </Card>
    </div>
  );
});
StatsCards.displayName = "StatsCards";

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading, roles, forceSync } = useAuth();
  const { toast } = useToast();
  const [syncLoading, setSyncLoading] = useState(false);

  const handleForceSync = async () => {
    console.log('⚡ Sincronização forçada pelo usuário');
    setSyncLoading(true);
    try {
      await forceSync?.();
      toast({ title: '✅ Sincronização completada' });
    } catch (error) {
      toast({ title: '❌ Erro na sincronização', variant: 'destructive' });
    } finally {
      setSyncLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔍 Admin Check:', { 
      user: user?.email || 'null', 
      isAdmin, 
      loading, 
      roles,
      timestamp: new Date().toISOString()
    });
    if (!loading) {
      if (!user) {
        console.log('❌ Redirecionando: sem usuário');
        navigate('/auth');
      } 
      else if (!isAdmin) {
        console.error('❌ Acesso negado: não é admin', {
          email: user.email,
          roles,
          userId: user.id
        });
        // NÃO redireciona para facilitar debug
        // navigate('/');
      }
    }
  }, [user, isAdmin, loading, roles, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">A carregar... (sincronizando com Supabase)</p>
        </div>
      </div>
    );
  }

  // Mostrar aviso de acesso negado mas permitir ver o painel para debug
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-700">❌ Acesso Negado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-red-600">
                Você não tem permissão de administrador para acessar este painel.
              </p>
              <div className="bg-red-100 p-4 rounded-lg text-sm font-mono space-y-1">
                <p>Email: <span className="font-bold">{user?.email}</span></p>
                <p>Roles: <span className="font-bold">{roles.join(', ') || 'nenhuma'}</span></p>
                <p>User ID: <span className="font-bold text-xs">{user?.id}</span></p>
              </div>
              <p className="text-sm text-red-600 mt-4">
                Se você é o administrador, pressione o botão abaixo para forçar sincronização com o Supabase.
              </p>
              <div className="flex gap-2">
                <Button 
                  onClick={handleForceSync} 
                  variant="outline"
                  disabled={syncLoading}
                >
                  {syncLoading ? '⏳ Sincronizando...' : '🔄 Forçar Sincronização'}
                </Button>
                <Button onClick={() => navigate('/')} variant="outline">
                  Voltar ao Início
                </Button>
              </div>
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
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Painel de Administração</h1>
          <p className="text-muted-foreground">Gerir o website Marrengula IT</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="users">Utilizadores</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="stores">Lojas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <StatsCards />
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Solicitações de Serviços Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ServicesManagement />
                </CardContent>
              </Card>
              <NewsletterManagement />
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerir Pedidos</CardTitle>
                <CardDescription>Visualizar e gerir todos os pedidos</CardDescription>
              </CardHeader>
              <CardContent>
                <OrdersManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerir Utilizadores</CardTitle>
                <CardDescription>Visualizar e gerir todos os utilizadores do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <UsersManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Gerir Produtos</CardTitle>
                    <CardDescription>Visualizar e gerir todos os produtos do marketplace</CardDescription>
                  </div>
                  <ProductsManagement />
                </div>
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="stores" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerir Lojas</CardTitle>
                <CardDescription>Visualizar e aprovar lojas do marketplace</CardDescription>
              </CardHeader>
              <CardContent>
                <StoresManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Admin;
