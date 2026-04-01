-- ============================================================================
-- CORREÇÃO DE ESTRUTURA - Adicionar Colunas Faltantes
-- Execute este script ANTES dos outros se já tem tabelas criadas
-- ============================================================================

-- ============================================================================
-- 1. ADICIONAR COLUNAS EM PROFILES
-- ============================================================================

DO $$ 
BEGIN
    -- phone
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'phone') THEN
        ALTER TABLE profiles ADD COLUMN phone TEXT;
    END IF;
    
    -- date_of_birth
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'date_of_birth') THEN
        ALTER TABLE profiles ADD COLUMN date_of_birth DATE;
    END IF;
    
    -- gender
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'gender') THEN
        ALTER TABLE profiles ADD COLUMN gender TEXT;
    END IF;
    
    -- bio
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'bio') THEN
        ALTER TABLE profiles ADD COLUMN bio TEXT;
    END IF;
    
    -- default_address_id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'default_address_id') THEN
        ALTER TABLE profiles ADD COLUMN default_address_id UUID;
    END IF;
    
    -- language
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'language') THEN
        ALTER TABLE profiles ADD COLUMN language TEXT DEFAULT 'pt-MZ';
    END IF;
    
    -- currency
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'currency') THEN
        ALTER TABLE profiles ADD COLUMN currency TEXT DEFAULT 'MZN';
    END IF;
    
    -- timezone
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'timezone') THEN
        ALTER TABLE profiles ADD COLUMN timezone TEXT DEFAULT 'Africa/Maputo';
    END IF;
    
    -- newsletter_subscribed
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'newsletter_subscribed') THEN
        ALTER TABLE profiles ADD COLUMN newsletter_subscribed BOOLEAN DEFAULT false;
    END IF;
    
    -- sms_notifications
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'sms_notifications') THEN
        ALTER TABLE profiles ADD COLUMN sms_notifications BOOLEAN DEFAULT true;
    END IF;
    
    -- email_notifications
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'email_notifications') THEN
        ALTER TABLE profiles ADD COLUMN email_notifications BOOLEAN DEFAULT true;
    END IF;
    
    -- metadata
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'metadata') THEN
        ALTER TABLE profiles ADD COLUMN metadata JSONB DEFAULT '{}';
    END IF;
    
    -- last_login_at
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'last_login_at') THEN
        ALTER TABLE profiles ADD COLUMN last_login_at TIMESTAMPTZ;
    END IF;
    
    RAISE NOTICE 'Tabela profiles atualizada com sucesso!';
END $$;

-- ============================================================================
-- 2. VERIFICAR E CRIAR TABELA ADDRESSES SE NÃO EXISTIR
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT,
  recipient_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT,
  country TEXT DEFAULT 'Moçambique',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. REMOVER ÍNDICE PROBLEMÁTICO SE EXISTIR
-- ============================================================================

DROP INDEX IF EXISTS idx_profiles_phone;

-- ============================================================================
-- 4. CRIAR ÍNDICES APENAS SE NÃO EXISTIREM
-- ============================================================================

DO $$ 
BEGIN
    -- Verificar se a coluna phone existe antes de criar índice
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'profiles' AND column_name = 'phone') THEN
        CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);

-- ============================================================================
-- 5. VERIFICAÇÃO FINAL
-- ============================================================================

-- Listar colunas de profiles
SELECT 
    'profiles' as tabela,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- ============================================================================
-- ✅ CORREÇÃO COMPLETA!
-- Agora você pode executar os scripts principais
-- ============================================================================
