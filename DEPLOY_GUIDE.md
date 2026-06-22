# ============================================
# DEPLOY GUIDE - VERCEL + SUPABASE
# ============================================

## PRÉ-REQUISITOS

1. Conta no [GitHub](https://github.com)
2. Conta no [Vercel](https://vercel.com)
3. Projeto no [Supabase](https://supabase.com)

---

## PASSO 1: SUBIR PARA GITHUB

### Opção A: Via Linha de Comando

```bash
# 1. Navegue até o diretório do projeto
cd C:\Users\HP Workstation\Documents\Projecto Actia\marrengulait

# 2. Inicialize git (se ainda não fez)
git init

# 3. Adicione todos os ficheiros
git add .

# 4. Faça o primeiro commit
git commit -m "Marrengula-IT e-commerce platform"

# 5. Crie a branch principal
git branch -M main

# 6. Adicione o remote (SUBSTITUA com a URL do seu repo)
git remote add origin https://github.com/SEU_USUARIO/marrengulait.git

# 7. Push para GitHub
git push -u origin main
```

### Opção B: Via GitHub Desktop

1. Abra o GitHub Desktop
2. File > Add Local Repository
3. Selecione a pasta do projeto
4. Publish repository to GitHub
5. Configure como público ou privado

---

## PASSO 2: DEPLOY NO VERCEL

### Opção A: Via Website

1. Acesse [vercel.com](https://vercel.com)
2. Login com GitHub
3. Clique "New Project"
4. Importe o repositório "marrengulait"
5. Configure as variáveis de ambiente:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-pUBLICA
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_sua-chave
STRIPE_SECRET_KEY=sk_test_*** (substituir pela chave real)
```

6. Clique "Deploy"

### Opção B: Via CLI

```bash
# 1. Instale o Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy (dentro do projeto)
vercel

# 4. Deploy em produção
vercel --prod
```

---

## PASSO 3: CONFIGURAR DOMÍNIO (OPCIONAL)

1. No Vercel Dashboard > Settings > Domains
2. Adicione "marrengulait.com"
3. Configure os DNS:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## PASSO 4: CONFIGURAR AUTENTICAÇÃO

### No Supabase Dashboard:

1. **Authentication > URL Configuration**
   - Site URL: `https://marrengulait.com`
   - Redirect URLs: `https://marrengulait.com/auth/callback`

2. **Authentication > Email Templates**
   - Configure os templates conforme `supabase/email-templates.sql`

3. **Authentication > Providers**
   - Para desenvolvimento local, mantenha apenas Email ativo

### No Vercel Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
```

> ⚠️ **NOTA:** Renomeie `VITE_` para `NEXT_PUBLIC_` se usar Next.js

---

## PASSO 5: CONFIGURAR STRIPE WEBHOOKS

1. Aceda ao [Stripe Dashboard](https://dashboard.stripe.com)
2. Developers > Webhooks
3. Add endpoint:
   - URL: `https://marrengulait.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`

4. Copie o Webhook Secret para:
   - Supabase: Edge Functions
   - Vercel: Environment Variables

---

## VERIFICAÇÃO PÓS-DEPLOY

### Checklist:

- [ ] Site carrega corretamente
- [ ] Login/Cadastro funciona
- [ ] Magic Links chegam por email
- [ ] Produtos são exibidos
- [ ] Carrinho funciona
- [ ] Checkout processa corretamente
- [ ] Pagamentos (se configurados) funcionam
- [ ] Mobile responsive
- [ ] SSL certificado ativo (HTTPS)

---

## COMANDOS ÚTEIS

```bash
# Development
npm run dev

# Build
npm run build

# Preview build localmente
npm run preview

# Lint
npm run lint

# Type check
npm run typecheck
```

---

## VARIÁVEIS DE AMBIENTE NECESSÁRIAS

```env
# Supabase
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_*** (usar chave real do Stripe Dashboard)

# Site URL (para confirmação de email)
VITE_SITE_URL=https://marrengulait.com
```

---

## RESOLUÇÃO DE PROBLEMAS

### Erro 500 após deploy:
- Verifique as variáveis de ambiente
- Check logs no Vercel Dashboard

### Autenticação não funciona:
- Verifique Redirect URLs no Supabase
- Confirme Site URL está correto

### CSS/Imagens não carregam:
- Limpe cache do browser
- Verifique build do Vercel

---

## SUPORTE

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Stripe Docs: https://stripe.com/docs
