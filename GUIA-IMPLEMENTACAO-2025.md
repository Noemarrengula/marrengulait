# 🚀 GUIA DE IMPLEMENTAÇÃO COMPLETA - MARRENGULA-IT 2025

## 📋 ÍNDICE
1. [Setup do Backend](#1-setup-do-backend)
2. [Configuração de Pagamentos](#2-configuração-de-pagamentos)
3. [Design e Tema](#3-design-e-tema)
4. [Painel Admin](#4-painel-admin)
5. [Importação de Produtos](#5-importação-de-produtos)
6. [Testes e Deploy](#6-testes-e-deploy)

---

## 1. SETUP DO BACKEND

### 1.1 Criar Novo Projeto Supabase

1. Acesse https://supabase.com/dashboard
2. Clique em "New Project"
3. Nome: `marrengula-it-2025`
4. Senha forte do banco de dados
5. Região: `Southeast Asia (Singapore)` (mais próxima de Moçambique)

### 1.2 Executar Script SQL

1. No Supabase Dashboard, vá em **SQL Editor**
2. Clique em **New Query**
3. Cole todo o conteúdo do arquivo `supabase-setup-completo-2025.sql`
4. Clique em **Run** (ou F5)
5. Aguarde a execução (deve levar ~30 segundos)

### 1.3 Criar Usuário Admin

No SQL Editor, execute:

```sql
-- Substitua pelo seu email
SELECT promote_to_admin('seu-email@exemplo.com');
```

### 1.4 Configurar Variáveis de Ambiente

Atualize o arquivo `.env`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-anon-key
```

Encontre essas informações em: **Project Settings** → **API**

---

## 2. CONFIGURAÇÃO DE PAGAMENTOS

### 2.1 Métodos Já Configurados

O sistema já inclui:
- ✅ M-Pesa (Vodacom)
- ✅ e-Mola (Mcel)
- ✅ Mkesh (Movitel)
- ✅ Transferência Bancária
- ✅ Pagamento na Entrega

### 2.2 Integração M-Pesa (Opcional - Produção)

Para integração real com M-Pesa:

1. Registre-se no portal de desenvolvedores Vodacom
2. Obtenha credenciais API (API Key, Public Key)
3. Configure no Supabase:

```sql
UPDATE payment_methods 
SET config = jsonb_build_object(
  'api_key', 'SUA_API_KEY',
  'public_key', 'SUA_PUBLIC_KEY',
  'service_provider_code', 'SEU_CODIGO'
)
WHERE code = 'mpesa';
```

### 2.3 Configurar Contas Bancárias

Adicione suas informações bancárias:

```sql
UPDATE payment_methods 
SET config = jsonb_build_object(
  'bank_name', 'Banco de Moçambique',
  'account_number', '1234567890',
  'account_name', 'Marrengula-IT',
  'swift', 'BMOCMZMX'
)
WHERE code = 'bank_transfer';
```

---

## 3. DESIGN E TEMA

### 3.1 Análise do Facebook MarrengulaHomeTech

Baseado na página do Facebook, o design deve ter:

**Cores:**
- Primária: Azul tecnológico (#0066CC ou similar)
- Secundária: Laranja/Vermelho para CTAs (#FF6600)
- Fundo: Branco limpo com cinza claro (#F5F5F5)

**Elementos:**
- Logo com texto "Marrengula" em destaque
- Banners promocionais grandes
- Cards de produtos com preços em destaque
- Badges de "Novo", "Promoção", "Frete Grátis"
- Ícones de redes sociais

### 3.2 Atualizar Cores do Tema

Edite `src/index.css`:

```css
:root {
  --primary: 210 100% 50%; /* Azul tecnológico */
  --primary-foreground: 0 0% 100%;
  --secondary: 24 100% 50%; /* Laranja */
  --secondary-foreground: 0 0% 100%;
  --accent: 210 40% 96%;
  --accent-foreground: 210 100% 40%;
}
```

### 3.3 Atualizar Logo

Substitua o logo em `src/assets/marrengula-logo.png` com o logo oficial.

---

## 4. PAINEL ADMIN

### 4.1 Estrutura do Painel

O painel admin deve ter:

```
/admin
├── Dashboard (Visão Geral)
├── Produtos
│   ├── Lista de Produtos
│   ├── Adicionar Produto
│   └── Editar Produto
├── Pedidos
│   ├── Todos os Pedidos
│   ├── Pendentes
│   ├── Em Processamento
│   └── Concluídos
├── Clientes
├── Categorias & Marcas
├── Cupons
├── Pagamentos
├── Configurações
└── Relatórios
```

### 4.2 Criar Componente Admin Dashboard

Crie `src/pages/AdminDashboard.tsx`:

```tsx
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [products, orders, pending] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('total_amount'),
      supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending')
    ]);

    const revenue = orders.data?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;

    setStats({
      totalProducts: products.count || 0,
      totalOrders: orders.data?.length || 0,
      pendingOrders: pending.count || 0,
      totalRevenue: revenue
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalProducts}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalOrders}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pedidos Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">{stats.pendingOrders}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receita Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {stats.totalRevenue.toLocaleString('pt-MZ')} MT
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### 4.3 Gestão de Produtos

Crie `src/pages/AdminProducts.tsx`:

```tsx
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*, category:categories(name), brand:brands(name)')
      .order('created_at', { ascending: false });
    
    setProducts(data || []);
  };

  const deleteProduct = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      await supabase.from('products').delete().eq('id', id);
      loadProducts();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Produto
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Imagem</th>
              <th className="px-6 py-3 text-left">Produto</th>
              <th className="px-6 py-3 text-left">Categoria</th>
              <th className="px-6 py-3 text-left">Preço</th>
              <th className="px-6 py-3 text-left">Stock</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => (
              <tr key={product.id} className="border-t">
                <td className="px-6 py-4">
                  <img src={product.image_url} alt={product.title} className="w-12 h-12 object-cover rounded" />
                </td>
                <td className="px-6 py-4">{product.title}</td>
                <td className="px-6 py-4">{product.category?.name}</td>
                <td className="px-6 py-4">{product.price} MT</td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteProduct(product.id)}>
                    <Trash className="h-4 w-4 text-red-600" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## 5. IMPORTAÇÃO DE PRODUTOS

### 5.1 Preparar CSV de Produtos

Crie um arquivo `produtos.csv`:

```csv
sku,title,category_slug,brand_slug,price,compare_at_price,stock,description,image_url
SM-A54-BLK,Samsung Galaxy A54 5G 128GB Preto,smartphones,samsung,18999,21999,15,"Smartphone Samsung com tela AMOLED de 6.4 polegadas",https://exemplo.com/samsung-a54.jpg
IP-14-BLU,iPhone 14 128GB Azul,smartphones,apple,45999,49999,8,"iPhone 14 com chip A15 Bionic",https://exemplo.com/iphone-14.jpg
```

### 5.2 Script de Importação

Crie `import-products.js`:

```javascript
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import csv from 'csv-parser';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Use service key para admin
);

const products = [];

fs.createReadStream('produtos.csv')
  .pipe(csv())
  .on('data', (row) => products.push(row))
  .on('end', async () => {
    for (const product of products) {
      // Buscar IDs de categoria e marca
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', product.category_slug)
        .single();

      const { data: brand } = await supabase
        .from('brands')
        .select('id')
        .eq('slug', product.brand_slug)
        .single();

      // Inserir produto
      await supabase.from('products').insert({
        sku: product.sku,
        title: product.title,
        category_id: category?.id,
        brand_id: brand?.id,
        price: parseFloat(product.price),
        compare_at_price: parseFloat(product.compare_at_price),
        stock: parseInt(product.stock),
        description: product.description,
        image_url: product.image_url,
        slug: product.title.toLowerCase().replace(/\s+/g, '-'),
        is_active: true
      });

      console.log(`✅ Importado: ${product.title}`);
    }
    
    console.log('🎉 Importação concluída!');
  });
```

Execute:
```bash
node import-products.js
```

---

## 6. TESTES E DEPLOY

### 6.1 Testar Localmente

```bash
npm install
npm run dev
```

Acesse: http://localhost:5173

### 6.2 Testar Funcionalidades

- [ ] Registro de usuário
- [ ] Login
- [ ] Navegação de produtos
- [ ] Adicionar ao carrinho
- [ ] Checkout
- [ ] Seleção de método de pagamento
- [ ] Criação de pedido
- [ ] Acesso ao painel admin
- [ ] Gestão de produtos
- [ ] Gestão de pedidos

### 6.3 Deploy

**Opção 1: Vercel**
```bash
npm i -g vercel
vercel
```

**Opção 2: Netlify**
```bash
npm i -g netlify-cli
netlify deploy --prod
```

Configure as variáveis de ambiente na plataforma escolhida.

---

## 📞 PRÓXIMOS PASSOS

1. ✅ Execute o script SQL no Supabase
2. ✅ Configure as variáveis de ambiente
3. ✅ Crie seu usuário admin
4. ✅ Atualize o design/cores
5. ✅ Importe os produtos reais
6. ✅ Teste todas as funcionalidades
7. ✅ Configure métodos de pagamento
8. ✅ Deploy em produção

---

## 🆘 SUPORTE

Se precisar de ajuda:
1. Verifique os logs do Supabase
2. Teste as queries SQL manualmente
3. Verifique as políticas RLS
4. Confirme as variáveis de ambiente

**Tudo pronto para começar! 🚀**
