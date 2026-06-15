# 🧪 Guia de Testes - Marrengula-IT

## 📋 Checklist de Testes

### ✅ PASSO 1: Popular Base de Dados

**Status**: ⏳ Em andamento

**Ações**:
1. Acessar Supabase Dashboard
2. SQL Editor → New query
3. Copiar conteúdo de `setup-complete.sql`
4. Executar query
5. Verificar: "Setup completo! Total de produtos: 12"

**Resultado Esperado**:
- 12 produtos inseridos
- Tabelas configuradas com RLS
- Índices criados

---

### ✅ PASSO 2: Verificar Produtos no Site

**Ações**:
1. Iniciar aplicação: `npm run dev`
2. Acessar: http://localhost:5173
3. Verificar se produtos aparecem na home
4. Ir para /produtos
5. Verificar listagem completa

**Resultado Esperado**:
- Produtos visíveis na home
- Página de produtos funcional
- Imagens carregando
- Preços exibidos corretamente

---

### ✅ PASSO 3: Criar Usuário Admin

**Opção A - Via Interface** (Recomendado):
1. Acessar: http://localhost:5173/auth
2. Criar conta com email e senha
3. Verificar email (se configurado)
4. Copiar User ID do Supabase

**Opção B - Via SQL**:
```sql
-- Após criar usuário via interface, execute:
INSERT INTO user_roles (user_id, role)
VALUES ('SEU-USER-ID-AQUI', 'admin');
```

**Como pegar User ID**:
1. Supabase → Authentication → Users
2. Clicar no usuário criado
3. Copiar o ID (UUID)

---

### ✅ PASSO 4: Testar Painel Admin

**Ações**:
1. Fazer login com usuário admin
2. Acessar: http://localhost:5173/admin
3. Testar cada aba

**Testes por Aba**:

#### Visão Geral:
- [ ] Cards mostram números reais
- [ ] Solicitações de serviços aparecem
- [ ] Newsletter aparece

#### Pedidos:
- [ ] Criar pedido de teste (via checkout)
- [ ] Verificar se aparece na lista
- [ ] Atualizar status
- [ ] Ver detalhes

#### Utilizadores:
- [ ] Ver lista de usuários
- [ ] Clicar em "Ver Detalhes"
- [ ] Alterar roles
- [ ] Salvar

#### Produtos:
- [ ] Ver lista de produtos (12 produtos)
- [ ] Clicar em "Novo Produto"
- [ ] Preencher formulário
- [ ] Criar produto
- [ ] Editar produto existente
- [ ] Deletar produto (confirmar)

#### Lojas:
- [ ] Ver lista de lojas
- [ ] Ver detalhes de uma loja
- [ ] Verificar estatísticas

---

### ✅ PASSO 5: Testar Funcionalidades Públicas

**Navegação**:
- [ ] Header funcional
- [ ] MegaMenu abre e fecha
- [ ] Busca funciona
- [ ] Links navegam corretamente

**Produtos**:
- [ ] Clicar em produto
- [ ] Ver detalhes
- [ ] Adicionar ao carrinho
- [ ] Adicionar aos favoritos

**Carrinho**:
- [ ] Ver carrinho
- [ ] Atualizar quantidades
- [ ] Aplicar cupom
- [ ] Ir para checkout

**Checkout**:
- [ ] Preencher formulário
- [ ] Selecionar método de pagamento
- [ ] Finalizar pedido
- [ ] Ver confirmação

**Favoritos**:
- [ ] Ver lista de favoritos
- [ ] Remover favorito

---

## 🐛 Problemas Comuns

### Produtos não aparecem:
```
Causa: Base de dados vazia
Solução: Executar setup-complete.sql
```

### Erro ao acessar /admin:
```
Causa: Usuário não é admin
Solução: Adicionar role admin no user_roles
```

### Erro "auth.admin is not a function":
```
Causa: anon key não tem permissão
Solução: Usar RPC function (próximo passo)
```

### Imagens não carregam:
```
Causa: URLs do Unsplash podem estar bloqueadas
Solução: Verificar conexão ou usar outras URLs
```

---

## 📊 Resultados Esperados

### Base de Dados:
- ✅ 12 produtos
- ✅ 0 pedidos (até criar teste)
- ✅ 0 favoritos (até adicionar)
- ✅ 1+ usuários

### Painel Admin:
- ✅ Dashboard com números reais
- ✅ CRUD de produtos funcional
- ✅ Gestão de usuários funcional
- ✅ Gestão de lojas funcional

### Site Público:
- ✅ Produtos visíveis
- ✅ Carrinho funcional
- ✅ Favoritos funcional
- ✅ Checkout funcional

---

## 🎯 Próximos Passos Após Testes

1. Corrigir bugs encontrados
2. Implementar melhorias
3. Adicionar funcionalidades avançadas

---

**Use este guia para testar sistematicamente todas as funcionalidades!**
