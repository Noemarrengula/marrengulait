# Configuração de Credenciais Admin

## Como criar um usuário Admin

### Passo 1: Aplicar Migração SQL
Execute a migração no Supabase SQL Editor:
```bash
# A migração já está em: supabase/migrations/20250110000001_setup_admin_credentials.sql
```

### Passo 2: Criar Conta de Usuário
1. Acesse `/auth` no website
2. Crie uma conta com email e senha
3. Email: `noemarrengula1@gmail.com`

### Passo 3: Promover a Admin
No Supabase SQL Editor, execute:
```sql
SELECT public.promote_to_admin('noemarrengula1@gmail.com');
```

### Passo 4: Fazer Login
1. Faça login com as credenciais criadas
2. Acesse `/admin` para ver o painel administrativo

## Verificar Roles de um Usuário
```sql
SELECT u.email, ur.role
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'noemarrengula1@gmail.com';
```

## Remover Role de Admin
```sql
DELETE FROM public.user_roles
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'noemarrengula1@gmail.com')
  AND role = 'admin';
```

## Roles Disponíveis
- `admin` - Acesso total ao painel administrativo
- `vendor` - Acesso ao painel de vendedor (futuro)
- `user` - Usuário comum (padrão)

## Segurança
- A função `promote_to_admin` só pode ser executada via SQL Editor do Supabase
- RLS (Row Level Security) está ativado em todas as tabelas
- Apenas admins podem visualizar e gerenciar roles de outros usuários
