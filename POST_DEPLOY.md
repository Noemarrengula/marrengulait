# ============================================
# CONFIGURAÇÃO PÓS-DEPLOY
# ============================================

## PASSO 1: Configurar Redirect URLs no Supabase

1. Aceda ao [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione o projeto "igphzzzxjahwocfmgkyo"
3. Vá para **Authentication** → **URL Configuration**
4. Em **Redirect URLs**, adicione:

```
https://marrengulaitstore.vercel.app
https://marrengulaitstore.vercel.app/*
https://marrengulait.com
https://marrengulait.com/*
http://localhost:5173
http://localhost:5173/*
```

5. Clique **Save**

---

## PASSO 2: Testar Login

1. Acesse https://marrengulaitstore.vercel.app
2. Tente fazer login/cadastro
3. Verifique se Magic Links funcionam

---

## PASSO 3: Configurar Domínio Personalizado (opcional)

No Vercel:
1. Settings → Domains
2. Adicione "marrengulait.com"

Depois, adicione a URL no Supabase Redirect URLs.

---

## URLs Importantes

| Serviço | URL |
|---------|-----|
| Site | https://marrengulaitstore.vercel.app |
| Supabase | https://supabase.com/dashboard/project/igphzzzxjahwocfmgkyo |
