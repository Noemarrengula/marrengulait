# 🚀 GUIA COMPLETO - DEPLOY NO VERCEL COM SUPABASE

**Data:** 25 de Fevereiro de 2026
**Status:** ✅ Pronto para Deploy

---

## 📋 Pré-Requisitos

```
✓ Repositório Git com código (GitHub, GitLab, Bitbucket)
✓ Conta no Vercel (vercel.com)
✓ Conta no Supabase com base de dados configurada
✓ Credenciais Supabase prontas
```

---

## 🎯 PASSO 1: Preparar Repositório Git

### 1.1 Atualizar .gitignore

Certifique-se de que `.env` está no `.gitignore`:

```bash
# Verificar
cat .gitignore | grep ".env"
```

Deve retornar `.env` (sem ".example").

### 1.2 Commit das Mudanças

```bash
git add .
git commit -m "feat: configure database and prepare for Vercel deployment"
git push
```

---

## 🌐 PASSO 2: Conectar Vercel ao Repositório

### 2.1 Aceder ao Vercel

1. Vá a: https://vercel.com/dashboard
2. Faça login (ou crie uma conta grátis)
3. Clique em **"Add New..."** → **"Project"**

### 2.2 Importar Repositório

1. Selecione seu repositório (GitHub/GitLab/Bitbucket)
2. Clique em **"Import"**
3. Aceite as permissões

### 2.3 Configurar Projeto

Na página de configuração:

**Framework Preset:** Vite (já selecionado)

**Build Command:** `npm run build`

**Output Directory:** `dist`

**Install Command:** `npm install`

---

## 🔐 PASSO 3: Adicionar Variáveis de Ambiente

### 3.1 Ir para Variáveis de Ambiente

Na página do projeto Vercel:

1. Clique em **Settings** (engrenagem)
2. Vá para **Environment Variables**

### 3.2 Adicionar Cada Variável

Clique em **"Add"** para cada uma:

```
Nome: VITE_SUPABASE_PROJECT_ID
Valor: jmefqzhoumdcgcxtdssu
Ambientes: Production, Preview, Development
```

```
Nome: VITE_SUPABASE_URL
Valor: https://jmefqzhoumdcgcxtdssu.supabase.co
Ambientes: Production, Preview, Development
```

```
Nome: VITE_SUPABASE_PUBLISHABLE_KEY
Valor: sb_publishable_6EUZKv42fC6vzueNMoo9aw_umL2MWqX
Ambientes: Production, Preview, Development
```

⚠️ **IMPORTANTE:**
- Os nomes devem ser **EXATAMENTE iguais** (case-sensitive)
- Comece com `VITE_` (Vite vai injetar no build)
- Os valores devem ser **EXATAMENTE iguais** aos do seu `.env` local

### 3.3 Salvar

Clique em **"Save"** para cada variável.

---

## ✅ PASSO 4: Fazer Deploy

### 4.1 Iniciar Deployment

Depois de adicionar as variáveis:

1. Clique em **"Deployments"** (aba no topo)
2. Clique em **"Redeploy"** (se houver build anterior) OU
3. Faça um novo `git push` para trigger automático

### 4.2 Acompanhar Build

Você verá:
```
⏳ Analyzing source code...
⏳ Installing dependencies...
⏳ Building...
✅ Ready
```

Tempo estimado: 1-3 minutos

### 4.3 Acessar o Aplicativo

Quando terminar:
```
✅ Production @ your-app.vercel.app
```

Clique no link para abrir seu app em produção!

---

## 🧪 PASSO 5: Testar em Produção

No seu app em **vercel.app**:

```
✓ Fazer Sign Up
✓ Fazer Login  
✓ Ver produtos (dados do Supabase)
✓ Criar um produto (se for admin)
✓ Criar um pedido
✓ Ver dados em: https://app.supabase.com → Table Editor
```

Se tudo funciona, **dados estão sendo gravados no Supabase!** ✅

---

## 📊 VERIFICAR DADOS NO SUPABASE

### Via Dashboard Supabase:

1. Vá a: https://app.supabase.com
2. Selecione seu projeto
3. Clique em **Table Editor**
4. Abra a tabela **orders** (ou outra)
5. Veja os registos criados em produção ✅

### Via SQL Query:

No SQL Editor, execute:

```sql
SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;
```

Deve ver os pedidos criados em produção!

---

## 🔄 CICLO DE DESENVOLVIMENTO

### Para Desenvolver Localmente:

```bash
npm run dev
# http://localhost:5173
```

### Para Deploy em Produção:

```bash
# 1. Fazer mudanças no código
# 2. Testar localmente
git add .
git commit -m "feat: descrição da mudança"
git push

# Vercel faz deploy automaticamente!
# Aceda a: your-app.vercel.app
```

---

## 🚨 RESOLVER PROBLEMAS

### Problema 1: Build Falha com "Variable not found"

**Solução:**
- Verifique nomes das variáveis em Vercel Settings
- Devem ser `VITE_SUPABASE_*` (exatamente)
- Redeploy: Settings → Deployments → Redeploy

### Problema 2: Dados não Aparecem em Produção

**Solução:**
- Verifique se Row Level Security (RLS) está ativo
- RLS pode bloquear dados de utilizadores não autenticados
- No Supabase: vá a RLS Policies e verifique

### Problema 3: Erro 401/403 no Supabase

**Solução:**
- Verifique a PUBLISHABLE_KEY em Vercel
- Execute teste local para comparar:
  ```bash
  node test-database-integration.js
  ```
- Uma deve funcionar (local) e outra não (produção RLS)

### Problema 4: CORS Error

**Solução:**
- CORS está configurado automaticamente no Supabase
- Se persistir, no Supabase → Settings → API → CORS verificar
- Adicionar seu domínio Vercel: `https://your-app.vercel.app`

---

## 📈 BOAS PRÁTICAS

### ✅ Fazer:

```
✓ Usar variáveis de ambiente para credenciais
✓ Nunca commitar .env
✓ Testar localmente antes de pushear
✓ Usar diferentes credenciais para dev/prod (opcional)
✓ Monitorar logs em Vercel
```

### ❌ Nunca Fazer:

```
✗ Commitar .env
✗ Usar credenciais hardcoded no código
✗ Deployyy sem testar localmente
✗ Usar ADMIN KEY no frontend
✗ Expor credenciais em console.log
```

---

## 📚 PRÓXIMAS ETAPAS

1. ✅ Deploy em Vercel realizado
2. ✅ Dados gravando em Supabase
3. 📊 Monitorar performance
4. 📈 Adicionar mais features
5. 💰 Monetizar (afiliados, assinaturas, etc)

---

## 🎯 RESUMO

```
┌─────────────────────────────────────────────┐
│ DEPLOY VERCEL + SUPABASE - CHECKLIST       │
├─────────────────────────────────────────────┤
│ □ Repositório Git criado                   │
│ □ Conta Vercel criada                      │
│ □ Projeto importado no Vercel              │
│ □ Variáveis de ambiente adicionadas        │
│ □ Build realizado com sucesso              │
│ □ App acessível em vercel.app              │
│ □ Dados sendo gravados (verificado)        │
│ □ Testes em produção passaram              │
└─────────────────────────────────────────────┘
```

---

## 💬 SUPORTE

Se encontrar problemas:

1. Verifique logs em Vercel: Deployments → Logs
2. Verifique Supabase: Logs → API
3. Teste localmente: `npm run dev`
4. Compare variáveis locais vs Vercel

---

**Pronto para crescer! 🚀**

*Documento atualizado: 25 de Fevereiro de 2026*
