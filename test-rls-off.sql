-- ================================================
-- TESTE: Desativar RLS para verificar se funciona
-- Execute no Supabase SQL Editor
-- ================================================

-- Desativar RLS em todas as tabelas principais
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists DISABLE ROW LEVEL SECURITY;
ALTER TABLE favorites DISABLE ROW LEVEL SECURITY;
ALTER TABLE recently_viewed DISABLE ROW LEVEL SECURITY;

SELECT 'RLS desativado em todas as tabelas' as status;

-- Testar查询 simples
SELECT 'Teste 1: Verificar user_roles' as teste;
SELECT * FROM user_roles LIMIT 5;

SELECT 'Teste 2: Verificar profiles' as teste;
SELECT * FROM profiles LIMIT 5;

-- ================================================
-- PARA REATIVAR RLS (depois do teste):
-- ================================================
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE recently_viewed ENABLE ROW LEVEL SECURITY;
