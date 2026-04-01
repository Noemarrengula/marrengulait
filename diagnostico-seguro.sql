-- ============================================================================
-- DIAGNÓSTICO SEGURO - MARRENGULA-IT
-- Este script não falha mesmo se tabelas não existirem
-- ============================================================================

-- 1. Listar TODAS as tabelas existentes
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. Ver colunas de TODAS as tabelas públicas
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- ============================================================================
-- RESULTADO: Isso mostra tudo que existe no seu banco
-- ============================================================================
