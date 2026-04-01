-- ================================================
-- ATUALIZAR FOTOS DOS PRODUTOS CCTV
-- Fotos de fabricantes reais
-- Execute no Supabase SQL Editor
-- ================================================

-- Câmaras Bullet Hikvision 6MP ColorVu
UPDATE products SET images = ARRAY[
  'https://www.securitywholesalers.com.au/wp-content/uploads/2024/01/2CD2067G2H.png'
] WHERE name LIKE '%Bullet 6MP ColorVu%' OR slug = 'hikvision-bullet-6mp-colorvu';

-- Kit CCTV Intelbras 4 Câmaras
UPDATE products SET images = ARRAY[
  'https://images.tcdn.com.br/img/img_prod/430365/kit_4_cameras_de_seguranca_intelbras_720p_1_megapixel_2_bullet_2_dome_1120_dvr_4_canais_hd_250gb_572_1_616243f803b3932e17a0c91803be4584.jpg'
] WHERE name LIKE '%Kit CCTV Intelbras%' OR slug = 'kit-cctv-intelbras-4cam-1080p';

-- Kit CCTV 8 Câmaras
UPDATE products SET images = ARRAY[
  'https://zicaigrupo.com/wp-content/uploads/2025/03/s-l1200.jpg'
] WHERE name LIKE '%Kit CCTV 8%' OR slug = 'kit-cctv-8cam-5mp';

-- Câmaras IP Dome
UPDATE products SET images = ARRAY[
  'https://zicaigrupo.com/wp-content/uploads/2025/03/311322068.jpg'
] WHERE name LIKE '%Dome%' OR slug = 'hikvision-ip-4mp-dome';

-- NVR 8 Canais
UPDATE products SET images = ARRAY[
  'https://cctv-direct.co.za/cdn/shop/files/26_45291cd0-c243-42c4-ae79-d41079402d6a.png?v=1769677117'
] WHERE name LIKE '%NVR 8%' OR slug = 'hikvision-nvr-8ch-4k';

-- Câmaras WiFi Ezviz
UPDATE products SET images = ARRAY[
  'https://megateh.eu/files/products/00/51/28/c3n.jpg'
] WHERE name LIKE '%WiFi%' OR name LIKE '%Ezviz%' OR slug = 'ezviz-c3n-3mp-wifi';

-- Uniview Dome
UPDATE products SET images = ARRAY[
  'https://www.touchwindow.com/mm5/graphics/00000001/gvision/C24BD-AU-4000.jpg'
] WHERE name LIKE '%Uniview%' OR slug = 'uniview-dome-4mp';

-- Monitor CCTV
UPDATE products SET images = ARRAY[
  'https://m.media-amazon.com/images/I/71NFiInyseL._AC_UF894,1000_QL80_.jpg'
] WHERE name LIKE '%Monitor%' OR slug = 'monitor-cctv-24-fhd';

-- Verificar resultado
SELECT name, images FROM products WHERE category = 'CCTV';
