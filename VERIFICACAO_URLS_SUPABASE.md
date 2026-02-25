# ✅ Verificação de URLs do Supabase

## Seu Projeto Vercel
🌐 **URL Principal:** `https://marrengulaitstore.vercel.app`

---

## URLs que PRECISAM estar configuradas no Supabase

### 📍 Localização no Supabase:
1. Vá a: https://supabase.com/dashboard/project/jmefqzhoumdcgcxtdssu/settings/auth
2. Procure por: **Authentication → URL Configuration**
3. Seção: **Redirect URLs**

---

## ✅ URLs Obrigatórias para Email Confirmation

Adicione EXATAMENTE estas URLs:

```
https://marrengulaitstore.vercel.app
https://marrengulaitstore.vercel.app/
```

(Basta adicionar apenas estas 2 - a raiz com e sem /)

---

## ✅ URLs para OAuth (Google, Facebook)

Se usar OAuth, adicione também:
```
https://marrengulaitstore.vercel.app/auth
```

---

## ✅ URLs para Reset de Password

Se tiver página de reset de password:
```
https://marrengulaitstore.vercel.app/reset-password
```

---

## 🔍 Como Verificar se Estão Configuradas

No Supabase Dashboard:
1. Settings → Authentication
2. Vá a **URL Configuration**
3. Você deverá VER uma lista com as URLs que você adicionou
4. Se a lista estiver vazia ou não incluir seu Vercel URL, ESTÁ ERRADO

---

## ⚠️ IMPORTANTE

Se a URL no campo estiver assim:
- `localhost:3000` ❌
- `http://marrengulaitstore.vercel.app` ❌ (sem https)
- Outra URL qualquer ❌

**ESTÁ ERRADO! Deve ser alterado.**

---

## ✅ CERTO seria:
```
https://marrengulaitstore.vercel.app
```

---

## 🔧 Depois de Adicionar

1. Clique em **Save**
2. Espere 30 segundos
3. Teste criar uma conta nova
4. Verifique o email que recebe
5. O link deve abrir em: `https://marrengulaitstore.vercel.app`

