# 🚀 SETUP ORGANIZADO - ADMIN USER

## 📋 Informações da Conta

- **Email:** `noemarrengula1@gmail.com`
- **UUID:** `8d28b443-b574-46c9-9f6c-02dd416cdb63`
- **Role:** `admin` ✅
- **Status:** Configurado

---

## ⚡ QUICK START (5 minutos)

### 1️⃣ Executar Script de Setup

```bash
cd c:\Users\HP Workstation\Documents\Projecto Actia\marrengulait
node setup-admin-user-organized.js
```

**Esperado output:**
```
✅ Ambiente validado
✅ Cliente Supabase inicializado
✅ Usuário EXISTE e TEM ROLE ADMIN
✅ SETUP CONCLUÍDO
```

---

### 2️⃣ Fazer Login no App

1. Vá para: `http://localhost:5173`
2. Clique em **"Login"** ou vá para `/auth`
3. Digite:
   - **Email:** `noemarrengula1@gmail.com`
   - **Password:** [sua senha do Supabase]
4. Clique **"Sign In"**

---

### 3️⃣ Acessar Admin Panel

1. Vá para: `http://localhost:5173/admin`
2. **Deverá aparecer** o painel de admin completo ✅

---

## 🔍 TROUBLESHOOTING

### Problema: "Acesso Negado" ao entrar em /admin

**Solução:**

1. **Abra o Console (F12)** e procure por:
   ```
   ✅ Roles carregados do Supabase para 8d28b443-b574-46c9-9f6c-02dd416cdb63: ['admin']
   ```

   - Se vê isto ➜ **Esperado** que funcione
   - Se vê `['user']` ➜ Continue para passo 2

2. **Clique no botão "🔄 Forçar Sincronização"** (se aparecer na tela de erro)

3. **Se ainda não funcionar, limpe o cache:**
   ```javascript
   // No console (F12):
   localStorage.clear();
   location.reload();
   ```

4. **Sign Out e Sign In novamente**:
   - Clique no menu do usuário
   - "Sign Out"
   - Faça login novamente

---

### Problema: Erro "UUID MISMATCH"

Se ver mensagem like: `❌ [UUID MISMATCH CRÍTICO]`

**A causa:** Browser tem sessão corrompida

**Solução:**
1. Feche o browser completamente
2. Limpe cache: `Ctrl+Shift+Delete`
3. Selecione "Cookies e outros dados do site"
4. Clique "Limpar dados"
5. Reabra o browser e faça login novamente

---

### Problema: Script diz "Nenhuma role encontrada"

**Solução - Adicionar role manualmente:**

No **console do Supabase Dashboard**:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('8d28b443-b574-46c9-9f6c-02dd416cdb63', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Verificar:
SELECT * FROM public.user_roles 
WHERE user_id = '8d28b443-b574-46c9-9f6c-02dd416cdb63';
```

---

## 📊 VERIFICAÇÃO MANUAL

### Checar dados no Supabase

```sql
-- Ver usuário
SELECT id, email, created_at FROM auth.users 
WHERE email = 'noemarrengula1@gmail.com';

-- Ver roles
SELECT user_id, role, created_at FROM public.user_roles
WHERE user_id = '8d28b443-b574-46c9-9f6c-02dd416cdb63';
```

### Testar no JavaScript

```javascript
// No console do app:
const { user } = await supabase.auth.getUser();
console.log('Current user:', user?.id);
console.log('Expected UUID:', '8d28b443-b574-46c9-9f6c-02dd416cdb63');
console.log('Match:', user?.id === '8d28b443-b574-46c9-9f6c-02dd416cdb63');

// Testar roles
const { data: roles } = await supabase
  .from('user_roles')
  .select('role')
  .eq('user_id', user.id);
console.log('Roles:', roles);
```

---

## ✅ CHECKLIST DE VERIFICAÇÃO

- [ ] Script `setup-admin-user-organized.js` executado com sucesso
- [ ] Output mostra `✅ Usuário EXISTE e TEM ROLE ADMIN`
- [ ] Consegue fazer login com `noemarrengula1@gmail.com`
- [ ] Acesso a `/admin` mostra painel (não erro)
- [ ] Console mostra `✅ Roles carregados do Supabase include admin`
- [ ] Painel admin carrega (não mostra loading infinito)

---

## 🔧 PRÓXIMOS PASSOS

Se tudo funcionar:
1. ✅ App está pronto para uso
2. ✅ Pode adicionar mais usuários como admin
3. ✅ Pode criar produtos e gerenciá-los

Se algo não funcionar:
1. Reporte o erro exato do console (F12)
2. Run script novamente e capture o output completo
3. Me envie: email + erro + UUID que está recebendo

---

## 📝 NOTES

- Este email já tinha account no Supabase desde 2025-11-25
- Role admin foi configurada em 2026-02-18 23:26:16
- Qualquer problema de UUID diferente = cache corrompido (solução = limpar localStorage)

---

**Última atualização:** 2026-02-19  
**Script versão:** 1.0  
**Status:** ✅ Pronto
