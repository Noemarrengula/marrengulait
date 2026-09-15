import { supabase } from "@/integrations/supabase/client";
import { uploadProductImage } from "@/lib/storage";
import type {
  Product, Order, User, Question, PriceAlert,
  Coupon, ActivityLog, SiteSettings, ContentBanner, ProductForm
} from "@/components/admin/types";

export interface AdminData {
  products: Product[];
  orders: Order[];
  users: User[];
  questions: Question[];
  alerts: PriceAlert[];
  coupons: Coupon[];
  banners: ContentBanner[];
  settingsRows: { key: string; value: unknown }[];
  activityLog: ActivityLog[];
}

export async function fetchAllAdminData(): Promise<AdminData> {
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
  return {
    products: productsRes.data ?? [],
    orders: ordersRes.data ?? [],
    users: (profilesRes.data ?? []).map((p) => ({
      id: p.id as string,
      email: (p.email as string) || (p.full_name as string) || "User",
      full_name: p.full_name as string,
      phone: p.phone as string,
      created_at: p.created_at as string,
      last_login_at: p.last_login_at as string
    })),
    questions: questionsRes.data ?? [],
    alerts: alertsRes.data ?? [],
    coupons: (couponsRes.data ?? []).map((c) => ({
      id: c.id as string,
      code: c.code as string,
      type: (c.type as "percent" | "fixed") || "percent",
      value: Number(c.value) || 0,
      min_order: Number(c.min_order) || 0,
      max_uses: Number(c.max_uses) || 100,
      used_count: Number(c.used_count) || 0,
      expiry_date: c.expiry_date as string | null,
      active: c.active !== false,
      created_at: c.created_at as string
    })),
    banners: (bannersRes.data ?? []).map((b, i) => ({
      id: b.id as string,
      title: b.title as string,
      subtitle: (b.subtitle as string) || "",
      imageUrl: (b.image_url as string) || "",
      linkUrl: (b.link_url as string) || "",
      active: b.active !== false,
      order: (b.sort_order as number) ?? (i + 1)
    })),
    settingsRows: (settingsRes.data ?? []) as { key: string; value: unknown }[],
    activityLog: activityRes.data ?? [],
  };
}

export type AllowedDeleteTable = "products" | "coupons" | "content_banners" | "price_alerts" | "product_questions";

export async function deleteRows(table: AllowedDeleteTable, id: string) {
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
}

export async function saveProductRecord(input: {
  editingId: string | null;
  form: ProductForm;
  imageFile: File | null;
}): Promise<{ id: string; created: boolean }> {
  let imageUrl = input.form.image_url || null;
  if (input.imageFile) {
    const tempId = input.editingId || `temp_${Date.now()}`;
    imageUrl = await uploadProductImage(input.imageFile, tempId);
  }
  const productData: Record<string, unknown> = {
    title: input.form.title,
    name: input.form.title,
    slug: input.form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    price: input.form.price,
    compare_at_price: input.form.compare_at_price || null,
    old_price: input.form.is_on_sale ? input.form.compare_at_price : null,
    stock: input.form.stock,
    category: input.form.category,
    brand: input.form.brand || null,
    image_url: imageUrl,
    description: input.form.description || null,
    is_featured: input.form.is_featured,
    is_on_sale: input.form.is_on_sale,
    is_active: input.form.is_active,
    store_name: "MarrengulaIT",
    updated_at: new Date().toISOString()
  };
  if (input.editingId) {
    const { error } = await supabase.from("products").update(productData).eq("id", input.editingId);
    if (error) throw error;
    return { id: input.editingId, created: false };
  }
  productData.created_at = new Date().toISOString();
  const { error } = await supabase.from("products").insert([productData]);
  if (error) throw error;
  return { id: "new", created: true };
}

export async function updateProductFieldRecord(id: string, field: "stock" | "price", value: number) {
  const { error } = await supabase.from("products").update({ [field]: value, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw error;
}

export async function bulkDeleteProducts(ids: string[]) {
  const { error } = await supabase.from("products").delete().in("id", ids);
  if (error) throw error;
}

export async function bulkUpdateProducts(ids: string[], patch: Record<string, unknown>) {
  const { error } = await supabase.from("products").update(patch).in("id", ids);
  if (error) throw error;
}

export async function updateOrderStatusRecord(id: string, status: string) {
  const { error } = await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw error;
}

export async function updatePaymentStatusRecord(id: string, patch: { payment_status: string; status: string }) {
  const { error } = await supabase.from("orders").update(patch).eq("id", id);
  if (error) throw error;
}

export async function insertCouponRecord(payload: {
  code: string; type: "percent" | "fixed"; value: number;
  min_order: number; max_uses: number; used_count: number;
  expiry_date: string | null; active: boolean;
}): Promise<Coupon> {
  const { data, error } = await supabase.from("coupons").insert([payload]).select().single();
  if (error) throw error;
  return {
    id: data.id, code: data.code, type: data.type,
    value: Number(data.value), min_order: Number(data.min_order) || 0,
    max_uses: Number(data.max_uses) || 100, used_count: 0,
    expiry_date: data.expiry_date, active: data.active, created_at: data.created_at
  };
}

export async function toggleCouponActive(id: string, active: boolean) {
  const { error } = await supabase.from("coupons").update({ active }).eq("id", id);
  if (error) throw error;
}

export async function removeCoupon(id: string) {
  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) throw error;
}

export async function insertBannerRecord(payload: {
  title: string; subtitle: string | null; image_url: string | null;
  link_url: string | null; active: boolean; sort_order: number;
}): Promise<ContentBanner> {
  const { data, error } = await supabase.from("content_banners").insert([payload]).select().single();
  if (error) throw error;
  return {
    id: data.id, title: data.title, subtitle: data.subtitle || "",
    imageUrl: data.image_url || "", linkUrl: data.link_url || "",
    active: data.active, order: data.sort_order
  };
}

export async function toggleBannerActive(id: string, active: boolean) {
  const { error } = await supabase.from("content_banners").update({ active }).eq("id", id);
  if (error) throw error;
}

export async function removeBanner(id: string) {
  const { error } = await supabase.from("content_banners").delete().eq("id", id);
  if (error) throw error;
}

export async function answerQuestionRecord(id: string, answer: string) {
  const { error } = await supabase.from("product_questions").update({ answer }).eq("id", id);
  if (error) throw error;
}

export async function saveSiteSettingsRecord(key: string, value: SiteSettings, updatedBy: string | undefined) {
  const { error } = await supabase.from("admin_settings").upsert({ key, value, updated_by: updatedBy });
  if (error) throw error;
}

export async function insertActivityLogEntry(entry: {
  action: string; entity: string; entity_id: string; details: string; user_email: string;
}) {
  try {
    await supabase.from("activity_log").insert(entry);
  } catch (e) {
    console.error("[Admin] Failed to log activity:", e);
  }
}