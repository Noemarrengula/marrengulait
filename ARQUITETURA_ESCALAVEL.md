# 🏗️ Arquitetura Escalável E-commerce - Marrengula-IT

## 📋 Visão Geral

Esta é uma arquitetura de banco de dados **profissional e escalável** para e-commerce, projetada para suportar:

- ✅ **Múltiplos vendedores** (marketplace)
- ✅ **Milhões de produtos**
- ✅ **Alto volume de transações**
- ✅ **Performance otimizada**
- ✅ **Segurança robusta**
- ✅ **Fácil manutenção**

---

## 🗄️ Estrutura do Banco de Dados

### 📊 Estatísticas

- **40+ Tabelas** organizadas em módulos
- **100+ Índices** para performance
- **20+ Triggers** automáticos
- **15+ Funções** úteis
- **RLS completo** em todas as tabelas

### 🎯 Módulos Principais

#### 1. **Core - Usuários** (5 tabelas)
- `profiles` - Perfis de usuários
- `user_roles` - Roles com suporte a múltiplas roles
- `addresses` - Múltiplos endereços por usuário
- `notifications` - Sistema de notificações
- `search_queries` - Analytics de busca

#### 2. **Catálogo** (8 tabelas)
- `categories` - Categorias hierárquicas
- `brands` - Marcas
- `vendors` - Lojas/Vendedores
- `products` - Produtos principais
- `product_variants` - Variantes (cor, tamanho)
- `product_images` - Galeria de imagens
- `product_views` - Tracking de visualizações
- `abandoned_carts` - Carrinhos abandonados

#### 3. **Pedidos** (5 tabelas)
- `orders` - Pedidos principais
- `order_items` - Itens do pedido
- `order_status_history` - Histórico de status
- `payment_transactions` - Transações de pagamento
- Suporte a múltiplos métodos de pagamento

#### 4. **Avaliações** (3 tabelas)
- `reviews` - Avaliações de produtos
- `review_responses` - Respostas às avaliações
- `product_questions` - Perguntas e respostas

#### 5. **Marketing** (4 tabelas)
- `coupons` - Cupons de desconto avançados
- `coupon_usage` - Histórico de uso
- `banners` - Banners promocionais
- Suporte a diferentes tipos de desconto

#### 6. **Fidelidade** (2 tabelas)
- `loyalty_points` - Pontos de fidelidade
- `loyalty_transactions` - Histórico de pontos
- Sistema de tiers (Bronze → Diamond)

#### 7. **Afiliados** (2 tabelas)
- `affiliates` - Programa de afiliados
- `affiliate_commissions` - Comissões

#### 8. **Wishlist** (3 tabelas)
- `wishlists` - Listas de desejos
- `wishlist_items` - Itens das listas
- `favorites` - Favoritos rápidos

#### 9. **Alertas** (3 tabelas)
- `price_alerts` - Alertas de preço
- `stock_alerts` - Alertas de estoque
- Notificações automáticas

---

## 🚀 Recursos Avançados

### 1. **Tipos Customizados (ENUMs)**

```sql
user_role_type: customer, vendor, admin, support
order_status_type: pending, confirmed, processing, shipped, delivered, cancelled, refunded
payment_status_type: pending, processing, paid, failed, refunded
payment_method_type: mpesa, emola, bank_transfer, cash_on_delivery, credit_card
discount_type: percentage, fixed, free_shipping, buy_x_get_y
loyalty_tier_type: bronze, silver, gold, platinum, diamond
```

### 2. **Índices Inteligentes**

- **Índices compostos** para queries comuns
- **Índices parciais** para dados ativos
- **Full-text search** em português
- **GIN indexes** para arrays e JSONB

### 3. **Triggers Automáticos**

- ✅ Criar profile ao registrar usuário
- ✅ Gerar número de pedido único
- ✅ Atualizar contadores (rating, reviews, favoritos)
- ✅ Calcular totais automaticamente
- ✅ Registrar histórico de mudanças
- ✅ Atualizar estoque após pedido
- ✅ Atualizar tier de fidelidade

### 4. **Funções Úteis**

```sql
-- Promover usuário a admin
SELECT promote_to_admin('email@exemplo.com');

-- Adicionar pontos de fidelidade
SELECT add_loyalty_points(user_id, 100, 'Compra realizada', 'order', order_id);

-- Calcular rating de produto
SELECT calculate_product_rating(product_id);

-- Verificar se é admin
SELECT is_admin(user_id);

-- Gerar número de pedido
SELECT generate_order_number(); -- ORD-2024-000001
```

### 5. **Row Level Security (RLS)**

Segurança em nível de linha para:
- ✅ Usuários veem apenas seus dados
- ✅ Vendedores gerenciam apenas seus produtos
- ✅ Admins têm acesso total
- ✅ Produtos inativos ocultos de clientes
- ✅ Reviews não aprovadas ocultas

### 6. **Views Otimizadas**

```sql
-- Produtos com informações completas
SELECT * FROM products_full;

-- Pedidos com resumo
SELECT * FROM orders_summary;

-- Estatísticas de vendedor
SELECT * FROM vendor_stats;
```

---

## 📈 Escalabilidade

### Performance

1. **Índices Estratégicos**
   - Queries comuns otimizadas
   - Busca full-text rápida
   - Joins eficientes

