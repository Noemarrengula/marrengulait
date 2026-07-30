-- Corrigir views para usar SECURITY INVOKER (herdar permissoes de quem consulta)
ALTER VIEW public.low_stock_products SET (security_invoker = true);
ALTER VIEW public.daily_sales SET (security_invoker = true);
