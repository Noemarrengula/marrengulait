export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: Database['public']['Enums']['app_role']
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: Database['public']['Enums']['app_role']
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: Database['public']['Enums']['app_role']
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          icon: string | null
          description: string | null
          parent_id: string | null
          active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          icon?: string | null
          description?: string | null
          parent_id?: string | null
          active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          icon?: string | null
          description?: string | null
          parent_id?: string | null
          active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      vendors: {
        Row: {
          id: string
          user_id: string | null
          name: string
          slug: string
          logo: string | null
          banner: string | null
          description: string | null
          rating: number
          total_sales: number
          total_products: number
          followers: number
          status: string
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          slug: string
          logo?: string | null
          banner?: string | null
          description?: string | null
          rating?: number
          total_sales?: number
          total_products?: number
          followers?: number
          status?: string
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          slug?: string
          logo?: string | null
          banner?: string | null
          description?: string | null
          rating?: number
          total_sales?: number
          total_products?: number
          followers?: number
          status?: string
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          vendor_id: string | null
          category_id: string | null
          name: string
          slug: string
          description: string | null
          short_description: string | null
          price: number
          old_price: number | null
          cost_price: number | null
          stock: number
          low_stock_threshold: number
          images: string[]
          brand: string | null
          model: string | null
          sku: string | null
          barcode: string | null
          weight: number | null
          dimensions: string | null
          specifications: Json
          features: string[]
          tags: string[]
          category: string | null
          subcategory: string | null
          rating: number
          reviews_count: number
          sales_count: number
          views_count: number
          featured: boolean
          on_sale: boolean
          is_active: boolean
          meta_title: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vendor_id?: string | null
          category_id?: string | null
          name: string
          slug: string
          description?: string | null
          short_description?: string | null
          price?: number
          old_price?: number | null
          cost_price?: number | null
          stock?: number
          low_stock_threshold?: number
          images?: string[]
          brand?: string | null
          model?: string | null
          sku?: string | null
          barcode?: string | null
          weight?: number | null
          dimensions?: string | null
          specifications?: Json
          features?: string[]
          tags?: string[]
          category?: string | null
          subcategory?: string | null
          rating?: number
          reviews_count?: number
          sales_count?: number
          views_count?: number
          featured?: boolean
          on_sale?: boolean
          is_active?: boolean
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vendor_id?: string | null
          category_id?: string | null
          name?: string
          slug?: string
          description?: string | null
          short_description?: string | null
          price?: number
          old_price?: number | null
          cost_price?: number | null
          stock?: number
          low_stock_threshold?: number
          images?: string[]
          brand?: string | null
          model?: string | null
          sku?: string | null
          barcode?: string | null
          weight?: number | null
          dimensions?: string | null
          specifications?: Json
          features?: string[]
          tags?: string[]
          category?: string | null
          subcategory?: string | null
          rating?: number
          reviews_count?: number
          sales_count?: number
          views_count?: number
          featured?: boolean
          on_sale?: boolean
          is_active?: boolean
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          vendor_id: string | null
          order_number: string
          status: string
          payment_status: string
          payment_method: string | null
          payment_reference: string | null
          subtotal: number
          shipping_cost: number
          discount_amount: number
          coupon_code: string | null
          total_amount: number
          currency: string
          customer_name: string
          customer_email: string | null
          customer_phone: string
          delivery_address: string
          delivery_city: string
          delivery_province: string | null
          delivery_postal_code: string | null
          delivery_instructions: string | null
          notes: string | null
          admin_notes: string | null
          estimated_delivery: string | null
          shipped_at: string | null
          delivered_at: string | null
          cancelled_at: string | null
          cancellation_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          vendor_id?: string | null
          order_number?: string
          status?: string
          payment_status?: string
          payment_method?: string | null
          payment_reference?: string | null
          subtotal?: number
          shipping_cost?: number
          discount_amount?: number
          coupon_code?: string | null
          total_amount?: number
          currency?: string
          customer_name: string
          customer_email?: string | null
          customer_phone: string
          delivery_address: string
          delivery_city: string
          delivery_province?: string | null
          delivery_postal_code?: string | null
          delivery_instructions?: string | null
          notes?: string | null
          admin_notes?: string | null
          estimated_delivery?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          vendor_id?: string | null
          order_number?: string
          status?: string
          payment_status?: string
          payment_method?: string | null
          payment_reference?: string | null
          subtotal?: number
          shipping_cost?: number
          discount_amount?: number
          coupon_code?: string | null
          total_amount?: number
          currency?: string
          customer_name?: string
          customer_email?: string | null
          customer_phone?: string
          delivery_address?: string
          delivery_city?: string
          delivery_province?: string | null
          delivery_postal_code?: string | null
          delivery_instructions?: string | null
          notes?: string | null
          admin_notes?: string | null
          estimated_delivery?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          vendor_id: string | null
          product_name: string
          product_image: string | null
          product_sku: string | null
          quantity: number
          unit_price: number
          discount_amount: number
          subtotal: number
          specifications: Json
          is_reviewed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          vendor_id?: string | null
          product_name: string
          product_image?: string | null
          product_sku?: string | null
          quantity?: number
          unit_price: number
          discount_amount?: number
          subtotal: number
          specifications?: Json
          is_reviewed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          vendor_id?: string | null
          product_name?: string
          product_image?: string | null
          product_sku?: string | null
          quantity?: number
          unit_price?: number
          discount_amount?: number
          subtotal?: number
          specifications?: Json
          is_reviewed?: boolean
          created_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string
          order_id: string | null
          rating: number
          title: string | null
          comment: string | null
          pros: string[]
          cons: string[]
          images: string[]
          verified_purchase: boolean
          helpful_count: number
          not_helpful_count: number
          admin_response: string | null
          responded_at: string | null
          is_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          order_id?: string | null
          rating: number
          title?: string | null
          comment?: string | null
          pros?: string[]
          cons?: string[]
          images?: string[]
          verified_purchase?: boolean
          helpful_count?: number
          not_helpful_count?: number
          admin_response?: string | null
          responded_at?: string | null
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          order_id?: string | null
          rating?: number
          title?: string | null
          comment?: string | null
          pros?: string[]
          cons?: string[]
          images?: string[]
          verified_purchase?: boolean
          helpful_count?: number
          not_helpful_count?: number
          admin_response?: string | null
          responded_at?: string | null
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      coupons: {
        Row: {
          id: string
          code: string
          description: string | null
          discount_type: string
          discount_value: number
          min_order_amount: number
          max_discount_amount: number | null
          usage_limit: number | null
          used_count: number
          per_user_limit: number
          valid_from: string
          valid_until: string | null
          is_active: boolean
          applicable_categories: string[] | null
          applicable_products: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          description?: string | null
          discount_type: string
          discount_value: number
          min_order_amount?: number
          max_discount_amount?: number | null
          usage_limit?: number | null
          used_count?: number
          per_user_limit?: number
          valid_from?: string
          valid_until?: string | null
          is_active?: boolean
          applicable_categories?: string[] | null
          applicable_products?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          min_order_amount?: number
          max_discount_amount?: number | null
          usage_limit?: number | null
          used_count?: number
          per_user_limit?: number
          valid_from?: string
          valid_until?: string | null
          is_active?: boolean
          applicable_categories?: string[] | null
          applicable_products?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      recently_viewed: {
        Row: {
          id: string
          user_id: string | null
          product_id: string
          viewed_at: string
          session_id: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          product_id: string
          viewed_at?: string
          session_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          product_id?: string
          viewed_at?: string
          session_id?: string | null
        }
      }
      loyalty_points: {
        Row: {
          id: string
          user_id: string
          points: number
          lifetime_points: number
          tier: string
          tier_discount_percent: number
          total_orders: number
          total_spent: number
          last_earning_at: string | null
          last_redemption_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          points?: number
          lifetime_points?: number
          tier?: string
          tier_discount_percent?: number
          total_orders?: number
          total_spent?: number
          last_earning_at?: string | null
          last_redemption_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          points?: number
          lifetime_points?: number
          tier?: string
          tier_discount_percent?: number
          total_orders?: number
          total_spent?: number
          last_earning_at?: string | null
          last_redemption_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      newsletter: {
        Row: {
          id: string
          email: string
          is_active: boolean
          subscribed_at: string
          unsubscribed_at: string | null
          source: string
        }
        Insert: {
          id?: string
          email: string
          is_active?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
          source?: string
        }
        Update: {
          id?: string
          email?: string
          is_active?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
          source?: string
        }
      }
      service_requests: {
        Row: {
          id: string
          user_id: string | null
          service_type: string
          name: string
          email: string | null
          phone: string
          company: string | null
          description: string
          preferred_date: string | null
          budget: string | null
          status: string
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          service_type: string
          name: string
          email?: string | null
          phone: string
          company?: string | null
          description: string
          preferred_date?: string | null
          budget?: string | null
          status?: string
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          service_type?: string
          name?: string
          email?: string | null
          phone?: string
          company?: string | null
          description?: string
          preferred_date?: string | null
          budget?: string | null
          status?: string
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      affiliates: {
        Row: {
          id: string
          user_id: string
          referral_code: string
          commission_rate: number
          total_referrals: number
          total_earnings: number
          pending_earnings: number
          paid_earnings: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          referral_code: string
          commission_rate?: number
          total_referrals?: number
          total_earnings?: number
          pending_earnings?: number
          paid_earnings?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          referral_code?: string
          commission_rate?: number
          total_referrals?: number
          total_earnings?: number
          pending_earnings?: number
          paid_earnings?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database['public']['Enums']['app_role']
          _user_id: string
        }
        Returns: boolean
      }
      track_product_view: {
        Args: {
          p_product_id: string
        }
        Returns: void
      }
    }
    Enums: {
      app_role: 'admin' | 'vendor' | 'user'
      order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
      payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Tipos específicos para uso no frontend
export type Product = Tables<'products'>
export type Category = Tables<'categories'>
export type Order = Tables<'orders'>
export type OrderItem = Tables<'order_items'>
export type Favorite = Tables<'favorites'>
export type Review = Tables<'reviews'>
export type Vendor = Tables<'vendors'>
export type Coupon = Tables<'coupons'>
