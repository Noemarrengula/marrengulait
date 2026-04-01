# 🚀 Integração Completa com Supabase - Marrengula-IT

## 📋 Status Atual

✅ Cliente Supabase configurado  
✅ Variáveis de ambiente definidas  
✅ Migrações SQL criadas  
⚠️ Precisa executar migrações no Supabase  
⚠️ Precisa configurar Storage  
⚠️ Precisa configurar Auth  

---

## 🎯 Passo 1: Verificar Configuração Atual

### 1.1 Verificar .env

Seu arquivo `.env` está configurado:
```env
VITE_SUPABASE_PROJECT_ID="jmefqzhoumdcgcxtdssu"
VITE_SUPABASE_URL="https://jmefqzhoumdcgcxtdssu.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable_6EUZKv42fC6vzueNMoo9aw_umL2MWqX"
```

⚠️ **IMPORTANTE**: A chave parece estar incompleta. Verifique no Supabase Dashboard.

### 1.2 Acessar Supabase Dashboard

1. Acesse: https://supabase.com/dashboard
2. Selecione o projeto: `jmefqzhoumdcgcxtdssu`
3. Vá em **Settings** → **API**
4. Copie a **anon/public key** completa

---

## 🗄️ Passo 2: Executar Migrações SQL

### 2.1 Ordem de Execução

Execute as migrações na seguinte ordem no **SQL Editor** do Supabase:

#### 1️⃣ Sistema de Pedidos
```bash
supabase/migrations/20250110000000_create_orders_system.sql
```

#### 2️⃣ Credenciais Admin
```bash
supabase/migrations/20250110000001_setup_admin_credentials.sql
```

#### 3️⃣ Sistema de Categorias
```bash
supabase/migrations/20250110000002_create_categories_system.sql
```

#### 4️⃣ Sistema de Vendedores
```bash
supabase/migrations/20250110000003_create_vendors_system.sql
```

#### 5️⃣ Sistema de Produtos
```bash
supabase/migrations/20250110000004_create_products_system.sql
```

#### 6️⃣ Sistema de Avaliações
```bash
supabase/migrations/20250110000005_create_reviews_system.sql
```

#### 7️⃣ Sistema de Favoritos
```bash
supabase/migrations/20250110000006_create_favorites_system.sql
```

#### 8️⃣ Melhorias no Sistema de Roles
```bash
supabase/migrations/20250219_improve_role_system.sql
```

### 2.2 Como Executar

1. Acesse: https://supabase.com/dashboard/project/jmefqzhoumdcgcxtdssu/sql
2. Clique em **New Query**
3. Copie o conteúdo de cada arquivo SQL
4. Cole no editor
5. Clique em **Run**
6. Verifique se não há erros

---

## 🔐 Passo 3: Configurar Autenticação

### 3.1 Habilitar Providers

1. Vá em **Authentication** → **Providers**
2. Habilite:
   - ✅ Email/Password
   - ✅ Magic Link (opcional)

### 3.2 Configurar Email Templates

1. Vá em **Authentication** → **Email Templates**
2. Personalize os templates:
   - **Confirm Signup**: Email de confirmação
   - **Reset Password**: Recuperação de senha
   - **Magic Link**: Login sem senha

### 3.3 Configurar URLs de Redirecionamento

1. Vá em **Authentication** → **URL Configuration**
2. Adicione:
   ```
   Site URL: http://localhost:5173
   Redirect URLs:
   - http://localhost:5173/auth/callback
   - http://localhost:5173/reset-password
   - https://seu-dominio.com/auth/callback (produção)
   - https://seu-dominio.com/reset-password (produção)
   ```

---

## 📦 Passo 4: Configurar Storage

### 4.1 Criar Buckets

1. Vá em **Storage** → **Create Bucket**
2. Crie os seguintes buckets:

#### Bucket: `products`
- **Public**: ✅ Sim
- **Allowed MIME types**: `image/jpeg, image/png, image/webp`
- **Max file size**: 5MB

#### Bucket: `avatars`
- **Public**: ✅ Sim
- **Allowed MIME types**: `image/jpeg, image/png`
- **Max file size**: 2MB

#### Bucket: `documents`
- **Public**: ❌ Não
- **Allowed MIME types**: `application/pdf, image/*`
- **Max file size**: 10MB

### 4.2 Configurar Políticas de Storage

Execute no SQL Editor:

