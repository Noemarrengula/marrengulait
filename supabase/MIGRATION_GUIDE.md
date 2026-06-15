# 🚀 Guia Rápido de Migração - Marrengula IT

## ⚡ Início Rápido (5 minutos)

### Passo 1: Acessar Supabase
```
https://supabase.com/dashboard/project/ynfnegxufykueofehvzm
```

### Passo 2: Abrir SQL Editor
Dashboard → SQL Editor → New Query

### Passo 3: Executar Migrações

#### 3.1 - Categorias
```sql
-- Copiar e colar: supabase/migrations/20250110000002_create_categories_system.sql
```
✅ Cria tabela `categories` com 5 categorias iniciais

#### 3.2 - Vendedores
```sql
-- Copiar e colar: supabase/migrations/20250110000003_create_vendors_system.sql
```
✅ Cria tabela `vendors` com workflow de aprovação

#### 3.3 - Produtos
```sql
-- Copiar e colar: supabase/migrations/20250110000004_create_products_system.sql
```
✅ Cria tabelas `products` e `product_images`

#### 3.4 - Avaliações
```sql
-- Copiar e colar: supabase/migrations/20250110000005_create_reviews_system.sql
```
✅ Cria tabelas `reviews` e `review_votes`

#### 3.5 - Favoritos
```sql
-- Copiar e colar: supabase/migrations/20250110000006_create_favorites_system.sql
```
✅ Cria tabela `favorites`

### Passo 4: Criar Admin
```sql
-- Após criar conta em /auth com email: noemarrengula1@gmail.com
SELECT public.promote_to_admin('noemarrengula1@gmail.com');
```

### Passo 5: Verificar
```sql
-- Ver tabelas criadas
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- Ver funções criadas
SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public' ORDER BY routine_name;
```

---

## ✅ Checklist de Verificação

Após aplicar todas as migrações, verificar:

- [ ] 11 tabelas criadas
- [ ] 15+ funções SQL disponíveis
- [ ] RLS ativado em todas as tabelas
- [ ] Categorias iniciais inseridas
- [ ] Admin criado e funcional

---

## 🔍 Testes Rápidos

### Testar Categorias
```sql
-- Ver categorias
SELECT * FROM public.categories;

-- Ver árvore de categorias
SELECT public.get_categories_tree();
```

### Testar Funções de Admin
```sql
-- Ver roles do admin
SELECT u.email, ur.role
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'noemarrengula1@gmail.com';
```

---

## 🐛 Troubleshooting

### Erro: "relation already exists"
**Solução:** Tabela já foi criada. Pular essa migração.

### Erro: "function does not exist"
**Solução:** Executar migração anterior que cria a função.

### Erro: "permission denied"
**Solução:** Verificar se está usando conta com permissões de admin no Supabase.

---

## 📚 Próximos Passos

Após aplicar migrações:

1. ✅ Criar tipos TypeScript para o frontend
2. ✅ Criar services para consumir APIs
3. ✅ Implementar interfaces de admin
4. ✅ Implementar painel de vendedor
5. ✅ Conectar frontend com backend

---

**Tempo estimado:** 5-10 minutos  
**Dificuldade:** Fácil  
**Pré-requisitos:** Acesso ao Supabase Dashboard
