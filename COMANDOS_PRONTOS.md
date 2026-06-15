# 📋 Comandos Prontos - Copiar e Colar

## 🚀 Setup Inicial

### 1. Verificar Ambiente

```bash
# Verificar Node.js
node --version

# Verificar npm
npm --version

# Verificar .env
cat .env
```

### 2. Instalar Dependências

```bash
# Instalar todas as dependências
npm install

# Ou com yarn
yarn install

# Ou com pnpm
pnpm install
```

### 3. Testar Integração

```bash
# Executar teste de integração
npm run test:integration

# Ou diretamente
node test-integration.js
```

### 4. Iniciar Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Abrir no navegador
# http://localhost:5173
```

---

## 🗄️ SQL - Executar no Supabase Dashboard

### Setup Completo (Copie TODO o conteúdo)

```sql
-- Abra: https://supabase.com/dashboard/project/jmefqzhoumdcgcxtdssu/sql
-- Cole o conteúdo completo de: setup-supabase-completo.sql
-- Clique em: Run
```

### Comandos SQL Individuais

#### Verificar Tabelas

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

#### Verificar Políticas RLS

```sql
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

#### Contar Registros

```sql
SELECT 
  (SELECT COUNT(*) FROM products) as produtos,
  (SELECT COUNT(*) FROM orders) as pedidos,
  (SELECT COUNT(*) FROM categories) as categorias,
  (SELECT COUNT(*) FROM user_roles) as usuarios,
  (SELECT COUNT(*) FROM reviews) as avaliacoes;
```

#### Listar Admins

```sql
SELECT 
  u.email, 
  ur.role,
  ur.created_at
FROM auth.users u
JOIN user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin'
ORDER BY ur.created_at DESC;
```

#### Promover Usuário a Admin

```sql
-- Substitua 'seu-email@exemplo.com' pelo email real
SELECT promote_to_admin('seu-email@exemplo.com');
```

#### Criar Buckets de Storage

```sql
-- Criar buckets
INSERT INTO storage.buckets (id, name, public) VALUES
('products', 'products', true),
('avatars', 'avatars', true),
('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Políticas para products
CREATE POLICY "Public Access Products" ON storage.objects
FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "Authenticated Upload Products" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'products' AND auth.role() = 'authenticated'
);

-- Políticas para avatars
CREATE POLICY "Public Access Avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users Upload Own Avatar" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Inserir Produtos de Teste

```sql
INSERT INTO products (
  title, 
  description, 
  price, 
  stock, 
  category, 
  featured,
  store_name
) VALUES
('Notebook Dell Inspiron 15', 'Intel Core i5, 8GB RAM, 256GB SSD', 45000.00, 10, 'Notebooks', true, 'MarrengulaIT'),
('Mouse Logitech MX Master 3', 'Mouse wireless ergonômico', 3500.00, 25, 'Acessórios', true, 'MarrengulaIT'),
('Teclado Mecânico Keychron K2', 'Switches Blue, RGB', 5500.00, 15, 'Acessórios', false, 'MarrengulaIT'),
('Monitor LG UltraWide 29"', 'IPS 2560x1080 75Hz', 18000.00, 8, 'Hardware', true, 'MarrengulaIT'),
('SSD Samsung 970 EVO 1TB', 'NVMe M.2 3500MB/s', 8500.00, 20, 'Hardware', false, 'MarrengulaIT'),
('Headset HyperX Cloud II', 'Gaming 7.1 Surround', 4500.00, 12, 'Gaming', true, 'MarrengulaIT'),
('Webcam Logitech C920', 'Full HD 1080p', 2800.00, 18, 'Acessórios', false, 'MarrengulaIT'),
('Roteador TP-Link Archer C6', 'Dual Band AC1200', 3200.00, 15, 'Redes', false, 'MarrengulaIT');
```

#### Limpar Dados de Teste

```sql
-- ⚠️ CUIDADO: Isso apaga TODOS os dados!
TRUNCATE TABLE order_items CASCADE;
TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE reviews CASCADE;
TRUNCATE TABLE favorites CASCADE;
TRUNCATE TABLE product_questions CASCADE;
TRUNCATE TABLE price_alerts CASCADE;
TRUNCATE TABLE products CASCADE;

-- Resetar sequências
ALTER SEQUENCE IF EXISTS products_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS orders_id_seq RESTART WITH 1;
```

---

## 🔧 Comandos de Desenvolvimento

### Build

```bash
# Build de produção
npm run build

# Build de desenvolvimento
npm run build:dev

# Preview do build
npm run preview
```

### Lint

```bash
# Executar linter
npm run lint

# Corrigir automaticamente
npm run lint -- --fix
```

### Limpar Cache

```bash
# Limpar node_modules
rm -rf node_modules

# Limpar cache do Vite
rm -rf node_modules/.vite

