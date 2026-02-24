# 📚 Documentação do Backend - Marrengula IT Marketplace

## 🎯 Visão Geral

Backend completo para marketplace e-commerce construído com Supabase (PostgreSQL).
Sistema modular implementado em 5 fases com segurança RLS, triggers automáticos e funções SQL otimizadas.

---

## 📋 Índice

1. [Arquitetura](#arquitetura)
2. [Migrações](#migrações)
3. [Tabelas](#tabelas)
4. [Funções SQL](#funções-sql)
5. [Segurança (RLS)](#segurança-rls)
6. [Como Aplicar](#como-aplicar)
7. [Fluxos de Uso](#fluxos-de-uso)

---

## 🏗️ Arquitetura

### Estrutura de Dados
```
users (auth.users)
├── profiles
├── user_roles (admin, vendor, user)
├── vendors (lojas)
│   └── products
│       ├── product_images
│       ├── reviews
│       └── favorites
├── orders
│   └── order_items
└── categories
```

### Tecnologias
- **Database:** PostgreSQL (Supabase)
- **Segurança:** Row Level Security (RLS)
- **Automação:** Triggers e Functions
- **Busca:** Full-text search (português)

---

## 📦 Migrações

### Ordem de Execução

| # | Arquivo | Descrição | Dependências |
|---|---------|-----------|--------------|
| 1 | `20251119121911_*.sql` | Autenticação e Roles | - |
| 2 | `20250110000000_*.sql` | Sistema de Pedidos | Roles |
| 3 | `20250110000001_*.sql` | Credenciais Admin | Roles |
| 4 | `20250110000002_*.sql` | Categorias | - |
| 5 | `20250110000003_*.sql` | Vendedores/Lojas | Roles |
| 6 | `20250110000004_*.sql` | Produtos | Categorias, Vendedores |
| 7 | `20250110000005_*.sql` | Avaliações | Produtos, Pedidos |
| 8 | `20250110000006_*.sql` | Favoritos | Produtos |

---

## 🗄️ Tabelas

### 1. **profiles** (Autenticação)
Perfis de usuários do sistema.

**Campos principais:**
- `user_id` - Referência para auth.users
- `full_name` - Nome completo
- `avatar_url` - Foto de perfil

**RLS:** Usuários veem apenas seu próprio perfil.

---

### 2. **user_roles** (Autenticação)
Roles/permissões dos usuários.

**Roles disponíveis:**
- `admin` - Acesso total ao sistema
- `vendor` - Pode gerenciar loja e produtos
- `user` - Cliente comum (padrão)

**RLS:** Usuários veem suas próprias roles, admins veem todas.

---

### 3. **categories** (Fase 1)
Categorias e subcategorias de produtos.

**Campos principais:**
- `name` - Nome da categoria
- `slug` - URL amigável (ex: "eletronicos")
- `parent_id` - Para subcategorias (hierarquia)
- `icon` - Nome do ícone Lucide
- `display_order` - Ordem de exibição

**Dados iniciais:**
- 5 categorias principais
- 3 subcategorias de Eletrônicos

**RLS:** Todos veem categorias ativas, admins gerenciam.

---

### 4. **vendors** (Fase 2)
Lojas/vendedores do marketplace.

**Campos principais:**
- `owner_id` - Proprietário (usuário)
- `store_name` - Nome da loja
- `slug` - URL da loja
- `status` - pending, approved, rejected, suspended
- `rating` - Avaliação (0-5)
- `commission_rate` - Taxa de comissão (%)

**Workflow:**
1. Usuário solicita criar loja (status: pending)
2. Admin aprova/rejeita
3. Se aprovado, ganha role 'vendor'

**RLS:** Todos veem lojas aprovadas, vendedores veem sua loja, admins veem todas.

---

### 5. **products** (Fase 3)
Produtos do marketplace.

**Campos principais:**
- `vendor_id` - Loja proprietária
- `category_id` - Categoria
- `name`, `slug`, `description`
- `price`, `compare_at_price` - Preços
- `sku`, `stock_quantity` - Estoque
- `variants` (JSONB) - Tamanhos, cores, etc
- `specifications` (JSONB) - Specs técnicas
- `rating`, `review_count`, `sales_count`

**Exemplo de variantes:**
```json
[
  {"name": "Tamanho", "values": ["P", "M", "G"]},
  {"name": "Cor", "values": ["Preto", "Branco"]}
]
```

**RLS:** Todos veem produtos ativos, vendedores gerenciam seus produtos.

---

### 6. **product_images** (Fase 3)
Múltiplas imagens por produto.

**Campos principais:**
- `product_id` - Produto
- `image_url` - URL da imagem
- `is_primary` - Imagem principal
- `display_order` - Ordem

**Constraint:** Apenas 1 imagem primária por produto.

---

### 7. **orders** (Já existente)
Pedidos dos clientes.

**Campos principais:**
- `user_id` - Cliente
- `order_number` - Número único
- `status` - pending, confirmed, processing, shipped, delivered, cancelled
- `payment_status` - pending, paid, failed, refunded
- `payment_method` - mpesa, bank_transfer, cash_on_delivery
- `total_amount` - Valor total

---

### 8. **order_items** (Já existente)
Itens dos pedidos.

**Campos principais:**
- `order_id` - Pedido
- `product_id` - Produto
- `quantity` - Quantidade
- `unit_price`, `total_price`

---

### 9. **reviews** (Fase 4)
Avaliações de produtos.

**Campos principais:**
- `product_id`, `user_id`, `order_id`
- `rating` (1-5)
- `title`, `comment`
- `images` (JSONB) - Fotos do cliente
- `is_verified_purchase` - Compra verificada
- `helpful_count`, `unhelpful_count`
- `vendor_response` - Resposta do vendedor

**Constraint:** 1 avaliação por usuário por produto.

**Automação:** Rating do produto atualizado automaticamente via trigger.

---

### 10. **review_votes** (Fase 4)
Votos de utilidade nas avaliações.

**Campos principais:**
- `review_id` - Avaliação
- `user_id` - Usuário que votou
- `is_helpful` - true = útil, false = não útil

**Constraint:** 1 voto por usuário por avaliação.

---

### 11. **favorites** (Fase 5)
Lista de desejos dos usuários.

**Campos principais:**
- `user_id` - Usuário
- `product_id` - Produto favoritado

**Constraint:** 1 favorito por usuário por produto.

---

## ⚙️ Funções SQL

### Categorias
- `get_categories_tree()` - Retorna árvore de categorias com subcategorias

### Vendedores
- `approve_vendor(vendor_id, admin_id)` - Aprova loja
- `reject_vendor(vendor_id, admin_id, reason)` - Rejeita loja
- `suspend_vendor(vendor_id, admin_id, reason)` - Suspende loja

### Produtos
- `search_products(...)` - Busca com filtros avançados
- `update_product_stats()` - Atualiza estatísticas (trigger)

### Pedidos
- `generate_order_number()` - Gera número único
- `create_order(...)` - Cria pedido completo

### Avaliações
- `update_product_rating()` - Atualiza rating (trigger)
- `update_review_vote_counts()` - Atualiza votos (trigger)
- `user_purchased_product(user_id, product_id)` - Verifica compra
- `get_product_reviews(product_id)` - Lista avaliações

### Favoritos
- `toggle_favorite(user_id, product_id)` - Adiciona/remove
- `is_favorite(user_id, product_id)` - Verifica se está favoritado
- `get_user_favorites(user_id)` - Lista favoritos
- `count_product_favorites(product_id)` - Conta favoritos

### Admin
- `promote_to_admin(email)` - Promove usuário a admin

---

## 🔒 Segurança (RLS)

### Princípios
- **RLS ativado** em todas as tabelas
- **Políticas específicas** por role
- **SECURITY DEFINER** em funções sensíveis

### Políticas Comuns

**Leitura pública:**
- Categorias ativas
- Produtos ativos e publicados
- Lojas aprovadas
- Avaliações aprovadas

**Leitura autenticada:**
- Próprios dados (perfil, pedidos, favoritos)
- Vendedores veem seus produtos/loja
- Admins veem tudo

**Escrita:**
- Usuários: próprios dados
- Vendedores: própria loja e produtos
- Admins: tudo

---

## 🚀 Como Aplicar

### 1. Acessar Supabase Dashboard
```
https://supabase.com/dashboard/project/[PROJECT_ID]
```

### 2. Abrir SQL Editor
Dashboard → SQL Editor → New Query

### 3. Executar Migrações na Ordem
Copiar e colar conteúdo de cada arquivo na ordem:

```sql
-- 1. Autenticação (se ainda não aplicado)
-- 2. Pedidos (se ainda não aplicado)
-- 3. Admin credentials
-- 4. Categorias
-- 5. Vendedores
-- 6. Produtos
-- 7. Avaliações
-- 8. Favoritos
```

### 4. Criar Primeiro Admin
```sql
-- Após criar conta em /auth
SELECT public.promote_to_admin('noemarrengula1@gmail.com');
```

### 5. Verificar
```sql
-- Ver todas as tabelas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Ver funções
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public';
```

---

## 🔄 Fluxos de Uso

### Fluxo de Vendedor
1. Usuário cria conta → role 'user'
2. Solicita criar loja → status 'pending'
3. Admin aprova → status 'approved' + role 'vendor'
4. Vendedor cria produtos
5. Produtos aparecem no marketplace

### Fluxo de Compra
1. Cliente adiciona produtos ao carrinho
2. Finaliza compra → cria order
3. Escolhe método de pagamento
4. Admin/Vendedor atualiza status
5. Cliente pode avaliar após entrega

### Fluxo de Avaliação
1. Cliente compra produto
2. Pedido entregue
3. Cliente cria avaliação
4. Rating do produto atualizado automaticamente
5. Outros usuários votam se útil

### Fluxo de Favoritos
1. Cliente favorita produto
2. Produto salvo na lista de desejos
3. Cliente pode ver todos favoritos
4. Toggle para adicionar/remover

---

## 📊 Estatísticas do Backend

- **11 tabelas** principais
- **15+ funções SQL** utilitárias
- **20+ triggers** automáticos
- **40+ políticas RLS**
- **30+ índices** de performance
- **Full-text search** em português
- **JSONB** para dados flexíveis

---

## 🎓 Boas Práticas Implementadas

✅ **Segurança:**
- RLS em todas as tabelas
- Validação de dados (constraints)
- Funções SECURITY DEFINER quando necessário

✅ **Performance:**
- Índices em campos frequentes
- Full-text search otimizado
- Triggers eficientes

✅ **Manutenibilidade:**
- Código comentado
- Funções reutilizáveis
- Estrutura modular

✅ **Escalabilidade:**
- JSONB para dados flexíveis
- Hierarquia de categorias
- Sistema de variantes

---

## 📞 Suporte

Para dúvidas sobre o backend:
1. Consultar esta documentação
2. Ver comentários nos arquivos SQL
3. Verificar políticas RLS no Supabase Dashboard

---

**Última atualização:** 10 de Janeiro de 2025  
**Versão:** 1.0.0  
**Projeto:** Marrengula IT Marketplace
