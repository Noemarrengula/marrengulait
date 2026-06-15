# 🔧 Guia Completo de Debug - Admin Panel Não Aparece

## ⚠️ PASSO 1: Limpar Cache do Navegador

### **Opção A: Limpeza Completa (Recomendado)**
1. Pressione: **Ctrl + Shift + Delete** (ou **Cmd + Shift + Delete** no Mac)
2. Selecione:
   - ☑️ Cookies e dados de sites
   - ☑️ Ficheiros em cache
   - ☑️ Histórico de navegação
3. Clique em **"Apagar dados"**
4. **Feche completamente o navegador**
5. **Reabra o navegador**

### **Opção B: DevTools (Rápido)**
1. Abra **DevTools (F12)**
2. Clique com botão direito na aba
3. Selecione **"Empty cache and hard refresh"** (Esvazie o cache e recarregue com força)

---

## ⚠️ PASSO 2: Fazer Logout

1. Acesse: `http://10.95.209.38:8082`
2. Se estiver logado, clique no perfil
3. Clique em **"Sair"**
4. Confirme que foi deslogado

---

## 🚀 PASSO 3: Fazer Login Novamente

1. Clique em **"Entrar"** (ou acesse `/auth`)
2. Email: `smartirriga.info@gmail.com`
3. Senha: (sua senha)
4. **Deixe o Console aberto (F12)**

---

## 🧪 PASSO 4: Abrir Console (F12)

Quando fizer login, você deve ver **EXACTAMENTE ISTO**:

```
👤 Usuário autenticado: smartirriga.info@gmail.com
🔄 Auth state changed: SIGNED_IN smartirriga.info@gmail.com
✅ Roles carregadas para smartirriga.info@gmail.com : ['admin']
Admin Check: { user: true, isAdmin: true, loading: false, roles: ['admin'] }
```

---

## ✨ PASSO 5: Testar Admin

Após ver os logs acima:

1. A página deve redirecionar automaticamente para `/admin`
2. **OU** acesse manualmente: `http://10.95.209.38:8082/admin`
3. Você deve ver:
   - **Painel de Administração** como título
   - **Abas:** Visão Geral, Pedidos, Utilizadores, Produtos, Lojas

---

## 🐛 Se Ainda Não Funcionar

Execute **isto no Console (F12)**:

```javascript
// 1. Verificar sessão
console.log('=== DIAGNÓSTICO ===');
const { data: session } = await supabase.auth.getSession();
console.log('Sessão:', session?.session?.user?.email);

// 2. Verificar roles no banco
const { data: roles, error } = await supabase
  .from('user_roles')
  .select('*')
  .eq('user_id', session?.session?.user.id);
console.log('Roles:', roles);
console.log('Error:', error);

// 3. Rodar diagnóstico completo
runSupabaseDiagnostics();
```

---

## 📋 Checklist Rápido

- [ ] Limpei o cache do navegador
- [ ] Fiz logout
- [ ] Fiz login novamente
- [ ] Abri o Console (F12)
- [ ] Vejo os logs correctos
- [ ] Acesso o `/admin` manualmente ou é redirecionado automaticamente
- [ ] Vejo as abas do painel admin

---

## 📞 Se Nada Funcionar

Me diga **EXACTAMENTE**:
1. **Qual é a URL que vê na barra de endereços depois do login?**
2. **Qual é a primeira mensagem que aparece no Console?**
3. **Qual é o último log que aparece no Console?**

---

**Tente agora e me diga o resultado!** 🎯
