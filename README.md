# 🛒 Marrengula-IT - E-commerce & Marketplace

<div align="center">

![Marrengula-IT](https://img.shields.io/badge/Marrengula--IT-E--commerce-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)

**Plataforma completa de e-commerce para produtos de tecnologia e serviços de TI em Moçambique**

[Demo](https://lovable.dev/projects/77db4adb-f00b-49fc-aa49-65a31da2845f) • [Documentação](#-documentação) • [Setup](#-instalação) • [Contribuir](#-contribuição)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Documentação](#-documentação)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Deploy](#-deploy)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

Marrengula-IT é uma plataforma moderna de e-commerce especializada em produtos de tecnologia e serviços de TI. O projeto combina um marketplace robusto com um sistema de gestão de serviços, oferecendo uma experiência completa para clientes e vendedores.

### ✨ Destaques

- 🎨 **Design Moderno**: Interface elegante com animações suaves e micro-interações
- 🚀 **Performance**: Otimizado com lazy loading, code splitting e caching
- 📱 **Responsivo**: Funciona perfeitamente em todos os dispositivos
- 🔒 **Seguro**: Autenticação robusta e Row Level Security (RLS)
- 🌐 **Marketplace**: Sistema completo para múltiplos vendedores
- 💼 **Serviços de TI**: Gestão de solicitações de serviços profissionais

---

## 🚀 Funcionalidades

### Para Clientes

- ✅ Navegação por categorias e busca avançada
- ✅ Filtros por preço, marca, categoria e avaliação
- ✅ Sistema de favoritos
- ✅ Carrinho de compras com cupons de desconto
- ✅ Checkout simplificado
- ✅ Rastreamento de pedidos
- ✅ Avaliações e comentários
- ✅ Solicitação de serviços de TI
- ✅ Newsletter

### Para Vendedores

- ✅ Painel de gestão de produtos
- ✅ Gestão de pedidos
- ✅ Estatísticas de vendas
- ✅ Perfil de loja personalizado

### Para Administradores

- ✅ Painel administrativo completo
- ✅ Gestão de usuários e permissões
- ✅ Moderação de produtos e avaliações
- ✅ Gestão de solicitações de serviços
- ✅ Relatórios e analytics

---

## 🛠️ Tecnologias

### Frontend

- **React 18.3.1** - Biblioteca UI
- **TypeScript 5.8.3** - Tipagem estática
- **Vite 7.2.2** - Build tool e dev server
- **React Router 6.30.1** - Roteamento
- **Tailwind CSS 3.4.17** - Estilização
- **shadcn/ui** - Componentes UI
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones
- **Sonner** - Notificações toast

### Backend

- **Supabase** - Backend as a Service
  - PostgreSQL - Banco de dados
  - Auth - Autenticação
  - Storage - Armazenamento de arquivos
  - Realtime - Atualizações em tempo real

### Ferramentas de Desenvolvimento

- **ESLint** - Linting
- **TypeScript ESLint** - Linting TypeScript
- **PostCSS** - Processamento CSS
- **Autoprefixer** - Prefixos CSS automáticos

---

## 💻 Instalação

### Pré-requisitos

- Node.js 18+ ([Instalar com nvm](https://github.com/nvm-sh/nvm))
- npm ou yarn
- Conta no [Supabase](https://supabase.com)

### Passo a Passo

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/marrengulait.git

# 2. Entre no diretório
cd marrengulait

# 3. Instale as dependências
npm install

# 4. Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais do Supabase

# 5. Inicie o servidor de desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

---

## ⚙️ Configuração

### 1. Configurar Supabase

Siga o guia completo em [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)

**Resumo:**
1. Crie um projeto no Supabase
2. Execute os scripts SQL fornecidos
3. Configure as variáveis de ambiente
4. Teste a conexão

### 2. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica
```

### 3. Configurar Autenticação

No dashboard do Supabase:
- Habilite Email/Password
- Configure URLs de redirecionamento
- Personalize templates de email

---

## 📁 Estrutura do Projeto

```
marrengulait/
├── src/
│   ├── assets/              # Imagens e recursos estáticos
│   ├── components/          # Componentes React
│   │   ├── ui/             # Componentes UI base (shadcn)
│   │   ├── admin/          # Componentes do painel admin
│   │   └── ...             # Componentes da aplicação
│   ├── contexts/           # Contextos React (Cart, Auth)
│   ├── hooks/              # Custom hooks
│   ├── integrations/       # Integrações externas
│   │   └── supabase/      # Cliente e tipos Supabase
│   ├── lib/               # Utilitários
│   ├── pages/             # Páginas da aplicação
│   ├── services/          # Serviços e API calls
│   ├── types/             # Definições de tipos TypeScript
│   ├── App.tsx            # Componente principal
│   ├── main.tsx           # Entry point
│   └── index.css          # Estilos globais
├── public/                # Arquivos públicos
├── .env.example          # Template de variáveis de ambiente
├── CHANGELOG.md          # Histórico de alterações
├── SUPABASE_SETUP.md     # Guia de setup do Supabase
├── package.json          # Dependências e scripts
├── tsconfig.json         # Configuração TypeScript
├── tailwind.config.ts    # Configuração Tailwind
└── vite.config.ts        # Configuração Vite
```

---

## 📚 Documentação

### Documentos Principais

- [`CHANGELOG.md`](./CHANGELOG.md) - Histórico completo de desenvolvimento
- [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) - Guia de configuração do backend
- [`.env.example`](./.env.example) - Template de configuração

### Guias de Desenvolvimento

#### Criar Novo Componente

```tsx
// src/components/MeuComponente.tsx
import { Button } from "@/components/ui/button";

const MeuComponente = () => {
  return (
    <div className="p-4">
      <Button>Clique aqui</Button>
    </div>
  );
};

export default MeuComponente;
```

#### Usar Supabase

```tsx
import { supabase } from "@/integrations/supabase/client";

// Buscar produtos
const { data, error } = await supabase
  .from('products')
  .select('*')
  .limit(10);
```

#### Adicionar Rota

```tsx
// src/App.tsx
<Route path="/nova-pagina" element={<NovaPagina />} />
```

---

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Cria build de produção
npm run preview      # Preview do build de produção

# Linting
npm run lint         # Executa ESLint
```

---

## 🚀 Deploy

### Opção 1: Lovable (Recomendado)

1. Acesse [Lovable](https://lovable.dev/projects/77db4adb-f00b-49fc-aa49-65a31da2845f)
2. Clique em **Share** → **Publish**
3. Configure domínio personalizado (opcional)

### Opção 2: Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Opção 3: Netlify

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Configurar Variáveis de Ambiente

Em qualquer plataforma, configure:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

---

## 🤝 Contribuição

### Como Contribuir

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Padrões de Código

- Use TypeScript para type safety
- Siga as convenções do ESLint
- Componentes em PascalCase
- Arquivos de utilitários em camelCase
- Use Tailwind CSS para estilização
- Documente funções complexas

### Commits Semânticos

```
feat: Nova funcionalidade
fix: Correção de bug
docs: Documentação
style: Formatação
refactor: Refatoração
test: Testes
chore: Manutenção
```

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Equipe

**Desenvolvido com ❤️ pela equipe Marrengula-IT**

- Website: [marrengula-it.co.mz](https://marrengula-it.co.mz)
- Email: info@marrengula-it.co.mz
- Telefone: +258 84 123 4567

---

## 🙏 Agradecimentos

- [Lovable](https://lovable.dev) - Plataforma de desenvolvimento
- [Supabase](https://supabase.com) - Backend as a Service
- [shadcn/ui](https://ui.shadcn.com) - Componentes UI
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS
- Comunidade open source

---

<div align="center">

**⭐ Se este projeto foi útil, considere dar uma estrela!**

[⬆ Voltar ao topo](#-marrengula-it---e-commerce--marketplace)

</div>
