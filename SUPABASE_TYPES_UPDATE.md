# Atualização de Types do Supabase

## 📋 Pré-requisitos

1. Instalar Supabase CLI:
```bash
npm install -g supabase
```

2. Fazer login no Supabase:
```bash
supabase login
```

## 🔄 Gerar Types Atualizados

### Opção 1: Via CLI (Recomendado)

```bash
# Substitua SEU_PROJECT_ID pelo ID do seu projeto Supabase
npx supabase gen types typescript --project-id SEU_PROJECT_ID > src/integrations/supabase/types.ts
```

### Opção 2: Via Dashboard

1. Acesse: https://supabase.com/dashboard/project/SEU_PROJECT_ID/api
2. Vá para a seção "TypeScript"
3. Copie o código gerado
4. Cole em `src/integrations/supabase/types.ts`

## 📝 Quando Atualizar

Atualize os types sempre que:
- Criar novas tabelas no banco de dados
- Modificar estrutura de tabelas existentes
- Adicionar/remover colunas
- Alterar tipos de dados
- Criar novas functions ou enums

## 🔍 Verificar Project ID

Seu Project ID está na URL do dashboard:
```
https://supabase.com/dashboard/project/[PROJECT_ID]/...
```

Ou nas variáveis de ambiente:
```
VITE_SUPABASE_URL=https://[PROJECT_ID].supabase.co
```

## ✅ Após Atualizar

1. Verifique se não há erros de TypeScript:
```bash
npm run build
```

2. Reinicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 📚 Tabelas Atuais no Schema

Com base no SQL fornecido, as seguintes tabelas devem estar nos types:

- `profiles`
- `user_roles`
- `products`
- `orders`
- `order_items`
- `product_questions`
- `price_history`
- `recently_viewed`
- `loyalty_points`
- `points_transactions`
- `price_alerts`
- `product_compatibility`
- `product_badges`
- `payment_methods`

## 🛠️ Troubleshooting

### Erro: "Project not found"
- Verifique se está logado: `supabase login`
- Confirme o Project ID

### Erro: "Permission denied"
- Verifique suas permissões no projeto Supabase
- Tente fazer login novamente

### Types incompletos
- Certifique-se de que todas as tabelas têm RLS habilitado
- Verifique se as migrations foram aplicadas corretamente
