# Correções de Segurança Implementadas

Este documento lista todas as correções de segurança aplicadas ao Marrengula-IT.

## Data: 02/04/2026

---

## 1. Security Headers (✅ Completo)

**Ficheiro:** `vercel.json`

Adicionados os seguintes headers de segurança:
- `X-DNS-Prefetch-Control`
- `Strict-Transport-Security` (HSTS)
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` (camera, microphone, geolocation desativados)
- `Content-Security-Policy` (CSP)
- `X-XSS-Protection`

**Impacto:** Protege contra XSS, clickjacking, MIME type sniffing.

---

## 2. Console Logs Removidos (✅ Completo)

**Ficheiro:** `src/hooks/useAuth.tsx`

Removidos todos os logs verbose com emojis e dados sensíveis:
- ❌ Logs com IDs de utilizador
- ❌ Logs com emails
- ❌ Logs de debug excessivos

Agora os logs só aparecem em modo desenvolvimento (`import.meta.env.DEV`).

---

## 3. Supabase Client Security (✅ Completo)

**Ficheiro:** `src/integrations/supabase/client.ts`

- Removidos comentários de debug
- Adicionado header `x-application-name`
- Configuração de retry para conexão estável

---

## 4. Stripe Card Element Fix (✅ Completo)

**Ficheiro:** `src/components/checkout/StripeCardElement.tsx`

Corrigido acesso inseguro ao token:
```typescript
// ANTES (inseguro):
localStorage.getItem('supabase-auth-token')

// DEPOIS (seguro):
const { data: { session } } = await supabase.auth.getSession();
session?.access_token
```

---

## 5. CAPTCHA Protection (✅ Completo)

**Ficheiros:**
- `src/providers/CaptchaProvider.tsx` (novo)
- `src/pages/Auth.tsx` (atualizado)

Adicionado Google reCAPTCHA v3 (invisible) para proteger:
- Login
- Registo
- Magic Link

**Nota:** Usa chave de teste do Google. Para produção:
1. Registar em https://www.google.com/recaptcha/admin
2. Substituir `VITE_RECAPTCHA_SITE_KEY` no `.env`

---

## Ações Recomendadas (Pendentes)

### 🔴 Crítico

1. **Rotacionar chaves Stripe**
   - Ir ao Stripe Dashboard
   - Gerar novas chaves (API > Keys)
   - Atualizar `.env`
   - INVALIDAR chaves antigas

2. **Configurar Supabase RLS**
   - Ir ao Supabase Dashboard > SQL Editor
   - Criar Row Level Security policies para todas as tabelas
   - Exemplo:
   ```sql
   ALTER TABLE products ENABLE ROW LEVEL SECURITY;
   
   CREATE POLICY "Public read" ON products
   FOR SELECT USING (true);
   
   CREATE POLICY "Admin only write" ON products
   FOR ALL USING (auth.role() = 'admin');
   ```

### 🟠 Alto

3. **Remover STRIPE_SECRET_KEY do .env**
   - Mover processamento de pagamentos para server-side
   - Usar Supabase Edge Functions para criar Payment Intents

4. **Adicionar rate limiting**
   - Configurar no Supabase ou usar API gateway

### 🟡 Médio

5. **Configurar reCAPTCHA server-side**
   - Verificar token no backend (Supabase Edge Function)
   - Adicionar validação de score

6. **Adicionar logout por inatividade**
   - Implementar timeout de sessão no frontend

---

## Testes de Segurança Recomendados

```bash
# 1. Verificar headers de segurança
curl -I https://marrengulaitstore.vercel.app

# 2. Verificar CSP
curl -sI https://marrengulaitstore.vercel.app | grep -i content-security-policy

# 3. Testar reCAPTCHA
# Abrir DevTools > Network > Filtrar "recaptcha"
# Verificar que token é gerado em login/signup
```

---

## Referências

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Security Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers#security)
- [Supabase Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Google reCAPTCHA](https://developers.google.com/recaptcha/docs/v3)
