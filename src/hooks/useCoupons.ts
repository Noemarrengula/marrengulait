import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase?: number;
  max_uses?: number;
  valid_from?: string;
  valid_until?: string;
  is_active?: boolean;
}

interface CouponValidationResult {
  is_valid: boolean;
  coupon_id?: string;
  code?: string;
  discount_type?: 'percentage' | 'fixed';
  discount_value?: number;
  discount_amount?: number;
  error_message?: string | null;
}

interface UseCouponReturn {
  validateCoupon: (code: string, subtotal: number) => Promise<CouponValidationResult | null>;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  currentCoupon: Coupon | null;
  discount: number;
  isValidating: boolean;
  error: string | null;
}

export function useCoupons(subtotal: number): UseCouponReturn {
  const [currentCoupon, setCurrentCoupon] = useState<Coupon | null>(null);
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validateCoupon = useCallback(async (code: string, subtotalAmount: number): Promise<CouponValidationResult | null> => {
    if (!code.trim()) {
      setError('Por favor, insere um código de cupão');
      return null;
    }

    setIsValidating(true);
    setError(null);

    try {
      const { data, error: rpcError } = await supabase.rpc('validate_coupon', {
        p_code: code.trim(),
        p_subtotal: subtotalAmount,
        p_product_ids: null,
        p_category: null,
      });

      if (rpcError) throw rpcError;

      const result = data as CouponValidationResult;

      if (!result.is_valid) {
        setError(result.error_message || 'Cupão inválido');
        setCurrentCoupon(null);
        setDiscount(0);
        return result;
      }

      setCurrentCoupon({
        id: result.coupon_id!,
        code: result.code!,
        discount_type: result.discount_type!,
        discount_value: result.discount_value!,
      });
      setDiscount(result.discount_amount || 0);
      setError(null);

      toast.success(`Cupão aplicado: ${result.discount_type === 'percentage' ? `${result.discount_value}% OFF` : `-${result.discount_value} MT`}`);

      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao validar cupão';
      console.error('Erro ao validar cupão:', err);
      setError(message);
      setCurrentCoupon(null);
      setDiscount(0);
      return null;
    } finally {
      setIsValidating(false);
    }
  }, []);

  const applyCoupon = useCallback(async (code: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('apply_coupon', {
        p_code: code.trim(),
      });

      if (error) throw error;
      return data as boolean;
    } catch (err: unknown) {
      console.error('Erro ao aplicar cupão:', err);
      return false;
    }
  }, []);

  const removeCoupon = useCallback(() => {
    setCurrentCoupon(null);
    setDiscount(0);
    setError(null);
  }, []);

  return {
    validateCoupon,
    applyCoupon,
    removeCoupon,
    currentCoupon,
    discount,
    isValidating,
    error,
  };
}

export function useCouponValidation() {
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback(async (code: string, subtotal: number) => {
    if (!code.trim()) {
      setError('Código do cupão é obrigatório');
      return null;
    }

    setIsValidating(true);
    setError(null);

    try {
      const { data, error: rpcError } = await supabase.rpc('validate_coupon', {
        p_code: code.trim().toUpperCase(),
        p_subtotal: subtotal,
        p_product_ids: null,
        p_category: null,
      });

      if (rpcError) throw rpcError;

      const result = data as CouponValidationResult;

      if (!result.is_valid) {
        setError(result.error_message || 'Cupão inválido');
        return null;
      }

      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao validar cupão';
      console.error('Erro ao validar cupão:', err);
      setError(message);
      return null;
    } finally {
      setIsValidating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    validate,
    isValidating,
    error,
    reset,
  };
}

export function useAdminCoupons() {
  const fetchCoupons = useCallback(async (): Promise<Coupon[]> => {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }, []);

  const createCoupon = useMutation({
    mutationFn: async (coupon: Omit<Coupon, 'id' | 'current_uses' | 'created_at' | 'updated_at'>) => {
      const { error } = await supabase.from('coupons').insert([{
        code: coupon.code.toUpperCase(),
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        min_purchase: coupon.min_purchase || 0,
        max_uses: coupon.max_uses,
        valid_from: coupon.valid_from || new Date().toISOString(),
        valid_until: coupon.valid_until,
        is_active: coupon.is_active ?? true,
      }]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Cupão criado com sucesso!');
    },
    onError: (err: any) => {
      toast.error(`Erro: ${err.message}`);
    },
  });

  const updateCoupon = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Coupon> }) => {
      const { error } = await supabase
        .from('coupons')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Cupão atualizado!');
    },
    onError: (err: unknown) => {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error(`Erro: ${errorMessage}`);
    },
  });

  const deleteCoupon = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Cupão eliminado!');
    },
    onError: (err: unknown) => {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error(`Erro: ${errorMessage}`);
    },
  });

  return {
    fetchCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
  };
}
