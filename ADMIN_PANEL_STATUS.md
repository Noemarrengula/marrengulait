# 🔐 Estado do Painel de Administrador - Marrengula-IT

## 📊 Visão Geral

**Rota**: `/admin`  
**Acesso**: Apenas usuários com role `admin`  
**Status**: Parcialmente implementado

---

## ✅ Funcionalidades Implementadas

### 1. **Autenticação e Autorização**
- ✅ Hook `useAuth` com verificação de roles
- ✅ Redirecionamento automático se não for admin
- ✅ Verificação de role `admin` via tabela `user_roles`
- ✅ Loading state durante verificação

### 2. **Layout e Estrutura**
- ✅ Header e Footer integrados
- ✅ Sistema de Tabs (5 abas)
- ✅ Design responsivo
- ✅ Cards de estatísticas (4 cards)

### 3. **Gestão de Pedidos** ⭐ (Funcional)
- ✅ Listagem de todos os pedidos
- ✅ Tabela com informações completas
- ✅ Atualização de status do pedido (6 estados)
- ✅ Atualização de status de pagamento (4 estados)
- ✅ Visualização de detalhes em modal
- ✅ Informações do cliente
- ✅ Itens do pedido
- ✅ Endereço de entrega
- ✅ Método de pagamento
- ✅ Toast notifications

---

## 🚧 Funcionalidades em Desenvolvimento

### 1. **Visão Geral (Dashboard)**
- ⚠️ Cards de estatísticas com valores fixos (0)
- ❌ Não conectado à base de dados
- ❌ Sem gráficos ou analytics

**Cards Atuais:**
- Total Utilizadores: 0
- Total Produtos: 0
- Total Lojas: 0
- Vendas Hoje: 0

### 2. **Gestão de Utilizadores**
- ❌ Apenas placeholder
- ❌ Sem listagem de usuários
- ❌ Sem edição de roles
- ❌ Sem bloqueio/desbloqueio

### 3. **Gestão de Produtos**
- ❌ Apenas placeholder
- ❌ Sem listagem de produtos
- ❌ Sem CRUD de produtos
- ❌ Sem aprovação/moderação

### 4. **Gestão de Lojas**
- ❌ Apenas placeholder
- ❌ Sem listagem de lojas
- ❌ Sem aprovação de lojas
- ❌ Sem gestão de vendedores

---

## 📁 Arquivos do Painel Admin

```
src/
├── pages/
│   └── Admin.tsx                    # Página principal (✅)
├── components/admin/
│   ├── OrdersTable.tsx              # Tabela de pedidos (✅)
│   └── OrderDetailsDialog.tsx       # Modal de detalhes (✅)
├── hooks/
│   └── useAuth.tsx                  # Hook de autenticação (✅)
├── services/
│   └── orderService.ts              # Serviço de pedidos (✅)
└── types/
    └── order.ts                     # Tipos de pedidos (✅)
```

---

## 🔧 Dependências de Base de Dados

### Tabelas Necessárias:

#### ✅ Implementadas:
- `orders` - Pedidos
- `order_items` - Itens dos pedidos
- `user_roles` - Roles dos usuários

#### ❌ Faltando:
- `users` - Informações estendidas de usuários
- `products` - Produtos (existe mas não integrado)
- `stores` - Lojas/Vendedores
- `product_reviews` - Avaliações de produtos

---

## 🎯 Funcionalidades Prioritárias para Implementar

### Alta Prioridade:

1. **Dashboard com Dados Reais**
   - Conectar cards de estatísticas à base de dados
   - Adicionar gráficos de vendas
   - Mostrar pedidos recentes
   - Indicadores de performance

2. **Gestão de Produtos**
   - Listagem de produtos
   - Adicionar novo produto
   - Editar produto existente
   - Deletar produto
   - Upload de imagens
   - Gestão de estoque

3. **Gestão de Utilizadores**
   - Listagem de usuários
   - Visualizar perfil
   - Atribuir/remover roles
   - Bloquear/desbloquear conta
   - Histórico de atividades

### Média Prioridade:

4. **Gestão de Lojas**
   - Listagem de lojas
   - Aprovar/rejeitar lojas
   - Editar informações da loja
   - Estatísticas por loja

5. **Relatórios e Analytics**
   - Relatório de vendas
   - Produtos mais vendidos
   - Lojas com melhor performance
   - Exportar dados (CSV/PDF)

### Baixa Prioridade:

6. **Gestão de Serviços**
   - Visualizar solicitações de serviços
   - Atribuir técnicos
   - Atualizar status

7. **Configurações do Sistema**
   - Configurações gerais
   - Gestão de cupons
   - Configurações de email
   - Banners e promoções

---

## 🔐 Sistema de Roles

### Roles Implementados:
- `admin` - Acesso total ao painel
- `vendor` - Vendedor (não implementado)
- `user` - Usuário comum

### Verificação de Acesso:
```typescript
const { user, isAdmin, loading } = useAuth();

// Redireciona se não for admin
if (!isAdmin) navigate('/');
```

---

## 📊 Status dos Pedidos

### Order Status (6 estados):
- `pending` - Pendente
- `confirmed` - Confirmado
- `processing` - Processando
- `shipped` - Enviado
- `delivered` - Entregue
- `cancelled` - Cancelado

### Payment Status (4 estados):
- `pending` - Pendente
- `paid` - Pago
- `failed` - Falhou
- `refunded` - Reembolsado

---

## 🚀 Como Acessar o Painel

1. **Criar usuário admin** (via SQL no Supabase):
```sql
-- Após criar usuário via auth
INSERT INTO user_roles (user_id, role)
VALUES ('seu-user-id-aqui', 'admin');
```

2. **Fazer login** na aplicação

3. **Acessar**: `http://localhost:5173/admin`

---

## 📝 Próximos Passos Recomendados

### Fase 1: Dashboard Funcional
1. Conectar cards de estatísticas à base de dados
2. Adicionar query para contar usuários
3. Adicionar query para contar produtos
4. Adicionar query para vendas do dia

### Fase 2: Gestão de Produtos
1. Criar componente `ProductsTable`
2. Criar componente `ProductForm`
3. Implementar CRUD completo
4. Adicionar upload de imagens

### Fase 3: Gestão de Utilizadores
1. Criar componente `UsersTable`
2. Criar componente `UserDetailsDialog`
3. Implementar gestão de roles
4. Adicionar filtros e busca

---

## 🎨 Melhorias de UX Sugeridas

1. **Filtros e Busca**
   - Filtrar pedidos por status
   - Buscar por número de pedido
   - Filtrar por data

2. **Paginação**
   - Adicionar paginação nas tabelas
   - Seletor de itens por página

3. **Exportação**
   - Exportar pedidos para CSV
   - Gerar relatórios em PDF

4. **Notificações**
   - Notificar novos pedidos
   - Alertas de estoque baixo

---

**Última Atualização**: Hoje  
**Versão**: 1.0.0 (Parcial)
