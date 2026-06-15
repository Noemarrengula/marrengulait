# ✅ CHECKLIST DEPLOYMENT - DO ZERO AO VERCEL

## 🎯 OBJETIVO FINAL

```
✓ App funcional em: https://your-app.vercel.app
✓ Dados sendo gravados em: Supabase
✓ Autenticação funcionando
✓ Produtos com CRUD completo
✓ Pedidos sendo criados
```

---

## ✅ FASE 1: PREPARAÇÃO (10 min)

```
□ Código compilado sem erros: npm run build
□ Teste local funciona: npm run dev
□ .git inicializado: git status
□ .env preenchido com credenciais reais
□ .gitignore contém .env
□ Código commitado: git push
```

---

## ✅ FASE 2: CONFIGURAR VERCEL (5 min)

```
□ Conta criada em vercel.com
□ Repositório conectado (GitHub/GitLab/Bitbucket)
□ Projeto criado no Vercel
□ Framework: Vite (selecionado)
```

---

## ✅ FASE 3: VARIÁVEIS DE AMBIENTE (5 min)

### Adicionar em Vercel → Settings → Environment Variables:

```
Nome: VITE_SUPABASE_PROJECT_ID
Valor: jmefqzhoumdcgcxtdssu
Ambientes: Production, Preview, Development
✓ Salvar
```

```
Nome: VITE_SUPABASE_URL
Valor: https://jmefqzhoumdcgcxtdssu.supabase.co
Ambientes: Production, Preview, Development
✓ Salvar
```

```
Nome: VITE_SUPABASE_PUBLISHABLE_KEY
Valor: (seu sb_publishable_... completo)
Ambientes: Production, Preview, Development
✓ Salvar
```

**Checklist:**
```
□ Todas 3 variáveis adicionadas
□ Nomes SEM espaços e em MAIÚSCULAS onde necessário
□ Valores EXATAMENTE iguais ao .env local
□ Ambientes: Production + Preview + Development marcados
```

---

## ✅ FASE 4: DEPLOYMENT (2 min)

```
□ Ir a Deployments
□ Clicar em "Redeploy" (se existe build anterior) OU
□ Fazer: git push (trigger automático de new build)
□ Aguardar: ⏳ Build em progresso...
□ Resultado: ✅ Ready
```

---

## ✅ FASE 5: VERIFICAR ACESSO (2 min)

```
□ URL gerada: https://your-app.vercel.app
□ Página carrega sem erros (F12 → Console vazio)
□ Não há erros de "Variable not found"
```

---

## ✅ FASE 6: TESTAR FUNCIONALIDADES (10 min)

### Autenticação
```
□ Aceder a /auth
□ Fazer Sign Up com email/password
□ Receber email de confirmação (check spam)
□ Fazer login com as credenciais
□ Ver "Logged in" ou seu nome no header
```

### Produtos
```
□ Página Home carrega produtos (do Supabase)
□ Consegue filtrar por categoria
□ Consegue pesquisar produtos
□ Consegue clicar em um produto (detalhes)
```

### Admin Panel (se tiver role admin)
```
□ Aceder a /admin
□ Ver página de admin
□ Criar novo produto
□ Preencher dados
□ Clicar "Salvar"
□ Produto aparece na loja (Home)
```

### Pedidos
```
□ Ir a Home e selecionar um produto
□ Clicar "Adicionar ao Carrinho"
□ Ir a /checkout
□ Preencher dados de entrega
□ Clicar "Confirmar Pedido"
□ Ver confirmação com número do pedido
```

---

## ✅ FASE 7: VERIFICAR DADOS NO SUPABASE (5 min)

### Via Browser:

1. Aceder a: https://app.supabase.com
2. Selecionar seu projeto
3. Clicar em **Table Editor**
4. Abrir cada tabela e verificar:

```
□ products → ter registos criados (admin)
□ orders → ter pedidos criados (checkout)
□ user_roles → ter "user" role para seu utilizador
□ profiles → ter seu perfil criado (sign up)
```

### Via SQL Query:

No SQL Editor, executar:

```sql
SELECT COUNT(*) as total FROM orders;
```

Deve retornar número > 0 se criou pedidos! ✅

---

## 🆘 RESOLVER PROBLEMAS

### Problema: Build Falha em Vercel

**Mensagem de erro típica:**
```
error: VITE_SUPABASE_URL not found
```

**Solução:**
1. Ir a Vercel → Settings → Environment Variables
2. Verificar se as 3 variáveis estão lá
3. Verificar nomes: VITE_SUPABASE_*
4. Clicar "Redeploy" na aba Deployments

### Problema: Dados Não Aparecem / Erro 401

**Sintomas:**
- Consegue login mas não vê dados
- Console mostra erro 401/403 do Supabase

**Solução:**
- Verifique Row Level Security (RLS) policies
- Supabase → Table Editor → Select a table → RLS
- Para teste, pode desativar temporariamente
- Depois reativar com políticas corretas

### Problema: CORS Error

**Sintoma:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solução:**
1. Supabase → Settings → API
2. Ir a "CORS Configuration"
3. Adicionar seu domínio Vercel:
   ```
   https://seu-app.vercel.app
   ```

### Problema: Variáveis Não São Injetadas

**Verifique:**
1. Nomes começam com `VITE_` (obrigatório para Vite)
2. Valores não têm espaços extras
3. Redeploy do Vercel
4. Teste local sem Vercel: `npm run dev` → funciona?

---

## 📊 STATUS FINAL

```
┌─────────────────────────────────────────────┐
│         DEPLOYMENT VERCEL - CHECKLIST       │
├─────────────────────────────────────────────┤
│ Fase 1: Preparação              ✅          │
│ Fase 2: Vercel Setup            ✅          │
│ Fase 3: Env Variables           ✅          │
│ Fase 4: Build & Deploy          ✅          │
│ Fase 5: Acesso                  ✅          │
│ Fase 6: Testes (7 áreas)        ✅          │
│ Fase 7: Dados no Supabase       ✅          │
│                                             │
│ RESULTADO: ✅ TUDO OPERACIONAL              │
│                                             │
│ App em: https://app-name.vercel.app        │
│ Dados em: Supabase Dashboard                │
│ Pronto para: Produção / Clientes             │
└─────────────────────────────────────────────┘
```

---

## 🎯 DEPOIS DO DEPLOY

```
✅ Partilhar URL com clientes
✅ Monitorar performance e erros
✅ Coletar feedback de utilizadores
✅ Iterar features baseado em feedback
✅ Escalar infraestrutura se necessário
```

---

## 📝 NOTAS

- **Build time:** ~2-3 minutos
- **Redeploy:** Automático ao fazer `git push`
- **Downtime:** ~1 minuto durante deploy (não ideal, mas OK)
- **Custo:** Vercel (grátis), Supabase (grátis até certo ponto)

---

**Parabéns! Seu app está em produção! 🚀**

*Documento: Checklist de Deployment Vercel*
*Atualizado: 25 de Fevereiro de 2026*
