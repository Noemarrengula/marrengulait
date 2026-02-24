# 🆕 CRIAR NOVO ADMIN - GUIA PASSO-A-PASSO

## 🎯 RESUMO (30 segundos)

```
1. Execute: node create-new-admin-user.js
2. Siga as instruções do script
3. Registre uma conta nova no app
4. Script promove automaticamente a admin
5. Pronto! 🎉
```

---

## 📋 PASSO-A-PASSO DETALHADO

### **PASSO 1: Abrir Terminal**

1. Pressione: `Ctrl + Shift + ~` (abre terminal no VS Code)
   - OU abra PowerShell manualmente
2. Navegue até a pasta do projeto:
   ```bash
   cd "c:\Users\HP Workstation\Documents\Projecto Actia\marrengulait"
   ```

### **PASSO 2: Executar o Script**

```bash
node create-new-admin-user.js
```

**Output esperado:**
```
✅ Supabase conectado

╔═══════════════════════════════════════════════════════════╗
║  PASSO 1: REGISTAR NOVO USUÁRIO NO APP                    ║
╚═══════════════════════════════════════════════════════════╝

📝 INSTRUÇÕES:
  1. Vá para: http://localhost:5173/auth
  2. Clique em: "Sign Up / Registar"
  3. Preencha email e password
  4. Clique: "Sign Up"
  5. Volte here and pressione ENTER
```

### **PASSO 3: Registar Nova Conta**

Enquanto o script espera:

1. **Abra o app no browser:**
   - URL: `http://localhost:5173/auth`

2. **Clique em "Sign Up" ou "Registar"**

3. **Preencha o formulário:**
   ```
   Email: seu-email@exemplo.com
   Password: sua-senha-forte
   Confirmar: sua-senha-forte
   ```

4. **Clique "Sign Up"**

5. **Espere a confirmação:**
   - Pode aparecer mensagem de confirmação
   - Se pedir email verification, confirme no email (se necessário)

### **PASSO 4: Voltar ao Terminal**

Quando terminar o registro no app:

1. **Volte para o terminal**
2. **Pressione ENTER**

### **PASSO 5: Fornecer o Email**

O script pergunta:
```
📧 Email registado:
```

1. **Cole ou digite o email que acabou de registar**
2. **Pressione ENTER**

### **PASSO 6: Aguardar Promoção**

O script:
1. Procura o novo usuário no banco
2. Obtém o UUID
3. Adiciona a role `admin`
4. Verifica se funcionou

**Output esperado:**
```
✅ Usuário encontrado!
   UUID: 1234abcd-5678-90ef-ghij-klmnopqrstuv

✅ Role ADMIN adicionado com sucesso!

✅ VERIFICAÇÃO OK - Usuário é ADMIN

📊 Resumo Final:
   Email: seu-email@exemplo.com
   UUID: 1234abcd-5678-90ef-ghij-klmnopqrstuv
   Roles: admin
   Status: ✅ PRONTO
```

### **PASSO 7: Próximos Passos**

O script mostra o que fazer:

```
1️⃣ FAZER LOGOUT (se ainda logado):
   - Clique no menu
   - "Sign Out"

2️⃣ FAZER LOGIN NOVAMENTE:
   - http://localhost:5173/auth
   - Email: seu-email@exemplo.com
   - Password: [sua senha]

3️⃣ ACESSAR PAINEL ADMIN:
   - http://localhost:5173/admin
   - Painel deve aparecer ✅

4️⃣ VERIFICAR NO CONSOLE (F12):
   - Procure: ✅ Roles carregados ... ['admin']
```

---

## ✅ VERIFICAÇÃO RÁPIDA

Depois de tudo, confirme que funciona:

### No Browser Console (F12):

```javascript
// Ver UUID e email
const { user } = await supabase.auth.getUser();
console.log('Email:', user?.email);
console.log('UUID:', user?.id);

// Ver roles
const { data: roles } = await supabase
  .from('user_roles')
  .select('role')
  .eq('user_id', user.id);
console.log('Roles:', roles);
```

**Output esperado:**
```
Email: seu-email@exemplo.com
UUID: 1234abcd-5678-90ef-ghij-klmnopqrstuv
Roles: [ { role: 'admin' } ]
```

### No Painel Admin:

```
✅ Consegue acessar: http://localhost:5173/admin
✅ Painel completo aparece (não "Acesso Negado")
✅ Pode ver: Produtos, Usuários, Lojas, Pedidos
```

---

## 🐛 Se Algo Não Funcionar

### Erro: "Variáveis de ambiente não configuradas"

**Solução:**
```bash
# No terminal, antes de rodar o script:
$env:VITE_SUPABASE_URL="seu-url-aqui"
$env:VITE_SUPABASE_PUBLISHABLE_KEY="sua-chave-aqui"

# Depois execute:
node create-new-admin-user.js
```

### Erro: "Usuário não encontrado"

**Causa:** Script não conseguiu encontrar o novo usuário

**Soluções:**
1. Se viu o UUID do novo usuário no console (F12), copie:
   - Script pedirá: "Cole o UUID"
   - Cole o UUID de 36 caracteres

2. Ou faça sign in primeiro:
   - Logout
   - Sign in com a nova conta
   - Depois execute o script novamente

### Erro: "Role admin já existe"

**Significa:** Funcionou! ✅

- Usuário já tem role admin
- Pode usar normalmente

---

## 📱 Alternativa: Sem Script (Manual)

Se preferir fazer manualmente:

### 1. Registar conta nova
- http://localhost:5173/auth → Sign Up

### 2. Obter UUID (F12 Console)
```javascript
const { user } = await supabase.auth.getUser();
console.log('UUID:', user.id);
```

### 3. Copiar UUID

### 4. Ir para Supabase Dashboard
- https://app.supabase.com
- Seu projeto
- SQL Editor

### 5. Executar SQL
```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('SEU-UUID-AQUI', 'admin');
```

### 6. Verificar
```sql
SELECT * FROM public.user_roles 
WHERE user_id = 'SEU-UUID-AQUI';
```

---

## 🎯 Resultado Esperado

```
Email:     seu-email@exemplo.com ✅
UUID:      1234abcd-5678-90ef... ✅
Role:      admin ✅
Status:    PRONTO ✅

Login funciona ✅
Acesso /admin ✅
Painel aparece ✅
```

---

## 💡 Tips

1. **Guarde o UUID** - Você pode precisar depois
2. **Use um email real** - Para receber notificações (opcional)
3. **Guarde a password** - Você vai precisar fazer login
4. **Hard refresh** - Se não funcionar, Ctrl+Shift+R

---

## ⏱️ Tempo Total

- **Com script:** 5-10 minutos
- **Manual:** 10-15 minutos
- **Se tudo funcionar:** 2 minutos! 🚀

---

**Está pronto? Execute agora:**
```bash
node create-new-admin-user.js
```

Boa sorte! 🎉
