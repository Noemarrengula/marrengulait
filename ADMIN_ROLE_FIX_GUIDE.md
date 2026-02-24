# ⚠️ RESOLUÇÃO: Problema de Admin Não Reconhecido no Supabase

## 🔍 O Problema
Users admin registrados no Supabase não estão sendo reconhecidos como admin, resultando em:
- Painel de admin não aparecendo
- `isAdmin` sempre `false`
- Erro de acesso negado com permissões insuficientes

## 🎯 Causa Raiz
Usuários admin não possuem um registro na tabela `user_roles` com role `admin`, ou o registro foi criado com role `user` por padrão.

A tabela `user_roles` é criada automaticamente para novos usuários via trigger `on_auth_user_created`, mas:
- Usuários criados ANTES da criação da tabela não têm registros
- Usuários criados diretamente no Supabase (sem passar pelo app) podem não ter registros
- A trigger pode ter falhado em alguns casos

## ✅ Solução (3 Passos)

### PASSO 1: Identificar o usuário admin no Supabase

1. Acesse **Supabase Dashboard** → seu projeto
2. Vá para **SQL Editor** → **New Query**
3. Cole este SQL:

```sql
-- Lista todos os usuários e seus roles atuais
SELECT 
  u.id,
  u.email,
  u.created_at,
  STRING_AGG(ur.role::text, ', ') as current_roles
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
GROUP BY u.id, u.email, u.created_at
ORDER BY u.created_at ASC;
```

4. **Execute a query** e anote:
   - O **email** do usuário admin
   - O **UUID** (id) do usuário (exemplo: `550e8400-e29b-41d4-a716-446655440000`)
   - Se tem alguma role listada (deve estar vazio ou mostrar 'user')

### PASSO 2: Garantir que o usuário tem um registro em user_roles

Se o usuário NÃO aparecer na tabela `user_roles`, execute:

```sql
-- Adiciona o usuário à tabela user_roles com role 'user'
-- Substitua 'uuid-do-usuario' pelo UUID que você anotou
INSERT INTO public.user_roles (user_id, role)
VALUES ('uuid-do-usuario', 'user')
ON CONFLICT (user_id, role) DO NOTHING;
```

### PASSO 3: Promover o usuário a admin (IMPORTANTE)

```sql
-- OPÇÃO A: Se quer manter os outros roles e adicionar admin
INSERT INTO public.user_roles (user_id, role)
VALUES ('uuid-do-usuario', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- OPÇÃO B: Se quer que o usuário SEJA APENAS ADMIN
-- Primeiro, delete os outros roles:
DELETE FROM public.user_roles 
WHERE user_id = 'uuid-do-usuario' AND role != 'admin';

-- Depois, insira admin:
INSERT INTO public.user_roles (user_id, role)
VALUES ('uuid-do-usuario', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

### PASSO 4: Verificar se funcionou

```sql
-- Verifique que o usuário agora tem role admin
SELECT 
  u.email,
  STRING_AGG(ur.role::text, ', ') as roles
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'seu-email-admin@exemplo.com'
GROUP BY u.id, u.email;
```

## 🔧 Melhorias Implantadas (Código)

1. **useAuth.tsx** - Agora garante automaticamente que todo usuário tem um role na tabela
2. **Admin.tsx** - Mostra mensagem clara em português explicando o problema e as roles do usuário
3. **adminRoleService.ts** - Novo serviço para gerenciar promoções de role via API

## 🧪 Testing

Depois de fazer os passos acima:

1. **Logout** completamente do app
2. **Login** novamente com o email admin
3. Abra o console (**F12 → Console**) e procure por mensagens com ✅ ou ❌
4. O painel de admin deve aparecer em `/admin`

## 📋 Verificação Rápida

No console do navegador (**F12**), depois de fazer login:

```javascript
// Procure por mensagens assim:
✅ Roles carregadas para seu-email@exemplo.com : ['admin']
```

Se não vir, procure por mensagens de erro ❌.

## 🆘 Se Ainda Não Funcionar

1. **Verifique RLS Policies** - Acesse o Supabase → SQL Editor → corra esta query:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'user_roles';
   ```

2. **Verifique a Trigger** - Execute:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname LIKE '%user%';
   ```

3. **Limpe o cache** - Faça Ctrl+Shift+Delete no navegador e tente novo login

4. **Reinicie o app** - Rode `npm run dev` novamente

## 📞 Arquivo de Correção Automática

Se preferir, pode executar este arquivo SQL diretamente:
- `fix-admin-roles.sql` - Identifica e corrige roles faltantes

Execute no Supabase SQL Editor.
