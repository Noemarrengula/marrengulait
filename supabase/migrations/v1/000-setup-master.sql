-- ================================================
-- MARRENGULA-IT DATABASE SETUP - MASTER SCRIPT
-- Execution Order: 001 → 002 → 003
-- ================================================

-- ================================================
-- PARTE 1: SCHEMA CORE (public)
-- Executar: supabase/migrations/v1/001-schema-core.sql
-- ================================================

-- Tables criadas:
-- - public.categories
-- - public.vendors
-- - public.products
-- - public.orders
-- - public.order_items
-- - public.cart_items
-- - public.favorites
-- - public.reviews
-- - public.coupons
-- - public.affiliate_commissions
-- - public.payments
-- - public.public_wishlists
-- - public.profiles (extensão auth.users)

-- Funções:
-- - public.handle_new_user() [trigger]
-- - public.generate_order_number()

-- ================================================
-- PARTE 2: SCHEMA BUSINESS
-- Executar: supabase/migrations/v1/002-schema-business.sql
-- ================================================

-- Schema: business

-- Tables criadas:
-- - business.clients
-- - business.services
-- - business.quotes
-- - business.orders
-- - business.tickets

-- Funções RPC:
-- - business.calculate_quote(service_id, quantity, level, user_id)
--   → Calcula orçamento e insere na tabela quotes
--   → Retorna: quote_id, quote_number, service_name, quantity, unit_price, total_price, valid_until
--
-- - business.create_order(quote_id, payment_method, notes)
--   → Converte orçamento em pedido
--   → Retorna: order_id, order_number, total_amount, status
--
-- - business.create_ticket(user_id, category, subject, description, priority)
--   → Cria ticket de suporte
--   → Retorna: ticket_id, ticket_number, status
--
-- - business.get_client_data(user_id)
--   → Retorna dados do cliente
--
-- - business.generate_quote_number()
-- - business.generate_ticket_number()
-- - business.generate_order_number()

-- ================================================
-- PARTE 3: SCHEMA SYSTEM + SECURITY
-- Executar: supabase/migrations/v1/003-rls-policies.sql
-- ================================================

-- Schema: system

-- Tables criadas:
-- - system.logs
-- - system.notifications

-- Funções:
-- - system.log_event(action, entity_type, entity_id, details)
-- - system.auto_log()
-- - public.get_current_user_role()
-- - public.is_admin()

-- RLS Policies (Row Level Security):
-- - public.profiles: users → own profile; admins → all
-- - public.products: all → view; vendors/admins → manage
-- - public.orders: users → own; admins → all
-- - public.order_items: owners/admins → view
-- - public.cart_items: users → own
-- - public.favorites: users → own
-- - public.reviews: all → view approved; users → insert own; admins → manage
-- - public.coupons: all → view active; admins → manage
-- - public.payments: users → own; admins → all
-- - business.clients: users → own; admins → all
-- - business.quotes: users → own; admins → all
-- - business.orders: users → own; admins → all
-- - business.tickets: users → own; admins → all
-- - business.services: all → view active; admins → manage
-- - system.logs: admins → all
-- - system.notifications: users → own

-- ================================================
-- EXECUTAR ESTE SCRIPT NO SUPABASE SQL EDITOR
-- ORDEM: 001-schema-core.sql → 002-schema-business.sql → 003-rls-policies.sql
-- ================================================

-- Para executar no Supabase:
-- 1. Abra o SQL Editor
-- 2. Copie o conteúdo de 001-schema-core.sql e execute
-- 3. Copie o conteúdo de 002-schema-business.sql e execute
-- 4. Copie o conteúdo de 003-rls-policies.sql e execute

-- Verificar criação:
-- SELECT 
--     schemaname, 
--     tablename 
-- FROM pg_tables 
-- WHERE schemaname IN ('public', 'business', 'system')
-- ORDER BY schemaname, tablename;

SELECT '🗄️ Marrengula-IT Database Setup Completo!' AS status;