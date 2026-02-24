# 🚀 Guia Deploy Vercel - Marrengula IT

## ⚡ Antes de Começar

### ✅ Checklist

- [ ] Account no Vercel criada (https://vercel.com)
- [ ] Repositório Git com código (GitHub/GitLab/Bitbucket)
- [ ] Credenciais do Supabase prontas
- [ ] `vercel.json` ✅ Criado
- [ ] `.vercelignore` ✅ Criado

---

## 🔑 Passo 1: Obter Credenciais Supabase

### A. Acessar Supabase Dashboard

```
https://supabase.com/dashboard/project/ynfnegxufykueofehvzm/settings/api
```

### B. Copiar Valores

**Procure por "API Keys":**

```
📋 VITE_SUPABASE_URL
   https://ynfnegxufykueofehvzm.supabase.co

🔑 VITE_SUPABASE_PUBLISHABLE_KEY
   (copie a chave "anon" ou "public")
```

**Exemplo:**
```
sb_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🎯 Passo 2: Conectar Repositório ao Vercel

### Opção A: Dashboard Vercel

1. Acesse: https://vercel.com/dashboard
2. Clique: **"Add New"** → **"Project"**
3. Selecione seu repositório Git
4. Clique: **"Import"**

### Opção B: CLI Vercel

```bash
npm i -g vercel
vercel link
```

---

## ⚙️ Passo 3: Configurar Variáveis de Ambiente

### Via Dashboard Vercel

1. Acesse seu projeto no Vercel
2. **Settings** → **Environment Variables**
3. Adicione:

```
VITE_SUPABASE_URL = https://ynfnegxufykueofehvzm.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY = (sua chave)
```

4. Clique: **"Save"**

### Via CLI Vercel

```bash
vercel env add VITE_SUPABASE_URL
# Cole: https://ynfnegxufykueofehvzm.supabase.co

vercel env add VITE_SUPABASE_PUBLISHABLE_KEY
# Cole: sua chave
```

---

## 📤 Passo 4: Deploy

### Opção A: Push para Git (Automático)

```bash
git add .
git commit -m "Deploy: Vercel config"
git push origin main
```

Vercel vai fazer deploy automaticamente!

### Opção B: CLI Manual

```bash
vercel --prod
```

---

## ✅ Passo 5: Verificar Deploy

### A. URL em Produção

Acesse seu site:
```
https://marrengulait.vercel.app
```

### B. Testar Funcionalidades

- [ ] Homepage carrega ✅
- [ ] Produtos aparecem ✅
- [ ] Login funciona ✅
- [ ] Novo usuário aparece no Supabase ✅
- [ ] Painel admin funciona ✅

### C. Verificar Builds

No Vercel Dashboard:
- Clique em **"Deployments"**
- Procure pelo status da build
- Se houver erro, veja os logs

---

## 🐛 Troubleshooting

### Erro: "Cannot find module"

**Solução:**
```bash
npm install
npm run build
```

### Erro: "VITE_SUPABASE_URL is not defined"

**Solução:**
1. Abra Vercel Dashboard
2. **Settings** → **Environment Variables**
3. Confirme que as variáveis estão corretas
4. Recoloque o deploy: **Deployments** → **Redeploy**

### Erro: "Cannot POST /api/..."

**Solução:**
- Vercel não suporta API routes no Vite
- Use Supabase Edge Functions em vez disso

---

## 📚 Recursos Úteis

- [Docs Vercel + Vite](https://vercel.com/docs/frameworks/vite)
- [Docs Supabase](https://supabase.com/docs)
- [CLI Vercel](https://vercel.com/docs/cli)

---

## 🎉 Parabéns!

Se tudo funcionou, seu site está LIVE! 🚀

**Próximas etapas:**
1. Adicione domínio personalizado
2. Configure SSL (automático)
3. Monitore performance
4. Configure CI/CD melhorado

---

**Última atualização:** 25 de Fevereiro de 2026  
**Versão:** 1.0.0
