# 🔑 Recuperar Acesso Admin

## Opção 1: Usar Conta Existente

Se você já tem uma conta criada, basta promovê-la a admin:

### No Supabase SQL Editor:
```sql
SELECT public.promote_to_admin('seu-email@exemplo.com');
```

Substitua `seu-email@exemplo.com` pelo email da sua conta.

---

## Opção 2: Criar Nova Conta Admin

### Passo 1: Criar Conta
1. Acesse: `http://localhost:5173/auth`
2. Clique em "Criar Conta"
3. Preencha:
   - Email: `admin@marrengula-it.co.mz`
   - Senha: (escolha uma senha forte)

### Passo 2: Promover a Admin
No Supabase SQL Editor, execute:
```sql
SELECT public.promote_to_admin('admin@marrengula-it.co.mz');
```

### Passo 3: Fazer Login
1. Acesse: `http://localhost:5173/auth`
2. Faça login com as credenciais criadas
3. Acesse: `http://localhost:5173/admin`

---

## Verificar se é Admin

Para verificar se um usuário tem role de admin:
```sql
SELECT u.email, ur.role
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'seu-email@exemplo.com';
```

---

## Remover Admin (se necessário)

```sql
DELETE FROM public.user_roles
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'seu-email@exemplo.com')
  AND role = 'admin';
```

---

## ⚠️ Importante

- A função `promote_to_admin` só funciona no SQL Editor do Supabase
- Você precisa ter acesso ao dashboard do Supabase
- Mantenha as credenciais de admin seguras
