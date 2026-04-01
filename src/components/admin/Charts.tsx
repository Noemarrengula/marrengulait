import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ['#FF3131', '#FF5555', '#FF7777', '#FF9999', '#FFBABB', '#FFDDD', '#12CBC4', '#A3CB38'];

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

export function ChartCard({ title, children, className, isLoading }: ChartCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}

interface SalesChartProps {
  data: { date: string; total_revenue: number; order_count: number }[];
  className?: string;
  isLoading?: boolean;
}

export function SalesChart({ data, className, isLoading }: SalesChartProps) {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  return (
    <ChartCard title="Receita Diária (Últimos 30 dias)" isLoading={isLoading}>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF3131" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FF3131" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => new Date(value).toLocaleDateString('pt-MZ', { day: '2-digit', month: 'short' })}
              className="text-xs"
            />
            <YAxis 
              tickFormatter={formatCurrency}
              className="text-xs"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value: number) => [formatCurrency(value) + ' MT', 'Receita']}
              labelFormatter={(label) => new Date(label).toLocaleDateString('pt-MZ', { day: '2-digit', month: 'long', year: 'numeric' })}
            />
            <Area 
              type="monotone" 
              dataKey="total_revenue" 
              stroke="#FF3131" 
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

interface OrdersChartProps {
  data: { date: string; order_count: number }[];
  className?: string;
  isLoading?: boolean;
}

export function OrdersChart({ data, className, isLoading }: OrdersChartProps) {
  return (
    <ChartCard title="Pedidos Diários (Últimos 30 dias)" isLoading={isLoading}>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => new Date(value).toLocaleDateString('pt-MZ', { day: '2-digit', month: 'short' })}
              className="text-xs"
            />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              labelFormatter={(label) => new Date(label).toLocaleDateString('pt-MZ', { day: '2-digit', month: 'long' })}
            />
            <Bar dataKey="order_count" fill="#FF3131" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

interface TopProductsChartProps {
  data: { name: string; sales_count: number }[];
  className?: string;
}

export function TopProductsChart({ data, className }: TopProductsChartProps) {
  return (
    <ChartCard title="Produtos Mais Vendidos">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.slice(0, 10)} layout="vertical" margin={{ top: 10, right: 30, left: 100, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis type="number" />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={90}
              tickFormatter={(value) => value.length > 15 ? value.substring(0, 15) + '...' : value}
              className="text-xs"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="sales_count" fill="#FF3131" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

interface RevenueByCategoryChartProps {
  data: { category: string; revenue: number }[];
  className?: string;
}

export function RevenueByCategoryChart({ data, className }: RevenueByCategoryChartProps) {
  const total = data.reduce((sum, item) => sum + item.revenue, 0);
  
  return (
    <ChartCard title="Receita por Categoria">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="revenue"
              nameKey="category"
              label={({ category, percent }) => `${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value: number) => [value.toLocaleString('pt-MZ') + ' MT', 'Receita']}
            />
            <Legend 
              formatter={(value) => value.length > 12 ? value.substring(0, 12) + '...' : value}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

interface OrdersByStatusChartProps {
  data: { status: string; count: number }[];
  className?: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#F59E0B',
  confirmed: '#3B82F6',
  processing: '#8B5CF6',
  shipped: '#F97316',
  delivered: '#22C55E',
  cancelled: '#EF4444',
};

export function OrdersByStatusChart({ data, className }: OrdersByStatusChartProps) {
  const statusLabels: Record<string, string> = {
    pending: 'Pendente',
    confirmed: 'Confirmado',
    processing: 'Em Processamento',
    shipped: 'Enviado',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
  };

  const chartData = data.map(item => ({
    ...item,
    name: statusLabels[item.status] || item.status,
  }));

  return (
    <ChartCard title="Pedidos por Status">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="count"
              nameKey="name"
              label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {chartData.map((item, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={STATUS_COLORS[item.status] || COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
