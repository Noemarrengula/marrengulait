-- ============================================================================
-- SCRIPT: Criar bucket para imagens de produtos
-- Executar no Supabase SQL Editor
-- ============================================================================

-- Criar bucket público para imagens de produtos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

-- Policy: permitir upload para utilizadores autenticados
DO $$ BEGIN
  CREATE POLICY "Allow authenticated uploads" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'products');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Policy: permitir atualização para utilizadores autenticados
DO $$ BEGIN
  CREATE POLICY "Allow authenticated updates" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'products')
    WITH CHECK (bucket_id = 'products');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Policy: permitir remoção para utilizadores autenticados
DO $$ BEGIN
  CREATE POLICY "Allow authenticated deletes" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'products');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Policy: permitir leitura pública
DO $$ BEGIN
  CREATE POLICY "Allow public read" ON storage.objects
    FOR SELECT TO public
    USING (bucket_id = 'products');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

SELECT '✅ Bucket products criado com sucesso!' AS status;
