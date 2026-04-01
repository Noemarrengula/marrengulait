-- ============================================================================
-- CORREÇÃO DE ESTRUTURA - MARRENGULA-IT
-- Execute este script para corrigir tabelas existentes
-- ============================================================================

-- 1. Verificar estrutura atual
DO $$ 
BEGIN
    RAISE NOTICE 'Verificando estrutura das tabelas...';
END $$;

-- 2. Corrigir product_badges
DO $$ 
BEGIN
    -- Adicionar colunas se não existirem
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'product_badges' AND column_name = 'name') THEN
        ALTER TABLE product_badges ADD COLUMN name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'product_badges' AND column_name = 'description') THEN
        ALTER TABLE product_badges ADD COLUMN description TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'product_badges' AND column_name = 'icon') THEN
        ALTER TABLE product_badges ADD COLUMN icon TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'product_badges' AND column_name = 'color') THEN
        ALTER TABLE product_badges ADD COLUMN color TEXT;
    END IF;
    
    RAISE NOTICE 'Tabela product_badges corrigida!';
END $$;

-- 3. Corrigir products (adicionar colunas que podem estar faltando)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'vendor_id') THEN
        ALTER TABLE products ADD COLUMN vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'category_id') THEN
        ALTER TABLE products ADD COLUMN category_id UUID REFERENCES categories(id) ON DELETE SET NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'compare_at_price') THEN
        ALTER TABLE products ADD COLUMN compare_at_price DECIMAL(10,2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'images') THEN
        ALTER TABLE products ADD COLUMN images TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'specifications') THEN
        ALTER TABLE products ADD COLUMN specifications JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'tags') THEN
        ALTER TABLE products ADD COLUMN tags TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'on_sale') THEN
        ALTER TABLE products ADD COLUMN on_sale BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'views') THEN
        ALTER TABLE products ADD COLUMN views INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'sales') THEN
        ALTER TABLE products ADD COLUMN sales INTEGER DEFAULT 0;
    END IF;
    
    RAISE NOTICE 'Tabela products corrigida!';
END $$;

-- 4. Inserir dados iniciais (com verificação)
INSERT INTO product_badges (name, description, icon, color) VALUES
('Novo', 'Produto novo', '🆕', '#10b981'),
('Promoção', 'Em promoção', '🔥', '#ef4444'),
('Mais Vendido', 'Mais vendido', '⭐', '#f59e0b'),
('Frete Grátis', 'Frete grátis', '🚚', '#3b82f6'),
('Exclusivo', 'Exclusivo', '💎', '#8b5cf6')
ON CONFLICT (name) DO NOTHING;

INSERT INTO categories (name, slug, description, icon) VALUES
('Hardware', 'hardware', 'Componentes de computador', '💻'),
('Software', 'software', 'Programas e licenças', '💿'),
('Smartphones', 'smartphones', 'Celulares', '📱'),
('Notebooks', 'notebooks', 'Laptops', '💻'),
('Acessórios', 'acessorios', 'Periféricos', '🔌'),
('Gaming', 'gaming', 'Equipamentos gamers', '🎮'),
('Redes', 'redes', 'Equipamentos de rede', '🌐'),
('Servidores', 'servidores', 'Servidores', '🖥️')
ON CONFLICT (slug) DO NOTHING;

-- 5. Verificar resultado
SELECT 
    'product_badges' as tabela,
    COUNT(*) as registros
FROM product_badges
UNION ALL
SELECT 
    'categories' as tabela,
    COUNT(*) as registros
FROM categories
UNION ALL
SELECT 
    'products' as tabela,
    COUNT(*) as registros
FROM products;

-- ============================================================================
-- PRONTO! ✅
-- ============================================================================
