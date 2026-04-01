-- ================================================
-- MARRENGULA-IT SEED DATA
-- Dados mock realistas para testes
-- ================================================

-- ================================================
-- VENDORS (Lojas)
-- ================================================
INSERT INTO vendors (id, name, slug, logo, description, rating, total_sales, total_products, followers, status, verified) VALUES
('vendor-1', 'TechStore Maputo', 'techstore-maputo', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', 'Loja especializada em tecnologia e informática', 4.8, 1250000, 156, 2340, 'active', true),
('vendor-2', 'Hardware Pro MZ', 'hardware-pro-mz', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200', 'Componentes de computador e acessórios', 4.6, 890000, 89, 1560, 'active', true),
('vendor-3', 'Gaming Gear Store', 'gaming-gear-store', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200', 'Equipamentos gaming e periféricos', 4.9, 2100000, 234, 4520, 'active', true),
('vendor-4', 'Smart Solutions', 'smart-solutions', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200', 'Smartphones e dispositivos inteligentes', 4.7, 1560000, 178, 3200, 'active', false)
ON CONFLICT (slug) DO NOTHING;

-- ================================================
-- PRODUCTS (Produtos)
-- ================================================

-- Laptops
INSERT INTO products (id, vendor_id, category, name, slug, description, short_description, price, old_price, stock, images, brand, model, specifications, features, rating, reviews_count, sales_count, featured, on_sale, is_active) VALUES
('prod-1', 'vendor-1', 'Laptops', 'Dell XPS 15 Intel Core i7 13th Gen', 'dell-xps-15-i7-13th', 'O Dell XPS 15 é um laptop premium perfeito para profissionais e creadores de conteúdo. Com processador Intel Core i7 de 13ª geração, 16GB de RAM e SSD de 512GB, oferece desempenho excepcional.', 'Laptop premium com Intel Core i7 13ª Gen, 16GB RAM, 512GB SSD', 95000, 110000, 12, 
  '{"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800","https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800"}',
  'Dell', 'XPS 15 9530',
  '{"Processador": "Intel Core i7-13700H", "RAM": "16GB DDR5", "Armazenamento": "512GB SSD NVMe", "Tela": "15.6\" OLED 3.5K", "Placa Gráfica": "Intel Iris Xe", "Bateria": "Até 13 horas", "Peso": "1.86 kg", "Portas": "2x Thunderbolt 4, 1x USB-C"}',
  '{"Design premium em alumíno","Tela OLED impressionante","Teclado confortável","Bateria de longa duração"}',
  4.8, 234, 89, true, true, true),

('prod-2', 'vendor-1', 'Laptops', 'MacBook Pro 14" M3 Pro 18GB 512GB', 'macbook-pro-14-m3-pro', 'O MacBook Pro com chip M3 Pro oferece desempenho incrível para profissionais criativos. 18GB de memória unificada e 512GB SSD.', 'MacBook Pro com chip M3 Pro para profissionais', 185000, null, 8,
  '{"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800","https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800"}',
  'Apple', 'MacBook Pro 14"',
  '{"Processador": "Apple M3 Pro", "RAM": "18GB", "Armazenamento": "512GB SSD", "Tela": "14.2\" Liquid Retina XDR", "Bateria": "Até 17 horas", "Peso": "1.55 kg", "Portas": "3x Thunderbolt 4, HDMI, SD"}',
  '{"Chip M3 Pro revolucionário","Tela XDR impressionante","Autonomia de 17 horas","macOS otimizado"}',
  5.0, 156, 45, true, false, true),

('prod-3', 'vendor-4', 'Laptops', 'HP Pavilion 15 Intel Core i5 12th Gen', 'hp-pavilion-15-i5', 'Laptop versátil para trabalho e estudos. Processador Intel Core i5 de 12ª geração, ideal para tarefas do dia-a-dia.', 'Laptop para trabalho e estudos', 45000, 52000, 25,
  '{"https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800"}',
  'HP', 'Pavilion 15',
  '{"Processador": "Intel Core i5-1235U", "RAM": "8GB DDR4", "Armazenamento": "256GB SSD", "Tela": "15.6\" FHD IPS", "Placa Gráfica": "Intel UHD Graphics", "Bateria": "Até 8 horas"}',
  '{"Bom desempenho geral","Tela Full HD","Design elegante","Bom preço"}',
  4.5, 89, 156, false, true, true),

('prod-4', 'vendor-1', 'Laptops', 'Lenovo ThinkPad E14 Gen 5 Intel Core i7', 'lenovo-thinkpad-e14-i7', 'ThinkPad profissional com processador Intel Core i7, perfeito para negócios e produtividade.', 'ThinkPad para profissionais', 52000, null, 15,
  '{"https://images.unsplash.com/photo-1588872657578-7efd0f3d5b79?w=800"}',
  'Lenovo', 'ThinkPad E14 Gen 5',
  '{"Processador": "Intel Core i7-1355U", "RAM": "16GB DDR4", "Armazenamento": "512GB SSD", "Tela": "14\" FHD IPS", "Placa Gráfica": "Intel Iris Xe", "Segurança": "Leitor de digitais, TPM 2.0"}',
  '{"Teclado lendário ThinkPad","Segurança avançada","Design robusto","Excelente para trabalho"}',
  4.7, 67, 78, false, false, true);

-- Smartphones
INSERT INTO products (id, vendor_id, category, name, slug, description, short_description, price, old_price, stock, images, brand, model, specifications, features, rating, reviews_count, sales_count, featured, on_sale, is_active) VALUES
('prod-5', 'vendor-4', 'Smartphones', 'iPhone 15 Pro Max 256GB', 'iphone-15-pro-max', 'O iPhone 15 Pro Max com chip A17 Pro, câmera de 48MP e design em titânio. A experiência definitiva da Apple.', 'iPhone 15 Pro Max com A17 Pro', 125000, 135000, 10,
  '{"https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800","https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800"}',
  'Apple', 'iPhone 15 Pro Max',
  '{"Ecrã": "6.7\" Super Retina XDR", "Processador": "A17 Pro", "RAM": "8GB", "Armazenamento": "256GB", "Câmara": "48MP + 12MP + 12MP", "Bateria": "Até 29 horas"}',
  '{"Chip A17 Pro","Câmara 48MP","Design em titânio","USB-C"}',
  4.9, 312, 234, true, true, true),

('prod-6', 'vendor-4', 'Smartphones', 'Samsung Galaxy S24 Ultra 256GB', 'samsung-galaxy-s24-ultra', 'Samsung Galaxy S24 Ultra com S Pen integrado, câmara de 200MP e Galaxy AI.', 'Galaxy S24 Ultra com S Pen e IA', 98000, 105000, 18,
  '{"https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800"}',
  'Samsung', 'Galaxy S24 Ultra',
  '{"Ecrã": "6.8\" Dynamic AMOLED 2X", "Processador": "Snapdragon 8 Gen 3", "RAM": "12GB", "Armazenamento": "256GB", "Câmara": "200MP + 12MP + 50MP + 10MP", "Bateria": "5000mAh"}',
  '{"S Pen integrado","Galaxy AI","Câmara 200MP","7 anos de atualizações"}',
  4.8, 189, 156, true, true, true),

('prod-7', 'vendor-4', 'Smartphones', 'Xiaomi Redmi Note 13 Pro 256GB', 'xiaomi-redmi-note-13-pro', 'Smartphone com excelente custo-benefício, câmara de 200MP e ecrã AMOLED 120Hz.', 'Redmi Note 13 Pro com câmara 200MP', 22000, 25000, 35,
  '{"https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800"}',
  'Xiaomi', 'Redmi Note 13 Pro',
  '{"Ecrã": "6.67\" AMOLED 120Hz", "Processador": "Snapdragon 7s Gen 2", "RAM": "8GB", "Armazenamento": "256GB", "Câmara": "200MP + 8MP + 2MP", "Bateria": "5100mAh"}',
  '{"Câmara 200MP","Ecrã 120Hz","Bateria 5100mAh","Excelente preço"}',
  4.6, 145, 289, false, true, true),

('prod-8', 'vendor-4', 'Smartphones', 'POCO X6 Pro 5G 256GB', 'poco-x6-pro-5g', 'POCO X6 Pro com processador Dimensity 8300-Ultra e carregamento turbo de 67W.', 'POCO X6 Pro com 5G e carregamento turbo', 28000, null, 22,
  '{"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800"}',
  'Xiaomi', 'POCO X6 Pro',
  '{"Ecrã": "6.67\" AMOLED 120Hz", "Processador": "Dimensity 8300-Ultra", "RAM": "8GB", "Armazenamento": "256GB", "Câmara": "64MP + 8MP + 2MP", "Bateria": "5000mAh", "Carregamento": "67W Turbo"}',
  '{"5G","Carregamento 67W","Performance gaming"}',
  4.7, 98, 178, true, false, true),

('prod-9', 'vendor-4', 'Smartphones', 'Samsung Galaxy A54 5G 128GB', 'samsung-galaxy-a54-5g', 'Samsung Galaxy A54 com 5G, câmara de 50MP e design premium.', 'Galaxy A54 com 5G', 18500, 21000, 40,
  '{"https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800"}',
  'Samsung', 'Galaxy A54 5G',
  '{"Ecrã": "6.4\" Super AMOLED 120Hz", "Processador": "Exynos 1380", "RAM": "8GB", "Armazenamento": "128GB", "Câmara": "50MP + 12MP + 5MP", "Bateria": "5000mAh"}',
  '{"5G","Câmara 50MP","Design premium","IP67"}',
  4.5, 234, 456, false, true, true);

-- Placas Gráficas
INSERT INTO products (id, vendor_id, category, name, slug, description, short_description, price, old_price, stock, images, brand, model, specifications, features, rating, reviews_count, sales_count, featured, on_sale, is_active) VALUES
('prod-10', 'vendor-2', 'Placas Gráficas', 'NVIDIA GeForce RTX 4060 8GB', 'nvidia-rtx-4060', 'Placa gráfica NVIDIA RTX 4060 com 8GB GDDR6, perfeita para gaming 1080p e 1440p.', 'RTX 4060 para gaming 1080p/1440p', 45000, null, 15,
  '{"https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800"}',
  'NVIDIA', 'GeForce RTX 4060',
  '{"GPU": "Ada Lovelace AD107", "VRAM": "8GB GDDR6", "Barramento": "128-bit", "TDP": "115W", "Ray Tracing": "3ª Geração", "DLSS": "3"}',
  '{"DLSS 3","Ray Tracing 3ª Gen","Eficiência energética","Ada Lovelace"}',
  4.8, 167, 89, true, false, true),

('prod-11', 'vendor-2', 'Placas Gráficas', 'NVIDIA GeForce RTX 4070 Ti SUPER 12GB', 'nvidia-rtx-4070-ti-super', 'RTX 4070 Ti SUPER com 12GB GDDR6X para gaming 4K e criação de conteúdo.', 'RTX 4070 Ti SUPER para 4K', 72000, 78000, 8,
  '{"https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800"}',
  'NVIDIA', 'GeForce RTX 4070 Ti SUPER',
  '{"GPU": "Ada Lovelace AD104", "VRAM": "12GB GDDR6X", "Barramento": "192-bit", "TDP": "285W", "Ray Tracing": "3ª Geração", "DLSS": "3"}',
  '{"Excelente 4K gaming","DLSS 3 incrível","Performance創作"}',
  4.9, 89, 45, true, true, true),

('prod-12', 'vendor-2', 'Placas Gráficas', 'AMD Radeon RX 7700 XT 12GB', 'amd-rx-7700-xt', 'AMD RX 7700 XT com 12GB GDDR6 para gaming de alta performance.', 'RX 7700 XT para gaming de topo', 55000, null, 12,
  '{"https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800"}',
  'AMD', 'Radeon RX 7700 XT',
  '{"GPU": "Navi 32", "VRAM": "12GB GDDR6", "Barramento": "192-bit", "TDP": "245W", "Ray Accelerator": "2ª Geração", "FidelityFX": "Super Resolution"}',
  '{"FSR 3","Ray Tracing 2ª Gen","12GB VRAM","AMD FreeSync"}',
  4.7, 56, 34, false, false, true),

('prod-13', 'vendor-2', 'Placas Gráficas', 'NVIDIA GeForce RTX 4090 24GB', 'nvidia-rtx-4090', 'RTX 4090 com 24GB GDDR6X - a placa gráfica mais poderosa para gaming e IA.', 'RTX 4090 - a mais poderosa', 180000, null, 3,
  '{"https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800"}',
  'NVIDIA', 'GeForce RTX 4090',
  '{"GPU": "Ada Lovelace AD102", "VRAM": "24GB GDDR6X", "Barramento": "384-bit", "TDP": "450W", "Ray Tracing": "3ª Geração", "DLSS": "3", "Tensor Cores": "4ª Geração"}',
  '{"Performance extrema","Melhor GPU do mundo","IA e deep learning","8K gaming"}',
  5.0, 234, 12, true, false, true);

-- Periféricos
INSERT INTO products (id, vendor_id, category, name, slug, description, short_description, price, old_price, stock, images, brand, model, specifications, features, rating, reviews_count, sales_count, featured, on_sale, is_active) VALUES
('prod-14', 'vendor-3', 'Periféricos', 'Teclado Mecânico RGB Logitech G915 TKL', 'logitech-g915-tkl', 'Teclado mecânico sem fios de perfil baixo com iluminação RGB e switches GL.', 'Teclado mecânico wireless premium', 12500, 15000, 20,
  '{"https://images.unsplash.com/photo-1595225476474-87563907a212?w=800"}',
  'Logitech', 'G915 TKL',
  '{"Tipo": "Mecânico", "Switches": "GL Tactile", "Conectividade": "Wireless/Ligthspeed + USB-C", "RGB": "LIGHTSYNC", "Layout": "TKL (80%)", "Bateria": "Até 40 horas"}',
  '{"Switches GL silenciosos","Design ultrafino","Wireless Lightspeed","Iluminação RGB"}',
  4.9, 345, 234, true, true, true),

('prod-15', 'vendor-3', 'Periféricos', 'Mouse Gamer Logitech G502 HERO', 'logitech-g502-hero', 'Mouse gamer de alta precisão com sensor HERO 25K e 11 botões programáveis.', 'Mouse gamer de precisão', 8900, null, 45,
  '{"https://images.unsplash.com/photo-1527814050087-3793815479db?w=800"}',
  'Logitech', 'G502 HERO',
  '{"Sensor": "HERO 25K", "DPI": "100-25600", "Switches": "Mecânicos", "Botões": "11 programáveis", "RGB": "LIGHTSYNC", "Peso": "121g (ajustável)"}',
  '{"Sensor 25K preciso","11 botões programáveis","RGB personalizável","Peso ajustável"}',
  4.8, 456, 567, false, false, true),

('prod-16', 'vendor-3', 'Periféricos', 'Headset Gamer HyperX Cloud III Wireless', 'hyperx-cloud-iii-wireless', 'Headset wireless com áudio 7.1 surround, microfone com cancelamento de ruído.', 'Headset gaming wireless 7.1', 14900, 16900, 18,
  '{"https://images.unsplash.com/photo-1599669454699-248893623440?w=800"}',
  'HyperX', 'Cloud III Wireless',
  '{"Driver": "50mm custom", "Frequência": "15Hz - 20kHz", "Impedância": "60Ω", "Conexão": "Wireless 2.4GHz + Bluetooth", "Bateria": "Até 120 horas", "Microfone": "Com cancelamento de ruído"}',
  '{"7.1 surround virtual","120 horas de bateria","Conforto máximo","Microfone removível"}',
  4.7, 234, 189, true, true, true),

('prod-17', 'vendor-3', 'Periféricos', 'Monitor Gaming Samsung Odyssey G7 27"', 'samsung-odyssey-g7-27', 'Monitor curvo gaming 27" com 240Hz, 1ms e resolução WQHD.', 'Monitor gaming curvo 240Hz', 42000, 48000, 10,
  '{"https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800"}',
  'Samsung', 'Odyssey G7 LC27G75TQSN',
  '{"Tamanho": "27\"", "Resolução": "2560x1440 (WQHD)", "Curvatura": "1000R", "Taxa de atualização": "240Hz", "Tempo de resposta": "1ms (GtG)", "Painel": "VA", "HDR": "HDR600"}',
  '{"240Hz fluido","1ms resposta","1000R curvatura imersiva","HDR600"}',
  4.9, 178, 89, true, true, true),

('prod-18', 'vendor-3', 'Periféricos', 'Monitor LG UltraGear 27" 144Hz IPS', 'lg-ultragear-27-144hz', 'Monitor IPS gaming 27" com 144Hz, 1ms e cores precisas para competitiva.', 'Monitor IPS gaming 144Hz', 28000, null, 15,
  '{"https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800"}',
  'LG', '27GP850-B',
  '{"Tamanho": "27\"", "Resolução": "2560x1440 (WQHD)", "Taxa de atualização": "144Hz (OC 165Hz)", "Tempo de resposta": "1ms (GtG)", "Painel": "IPS", "Adobe RGB": "99%"}',
  '{"IPS com cores precisas","144Hz fluido","99% Adobe RGB","G-Sync Compatible"}',
  4.6, 123, 156, false, false, true);

-- Componentes
INSERT INTO products (id, vendor_id, category, name, slug, description, short_description, price, old_price, stock, images, brand, model, specifications, features, rating, reviews_count, sales_count, featured, on_sale, is_active) VALUES
('prod-19', 'vendor-2', 'Componentes', 'Processador AMD Ryzen 5 7600X', 'amd-ryzen-5-7600x', 'Processador AMD Ryzen 5 7600X com arquitectura Zen 4, 6 cores e 12 threads.', 'Ryzen 5 7600X Zen 4', 28000, null, 25,
  '{"https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800"}',
  'AMD', 'Ryzen 5 7600X',
  '{"Socket": "AM5", "Núcleos": "6", "Threads": "12", "Frequência Base": "4.7 GHz", "Frequência Boost": "5.3 GHz", "Cache": "32MB", "TDP": "105W", "Memória": "DDR5"}',
  '{"Zen 4 architecture","PCIe 5.0","DDR5 support","Overclocking fácil"}',
  4.8, 145, 89, true, false, true),

('prod-20', 'vendor-2', 'Componentes', 'Processador Intel Core i7-13700K', 'intel-core-i7-13700k', 'Processador Intel Core i7 de 13ª geração com 16 cores e 24 threads para gaming e criação.', 'Intel i7-13700K 13ª Gen', 45000, 48000, 12,
  '{"https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800"}',
  'Intel', 'Core i7-13700K',
  '{"Socket": "LGA1700", "Núcleos": "16 (8P + 8E)", "Threads": "24", "Frequência Base": "3.4 GHz", "Frequência Boost": "5.4 GHz", "Cache": "30MB", "TDP": "125W (PBP) / 253W (MTP)"}',
  '{"Hybrid Performance","DDR4 + DDR5","PCIe 5.0","Overclocking desbloqueado"}',
  4.9, 178, 67, true, true, true),

('prod-21', 'vendor-2', 'Componentes', 'Memória RAM 32GB DDR5 5600MHz Corsair Vengeance', 'corsair-vengeance-32gb-ddr5', 'Kit de memória DDR5 32GB (2x16GB) a 5600MHz da Corsair Vengeance.', '32GB DDR5 5600MHz Vengeance', 22000, null, 30,
  '{"https://images.unsplash.com/photo-1562976540-1502c2145186?w=800"}',
  'Corsair', 'Vengeance DDR5',
  '{"Capacidade": "32GB (2x16GB)", "Tipo": "DDR5", "Frequência": "5600MHz", "Latência": "CL36", "Voltagem": "1.25V", "RGB": "Não"}',
  '{"DDR5 de última geração","XMP 3.0","Baixa latência","Qualidade Corsair"}',
  4.7, 89, 134, false, false, true),

('prod-22', 'vendor-2', 'Componentes', 'SSD NVMe 1TB Samsung 990 PRO', 'samsung-990-pro-1tb', 'SSD NVMe PCIe 4.0 de 1TB Samsung 990 PRO com velocidades até 7450MB/s.', 'SSD 1TB 990 PRO PCIe 4.0', 10000, 12000, 40,
  '{"https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800"}',
  'Samsung', '990 PRO MZ-V9P1T0B',
  '{"Capacidade": "1TB", "Interface": "PCIe 4.0 x4 NVMe", "Leitura": "7450 MB/s", "Escrita": "6900 MB/s", "Memória": "V-NAND TLC", "TBW": "600 TBW"}',
  '{"Velocidades extremas","7450 MB/s leitura","Maior eficiência energética","5 anos de garantia"}',
  4.9, 234, 267, true, true, true),

('prod-23', 'vendor-2', 'Componentes', 'Fonte Alimentação 750W 80+ Gold Corsair RM750x', 'corsair-rm750x-750w', 'Fonte modular 750W 80+ Gold com certificação iCUE e proteção completa.', 'Fonte 750W Gold modular', 10000, null, 22,
  '{"https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800"}',
  'Corsair', 'RM750x (2024)',
  '{"Potência": "750W", "Certificação": "80+ Gold", "Modular": "Full Modular", "Fans": "135mm ML", "Proteções": "OVP, OCP, SCP, OPP, OTP", "Garantia": "10 anos"}',
  '{"80+ Gold eficiente","Full modular","Zero RPM mode","10 anos garantia"}',
  4.8, 156, 189, false, false, true);

-- ================================================
-- COUPONS (Cupões de desconto)
-- ================================================
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, valid_from, valid_until, is_active) VALUES
('BEMVINDO10', '10% de desconto para novos clientes', 'percentage', 10, 5000, 5000, 1000, NOW(), NOW() + INTERVAL '90 days', true),
('FRETE30', 'Frete grátis para compras acima de 5000 MT', 'fixed', 0, 5000, NULL, NULL, NOW(), NOW() + INTERVAL '30 days', true),
('PROMO20', '20% de desconto em produtos selecionados', 'percentage', 20, 10000, 10000, 500, NOW(), NOW() + INTERVAL '60 days', true)
ON CONFLICT (code) DO NOTHING;

-- ================================================
-- FIM DO SEED DATA
-- ================================================
