-- ================================================
-- FASE A: CCTV - PRODUTOS E CATEGORIA
-- Execute este SQL no Supabase SQL Editor
-- ================================================

-- 1. Adicionar categoria CCTV se não existir
INSERT INTO categories (name, slug, icon, description, sort_order) 
VALUES ('CCTV e Segurança', 'cctv', 'camera', 'Sistemas de vigilância, câmaras e gravadores', 9)
ON CONFLICT (slug) DO NOTHING;

-- 2. Obter ID da categoria CCTV
DO $$
DECLARE
    cctv_cat_id UUID;
BEGIN
    SELECT id INTO cctv_cat_id FROM categories WHERE slug = 'cctv';
    
    -- 3. Inserir produtos CCTV (usando subquery para vendor)
    INSERT INTO products (vendor_id, category_id, category, name, slug, description, short_description, price, old_price, stock, images, brand, model, specifications, features, rating, reviews_count, sales_count, featured, on_sale, is_active)
    SELECT 
        v.id,
        cctv_cat_id,
        'CCTV',
        'Kit CCTV Intelbras 4 Câmaras 1080p',
        'kit-cctv-intelbras-4cam-1080p',
        'Kit completo de vigilância com 4 câmaras bullet HD 1080p, gravador DVR 4 canais, disco rígido de 1TB, cabos e acessorios. Ideal para residências e pequenas empresas.',
        'Kit 4 câmaras 1080p + DVR 4CH + 1TB HDD',
        35000, 42000, 8,
        ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800','https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800'],
        'Intelbras',
        'VD 4K 1104',
        '{"Câmaras": "4x Bullet 1080p", "Resolução": "Full HD 1080p", "Visão Noturna": "Até 20 metros", "DVR": "4 Canais", "Armazenamento": "1TB HDD", "Monitoramento": "Via mobile app"}',
        ARRAY['4 câmaras HD','Visão noturna','1TB armazenamento','App para celular','Instalação gratuita'],
        4.7, 45, 23, true, true, true
    FROM vendors v WHERE v.slug = 'techstore-maputo';
    
    INSERT INTO products (vendor_id, category_id, category, name, slug, description, short_description, price, old_price, stock, images, brand, model, specifications, features, rating, reviews_count, sales_count, featured, on_sale, is_active)
    SELECT 
        v.id,
        cctv_cat_id,
        'CCTV',
        'Câmara IP Hikvision 4MP Dome',
        'hikvision-ip-4mp-dome',
        'Câmara IP dome 4MP com visão noturna IR, deteção de movimento, suporta cartão SD. Ideal para interior com design discreto.',
        'Câmara IP 4MP Dome IR',
        8500, NULL, 15,
        ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
        'Hikvision',
        'DS-2CD2143G2-IZ',
        '{"Resolução": "4MP (2560x1440)", "Visão Noturna": "IR até 30m", "Lente": "2.8-12mm motorizada", "Cartão SD": "Até 256GB", "POE": "Sim", "Proteção": "IP67, IK10"}',
        ARRAY['4MP alta definição','Visão noturna 30m','POE (alimentação por cabo)','Detecção de movimento','À prova de vandalismo'],
        4.8, 67, 34, true, false, true
    FROM vendors v WHERE v.slug = 'techstore-maputo';
    
    INSERT INTO products (vendor_id, category_id, category, name, slug, description, short_description, price, old_price, stock, images, brand, model, specifications, features, rating, reviews_count, sales_count, featured, on_sale, is_active)
    SELECT 
        v.id,
        cctv_cat_id,
        'CCTV',
        'Câmara Bullet Hikvision 6MP ColorVu',
        'hikvision-bullet-6mp-colorvu',
        'Câmara bullet 6MP com tecnologia ColorVu para imagens a cores 24/7, visão noturna a cores até 40m, deteção de pessoas e veículos por IA.',
        'Câmara 6MP ColorVu a cores',
        12500, 15000, 12,
        ARRAY['https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800'],
        'Hikvision',
        'DS-2CD2066G2',
        '{"Resolução": "6MP (3200x1800)", "Tecnologia": "ColorVu (cores 24/7)", "Visão Noturna": "A cores até 40m", "IA": "Detecção de pessoas/veículos", "POE": "Sim", "Proteção": "IP67"}',
        ARRAY['Imagens a cores 24/7','6MP ultra HD','Visão noturna 40m','IA para deteção smart','POE integrado'],
        4.9, 89, 45, true, true, true
    FROM vendors v WHERE v.slug = 'techstore-maputo';
    
    INSERT INTO products (vendor_id, category_id, category, name, slug, description, short_description, price, old_price, stock, images, brand, model, specifications, features, rating, reviews_count, sales_count, featured, on_sale, is_active)
    SELECT 
        v.id,
        cctv_cat_id,
        'CCTV',
        'NVR Hikvision 8 Canais 4K',
        'hikvision-nvr-8ch-4k',
        'Gravador NVR 8 canais com suporte para câmaras até 8MP, saída HDMI 4K, deteção de movimento, backup para cloud. Compatible com câmaras IP de qualquer marca.',
        'NVR 8CH 4K com HDD 2TB',
        28000, 35000, 6,
        ARRAY['https://images.unsplash.com/photo-1557862921-37829c790f19?w=800'],
        'Hikvision',
        'DS-7608NI-I2',
        '{"Canais": "8x IP", "Resolução máx": "8MP (4K)", "Saída": "HDMI 4K + VGA", "Armazenamento": "2x HDD até 8TB", "Rede": "Bandwidth 80Mbps", "App": "iVMS-4500"}',
        ARRAY['8 canais IP','Suporta 4K','2TB HDD incluído','Monitorização remota','Plug & Play com câmaras Hikvision'],
        4.8, 34, 18, false, true, true
    FROM vendors v WHERE v.slug = 'techstore-maputo';
    
    INSERT INTO products (vendor_id, category_id, category, name, slug, description, short_description, price, old_price, stock, images, brand, model, specifications, features, rating, reviews_count, sales_count, featured, on_sale, is_active)
    SELECT 
        v.id,
        cctv_cat_id,
        'CCTV',
        'Kit CCTV Completo 8 Câmaras 5MP',
        'kit-cctv-8cam-5mp',
        'Sistema de vigilância profissional com 8 câmaras turret 5MP, gravador NVR 8 canais, 2TB HDD, visão noturna a cores. Cobertura completa para grandes áreas.',
        'Kit 8 câmaras 5MP + NVR 8CH',
        85000, 95000, 4,
        ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800','https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800'],
        'Hikvision',
        'DS-7108NI-Q2',
        '{"Câmaras": "8x Turret 5MP", "Resolução": "3K (2880x1620)", "Visão Noturna": "ColorVu até 30m", "NVR": "8 Canais", "Armazenamento": "2TB HDD", "Monitoramento": "Cloud + Mobile"}',
        ARRAY['8 câmaras profissionais','5MP alta definição','Visão noturna a cores','NVR com cloud','Monitorização remota'],
        5.0, 23, 12, true, true, true
    FROM vendors v WHERE v.slug = 'techstore-maputo';
    
    INSERT INTO products (vendor_id, category_id, category, name, slug, description, short_description, price, old_price, stock, images, brand, model, specifications, features, rating, reviews_count, sales_count, featured, on_sale, is_active)
    SELECT 
        v.id,
        cctv_cat_id,
        'CCTV',
        'Câmara WiFi IP Ezviz C3N 3MP',
        'ezviz-c3n-3mp-wifi',
        'Câmara WiFi de interior/exterior com resolução 3MP, visão noturna a cores, deteção de movimento, áudio bidirecional. Fácil instalação sem cables de rede.',
        'Câmara WiFi 3MP com sirene',
        5500, 6500, 20,
        ARRAY['https://images.unsplash.com/photo-1557862921-37829c790f19?w=800'],
        'Ezviz',
        'C3N',
        '{"Resolução": "3MP (2304x1296)", "WiFi": "2.4GHz", "Visão Noturna": "A cores até 30m", "Áudio": "Bidirecional", "Sirene": "Incorporada", "Cartão SD": "Até 256GB"}',
        ARRAY['WiFi sem cabos','3MP HD','Visão noturna a cores','Áudio bidirecional','Sirene integrada','Fácil instalação'],
        4.6, 123, 89, false, true, true
    FROM vendors v WHERE v.slug = 'techstore-maputo';
    
    INSERT INTO products (vendor_id, category_id, category, name, slug, description, short_description, price, old_price, stock, images, brand, model, specifications, features, rating, reviews_count, sales_count, featured, on_sale, is_active)
    SELECT 
        v.id,
        cctv_cat_id,
        'CCTV',
        'Dome IP Uniview 4MP 2.8mm',
        'uniview-dome-4mp',
        'Câmara dome IP 4MP com lente wide 2.8mm para ângulo amplo, visão noturna IR, корпус IK10 resistente a vandalismo. Perfeita para tetos.',
        'Câmara Dome 4MP IK10',
        6800, NULL, 18,
        ARRAY['https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800'],
        'Uniview',
        'IPC314SR-DV',
        '{"Resolução": "4MP (2688x1520)", "Lente": "2.8mm wide angle", "Visão Noturna": "IR até 30m", "POE": "Sim", "Proteção": "IP67, IK10", "WDR": "120dB"}',
        ARRAY['4MP ultra HD','Lente wide 2.8mm','IK10 antivandalismo','WDR 120dB','POE integrado'],
        4.7, 56, 28, false, false, true
    FROM vendors v WHERE v.slug = 'techstore-maputo';
    
    INSERT INTO products (vendor_id, category_id, category, name, slug, description, short_description, price, old_price, stock, images, brand, model, specifications, features, rating, reviews_count, sales_count, featured, on_sale, is_active)
    SELECT 
        v.id,
        cctv_cat_id,
        'CCTV',
        'Monitor 24" Full HD para CCTV',
        'monitor-cctv-24-fhd',
        'Monitor LED 24 polegadas Full HD 1080p, ideal para sistemas de CCTV. Baixo consumo, formato 16:9, entrada HDMI e VGA.',
        'Monitor 24" FHD para vigilância',
        6500, NULL, 10,
        ARRAY['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800'],
        'Samsung',
        'S24F350',
        '{"Tamanho": "24 polegadas", "Resolução": "1920x1080 FHD", "Painel": "PLS", "Entradas": "HDMI + VGA", "Consumo": "25W", "Formato": "16:9"}',
        ARRAY['24 polegadas Full HD','Baixo consumo','HDMI + VGA','Ideial para CCTV','Pé ajustável'],
        4.5, 34, 15, false, false, true
    FROM vendors v WHERE v.slug = 'techstore-maputo';
    
    INSERT INTO products (vendor_id, category_id, category, name, slug, description, short_description, price, old_price, stock, images, brand, model, specifications, features, rating, reviews_count, sales_count, featured, on_sale, is_active)
    SELECT 
        v.id,
        cctv_cat_id,
        'CCTV',
        'HDD Surveillance 4TB para NVR/DVR',
        'hdd-surveillance-4tb',
        'Disco rígido específico para sistemas de vigilância, 4TB capacidade, optimized para gravação 24/7. Compatível com Hikvision, Dahua, Intelbras e outros.',
        'HDD 4TB para CCTV 24/7',
        4500, NULL, 25,
        ARRAY['https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800'],
        'Seagate',
        'SkyHawk ST4000VX',
        '{"Capacidade": "4TB", "Uso": "24/7 Surveillance", "Cache": "64MB", "RPM": "5400", "Interface": "SATA III", "Taxa transferência": "180 MB/s"}',
        ARRAY['4TB para CCTV','Otimizado 24/7','Compatível com NVR/DVR','Baixo consumo','3 anos garantia'],
        4.8, 67, 45, false, false, true
    FROM vendors v WHERE v.slug = 'techstore-maputo';
    
    INSERT INTO products (vendor_id, category_id, category, name, slug, description, short_description, price, old_price, stock, images, brand, model, specifications, features, rating, reviews_count, sales_count, featured, on_sale, is_active)
    SELECT 
        v.id,
        cctv_cat_id,
        'CCTV',
        'Cabo Rede CAT6 100m para CCTV IP',
        'cabo-cat6-100m-cctv',
        'Cabo de rede CAT6 de alta qualidade, 100 metros, adequado para câmaras IP, NVR e redes. Condutor de cobre sólido, resistente UV para uso exterior.',
        'CAT6 100m para câmaras IP',
        3500, NULL, 30,
        ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
        'UbiQuiti',
        'Cable-CAT6',
        '{"Tipo": "CAT6", "Comprimento": "100 metros", "Condutor": "Cobre sólido 23AWG", "Shielding": "UTP", "Outdoor": "Sim (UV resistant)", "Velocidade": "10Gbps"}',
        ARRAY['100 metros','Cobre sólido','Resistente UV','Exterior/interior','10Gbps'],
        4.6, 89, 67, false, false, true
    FROM vendors v WHERE v.slug = 'techstore-maputo';

END $$;

-- 4. Verificar produtos inseridos
SELECT name, price, stock, category FROM products WHERE category = 'CCTV' ORDER BY name;
