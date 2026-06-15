# 🔧 Guia Completo de Configuração da Base de Dados - MarrengulaIT

## 📋 Status Atual

- ✅ Credenciais do Supabase atualizadas em `.env`
- ✅ Código analisado e todas as tabelas identificadas
- ⏳ Base de dados pronta para configuração

## 🚀 Como Configurar a Base de Dados

### Método 1: Executar via Supabase Console (RECOMENDADO)

1. **Aceder ao Supabase Dashboard**
   - Vá a: https://app.supabase.com
   - Faça login com sua conta

2. **Selecionar o Projeto**
   - Clique em seu projeto: **jmefqzhoumdcgcxtdssu**
   - Vá até à aba **SQL Editor**

3. **Copiar e Colar o Script**
   - Abra este ficheiro: `SETUP_DATABASE_MANUAL.sql`
   - Copie TODO o conteúdo
   - Cole no SQL Editor do Supabase
   - Clique em **"Run"** (botão azul no canto inferior direito)

4. **Verificar se Correu Bem**
   - Se vir "Success" em verde, a configuração foi bem-sucedida
   - Se houver erros, verifique a mensagem de erro (em vermelho)

### Método 2: Usar Migração em Partes (Se houver timeout)

Se o script completo gerar timeout, execute em 3 partes:

#### Parte 1: Tabelas de Autenticação (5 minutos)
- Crie um novo query
- Copie linhas 1-40 do ficheiro `SETUP_DATABASE_MANUAL.sql`
- Execute

#### Parte 2: Tabelas de E-commerce (5 minutos)
- Crie um novo query
- Copie linhas 41-120 do ficheiro
- Execute

#### Parte 3: Funções, RLS e Triggers (10 minutos)
- Crie um novo query
- Copie linhas 121-400 (resto do ficheiro)
- Execute

---

## ✅ O que Foi Criado

### 📊 Tabelas (14 tabelas)

| Tabela | Descrição |
|--------|-----------|
| `profiles` | Perfis de utilizadores |
| `user_roles` | Papéis dos utilizadores (admin/vendor/user) |
| `products` | Catálogo de produtos |
| `orders` | Pedidos do cliente |
| `order_items` | Itens dentro de cada pedido |
| `product_questions` | Q&A dos produtos |
| `price_history` | Histórico de variações de preço |
| `recently_viewed` | Produtos visualizados recentemente |
| `loyalty_points` | Pontos de fidelidade dos clientes |
| `points_transactions` | Histórico de transações de pontos |
| `price_alerts` | Alertas de preço de clientes |
| `product_badges` | Badges/Promoções dos produtos |
| `payment_methods` | Métodos de pagamento dos clientes |
| `affiliates` | Programa de afiliados |

### 🔧 Funções SQL (4 funções)

- `has_role()` - Verifica se um utilizador tem um papel específico
- `track_product_view()` - Rastreia visualizações de produtos
- `create_order()` - Função RPC para criar pedidos
- `create_affiliate()` - Função RPC para criar conta de afiliado

### 🔐 Segurança

- ✅ Row Level Security (RLS) ativado em TODAS as tabelas
- ✅ Políticas de acesso configuradas por tabela
- ✅ Apenas dados relevantes são visíveis para cada utilizador

### ⚡ Performance

- ✅ 18 índices criados para otimizar queries
- ✅ Triggers automáticos para manutenção de dados
- ✅ Sincronização automática de timestamps

---

## 🧪 Verificar a Configuração

Depois de executar o script, teste se tudo funcionou:

### 1. Verificar Tabelas no Supabase
- Vá a **Table Editor** no Supabase
- Você deve ver todas as 14 tabelas listadas

### 2. Verificar as Funções
- Vá a **SQL Editor** → **Database Functions**
- Você deve ver:
  - `has_role`
  - `track_product_view`
  - `create_order`
  - `create_affiliate`

### 3. Testar a Aplicação (Local)
```bash
# Certifique-se de que as credenciais .env estão corretas
npm run dev
```

Se tudo correr bem, você deve:
- ✅ Conseguir fazer login
- ✅ Ver o painel de admin (se tiver role de admin)
- ✅ Ver produtos na loja
- ✅ Poder criar pedidos

---

## 🆘 Resolver Problemas

### Erro: "Type app_role already exists"
**Solução:** O tipo já foi criado. Isso é normal. Pode ignorar ou prosseguir com o resto do script.

### Erro: "Table profiles already exists"
**Solução:** As tabelas já existem. Use `DROP TABLE IF EXISTS` antes de recriar, ou simplesmente ignore este erro.

### Erro: "Connection timeout"
**Solução:** Divida o script em 3 partes (veja acima em "Método 2")

### Erro ao tentar inserir um produto
**Solução:** Verifique se você tem o papel 'admin' ou 'vendor':
```sql
-- No SQL Editor, execute:
SELECT * FROM user_roles WHERE user_id = 'seu-user-id';
```

Se não houver resultado, você precisa ter um admin criando seu role primeiro.

---

## 📱 Integração com a Aplicação React

O código já está pronto para usar! Os serviços já fazem chamadas às tabelas:

- `src/services/productService.ts` - Gerencia produtos
- `src/services/orderService.ts` - Gerencia pedidos
- `src/services/userService.ts` - Gerencia utilizadores
- `src/services/advancedFeaturesService.ts` - Funcionalidades avançadas
- `src/pages/Affiliate.tsx` - Programa de afiliados

---

## 🎯 Próximas Etapas

1. ✅ Executar o script SQL no Supabase
2. ✅ Verificar que tudo foi criado corretamente
3. ✅ Executar `npm run dev` localmente
4. ✅ Testar login e criação de produtos
5. ✅ Testar criação de pedidos
6. ✅ Testar programa de afiliados

---

## 📞 Contato & Suporte

Se encontrar algum problema:
1. Verifique o ficheiro de erros no SQL Editor
2. Copie a mensagem de erro exata
3. Tente o método 2 (executar em partes)

---

**Boa sorte! 🚀**
