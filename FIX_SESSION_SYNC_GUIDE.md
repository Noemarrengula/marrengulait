# 🚨 RESOLUÇÃO: Falha Crítica de Sincronização de Sessão

## 🔍 O Problema

A sua sessão tem **dois UUIDs diferentes**:
- **UUID no navegador (errado):** `dac583ee-0b85-4058-8dee-9291d592ed33`
- **UUID no Supabase (correto):** `7ed44fba-1ef7-41e7-897f-2e53abaf3079`

Isso significa que:
1. ❌ O app está lendo um UUID antigo/errado da sessão persistida
2. ❌ O Supabase tem um UUID diferente (possível duplicação de usuário)
3. ❌ As roles estão vinculadas ao UUID CORRETO, mas o app usa o ERRADO

## 🎯 Solução em 3 Passos

### PASSO 1️⃣: Executar Diagnóstico no Supabase

**No Supabase Dashboard → SQL Editor:**

1. Copie e execute:

```sql
SELECT 
  id as user_uuid,
  email,
  created_at
FROM auth.users
WHERE email = 'smartirriga.info@gmail.com'
ORDER BY created_at ASC;
```

**O queverá ver:**
- Se aparecer **1 linha**: Sistema consistente, problema é no navegador
- Se aparecer **2 ou mais linhas**: **DUPLICAÇÃO CRÍTICA** de usuários

---

### PASSO 2️⃣: Limpar Cache do Navegador

Se apenas 1 linha apareceu no Passo 1, o problema é sessão cached:

**Opção A: Via Console (Automático)**
1. Abra o Console (**F12 → Console**)
2. Cole isto:

```javascript
// 🧹 LIMPEZA AUTOMÁTICA
var keys = Object.keys(localStorage);
keys.forEach(k => {
  if (k.includes('supabase') || k.includes('auth') || k.includes('ecybjpzugmtlqqwydsjq')) {
    localStorage.removeItem(k);
    console.log('✅ Deletado:', k);
  }
});
sessionStorage.clear();
console.log('✅ Limpeza completa');
location.reload();
```

3. Pressione **Enter** e aguarde a página recarregar

**Opção B: Manual**
1. **F12 → Application**
2. **Local Storage** → Clique direito em cada linha com 'supabase' → Delete
3. **Session Storage** → Clear All
4. **Cookies** → Delete cookies com 'supabase'
5. Feche DevTools e recarregue (Ctrl+Shift+R)

---

### PASSO 3️⃣: Logout e Login Novamente

1. **Clique em Logout** (voltar para home é ok, mas melhor logout formal)
2. **Aguarde** a página carregar completamente
3. Veja o console, procure por ❌ ou 🚨 (indíciaoe de erro)
4. **Login novamente** com `smartirriga.info@gmail.com`
5. **Monitore o console** (F12) procurando por:

```
✅ Roles carregadas para smartirriga.info@gmail.com : ['admin']
```

6. Acesse `/admin` - deve aparecer o painel!

---

## 🚨 Se Encontrar Duplicação (2+ linhas no Passo 1)

**Se aparecer 2 UUIDs diferentes, execute isto:**

No Supabase SQL Editor:

```sql
-- Ver qual é o CORRETO (mais antigo)
SELECT 
  id,
  email,
  created_at,
  ROW_NUMBER() OVER (ORDER BY created_at) as posicao
FROM auth.users
WHERE email = 'smartirriga.info@gmail.com'
ORDER BY created_at;

-- O com posicao = 1 é o CORRETO
-- O com posicao = 2 é o DUPLICADO (será deletado)
```

**Copie o UUID do PRIMEIRO (correto):**

```sql
-- Substituir 'UUID-CORRETO' pelo UUID que você copiou
-- Garantir que ele tem role admin

INSERT INTO public.user_roles (user_id, role)
VALUES ('UUID-CORRETO', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Verificar
SELECT 
  u.email,
  STRING_AGG(ur.role::text, ', ') as roles
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.id = 'UUID-CORRETO'
GROUP BY u.id, u.email;
```

Depois, **limpar sessão do navegador** (Opção A ou B do Passo 2).

---

## 🔧 Reforço: Melhorias no Código

Atualizei o hook `useAuth.tsx` para:
- ✅ Detectar mudanças de UUID (sinal de problema)
- ✅ Limpar cache automaticamente se UUID mudar
- ✅ Logs mais detalhados com timestamp
- ✅ Rastrear o UUID para evitar sincronização cruzada

---

## 📋 Checklist de Verificação

Depois de cada passo, verifique:

- [ ] Passo 1: Supabase mostra 1 UUID para smartirriga.info@gmail.com
- [ ] Passo 2: Console mostra "✅ Limpeza completa"
- [ ] Página recarrega após limpeza
- [ ] Login com sucesso
- [ ] Console mostra `✅ Roles carregadas` com 'admin'
- [ ] Painel aparece em `/admin`

---

## 🆘 Se Ainda Não Funcionar

### Verificação Avançada

No console (F12), cole isto para ver detalhes de debug:

```javascript
// Ver UUID atual na sessão
const session = JSON.parse(localStorage.getItem('sb-ecybjpzugmtlqqwydsjq-auth-token') || '{}');
console.log('UUID na sessão:', session?.user?.id);
console.log('Email:', session?.user?.email);
```

Se o UUID aqui for diferente do Supabase, a limpeza (Passo 2) não funcionou completamente.

### Última Opção: Forçar Nova Sessão

Execute NO Supabase SQL Editor:

```sql
-- Garantir que o UUID CORRETO tem TUDO configurado
WITH correct_user AS (
  SELECT id FROM auth.users 
  WHERE email = 'smartirriga.info@gmail.com'
  ORDER BY created_at ASC LIMIT 1
)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM correct_user
ON CONFLICT (user_id, role) DO NOTHING;
```

Depois limpe o navegador de novo (Passo 2).

---

## 📝 Arquivo de Referência

Usei os seguintes arquivos criados:
- `diagnose-session-sync-issue.sql` - Diagnóstico
- `fix-session-sync-critical.sql` - Correção SQL
- `cleanup-session.js` - Limpeza do navegador
- `src/hooks/useAuth.tsx` - Hook melhorado

---

## 🎯 Resultado Esperado

✅ **Quando terminar:**
```
👤 Usuário autenticado: smartirriga.info@gmail.com
🔑 User ID: 7ed44fba-1ef7-41e7-897f-2e53abaf3079  ← CORRETO!
✅ Roles carregadas para smartirriga.info@gmail.com : ['admin']
```

E o painel admin vai aparecer normalmente!

---

**Aviso:** Se a duplicação não foi resolvida e você precisa deletar o usuário duplicado, pode precisar de acesso SUPER do Supabase (entre em contato com com o suporte Supabase).

