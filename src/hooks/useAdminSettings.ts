import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AdminSiteSettings {
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
  showAugustBanner: boolean;
}

export interface AdminContentBanner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  active: boolean;
  order: number;
}

export interface AdminCoupon {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  expiryDate: string;
  active: boolean;
  createdAt: string;
}

const DEFAULT_SETTINGS: AdminSiteSettings = {
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
  showAugustBanner: true,
};

export function useAdminSettings() {
  const [settings, setSettings] = useState<AdminSiteSettings>(DEFAULT_SETTINGS);
  const [banners, setBanners] = useState<AdminContentBanner[]>([]);
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [{ data: settingsData }, { data: bannersData }, { data: couponsData }] = await Promise.all([
          supabase.from("admin_settings").select("key, value").eq("key", "site_settings").single(),
          supabase.from("content_banners").select("*").eq("active", true).order("sort_order", { ascending: true }),
          supabase.from("coupons").select("*").eq("active", true),
        ]);

        if (settingsData?.value) {
          setSettings(prev => ({ ...prev, ...(settingsData.value as Partial<AdminSiteSettings>) }));
        }

        if (bannersData) {
          setBanners(bannersData.map((b: Record<string, unknown>, i: number) => ({
            id: b.id as string,
            title: b.title as string,
            subtitle: (b.subtitle as string) || "",
            imageUrl: (b.image_url as string) || "",
            linkUrl: (b.link_url as string) || "",
            active: b.active !== false,
            order: (b.sort_order as number) ?? (i + 1),
          })));
        }

        if (couponsData) {
          setCoupons(couponsData.map((c: Record<string, unknown>) => ({
            id: c.id as string,
            code: c.code as string,
            type: (c.type as "percent" | "fixed") || "percent",
            value: Number(c.value) || 0,
            minOrder: Number(c.min_order) || 0,
            maxUses: Number(c.max_uses) || 100,
            usedCount: Number(c.used_count) || 0,
            expiryDate: (c.expiry_date as string) || "",
            active: c.active !== false,
            createdAt: (c.created_at as string) || "",
          })));
        }
      } catch {
        console.warn("[AdminSettings] Failed to fetch, using defaults");
      }
    };

    fetchAll();
  }, []);

  const activeBanners = banners.filter(b => b.active).sort((a, b) => a.order - b.order);
  const activeCoupons = coupons.filter(c => c.active);
  const paymentMethods = {
    mpesa: settings.mpesaEnabled,
    emola: settings.emolaEnabled,
    cash: settings.cashEnabled,
  };

  return {
    settings,
    banners: activeBanners,
    coupons: activeCoupons,
    paymentMethods,
  };
}
