-- Business Services Table
CREATE TABLE IF NOT EXISTS business.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  base_price DECIMAL(12,2) DEFAULT 0,
  price_basic DECIMAL(12,2) DEFAULT 0,
  price_professional DECIMAL(12,2) DEFAULT 0,
  price_enterprise DECIMAL(12,2) DEFAULT 0,
  unit TEXT DEFAULT 'unidade',
  duration_minutes INTEGER,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE business.services ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active services
CREATE POLICY "Allow read active services" ON business.services
  FOR SELECT USING (is_active = true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON business.services
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow admins to manage
CREATE POLICY "Allow admins manage" ON business.services
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Insert default services (ignore duplicates)
INSERT INTO business.services (code, name, description, category, base_price, price_basic, price_professional, price_enterprise, unit, duration_minutes, is_active, is_featured, sort_order) VALUES
('INST-REDE', 'Instalação de Rede', 'Configuração e instalação de redes corporativas', 'Redes', 5000, 5000, 10000, 25000, 'projeto', 480, true, true, 1),
('SUP-ON-SITE', 'Suporte Técnico On-Site', 'Suporte técnico presencial', 'Suporte', 1500, 1500, 3500, 8000, 'hora', 60, true, true, 2),
('SUP-REMOTO', 'Suporte Técnico Remoto', 'Suporte técnico via remoto', 'Suporte', 500, 500, 1500, 3500, 'hora', 60, true, true, 3),
('CONFIG-SERVIDOR', 'Configuração de Servidor', 'Instalação e configuração de servidores', 'Infraestrutura', 15000, 15000, 35000, 75000, 'projeto', 1440, true, true, 4),
('CCTV-INST', 'Instalação de CCTV', 'Sistema de cameras de segurança', 'Segurança', 8000, 8000, 18000, 40000, 'projeto', 720, true, true, 5),
('BACKUP-CLOUD', 'Solução Backup Cloud', 'Configuração de backup na nuvem', 'Armazenamento', 3000, 3000, 6000, 12000, 'mês', null, true, false, 6),
('CONS-IT', 'Consultoria IT', 'Consultoria em tecnologia da informação', 'Consultoria', 5000, 5000, 12000, 30000, 'projeto', 240, true, true, 7),
('SEG-REDE', 'Segurança de Rede', 'Firewall e proteção de rede', 'Segurança', 6000, 6000, 15000, 35000, 'projeto', 480, true, false, 8),
('MIG-DADOS', 'Migração de Dados', 'Migração e transferência de dados', 'Infraestrutura', 4000, 4000, 10000, 25000, 'projeto', 720, true, false, 9),
('MANUT-HW', 'Manutenção de Hardware', 'Manutenção preventiva e corretiva', 'Suporte', 1000, 1000, 2500, 5000, 'visita', null, true, false, 10),
('WIFI-EMPRESA', 'Rede WiFi Empresarial', 'Configuração WiFi para empresas', 'Redes', 4500, 4500, 10000, 22000, 'projeto', 360, true, true, 11),
('VOIP-SETUP', 'Configuração VoIP', 'Sistema de telefonia IP', 'Infraestrutura', 3500, 3500, 8000, 18000, 'projeto', 240, true, false, 12)
ON CONFLICT (code) DO NOTHING;