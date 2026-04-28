-- ============================================================================
-- SCRIPT: Criar bucket para comprovativos de pagamento
-- Executar no Supabase SQL Editor
-- ============================================================================

-- Criar bucket público para comprovativos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment-proofs',
  'payment-proofs',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Policy para permitir upload de todos os utilizadores autenticados
DO $$ BEGIN
    CREATE POLICY "Allow authenticated uploads" ON storage.objects
      FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'payment-proofs');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Policy para permitir leitura pública dos comprovativos
DO $$ BEGIN
    CREATE POLICY "Allow public read" ON storage.objects
      FOR SELECT TO public
      USING (bucket_id = 'payment-proofs');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Adicionar coluna payment_proof à tabela orders
DO $$ BEGIN
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_proof_url TEXT;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_proof_data JSONB;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_reference TEXT;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

SELECT '✅ Bucket payment-proofs criado com sucesso!' AS status;
SELECT '✅ Colunas payment_proof_url, payment_proof_data, payment_reference adicionadas à tabela orders' AS info;
