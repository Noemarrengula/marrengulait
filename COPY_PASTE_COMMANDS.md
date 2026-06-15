# 📋 COPY-PASTE COMMANDS

## 🔧 Quick Fixes

### Problema: "Acesso Negado" no /admin

**Solução 1 Rápida (2 segundos):**
```javascript
// Cole isto no F12 Console e pressione Enter:
localStorage.clear(); location.reload();
```

**Solução 2 Completa (30 segundos):**
1. Pressione F12 (abrir console)
2. Cole:
```javascript
// Limpar localStorage
localStorage.clear();

// Limpar sessionStorage  
sessionStorage.clear();

// Limpar IndexedDB
indexedDB.databases?.().then(dbs => 
  dbs.forEach(d => indexedDB.deleteDatabase(d.name))
);

console.log('✅ Tudo limpo. Recarregando...');
setTimeout(() => location.reload(), 1000);
```

---

## 🧪 Verificação

### Ver UUID atual (Console do App)
```javascript
const { user } = await supabase.auth.getUser();
console.log('UUID:', user?.id);
console.log('Email:', user?.email);
```

### Ver Roles (Console do App)
```javascript
const { user } = await supabase.auth.getUser();
const { data: roles } = await supabase
  .from('user_roles')
  .select('role')
  .eq('user_id', user.id);
console.log('Roles:', roles);
```

### UUID Esperado (Para comparar)
```
8d28b443-b574-46c9-9f6c-02dd416cdb63
```

---

## 🗄️ SQL Commands (Supabase Dashboard)

### Ver usuário
```sql
SELECT id, email, created_at FROM auth.users 
WHERE email = 'noemarrengula1@gmail.com';
```

**Output esperado:**
```
id: 8d28b443-b574-46c9-9f6c-02dd416cdb63
email: noemarrengula1@gmail.com
created_at: 2025-11-25 12:08:30.273739+00
```

---

### Ver roles
```sql
SELECT user_id, role, created_at FROM public.user_roles
WHERE user_id = '8d28b443-b574-46c9-9f6c-02dd416cdb63';
```

**Output esperado:**
```
user_id: 8d28b443-b574-46c9-9f6c-02dd416cdb63
role: admin
created_at: 2026-02-18 23:26:16.133986+00
```

---

### Adicionar role (se faltando)
```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('8d28b443-b574-46c9-9f6c-02dd416cdb63', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Verificar:
SELECT * FROM public.user_roles 
WHERE user_id = '8d28b443-b574-46c9-9f6c-02dd416cdb63';
```

---

### Remover role (se duplicada)
```sql
DELETE FROM public.user_roles
WHERE user_id = '8d28b443-b574-46c9-9f6c-02dd416cdb63'
AND role = 'admin';

-- Readicionar:
INSERT INTO public.user_roles (user_id, role)
VALUES ('8d28b443-b574-46c9-9f6c-02dd416cdb63', 'admin');
```

---

### Ver todos os dados do usuário
```sql
SELECT 
  u.id,
  u.email,
  u.created_at,
  u.updated_at,
  STRING_AGG(ur.role, ', ') as roles,
  COUNT(ur.role) as role_count
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'noemarrengula1@gmail.com'
GROUP BY u.id, u.email, u.created_at, u.updated_at;
```

---

## 🖥️ Terminal Commands

### Executar setup script
```bash
cd "c:\Users\HP Workstation\Documents\Projecto Actia\marrengulait"
node setup-admin-user-organized.js
```

---

### Testar no Node.js REPL
```bash
node -e "require('dotenv').config(); require('@supabase/supabase-js').createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY).from('user_roles').select('*').eq('user_id', '8d28b443-b574-46c9-9f6c-02dd416cdb63').then(r => console.log(r))"
```

---

## 📱 Browser Actions

### Abrir Console (Diagnostic Mode)
1. Pressione **F12**
2. Vá para aba **"Console"**
3. Cole qualquer comando acima

### Abrir DevTools em Production
- **Chrome:** Ctrl+Shift+I ou F12
- **Firefox:** Ctrl+Shift+K ou F12
- **Safari:** Cmd+Option+I ou Cmd+Option+U

### Clear Browser Cache
- **Windows:** Ctrl+Shift+Delete
- **Mac:** Cmd+Shift+Delete
- Selecione: "Cookies e dados do site"
- Clique: "Limpar dados"

---

## 🔐 Environment Variables

Se necessário regenerar, use:
```bash
# Windows PowerShell:
$env:VITE_SUPABASE_URL="https://xxxxxxxxxxx.supabase.co"
$env:VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGc..."
```

---

## 🚨 EMERGENCY PROCEDURES

### Se cliente está bloqueado (last resort)
```sql
-- Deletar todas as roles do usuário:
DELETE FROM public.user_roles
WHERE user_id = '8d28b443-b574-46c9-9f6c-02dd416cdb63';

-- Recriar role admin:
INSERT INTO public.user_roles (user_id, role)
VALUES ('8d28b443-b574-46c9-9f6c-02dd416cdb63', 'admin');

-- Verificar:
SELECT * FROM public.user_roles 
WHERE user_id = '8d28b443-b574-46c9-9f6c-02dd416cdb63';
```

### Se localStorage está corrompido
```javascript
// NO CONSOLE:
// Backup de dados importantes primeiro!
const backup = {
  theme: localStorage.getItem('theme-mode'),
  language: localStorage.getItem('language'),
  cart: localStorage.getItem('cart')
};

// Limpar tudo
localStorage.clear();

// Se havia dados importantes:
Object.entries(backup).forEach(([k, v]) => {
  if (v) localStorage.setItem(k, v);
});

location.reload();
```

---

## ✅ VERIFICATION CHECKLIST

Após executar qualquer fix, verifique com:

```javascript
// 1. UUID correto?
const { user } = await supabase.auth.getUser();
console.log('✅ UUID OK?', user?.id === '8d28b443-b574-46c9-9f6c-02dd416cdb63');

// 2. Roles corretas?
const { data: roles } = await supabase
  .from('user_roles')
  .select('role')
  .eq('user_id', user.id);
console.log('✅ Admin?', roles?.some(r => r.role === 'admin'));

// 3. Pronto para /admin?
console.log('✅ Ready?', user?.id && roles?.some(r => r.role === 'admin'));
```

**Output esperado:** `✅ Ready? true`

---

**Última atualização:** 2026-02-19  
**Email:** noemarrengula1@gmail.com  
**UUID:** 8d28b443-b574-46c9-9f6c-02dd416cdb63
