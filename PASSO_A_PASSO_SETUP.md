# 🎯 INSTRUÇÕES PASSO A PASSO - Configuração da Base de Dados

## Status da Integração

```
✅ Credenciais atualizadas (.env)
✅ Código analisado completamente
✅ Script SQL gerado
⏳ Base de dados pronta para ser criada
```

---

## PASSO 1: Aceder ao Supabase

### 1.1 Abrir o Dashboard do Supabase

1. Vá a: **https://app.supabase.com**
2. Faça login com sua conta Supabase
3. Você deve ver a lista de seus projetos

### 1.2 Selecionar o Projeto Correto

Na página de projetos, procure por:
```
Projeto ID: jmefqzhoumdcgcxtdssu
Nome do projeto: Deve conter referência a novo projeto
```

Clique no projeto para abrir o dashboard.

---

## PASSO 2: Abrir o SQL Editor

Dentro do dashboard do projeto:

1. Clique na aba **SQL Editor** (lado esquerdo)
2. Clique em **New Query** (botão azul no topo)
3. Você verá um campo em branco para escrever SQL

### Aparência esperada:
```
┌─────────────────────────────────────────┐
│  SQL Editor              [New Query] ▼   │
├─────────────────────────────────────────┤
│                                         │
│  SELECT * FROM ...                      │
│  (seu SQL aqui)                         │
│                                         │
├─────────────────────────────────────────┤
│  [Run] ▶️   [Save]   [Share]            │
└─────────────────────────────────────────┘
```

---

## PASSO 3: Copiar o Script SQL

### 3.1 Abrir o Ficheiro SQL

No seu computador, em VS Code:
- Abra o ficheiro: `SETUP_DATABASE_MANUAL.sql`
- Este ficheiro tem ~400 linhas com todo o código necessário

### 3.2 Copiar TODO o Conteúdo

```
Ctrl+A  (selecionar tudo)
Ctrl+C  (copiar)
```

---

## PASSO 4: Colar no Supabase

### 4.1 Colar o Script

1. Clique no campo de texto do SQL Editor
2. Cole o script:
```
Ctrl+V
```

### 4.2 Verificar se Colou Bem

Você deve ver linhas como:
```sql
CREATE TYPE app_role AS ENUM ('admin', 'vendor', 'user');

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  ...
)
```

---

## PASSO 5: Executar o Script

### 5.1 Clicar em "Run"

- Procure o botão **[Run] ▶️** (em azul)
- Clique nele
- O sistema começará a executar o script

### 5.2 Aguardar Execução

- Tempo estimado: **5 a 15 minutos**
- Não feche a página e não cancele a operação
- Você verá uma barra de progresso

### 5.3 Verificar Resultado

**Se Tudo Correu Bem:**
```
✅ Success
└─ All done!
```

**Se Houver Erro:**
```
❌ Error
└─ [mensagem de erro em vermelho]
```

---

## PASSO 6: Ignorar Mensagens de Aviso

Durante a execução, pode ver mensagens como:

```
⚠️  Type "app_role" already exists
⚠️  Table "profiles" already exists  
⚠️  Function "has_role" already exists
```

**Isto é NORMAL.** Significa que:
- O código foi executado antes (ou parcialmente)
- OU múltiplas tentativas de execução
- Pode ignorar estas mensagens e continuar

---

## PASSO 7: Verificar as Tabelas Criadas

Depois de executar o script com sucesso:

### 7.1 Abrir Table Editor

No dashboard do Supabase (lado esquerdo):
1. Clique em **Table Editor**
2. Expanda a lista de tabelas

### 7.2 Verificar a Lista

Você deve ver TODAS estas 14 tabelas:

```
auth
├─ users
├─ sessions
└─ ...

public
├─ profiles
├─ user_roles
├─ products
├─ orders
├─ order_items
├─ product_questions
├─ price_history
├─ recently_viewed
├─ loyalty_points
├─ points_transactions
├─ price_alerts
├─ product_badges
├─ payment_methods
└─ affiliates
```

Se vir todas estas, excelente! ✅

---

## PASSO 8: Verificar as Funções

No dashboard:
1. Clique em **Database Functions** (ou procure "Functions")
2. Deve ver:
   - `has_role`
   - `track_product_view`
   - `create_order`
   - `create_affiliate`

---

## PASSO 9: Testar a Integração Localmente

