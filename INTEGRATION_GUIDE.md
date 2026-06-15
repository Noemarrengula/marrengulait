# 🔗 Guia de Integração Backend-Frontend

## 📚 Índice

1. [Arquitetura](#arquitetura)
2. [Configuração](#configuração)
3. [Serviços](#serviços)
4. [Hooks Personalizados](#hooks-personalizados)
5. [Realtime](#realtime)
6. [Exemplos de Uso](#exemplos-de-uso)
7. [Boas Práticas](#boas-práticas)

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                    React Components                      │
├─────────────────────────────────────────────────────────┤
│                   Custom Hooks (React Query)             │
│  useProducts | useOrders | useAuth | useRealtime        │
├─────────────────────────────────────────────────────────┤
│                      Services Layer                      │
│  productService | orderService | advancedFeaturesService│
├─────────────────────────────────────────────────────────┤
│                    Supabase Client                       │
│              (Auth, Database, Realtime)                  │
├─────────────────────────────────────────────────────────┤
│                  Supabase Backend                        │
│         PostgreSQL + Auth + Storage + Realtime           │
└─────────────────────────────────────────────────────────┘
```

---

## ⚙️ Configuração

### 1. Variáveis de Ambiente

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica
```

### 2. React Query Setup

O QueryClient está configurado em `src/main.tsx`:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

---

## 🛠️ Serviços

### productService

**Localização:** `src/services/productService.ts`

```typescript
// Buscar todos os produtos com filtros
const products = await productService.getAllProducts({
  categories: ['Laptops'],
  priceRange: [0, 50000],
  search: 'Dell'
});

// Buscar produto por ID
const product = await productService.getProductById(id);

// Criar produto
const newProduct = await productService.createProduct(productData);

// Atualizar produto
await productService.updateProduct(id, updates);

// Deletar produto
await productService.deleteProduct(id);

// Rastrear visualização
await productService.trackView(productId);
```

### orderService

**Localização:** `src/services/orderService.ts`

```typescript
// Criar pedido
const orderId = await orderService.createOrder(formData, cartItems, userId);

// Buscar pedido
const { order, items } = await orderService.getOrderById(orderId);

// Buscar pedidos do usuário
const orders = await orderService.getUserOrders(userId);

// Atualizar status
await orderService.updateOrderStatus(orderId, 'shipped');
await orderService.updatePaymentStatus(orderId, 'paid');
```

### advancedFeaturesService

**Localização:** `src/services/advancedFeaturesService.ts`

```typescript
// Perguntas & Respostas
const questions = await advancedFeaturesService.getProductQuestions(productId);
await advancedFeaturesService.createQuestion(productId, 'Tem garantia?');

// Histórico de Preços
const history = await advancedFeaturesService.getPriceHistory(productId);

// Produtos Recentes
const recent = await advancedFeaturesService.getRecentlyViewed();

// Pontos de Fidelidade
const points = await advancedFeaturesService.getLoyaltyPoints();
const transactions = await advancedFeaturesService.getPointsTransactions();

// Alertas de Preço
await advancedFeaturesService.createPriceAlert(productId, 45000);
const alerts = await advancedFeaturesService.getPriceAlerts();

// Métodos de Pagamento
const methods = await advancedFeaturesService.getPaymentMethods();
await advancedFeaturesService.createPaymentMethod('mpesa', { phone: '84...' });
```

---

## 🎣 Hooks Personalizados

### useProducts

**Localização:** `src/hooks/useProducts.ts`

```typescript
import { useProducts, useProduct, useCreateProduct } from '@/hooks/useProducts';

// Listar produtos
const { data: products, isLoading, error } = useProducts({
  categories: ['Laptops'],
  search: 'Dell'
});

// Produto individual
const { data: product } = useProduct(productId);

// Criar produto
const createMutation = useCreateProduct();
createMutation.mutate(productData);

// Atualizar produto
const updateMutation = useUpdateProduct();
updateMutation.mutate({ id, product: updates });

// Deletar produto
const deleteMutation = useDeleteProduct();
deleteMutation.mutate(productId);
```

### useOrders

**Localização:** `src/hooks/useOrders.ts`

```typescript
import { useCreateOrder, useOrder, useUserOrders } from '@/hooks/useOrders';

// Criar pedido
const createOrderMutation = useCreateOrder();
createOrderMutation.mutate({ formData, cartItems, userId });

// Buscar pedido
const { data: orderData } = useOrder(orderId);

// Pedidos do usuário
const { data: orders } = useUserOrders(userId);
```

### useAuth

**Localização:** `src/hooks/useAuth.tsx`

```typescript
import { useAuth } from '@/hooks/useAuth';

const { user, roles, loading, isAdmin, isVendor, signIn, signUp, signOut } = useAuth();

// Login
await signIn(email, password);

// Registro
await signUp(email, password, fullName);

// Logout
await signOut();

// Verificar permissões
if (isAdmin) {
  // Código admin
}
```

---

## 🔴 Realtime

### useRealtime

**Localização:** `src/hooks/useRealtime.ts`

```typescript
import { useProductsRealtime, useOrdersRealtime, useStockRealtime } from '@/hooks/useRealtime';

// Atualização automática de produtos
useProductsRealtime();

// Atualização de pedidos do usuário
useOrdersRealtime(userId);

// Atualização de stock específico
useStockRealtime(productId);
```

**Como funciona:**
- Escuta mudanças no banco de dados em tempo real
- Invalida queries do React Query automaticamente
- Componentes re-renderizam com dados atualizados

---

## 💡 Exemplos de Uso

### Exemplo 1: Página de Produtos

```typescript
import { useProducts } from '@/hooks/useProducts';
import { useProductsRealtime } from '@/hooks/useRealtime';

const ProductsPage = () => {
  const [filters, setFilters] = useState({ search: '' });
  const { data: products, isLoading } = useProducts(filters);
  
  // Atualização em tempo real
  useProductsRealtime();

  if (isLoading) return <Loader />;

  return (
    <div>
      {products?.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
```

### Exemplo 2: Detalhes do Produto

```typescript
import { useProduct } from '@/hooks/useProducts';
import { productService } from '@/services/productService';

const ProductDetails = ({ id }) => {
  const { data: product } = useProduct(id);

  useEffect(() => {
    // Rastrear visualização
    productService.trackView(id);
  }, [id]);

  return <div>{product?.title}</div>;
};
```

### Exemplo 3: Criar Pedido

```typescript
import { useCreateOrder } from '@/hooks/useOrders';
import { useCart } from '@/contexts/CartContext';

const CheckoutPage = () => {
  const { items, clearCart } = useCart();
  const createOrder = useCreateOrder();

  const handleSubmit = async (formData) => {
    try {
      await createOrder.mutateAsync({ formData, cartItems: items });
      clearCart();
      navigate('/order-success');
    } catch (error) {
      toast.error('Erro ao criar pedido');
    }
  };

  return <CheckoutForm onSubmit={handleSubmit} />;
};
```

---

## ✅ Boas Práticas

### 1. Sempre use Hooks do React Query

❌ **Evite:**
```typescript
const [products, setProducts] = useState([]);
useEffect(() => {
  productService.getAllProducts().then(setProducts);
}, []);
```

✅ **Prefira:**
```typescript
const { data: products } = useProducts();
```

### 2. Tratamento de Erros

```typescript
const { data, error, isLoading } = useProducts();

if (isLoading) return <Loader />;
if (error) return <ErrorMessage error={error} />;
return <ProductList products={data} />;
```

### 3. Mutations com Feedback

```typescript
const createProduct = useCreateProduct();

const handleCreate = async (data) => {
  try {
    await createProduct.mutateAsync(data);
    // Toast de sucesso já é exibido pelo hook
  } catch (error) {
    // Toast de erro já é exibido pelo hook
  }
};
```

### 4. Invalidação de Cache

```typescript
const queryClient = useQueryClient();

// Após criar/atualizar/deletar
queryClient.invalidateQueries({ queryKey: ['products'] });
```

### 5. Realtime Seletivo

Use realtime apenas onde necessário:
- ✅ Dashboard de pedidos
- ✅ Stock de produtos
- ✅ Notificações
- ❌ Páginas estáticas
- ❌ Dados históricos

---

## 🔧 Troubleshooting

### Erro: "Failed to fetch"
- Verifique variáveis de ambiente
- Confirme conexão com internet
- Valide credenciais do Supabase

### Dados não atualizam
- Verifique `staleTime` do React Query
- Use `invalidateQueries` após mutations
- Confirme que realtime está ativo

### Types incorretos
- Execute: `npm run update-types` (após criar o script)
- Verifique se todas as tabelas existem no Supabase

---

## 📖 Recursos Adicionais

- [Documentação Supabase](https://supabase.com/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [SUPABASE_TYPES_UPDATE.md](./SUPABASE_TYPES_UPDATE.md)
- [CHANGELOG.md](./CHANGELOG.md)

---

**Última atualização:** ${new Date().toISOString().split('T')[0]}