```sql
-- Política para produtos (público)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'products' 
  AND auth.role() = 'authenticated'
);

-- Política para avatars
CREATE POLICY "Avatar Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## 👤 Passo 5: Criar Usuário Admin

### 5.1 Criar Conta

Execute no SQL Editor:

```sql
-- Criar função para promover admin
CREATE OR REPLACE FUNCTION promote_to_admin(user_email TEXT)
RETURNS void AS $$
DECLARE
  user_uuid UUID;
BEGIN
  -- Buscar UUID do usuário
  SELECT id INTO user_uuid
  FROM auth.users
  WHERE email = user_email;

  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado: %', user_email;
  END IF;

  -- Inserir ou atualizar role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (user_uuid, 'admin')
  ON CONFLICT (user_id) 
  DO UPDATE SET role = 'admin', updated_at = NOW();

  RAISE NOTICE 'Usuário % promovido a admin com sucesso!', user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 5.2 Registrar e Promover

1. Acesse: http://localhost:5173/auth
2. Registre-se com: `admin@marrengula-it.co.mz`
3. Confirme o email
4. Execute no SQL Editor:
   ```sql
   SELECT promote_to_admin('admin@marrengula-it.co.mz');
   ```

---

## 🧪 Passo 6: Testar Integração

### 6.1 Criar Script de Teste

Crie: `test-supabase-integration.js`

```javascript
import { supabase } from './src/integrations/supabase/client.js';

async function testIntegration() {
  console.log('🧪 Testando integração Supabase...\n');

  // 1. Testar conexão
  console.log('1️⃣ Testando conexão...');
  const { data: healthCheck, error: healthError } = await supabase
    .from('profiles')
    .select('count')
    .limit(1);
  
  if (healthError) {
    console.error('❌ Erro de conexão:', healthError.message);
    return;
  }
  console.log('✅ Conexão OK\n');

  // 2. Testar autenticação
  console.log('2️⃣ Testando autenticação...');
  const { data: { session } } = await supabase.auth.getSession();
  console.log(session ? '✅ Sessão ativa' : '⚠️ Sem sessão\n');

  // 3. Testar produtos
  console.log('3️⃣ Testando produtos...');
  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('*')
    .limit(5);
  
  if (prodError) {
    console.error('❌ Erro:', prodError.message);
  } else {
    console.log(`✅ ${products.length} produtos encontrados\n`);
  }

  // 4. Testar categorias
  console.log('4️⃣ Testando categorias...');
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*');
  
  if (catError) {
    console.error('❌ Erro:', catError.message);
  } else {
    console.log(`✅ ${categories.length} categorias encontradas\n`);
  }

  // 5. Testar pedidos
  console.log('5️⃣ Testando pedidos...');
  const { data: orders, error: ordError } = await supabase
    .from('orders')
    .select('*')
    .limit(5);
  
  if (ordError) {
    console.error('❌ Erro:', ordError.message);
  } else {
    console.log(`✅ ${orders.length} pedidos encontrados\n`);
  }

  console.log('✅ Teste completo!');
}

testIntegration();
```

### 6.2 Executar Teste

```bash
node test-supabase-integration.js
```

---

## 📊 Passo 7: Popular Banco de Dados

### 7.1 Inserir Categorias

```sql
INSERT INTO categories (name, slug, description, icon) VALUES
('Hardware', 'hardware', 'Componentes e periféricos', '💻'),
('Software', 'software', 'Programas e licenças', '💿'),
('Smartphones', 'smartphones', 'Celulares e acessórios', '📱'),
('Notebooks', 'notebooks', 'Laptops e ultrabooks', '💻'),
('Acessórios', 'acessorios', 'Cabos, cases e mais', '🔌'),
('Gaming', 'gaming', 'Equipamentos para gamers', '🎮'),
('Redes', 'redes', 'Equipamentos de rede', '🌐'),
('Servidores', 'servidores', 'Servidores e storage', '🖥️');
```

### 7.2 Inserir Produtos de Exemplo

