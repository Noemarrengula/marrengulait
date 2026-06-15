-- ============================================
-- SCRIPT DE CORREÇÃO - MARRENGULA-IT
-- Execute este script para corrigir a estrutura
-- ============================================

-- 1. DELETAR TABELA PRODUCTS EXISTENTE E RECRIAR
DROP TABLE IF EXISTS products CASCADE;

-- 2. RECRIAR TABELA DE PRODUTOS COM ESTRUTURA CORRETA
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  old_price DECIMAL(10, 2),
  image_url TEXT,
  category TEXT,
  brand TEXT,
  rating DECIMAL(2, 1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 0,
  store_name TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. CRIAR ÍNDICES
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- 4. HABILITAR RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 5. CRIAR POLÍTICA
DROP POLICY IF EXISTS "Produtos são públicos" ON products;
CREATE POLICY "Produtos são públicos" ON products FOR SELECT USING (true);

-- 6. INSERIR PRODUTOS
INSERT INTO products (title, description, price, old_price, image_url, category, brand, rating, reviews_count, stock, store_name, featured) VALUES
('Laptop HP ProBook 450 G10', 'Intel Core i7 13th Gen, 16GB RAM, 512GB SSD, Windows 11 Pro', 89999.00, 105000.00, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800', 'Laptops', 'HP', 4.5, 127, 15, 'TechStore Maputo', true),
('NVIDIA GeForce RTX 4070 Ti', '12GB GDDR6X, Ray Tracing, DLSS 3.0', 72500.00, NULL, 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800', 'Hardware', 'NVIDIA', 5.0, 189, 8, 'Hardware Pro', true),
('Samsung 27" Monitor Curvo', '144Hz Gaming, 1ms, FreeSync Premium, WQHD', 18900.00, 22000.00, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800', 'Monitores', 'Samsung', 4.0, 567, 23, 'Display Tech', false),
('Teclado Mecânico RGB Logitech G915', 'TKL Wireless, Low Profile, LIGHTSPEED', 12500.00, NULL, 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800', 'Acessórios', 'Logitech', 5.0, 342, 45, 'Periféricos MZ', true),
('Dell XPS 15', 'Intel i9, 32GB RAM, 1TB SSD, RTX 4060', 145000.00, 160000.00, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800', 'Laptops', 'Dell', 4.8, 234, 7, 'Premium Tech', true),
('Mouse Razer DeathAdder V3', 'Wireless, 30K DPI, 90h bateria', 4500.00, 5200.00, 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800', 'Acessórios', 'Razer', 4.7, 891, 67, 'Gaming Store', false),
('SSD Samsung 990 PRO 2TB', 'NVMe PCIe 4.0, 7450MB/s leitura', 15800.00, NULL, 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800', 'Hardware', 'Samsung', 5.0, 445, 34, 'Storage Pro', false),
('Webcam Logitech C920 HD Pro', 'Full HD 1080p, 30fps, Microfone estéreo', 3200.00, 3800.00, 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=800', 'Acessórios', 'Logitech', 4.3, 678, 89, 'Periféricos MZ', false),
('MacBook Pro 14" M3', 'Apple M3 Pro, 18GB RAM, 512GB SSD', 185000.00, NULL, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', 'Laptops', 'Apple', 4.9, 456, 5, 'Apple Store MZ', true),
('Headset HyperX Cloud II', 'Gaming, 7.1 Surround, USB', 6800.00, 7500.00, 'https://images.unsplash.com/photo-1599669454699-248893623440?w=800', 'Acessórios', 'HyperX', 4.6, 1234, 56, 'Gaming Store', false),
('Processador AMD Ryzen 9 7950X', '16-Core, 32-Thread, 5.7GHz', 45000.00, NULL, 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800', 'Hardware', 'AMD', 4.8, 234, 12, 'Hardware Pro', true),
('Impressora HP LaserJet Pro', 'M404dn, Duplex automático, Rede', 28500.00, 32000.00, 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800', 'Impressoras', 'HP', 4.2, 345, 18, 'Office Tech', false);

-- 7. VERIFICAÇÃO
SELECT 'Correção completa! Total de produtos:' as message, COUNT(*) as total FROM products;