Abra seu terminal no VS Code:

```bash
# Terminal → New Terminal (ou Ctrl+`)

# Executar o script de teste
node test-database-integration.js
```

**Resultado esperado:**

```
🔍 Verificando Integração Supabase

📡 Testando Conexão...
✅ Conexão com Supabase estabelecida

📊 Verificando Tabelas...
✅ profiles
✅ user_roles
✅ products
✅ orders
[... resto das tabelas ...]

⚙️  Verificando Funções SQL...
✅ has_role
✅ track_product_view
✅ create_order
✅ create_affiliate

═════════════════════════════════════════
📋 RESUMO FINAL
═════════════════════════════════════════
✅ TUDO OK! Base de dados completamente configurada!
```

Se tudo passar, pode proceder para o próximo passo! ✅

---

## PASSO 10: Executar a Aplicação

```bash
# No terminal, execute:
npm run dev

# Você deve ver:
# ✨ ready in 450ms.
# ➜  Local:   http://localhost:5173/
```

Abra http://localhost:5173 no navegador.

---

## 🆘 Resolver Problemas

### Problema 1: Erro de Timeout no SQL Editor

**Sintoma:** Mensagem de timeout após 30 segundos

**Solução:** Divida o script em 3 partes:

**Parte 1** (Linhas 1-40):
```sql
CREATE TYPE app_role AS ENUM ('admin', 'vendor', 'user');
-- ... até às primeiras tabelas
```
Execute e aguarde sucesso.

**Parte 2** (Linhas 41-150):
```sql
-- Tabelas de e-commerce
CREATE TABLE IF NOT EXISTS products (...)
-- ... até ao fim das tabelas
```
Execute novamente.

**Parte 3** (Linhas 151-400):
```sql
-- Funções, RLS, Triggers
CREATE OR REPLACE FUNCTION has_role(...)
-- ... até ao fim
```
Execute por último.

### Problema 2: "Type app_role already exists"

**Solução:** Isto é normal. Significa que parte do script já foi executada.
- Pode ignorar e prosseguir
- OU remova a linha `CREATE TYPE app_role AS ENUM...`

### Problema 3: "Table already exists"

**Solução:** Use `DROP TABLE IF EXISTS` ou `CREATE TABLE IF NOT EXISTS`
- O script já usa `IF NOT EXISTS`, portanto é seguro executar de novo

### Problema 4: Aplicação não conecta à base de dados

**Verificação:**

1. Confirme que .env está correto:
```env
VITE_SUPABASE_PROJECT_ID="jmefqzhoumdcgcxtdssu"
VITE_SUPABASE_URL="https://jmefqzhoumdcgcxtdssu.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable_..."
```

2. Execute o teste de integração:
```bash
node test-database-integration.js
```

3. Se falhar, verifique no Supabase se as tabelas existem realmente

### Problema 5: Erro de Row Level Security (RLS)

**Sintoma:** "new row violates row-level security policy"

**Solução:** Isto significa que as políticas RLS estão restritivas (segurança normal)

Para testar com um utilizador:
1. Crie uma conta na aplicação (Sign Up)
2. Faça login
3. Tente criar um produto/pedido

---

## ✅ Checklist Final

Antes de considerar PRONTO:

```
□ Script SQL executado com sucesso no Supabase
□ 14 tabelas criadas e visíveis no Table Editor
□ 4 funções criadas e visíveis em Database Functions
□ Script de teste passou: node test-database-integration.js
□ npm run dev funciona sem erros
□ Consegue aceder a http://localhost:5173
□ Consegue fazer login/signup
□ Consegue ver produtos na home
□ Consegue criar um pedido
```

Se todos os pontos estiverem, ✅ **PARABÉNS! Tudo está funcional!**

---

## 📚 Ficheiros de Referência

| Ficheiro | Descrição |
|----------|-----------|
| `SETUP_DATABASE_MANUAL.sql` | Script SQL completo |
| `test-database-integration.js` | Teste de integração |
| `GUIA_CONFIGURACAO_DATABASE.md` | Guia técnico detalhado |
| `.env` | Credenciais Supabase |
| `src/integrations/supabase/types.ts` | Tipos da base de dados |
| `src/services/*.ts` | Serviços que usam a DB |

---

**Boa sorte! Qualquer dúvida, consulte os ficheiros de referência. 🚀**
