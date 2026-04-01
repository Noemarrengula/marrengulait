# ⚡ Guia Rápido - Integração Supabase

## 🚀 Setup em 5 Minutos

### 1️⃣ Verificar Credenciais

```bash
# Verificar .env
cat .env

# Deve conter:
# VITE_SUPABASE_URL=https://jmefqzhoumdcgcxtdssu.supabase.co
# VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-completa
```

### 2️⃣ Executar SQL no Supabase

1. Acesse: https://supabase.com/dashboard/project/jmefqzhoumdcgcxtdssu/sql
2. Cole o conteúdo de: `setup-supabase-completo.sql`
3. Clique em **Run**

### 3️⃣ Configurar Storage

```sql
-- Execute no SQL Editor
-- Criar buckets
INSERT INTO storage.buckets (id, name, public) VALUES
('products', 'products', true),
('avatars', 'avatars', true),
('documents', 'documents', false);

-- Políticas de acesso
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "Authenticated Upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'products' AND auth.role() = 'authenticated'
);
```

### 4️⃣ Criar Admin

```sql
-- 1. Registre-se em: http://localhost:5173/auth
-- 2. Execute:
SELECT promote_to_admin('seu-email@exemplo.com');
```

### 5️⃣ Testar

```bash
# Instalar dependências
npm install

# Testar integração
node test-integration.js

# Iniciar app
npm run dev
```

---

## 📝 Comandos Úteis

### Verificar Tabelas

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

### Verificar RLS

```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

### Contar Registros

```sql
SELECT 
  (SELECT COUNT(*) FROM products) as produtos,
  (SELECT COUNT(*) FROM orders) as pedidos,
  (SELECT COUNT(*) FROM categories) as categorias,
  (SELECT COUNT(*) FROM user_roles) as usuarios;
```

### Listar Admins

```sql
SELECT u.email, ur.role 
FROM auth.users u
JOIN user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin';
```

### Promover Usuário

```sql
SELECT promote_to_admin('email@exemplo.com');
```

### Resetar Senha

```sql
-- No dashboard: Authentication → Users → Reset Password
```

---

## 🐛 Troubleshooting Rápido

### Erro: "Invalid API Key"
```bash
# Verificar chave no dashboard
# Settings → API → anon/public key
# Atualizar .env
```

### Erro: "relation does not exist"
```bash
# Executar: setup-supabase-completo.sql
```

### Erro: "Row Level Security"
```sql
-- Verificar políticas
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

### Erro: "CORS"
```bash
# Dashboard → Settings → API → CORS
# Adicionar: http://localhost:5173
```

---

## 📊 Inserir Dados de Teste

### Produtos

```sql
INSERT INTO products (title, description, price, stock, category, featured) VALUES
('Notebook Dell Inspiron', 'Intel i5, 8GB RAM, 256GB SSD', 45000, 10, 'Notebooks', true),
('Mouse Logitech MX', 'Mouse wireless ergonômico', 3500, 25, 'Acessórios', true),
('Teclado Mecânico', 'Switches Blue, RGB', 5500, 15, 'Acessórios', false),
('Monitor LG 29"', 'UltraWide IPS 2560x1080', 18000, 8, 'Hardware', true),
('SSD Samsung 1TB', 'NVMe M.2 3500MB/s', 8500, 20, 'Hardware', false);
```

### Categorias (já incluídas no setup)

```sql
-- Já criadas automaticamente
SELECT * FROM categories;
```

---

## 🔄 Atualizar Projeto

```bash
# Atualizar dependências
npm update

# Limpar cache
npm run build
rm -rf node_modules/.vite

# Reinstalar
npm install
```

---

## 📱 URLs Importantes

- **Dashboard**: https://supabase.com/dashboard/project/jmefqzhoumdcgcxtdssu
- **SQL Editor**: https://supabase.com/dashboard/project/jmefqzhoumdcgcxtdssu/sql
- **Auth**: https://supabase.com/dashboard/project/jmefqzhoumdcgcxtdssu/auth/users
- **Storage**: https://supabase.com/dashboard/project/jmefqzhoumdcgcxtdssu/storage/buckets
- **API Docs**: https://supabase.com/dashboard/project/jmefqzhoumdcgcxtdssu/api

---

## ✅ Checklist Rápido

- [ ] `.env` configurado
- [ ] SQL executado
- [ ] Storage configurado
- [ ] Admin criado
- [ ] Teste passou
- [ ] App rodando

---

## 🆘 Suporte

- 📖 Guia Completo: `INTEGRACAO_SUPABASE_COMPLETA.md`
- 🧪 Teste: `node test-integration.js`
- 📧 Email: info@marrengula-it.co.mz

---

**Tempo estimado: 5-10 minutos** ⏱️
