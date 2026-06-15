-- ============================================================================
-- DIAGNÓSTICO DE ESTRUTURA - MARRENGULA-IT
-- Execute este script PRIMEIRO para ver o que já existe
-- ============================================================================

-- 1. Listar todas as tabelas
SELECT 
    'TABELAS EXISTENTES' as tipo,
    table_name as nome
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. Ver estrutura de product_badges (se existir)
SELECT 
    'COLUNAS DE product_badges' as tipo,
    column_name as nome,
    data_type as tipo_dado,
    is_nullable as permite_null
FROM information_schema.columns
WHERE table_name = 'product_badges' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Ver estrutura de products
SELECT 
    'COLUNAS DE products' as tipo,
    column_name as nome,
    data_type as tipo_dado
FROM information_schema.columns
WHERE table_name = 'products' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Ver estrutura de categories
SELECT 
    'COLUNAS DE categories' as tipo,
    column_name as nome,
    data_type as tipo_dado
FROM information_schema.columns
WHERE table_name = 'categories' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 5. Contar registros
SELECT 
    'products' as tabela,
    COUNT(*) as total
FROM products
UNION ALL
SELECT 
    'categories' as tabela,
    COUNT(*) as total
FROM categories
UNION ALL
SELECT 
    'orders' as tabela,
    COUNT(*) as total
FROM orders
UNION ALL
SELECT 
    'user_roles' as tabela,
    COUNT(*) as total
FROM user_roles;

-- ============================================================================
-- RESULTADO: Copie o output e me envie para criar o script correto
-- ============================================================================