2. **Desnormalização Controlada**
   - Contadores em cache (rating, reviews, sales)
   - Snapshots de dados (order_items)
   - Reduz joins em queries frequentes

3. **Particionamento Futuro**
   - Estrutura preparada para particionamento por data
   - Tabelas de histórico separáveis

### Manutenibilidade

1. **Código Limpo**
   - Nomes descritivos
   - Comentários em português
   - Organização modular

2. **Migrations Seguras**
   - `IF NOT EXISTS` em tudo
   - `DROP IF EXISTS` antes de criar
   - Rollback fácil

3. **Monitoramento**
   - Views de estatísticas
   - Logs de mudanças
   - Analytics integrado

---

## 🔒 Segurança

### Camadas de Segurança

1. **RLS (Row Level Security)**
   - Isolamento de dados por usuário
   - Políticas granulares
   - Proteção contra SQL injection

2. **Roles e Permissões**
   - Sistema de roles flexível
   - Múltiplas roles por usuário
   - Expiração de permissões

3. **Auditoria**
   - Histórico de mudanças
   - Logs de transações
   - Tracking de ações

4. **Validações**
   - Constraints no banco
   - Checks de integridade
   - Triggers de validação

---

## 📦 Instalação

### Passo 1: Executar Scripts

```bash
# 1. Abrir SQL Editor do Supabase
https://supabase.com/dashboard/project/jmefqzhoumdcgcxtdssu/sql

# 2. Executar na ordem:
# - database-schema-part1.sql (Tabelas)
# - database-schema-part2.sql (Índices, Triggers, Funções)
# - database-schema-part3.sql (RLS, Dados Iniciais)
```

### Passo 2: Criar Admin

```sql
SELECT promote_to_admin('seu-email@exemplo.com');
```

### Passo 3: Configurar Storage

```sql
-- Criar buckets
INSERT INTO storage.buckets (id, name, public) VALUES
('products', 'products', true),
('avatars', 'avatars', true),
('banners', 'banners', true);

-- Políticas de acesso
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id IN ('products', 'banners'));

CREATE POLICY "Authenticated Upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id IN ('products', 'avatars') 
  AND auth.role() = 'authenticated'
);
```

### Passo 4: Testar

```bash
npm run test:integration
npm run dev
```

---

## 🎯 Casos de Uso

### 1. Marketplace Multi-Vendor

```sql
-- Criar vendedor
INSERT INTO vendors (user_id, store_name, slug, description)
VALUES (auth.uid(), 'Minha Loja', 'minha-loja', 'Descrição da loja');

-- Adicionar produto
INSERT INTO products (vendor_id, title, price, stock, category_id)
VALUES (vendor_id, 'Produto Teste', 1000.00, 10, category_id);
```

### 2. Sistema de Fidelidade

```sql
-- Adicionar pontos após compra
SELECT add_loyalty_points(
  user_id, 
  100, 
  'Compra de MT 1000', 
  'order', 
  order_id
);

-- Verificar tier
SELECT tier, points, points_to_next_tier 
FROM loyalty_points 
WHERE user_id = auth.uid();
```

### 3. Cupons Avançados

```sql
-- Criar cupom de categoria específica
INSERT INTO coupons (
  code, 
  discount_type, 
  discount_value,
  applicable_to,
  applicable_ids
) VALUES (
  'NOTEBOOKS20',
  'percentage',
  20.00,
  'category',
  ARRAY[category_id]::UUID[]
);
```

### 4. Analytics

```sql
-- Produtos mais vendidos
SELECT p.title, p.sale_count, p.rating
FROM products p
WHERE p.is_active = true
ORDER BY p.sale_count DESC
LIMIT 10;

-- Vendedores top
SELECT * FROM vendor_stats
ORDER BY total_revenue DESC
LIMIT 10;

-- Buscas populares
SELECT query, COUNT(*) as count
FROM search_queries
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY query
ORDER BY count DESC
LIMIT 20;
```

---

## 🔄 Manutenção

### Backup

```bash
# Via Supabase CLI
supabase db dump -f backup.sql

# Ou via dashboard
# Settings → Database → Backup
```

### Otimização

```sql
-- Reindexar tabelas
REINDEX TABLE products;
REINDEX TABLE orders;

-- Atualizar estatísticas
ANALYZE products;
ANALYZE orders;

-- Limpar dados antigos
DELETE FROM product_views 
WHERE created_at < NOW() - INTERVAL '90 days';
```

### Monitoramento

```sql
-- Queries lentas
SELECT query, calls, mean_time
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

## 📚 Documentação Adicional

- **API Docs**: Gerado automaticamente pelo Supabase
- **Schema Diagram**: Use `dbdiagram.io` para visualizar
- **Postman Collection**: Disponível para testes

---

## 🎉 Pronto para Produção!

Esta arquitetura está pronta para:
- ✅ Milhares de produtos
- ✅ Centenas de vendedores
- ✅ Milhões de transações
- ✅ Crescimento sustentável
- ✅ Fácil manutenção

**Desenvolvido com ❤️ pela equipe Marrengula-IT**

---

*Última atualização: 2024*  
*Versão: 2.0.0 - Arquitetura Escalável*
