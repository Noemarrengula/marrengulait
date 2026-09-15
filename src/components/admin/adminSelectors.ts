import type { Product, Order, User, Question, DashboardStats } from "./types";

export function computeCategories(products: Product[]): string[] {
  const cats = new Set(products.map(p => p.category).filter(Boolean));
  return Array.from(cats) as string[];
}

export function computeStats(products: Product[], orders: Order[], users: User[]): DashboardStats {
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
}

export function filterProducts(products: Product[], search: string, category: string): Product[] {
  return products.filter(p => {
    const name = p.title || p.name || "";
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || p.category === category;
    return matchesSearch && matchesCategory;
  });
}

export function filterOrders(orders: Order[], search: string, status: string): Order[] {
  return orders.filter(o => {
    const matchesSearch =
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(search.toLowerCase()) ||
      o.order_number?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all" || o.status === status;
    return matchesSearch && matchesStatus;
  });
}

export function filterUsers(users: User[], search: string): User[] {
  const searchLower = search.toLowerCase();
  return users.filter(u =>
    u.email?.toLowerCase().includes(searchLower) ||
    u.full_name?.toLowerCase().includes(searchLower)
  );
}

export function filterUnanswered(questions: Question[]): Question[] {
  return questions.filter(q => !q.answer || q.answer.trim() === "");
}

export function paginate<T>(items: T[], page: number, perPage: number): T[] {
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
}