# 🔐 Configuração de Recuperação de Senha

## O que foi implementado

1. **Página de Recuperação de Senha** (`/forgot-password`)
   - Formulário simples com email
   - Envia link de reset para o email do usuário
   - Confirmação visual após envio

2. **Página de Reset de Senha** (`/reset-password`)
   - Recebe o link do Supabase automaticamente
   - Formulário para definir nova senha
   - Validação de confirmação de senha
   - Redirecionamento automático após sucesso

3. **Link no Login** 
   - Botão "Esqueci a senha" na página de autenticação
   - Leva para `/forgot-password`

## Configuração no Supabase

### Passo 1: Configurar URL de Redirecionamento

1. Acesse o dashboard do Supabase
2. Vá para **Authentication** → **URL Configuration**
3. Procure por **Redirect URLs** (ou **Authorized redirect URIs**)
4. Adicione a URL de reset:

```
http://localhost:5173/reset-password
https://seu-dominio.com/reset-password
```

### Passo 2: Configurar Templates de Email (Opcional)

1. Em **Authentication** → **Email Templates**
2. Procure pelo template **Reset password**
3. O padrão funciona, mas você pode customizar se desejar

O link padrão que o Supabase envia é similar a:
```
https://seu-projeto.supabase.co/auth/v1/recover?token=XXX&type=recovery
```

Nosso App automaticamente redireciona isso para `/reset-password` e processa o token.

### Passo 3: Teste Localmente

```bash
npm run dev
# Abra http://localhost:5173
```

1. Clique em "Entrar"
2. Clique em "Esqueci a senha"
3. Digite seu email
4. Verifique seu email
5. Clique no link (ele abrirá `/reset-password`)
6. Define uma nova senha

## Fluxo Completo

```
Usuário em /auth
        ↓
   Clica "Esqueci a senha"
        ↓
  Vai para /forgot-password
        ↓
  Digita email
        ↓
  Supabase envia email com link
        ↓
  Usuário clica link no email
        ↓
  Redirecionado para /reset-password
        ↓
  Define nova senha
        ↓
  Redireciona para /auth (login)
```

## Email de Reset

O Supabase envia automaticamente um email com:
- Link de reset (válido por 24 horas)
- Texto personalizável nos templates
- HTML responsivo

Para customizar o email:
1. **Authentication** → **Email Templates** → **Reset password**
2. Edite o conteúdo (suporta variáveis como `{{ link }}`)

## Segurança

✅ Link expira em 24 horas  
✅ Token de reset é seguro (enviado via Supabase Auth)  
✅ A nova senha é validada (mínimo 6 caracteres)  
✅ Verificação de correspondência de senhas no frontend  
✅ HTTPS é recomendado em produção  

## Variáveis de Ambiente

Nenhuma configuração adicional necessária! O Supabase gerencia tudo automaticamente via:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## Troubleshooting

### "Link expirado" ou "Link inválido"

1. Verifique se a URL de redirecionamento está configurada no Supabase
2. Certifique-se que está testando com o domínio correto
3. Links expiram em 24 horas

### Email não chega

1. Verifique pasta de SPAM
2. Verifique se o email está correto
3. Aguarde alguns minutos (pode levar até 5 minutos)
4. No Supabase, cheque **Auth** → **Logs** para erros

### Segue para página em branco

Isso foi resolvido! Agora vai direto para `/reset-password` com formulário completo.

## URLs Implementadas

| Rota | Função |
|------|--------|
| `/auth` | Login e Signup |
| `/forgot-password` | Solicitar reset de senha |
| `/reset-password` | Redefinir senha (vem do email) |

---

**Última atualização:** Fevereiro 2026
**Status:** ✅ Pronto para produção
