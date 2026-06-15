# 🗄️ Guia de Configuração do Supabase - Marrengula-IT

## 📋 Índice
1. [Criar Projeto no Supabase](#1-criar-projeto-no-supabase)
2. [Configurar Variáveis de Ambiente](#2-configurar-variáveis-de-ambiente)
3. [Criar Tabelas do Banco de Dados](#3-criar-tabelas-do-banco-de-dados)
4. [Configurar Autenticação](#4-configurar-autenticação)
5. [Testar Conexão](#5-testar-conexão)

---

## 1. Criar Projeto no Supabase

### Passo 1.1: Criar Conta
1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Faça login com GitHub, Google ou Email

### Passo 1.2: Criar Novo Projeto
1. Clique em "New Project"
2. Preencha:
   - **Name**: `marrengula-it`
   - **Database Password**: Crie uma senha forte (guarde-a!)
   - **Region**: Escolha a mais próxima (ex: `South America (São Paulo)`)
3. Clique em "Create new project"
4. Aguarde 2-3 minutos para o projeto ser criado

---

## 2. Configurar Variáveis de Ambiente

### Passo 2.1: Obter Credenciais
1. No dashboard do Supabase, vá em **Settings** → **API**
2. Copie:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** key (chave pública)

### Passo 2.2: Configurar .env
1. Na raiz do projeto, copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` e cole suas credenciais:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica-aqui
   ```

3. **IMPORTANTE**: Nunca commite o arquivo `.env` para o Git!

---

## 3. Criar Tabelas do Banco de Dados

### Passo 3.1: Acessar SQL Editor
1. No dashboard do Supabase, vá em **SQL Editor**
2. Clique em "New query"

### Passo 3.2: Executar Scripts SQL

#### 3.2.1 - Tabela de Produtos
```sql
-- Criar tabela de produtos
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  old_price DECIMAL(10, 2),
  image_url TEXT,
  category TEXT,
  brand TEXT,
  rating DECIMAL(2, 1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 0,
  store_name TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar índices para melhor performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Habilitar RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ler produtos
CREATE POLICY "Produtos são públicos" ON products
  FOR SELECT USING (true);

-- Política: Apenas admins podem inserir/atualizar/deletar
CREATE POLICY "Apenas admins podem modificar produtos" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );
```

#### 3.2.2 - Tabela de Favoritos
```sql
-- Criar tabela de favoritos
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, product_id)
);

-- Criar índice
CREATE INDEX idx_favorites_user_id ON favorites(user_id);

-- Habilitar RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Política: Usuários só veem seus próprios favoritos
CREATE POLICY "Usuários veem seus favoritos" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

-- Política: Usuários podem adicionar favoritos
CREATE POLICY "Usuários podem adicionar favoritos" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem remover favoritos
CREATE POLICY "Usuários podem remover favoritos" ON favorites
  FOR DELETE USING (auth.uid() = user_id);
```

#### 3.2.3 - Tabela de Pedidos
```sql
-- Criar tabela de pedidos
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_address JSONB NOT NULL,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar tabela de itens do pedido
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  product_snapshot JSONB NOT NULL
);

-- Criar índices
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Habilitar RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Políticas para orders
CREATE POLICY "Usuários veem seus pedidos" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar pedidos" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para order_items
CREATE POLICY "Usuários veem itens de seus pedidos" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );
```

#### 3.2.4 - Tabela de Serviços
```sql
-- Criar tabela de solicitações de serviços
CREATE TABLE service_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_type TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar índice
CREATE INDEX idx_service_requests_status ON service_requests(status);
CREATE INDEX idx_service_requests_created_at ON service_requests(created_at DESC);

-- Habilitar RLS
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- Política: Qualquer um pode criar solicitação
CREATE POLICY "Qualquer um pode solicitar serviço" ON service_requests
  FOR INSERT WITH CHECK (true);

-- Política: Apenas admins podem ver todas as solicitações
CREATE POLICY "Admins veem todas solicitações" ON service_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );
```

#### 3.2.5 - Tabela de Newsletter
```sql
-- Criar tabela de newsletter
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  active BOOLEAN DEFAULT true
);

-- Criar índice
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);

-- Habilitar RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Política: Qualquer um pode subscrever
CREATE POLICY "Qualquer um pode subscrever" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);
```

### Passo 3.3: Inserir Dados de Teste
```sql
-- Inserir produtos de exemplo
INSERT INTO products (title, description, price, old_price, image_url, category, brand, rating, reviews_count, stock, store_name, featured) VALUES
('Laptop HP ProBook 450 G10', 'Intel Core i7 13th Gen, 16GB RAM, 512GB SSD', 89999.00, 105000.00, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800', 'Laptops', 'HP', 4.5, 127, 15, 'TechStore Maputo', true),
('NVIDIA GeForce RTX 4070 Ti', '12GB GDDR6X', 72500.00, NULL, 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800', 'Hardware', 'NVIDIA', 5.0, 189, 8, 'Hardware Pro', true),
('Samsung 27" Monitor Curvo', '144Hz Gaming', 18900.00, 22000.00, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800', 'Monitores', 'Samsung', 4.0, 567, 23, 'Display Tech', false),
('Teclado Mecânico RGB Logitech', 'G915 TKL Wireless', 12500.00, NULL, 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800', 'Acessórios', 'Logitech', 5.0, 342, 45, 'Periféricos MZ', true);
```

---

## 4. Configurar Autenticação

### Passo 4.1: Habilitar Provedores
1. Vá em **Authentication** → **Providers**
2. Habilite:
   - ✅ Email (já habilitado por padrão)
   - ✅ Google (opcional)
   - ✅ GitHub (opcional)

### Passo 4.2: Configurar Email Templates
1. Vá em **Authentication** → **Email Templates**
2. Personalize os templates de:
   - Confirmação de email
   - Recuperação de senha
   - Convite

### Passo 4.3: Configurar URLs
1. Vá em **Authentication** → **URL Configuration**
2. Adicione:
   - **Site URL**: `http://localhost:5173` (desenvolvimento)
   - **Redirect URLs**: `http://localhost:5173/**`

---

## 5. Testar Conexão

### Passo 5.1: Verificar no Console
Abra o console do navegador e execute:
```javascript
import { supabase } from '@/integrations/supabase/client';

// Testar conexão
const { data, error } = await supabase.from('products').select('count');
console.log('Conexão:', data, error);
```

### Passo 5.2: Testar Autenticação
```javascript
// Criar usuário de teste
const { data, error } = await supabase.auth.signUp({
  email: 'teste@marrengula-it.co.mz',
  password: 'senha123456'
});
console.log('Usuário criado:', data, error);
```

---

## 📚 Recursos Adicionais

### Documentação Oficial
- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

### Comandos Úteis
```bash
# Instalar Supabase CLI (opcional)
npm install -g supabase

# Fazer backup do banco
supabase db dump > backup.sql

# Restaurar backup
supabase db restore backup.sql
```

---

## 🔒 Segurança

### Boas Práticas
1. ✅ Nunca exponha a `service_role` key no frontend
2. ✅ Use RLS (Row Level Security) em todas as tabelas
3. ✅ Valide dados no backend
4. ✅ Use HTTPS em produção
5. ✅ Implemente rate limiting
6. ✅ Monitore logs de acesso

### Checklist de Segurança
- [ ] RLS habilitado em todas as tabelas
- [ ] Políticas de acesso configuradas
- [ ] Variáveis de ambiente protegidas
- [ ] Backup automático configurado
- [ ] Monitoramento ativo

---

## 🚀 Próximos Passos

Após configurar o Supabase:
1. ✅ Testar autenticação
2. ✅ Implementar CRUD de produtos
3. ✅ Integrar favoritos
4. ✅ Implementar sistema de pedidos
5. ✅ Configurar storage para imagens

---

**Última Atualização:** [Data Atual]
**Versão:** 1.0.0