```sql
INSERT INTO products (
  title, 
  description, 
  price, 
  stock, 
  category, 
  image_url,
  featured,
  store_name
) VALUES
(
  'Notebook Dell Inspiron 15',
  'Intel Core i5, 8GB RAM, 256GB SSD, Tela 15.6"',
  45000.00,
  10,
  'Notebooks',
  'https://via.placeholder.com/400x300?text=Dell+Inspiron',
  true,
  'MarrengulaIT'
),
(
  'Mouse Logitech MX Master 3',
  'Mouse wireless ergonômico para produtividade',
  3500.00,
  25,
  'Acessórios',
  'https://via.placeholder.com/400x300?text=Logitech+MX',
  true,
  'MarrengulaIT'
),
(
  'Teclado Mecânico Keychron K2',
  'Teclado mecânico wireless, switches Blue',
  5500.00,
  15,
  'Acessórios',
  'https://via.placeholder.com/400x300?text=Keychron+K2',
  false,
  'MarrengulaIT'
),
(
  'Monitor LG UltraWide 29"',
  'Monitor 29" IPS, 2560x1080, 75Hz',
  18000.00,
  8,
  'Hardware',
  'https://via.placeholder.com/400x300?text=LG+UltraWide',
  true,
  'MarrengulaIT'
),
(
  'SSD Samsung 970 EVO 1TB',
  'SSD NVMe M.2, leitura 3500MB/s',
  8500.00,
  20,
  'Hardware',
  'https://via.placeholder.com/400x300?text=Samsung+SSD',
  false,
  'MarrengulaIT'
);
```

---

## 🔄 Passo 8: Configurar Realtime

### 8.1 Habilitar Realtime

1. Vá em **Database** → **Replication**
2. Habilite para as tabelas:
   - ✅ products
   - ✅ orders
   - ✅ reviews
   - ✅ product_questions

### 8.2 Testar Realtime

```typescript
// No seu componente React
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

useEffect(() => {
  const channel = supabase
    .channel('products-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'products' },
      (payload) => {
        console.log('Produto atualizado:', payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

---

## 🛡️ Passo 9: Configurar Row Level Security (RLS)

### 9.1 Verificar Políticas

Execute para verificar:

```sql
-- Ver todas as políticas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### 9.2 Políticas Essenciais

```sql
-- Produtos: Todos podem ler, apenas autenticados podem criar
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
ON products FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert products"
ON products FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Pedidos: Usuários veem apenas seus pedidos
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
ON orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admin pode ver tudo
CREATE POLICY "Admins can view all orders"
ON orders FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);
```

---

## 📱 Passo 10: Testar no Frontend

### 10.1 Iniciar Aplicação

```bash
npm run dev
```

### 10.2 Checklist de Testes

- [ ] Página inicial carrega produtos
- [ ] Registro de usuário funciona
- [ ] Login funciona
- [ ] Logout funciona
- [ ] Adicionar ao carrinho funciona
- [ ] Criar pedido funciona
- [ ] Painel admin acessível (para admin)
- [ ] Upload de imagens funciona
- [ ] Favoritos funcionam
- [ ] Avaliações funcionam

---

## 🚀 Passo 11: Deploy

### 11.1 Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Adicionar variáveis de ambiente
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_PUBLISHABLE_KEY
```

### 11.2 Atualizar URLs no Supabase

Após deploy, adicione a URL de produção em:
- **Authentication** → **URL Configuration**
- **API Settings** → **CORS**

---

## 📚 Recursos Adicionais

### Documentação
- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

### Arquivos de Referência
- `SUPABASE_SETUP.md` - Setup detalhado
- `supabase/BACKEND_DOCUMENTATION.md` - Documentação do backend
- `supabase/MIGRATION_GUIDE.md` - Guia de migrações

---

## 🆘 Troubleshooting

### Erro: "Invalid API Key"
- Verifique se a chave no `.env` está completa
- Confirme que está usando a **anon/public key**

### Erro: "relation does not exist"
- Execute as migrações SQL na ordem correta
- Verifique se todas foram executadas sem erros

### Erro: "Row Level Security"
- Verifique as políticas RLS
- Confirme que o usuário está autenticado

### Erro: "CORS"
- Adicione a URL do frontend nas configurações do Supabase
- Verifique **API Settings** → **CORS**

---

## ✅ Checklist Final

- [ ] Variáveis de ambiente configuradas
- [ ] Todas as migrações executadas
- [ ] Autenticação configurada
- [ ] Storage configurado
- [ ] Usuário admin criado
- [ ] Produtos de exemplo inseridos
- [ ] RLS configurado
- [ ] Realtime habilitado
- [ ] Testes passando
- [ ] Deploy realizado

---

**🎉 Parabéns! Sua integração com Supabase está completa!**

Para suporte: info@marrengula-it.co.mz
