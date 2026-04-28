import { supabase } from "@/integrations/supabase/client";

export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
}

export interface ReviewFormData {
  rating: number;
  title: string;
  comment: string;
}

export const reviewService = {
  async getReviewsByProduct(productId: string): Promise<ProductReview[]> {
    const { data, error } = await supabase
      .from("product_reviews")
      .select("*")
      .eq("product_id", productId)
      .eq("is_approved", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getProductRating(productId: string): Promise<{ rating: number; count: number }> {
    const { data, error } = await supabase
      .from("product_reviews")
      .select("rating")
      .eq("product_id", productId)
      .eq("is_approved", true);

    if (error) return { rating: 0, count: 0 };
    
    const count = data?.length || 0;
    const rating = count > 0 
      ? data.reduce((sum, r) => sum + r.rating, 0) / count 
      : 0;

    return { rating: Math.round(rating * 10) / 10, count };
  },

  async submitReview(productId: string, userId: string, reviewData: ReviewFormData): Promise<void> {
    const { error } = await supabase.from("product_reviews").insert({
      product_id: productId,
      user_id: userId,
      user_name: "Cliente",
      rating: reviewData.rating,
      title: reviewData.title,
      comment: reviewData.comment,
      is_approved: false,
    });

    if (error) throw error;
  },

  async hasUserReviewed(productId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("product_reviews")
      .select("id")
      .eq("product_id", productId)
      .eq("user_id", userId)
      .single();

    return !!data && !error;
  },
};