# ⚡ Guia Passo-a-Passo: Vercel + GitHub Deploy Automático

## 🎯 Objetivo
Conectar seu repositório GitHub ao Vercel para **deploy automático** em cada push.

---

## 📋 Passo 1: Acessar Vercel

1. Abra: **https://vercel.com**
2. Se não tiver conta:
   - Clique: **"Sign Up"**
   - Conecte com **GitHub**
3. Se já tem conta:
   - Clique: **"Log In"**
   - Insira credenciais

---

## 🔗 Passo 2: Conectar Repositório GitHub

1. No Vercel Dashboard, clique: **"Add New"**
2. Selecione: **"Project"**
3. Na seção **"Import Git Repository"**:
   - Procure por: `marrengulait`
   - Selecione: `Noemarrengula/marrengulait`
   - Clique: **"Import"**

---

## ⚙️ Passo 3: Configurar Projeto

### A. Framework Detection
Vercel deve detectar **Vite** automaticamente ✅

Se não detectar, configure:
- **Framework:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### B. Variáveis de Ambiente

**IMPORTANTE:** Adicione as credenciais do Supabase:

1. Clique em: **"Environment Variables"**
2. Adicione **2 variáveis**:

```
Nome: VITE_SUPABASE_URL
Valor: https://ynfnegxufykueofehvzm.supabase.co

Nome: VITE_SUPABASE_PUBLISHABLE_KEY
Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluZm5lZ3h1ZnlrdWVvZmVodnptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NTA5MzgsImV4cCI6MjA3OTEyNjkzOH0.BmLSptmvf9Q4XLzWG7ZiO3I40Ay5luJgHMNE0dCtUKg
```

3. Clique: **"Save"**

---

## 🚀 Passo 4: Deploy

1. Clique: **"Deploy"**
2. Aguarde a build (2-5 minutos)
3. Se tudo OK, verá: ✅ **"Congratulations!"**

---

## 🌐 Passo 5: Acessar Seu Site

Após deploy bem-sucedido:

```
https://marrengulait.vercel.app
```

(Ou o URL gerado pelo Vercel)

---

## ✅ Verificação

Após deploy, teste:

- [ ] Homepage carrega ✅
- [ ] Produtos aparecem ✅
- [ ] Botão "Sign Up" funciona ✅
- [ ] Novo usuário aparece no Supabase ✅
- [ ] Painel admin acessível (se for admin) ✅

---

## 🔄 Próximas Vezes: Deploy Automático

Agora, **toda vez que fizer push** para GitHub:

```bash
git add .
git commit -m "sua mensagem"
git push origin main
```

✅ **Vercel faz deploy automaticamente!**

---

## 🌍 Configurar Domínio Personalizado

Após primeiro deploy bem-sucedido:

1. No Vercel Dashboard, vá ao seu projeto
2. **Settings** → **Domains**
3. Adicione seu domínio (ex: `marrengulait.com`)
4. Configure DNS com seu registrador

---

## 🐛 Troubleshooting

### Erro: "Build Failed"

**Solução:**
1. Clique em **"View Function Logs"**
2. Procure pela mensagem de erro
3. Geralmente é falta de variáveis de ambiente

### Erro: "VITE_SUPABASE_URL is undefined"

**Solução:**
1. Vá em **Settings** → **Environment Variables**
2. Confirme que ambas variáveis estão presentes
3. Clique em **"Rebuild"** no deployment

### Site mostra "404"

**Solução:**
1. Verifique se output directory é `dist`
2. Verifique build command é `npm run build`
3. Faça rebuild

---

## 📞 Suporte

Se tiver problemas:

- [Vercel Docs](https://vercel.com/docs)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html#vercel)
- [Supabase Docs](https://supabase.com/docs)

---

## 🎉 Pronto!

Seu site está **LIVE** com deploy automático! 🚀

**Cada push = novo deploy automático**

Parabéns! 🎊
