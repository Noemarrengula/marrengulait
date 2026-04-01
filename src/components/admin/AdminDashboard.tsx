import { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3, 
  Bell, 
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminStats, useDailySales, useRecentOrders, useLowStockProducts } from '@/hooks/useAdminAnalytics';
import { StatsGrid } from '@/components/admin/StatsCard';
import { SalesChart, OrdersChart } from '@/components/admin/Charts';
import { useSettings } from '@/context/SettingsContext';
import { cn } from '@/lib/utils';

const SIDEBAR_TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Pedidos', icon: ShoppingCart, badge: true },
  { id: 'products', label: 'Produtos', icon: Package },
  { id: 'users', label: 'Utilizadores', icon: Users },
  { id: 'analytics', label: 'Estatísticas', icon: BarChart3 },
  { id: 'alerts', label: 'Alertas', icon: Bell, badge: true },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const { locale } = useSettings();
  
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: salesData, isLoading: salesLoading } = useDailySales(30);
  const { data: recentOrders, isLoading: ordersLoading } = useRecentOrders(5);
  const { data: lowStock, isLoading: lowStockLoading } = useLowStockProducts();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'MZN',
      minimumFractionDigits: 0,
    }).format(value);
  };
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(locale, {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: 'bg-yellow-500',
      confirmed: 'bg-blue-500',
      processing: 'bg-purple-500',
      shipped: 'bg-orange-500',
      delivered: 'bg-green-500',
      cancelled: 'bg-red-500',
    };
    return statusColors[status] || 'bg-gray-500';
  };
  
  return (
    <div className="flex h-[calc(100vh-64px)] bg-muted/30">
      {/* Sidebar */}
      <aside className={cn(
        "bg-background border-r border-border transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          {!collapsed && <h2 className="font-bold">Admin Panel</h2>}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        
        <nav className="flex-1 p-2 space-y-1">
          {SIDEBAR_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const hasBadge = tab.badge && (
              (tab.id === 'orders' && stats?.pending_orders) ||
              (tab.id === 'alerts' && lowStock?.length)
            );
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  isActive 
                    ? "bg-[#FF3131] text-white" 
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="flex-1 text-left font-medium">{tab.label}</span>
                )}
                {hasBadge && !collapsed && (
                  <Badge variant="destructive" className="h-5 min-w-5 flex items-center justify-center">
                    {tab.id === 'orders' ? stats?.pending_orders : lowStock?.length}
                  </Badge>
                )}
                {hasBadge && collapsed && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
              <p className="text-muted-foreground">Visão geral da sua loja</p>
            </div>
            
            {/* Stats Grid */}
            <StatsGrid stats={stats} isLoading={statsLoading} />
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SalesChart 
                data={salesData || []} 
                isLoading={salesLoading}
              />
              <OrdersChart 
                data={salesData?.map(d => ({ date: d.date, order_count: d.order_count })) || []} 
                isLoading={salesLoading}
              />
            </div>
            
            {/* Recent Orders & Low Stock */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">Pedidos Recentes</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('orders')}>
                    Ver Todos
                  </Button>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentOrders?.map(order => (
                        <div 
                          key={order.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                        >
                          <div>
                            <p className="font-medium">{order.order_number}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.customer_name}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-[#FF3131]">
                              {formatCurrency(order.total_amount)}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "w-2 h-2 rounded-full",
                                getStatusBadge(order.status)
                              )} />
                              <span className="text-xs text-muted-foreground capitalize">
                                {order.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Low Stock Alert */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-red-500">⚠️</span>
                    Stock Baixo
                  </CardTitle>
                  {lowStock && lowStock.length > 0 && (
                    <Badge variant="destructive">{lowStock.length}</Badge>
                  )}
                </CardHeader>
                <CardContent>
                  {lowStockLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : lowStock && lowStock.length > 0 ? (
                    <div className="space-y-3">
                      {lowStock.slice(0, 5).map((product: any) => (
                        <div 
                          key={product.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900"
                        >
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.category || 'Sem categoria'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-red-600">
                              {product.stock} unid.
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Mín: {product.low_stock_threshold}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Todos os produtos com stock OK</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">Pedidos</h1>
              <p className="text-muted-foreground">Gestão de pedidos</p>
            </div>
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Use a tab existente de Pedidos no Admin principal</p>
              </CardContent>
            </Card>
          </div>
        )}
        
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">Produtos</h1>
              <p className="text-muted-foreground">Gestão de produtos</p>
            </div>
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Use a tab existente de Produtos no Admin principal</p>
              </CardContent>
            </Card>
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">Estatísticas</h1>
              <p className="text-muted-foreground">Análise detalhada</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SalesChart data={salesData || []} isLoading={salesLoading} />
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Resumo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Receita Mensal</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(stats?.month_revenue || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total de Pedidos</span>
                    <span className="font-bold">{stats?.total_orders || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Pedidos Pendentes</span>
                    <span className="font-bold text-orange-500">{stats?.pending_orders || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">Alertas</h1>
              <p className="text-muted-foreground">Notificações importantes</p>
            </div>
            
            {lowStock && lowStock.length > 0 && (
              <Card className="border-red-200">
                <CardHeader className="bg-red-50 dark:bg-red-950/20 border-b border-red-200">
                  <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
                    ⚠️ Alertas de Stock Baixo ({lowStock.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {lowStock.map((product: any) => (
                      <div 
                        key={product.id}
                        className="flex items-center justify-between p-4"
                      >
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.category || 'Sem categoria'}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="destructive">
                            {product.stock} unid.
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            Threshold: {product.low_stock_threshold}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {(!lowStock || lowStock.length === 0) && (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Sem alertas</p>
                  <p>Tudo está funcionando bem!</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">Configurações</h1>
              <p className="text-muted-foreground">Definições da loja</p>
            </div>
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Configurações disponíveis na tab Ferramentas do Admin</p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