# Reinstalar
npm install
```

---

## 🚀 Deploy

### Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy em produção
vercel --prod

# Adicionar variáveis de ambiente
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_PUBLISHABLE_KEY
```

### Netlify

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Deploy em produção
netlify deploy --prod

# Adicionar variáveis de ambiente
netlify env:set VITE_SUPABASE_URL "https://jmefqzhoumdcgcxtdssu.supabase.co"
netlify env:set VITE_SUPABASE_PUBLISHABLE_KEY "sua-chave"
```

---

## 🧪 Testes

### Teste de Integração

```bash
# Executar teste completo
npm run test:integration

# Com output detalhado
node test-integration.js
```

### Teste Manual

```bash
# 1. Iniciar app
npm run dev

# 2. Abrir navegador
# http://localhost:5173

# 3. Testar:
# - Registro de usuário
# - Login
# - Listagem de produtos
# - Adicionar ao carrinho
# - Checkout
# - Painel admin (se for admin)
```

---

## 🔍 Debug

### Verificar Logs

```bash
# Logs do Vite
npm run dev -- --debug

# Logs do build
npm run build -- --debug
```

### Verificar Conexão Supabase

```javascript
// Cole no console do navegador (F12)
const { data, error } = await supabase.from('products').select('count');
console.log('Conexão:', error ? 'ERRO' : 'OK', { data, error });
```

### Verificar Autenticação

```javascript
// Cole no console do navegador (F12)
const { data: { session } } = await supabase.auth.getSession();
console.log('Sessão:', session ? 'ATIVA' : 'INATIVA', session);
```

---

## 📊 Monitoramento

### Verificar Status do Supabase

```bash
# Abrir dashboard
open https://supabase.com/dashboard/project/jmefqzhoumdcgcxtdssu

# Verificar logs
open https://supabase.com/dashboard/project/jmefqzhoumdcgcxtdssu/logs/explorer
```

### Verificar Performance

```sql
-- Queries mais lentas
SELECT 
  query,
  calls,
  total_time,
  mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Tamanho das tabelas
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 🔄 Backup e Restore

### Backup

```bash
# Via Supabase CLI
supabase db dump -f backup.sql

# Ou via dashboard
# Settings → Database → Backup
```

### Restore

```bash
# Via Supabase CLI
supabase db reset
psql -h db.jmefqzhoumdcgcxtdssu.supabase.co -U postgres -d postgres -f backup.sql
```

---

## 🆘 Troubleshooting

### Erro: "Cannot find module"

```bash
# Limpar e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Invalid API Key"

```bash
# Verificar .env
cat .env

# Obter nova chave
# Dashboard → Settings → API → Copy anon/public key

# Atualizar .env
echo 'VITE_SUPABASE_PUBLISHABLE_KEY="nova-chave"' >> .env
```

### Erro: "CORS"

```sql
-- Adicionar URL no Supabase
-- Dashboard → Settings → API → CORS
-- Adicionar: http://localhost:5173
```

### Erro: "Row Level Security"

```sql
-- Verificar políticas
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Desabilitar temporariamente (NÃO EM PRODUÇÃO!)
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
```

---

## 📱 URLs Rápidas

```bash
# Dashboard Principal
open https://supabase.com/dashboard/project/jmefqzhoumdcgcxtdssu

# SQL Editor
open https://supabase.com/dashboard/project/jmefqzhoumdcgcxtdssu/sql

# Auth
open https://supabase.com/dashboard/project/jmefqzhoumdcgcxtdssu/auth/users

# Storage
open https://supabase.com/dashboard/project/jmefqzhoumdcgcxtdssu/storage/buckets

# API Docs
open https://supabase.com/dashboard/project/jmefqzhoumdcgcxtdssu/api

# Logs
open https://supabase.com/dashboard/project/jmefqzhoumdcgcxtdssu/logs/explorer
```

---

## ✅ Checklist Rápido

```bash
# Copie e cole para verificar tudo
echo "🔍 Verificando setup..."
echo ""

echo "✓ Node.js:" $(node --version)
echo "✓ npm:" $(npm --version)
echo ""

echo "✓ .env existe:" $(test -f .env && echo "SIM" || echo "NÃO")
echo "✓ node_modules existe:" $(test -d node_modules && echo "SIM" || echo "NÃO")
echo ""

echo "📦 Dependências:"
npm list --depth=0 | grep -E "(react|supabase|vite)" || echo "Instale com: npm install"
echo ""

echo "🧪 Teste de integração:"
echo "Execute: npm run test:integration"
echo ""

echo "🚀 Iniciar app:"
echo "Execute: npm run dev"
```

---

**💡 Dica**: Salve este arquivo e use como referência rápida!

**📖 Documentação Completa**: `INTEGRACAO_SUPABASE_COMPLETA.md`  
**⚡ Guia Rápido**: `GUIA_RAPIDO_SUPABASE.md`  
**✅ Checklist**: `CHECKLIST_INTEGRACAO.md`
