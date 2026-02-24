# 🎨 Novo Logo MarrengulaIT

## 📐 Design Concept

O novo logo da MarrengulaIT foi criado com inspiração no estilo moderno do Pichau, mas adaptado para o nicho de tecnologia em Moçambique.

### Elementos do Design

#### 1. **Ícone - Microchip**
- Representa tecnologia, inovação e hardware
- Design minimalista e profissional
- Gradiente azul moderno (#60A5FA → #3B82F6)
- Pinos do chip simbolizam conectividade

#### 2. **Tipografia**
- **"MarrengulaIT"** - Fonte bold, tracking tight
- Gradiente de cores (primary → accent)
- Efeito text-transparent com bg-clip-text
- **"Tech & Innovation"** - Tagline em uppercase, letra pequena

#### 3. **Cores**
- Suporta 3 variantes:
  - `default` - Usa as cores do tema (dark/light mode)
  - `white` - Para fundos escuros
  - `dark` - Para fundos claros

### Características Técnicas

✅ **Responsivo** - Adapta-se a diferentes tamanhos
✅ **SVG** - Escalável sem perda de qualidade
✅ **Acessível** - Suporta dark/light mode
✅ **Performático** - Componente React otimizado
✅ **Moderno** - Gradientes e efeitos visuais

## 🎯 Inspiração (Pichau)

### O que pegamos do Pichau:
- ✅ Design tech e moderno
- ✅ Uso de gradientes
- ✅ Tipografia bold e impactante
- ✅ Ícone representativo do nicho
- ✅ Tagline descritiva

### O que fizemos diferente:
- 🎨 Microchip ao invés de mascote
- 🎨 Cores adaptáveis ao tema
- 🎨 Foco em hardware/TI
- 🎨 Identidade moçambicana

## 📦 Como Usar

### Uso Básico
```tsx
import Logo from "@/components/Logo";

<Logo />
```

### Com Opções
```tsx
// Apenas ícone
<Logo showText={false} />

// Variante branca
<Logo variant="white" />

// Variante escura
<Logo variant="dark" />

// Com classe customizada
<Logo className="w-32 h-32" />
```

## 🎨 Variações

### Header
- Logo completo (ícone + texto)
- Hover effect com glow
- Scale animation

### Footer
- Logo completo
- Versão padrão

### Mobile
- Logo pode ser reduzido
- Opção de mostrar apenas ícone

## 🚀 Melhorias Futuras

- [x] Adicionar animação no ícone (pulso no chip)
- [x] Versão animated com circuitos piscando
- [ ] Favicon baseado no ícone
- [ ] Versão para redes sociais
- [ ] Versão para email marketing

## ✨ Animações Implementadas

### 1. **Pulso no Chip**
- O corpo do microchip pulsa suavemente
- Animação: 2s ease-in-out infinite
- Efeito: opacity 0.9 → 1

### 2. **Piscar nos Pinos**
- Cada pino do chip pisca em sequência
- 12 pinos com delays diferentes (0s a 1.3s)
- Cria efeito de "dados fluindo"
- Animação: 1.5s ease-in-out infinite

### 3. **Glow no Background**
- Círculo de fundo com pulso suave
- Animação: 3s ease-in-out infinite
- Efeito: opacity 0.1 → 0.2

### 4. **Fade-in no Texto**
- Texto principal desliza da esquerda
- Tagline aparece com delay
- Duração: 700ms + 300ms delay

### 5. **Gradiente Animado**
- Texto "MarrengulaIT" com gradiente em movimento
- Classe: `animate-gradient`
- Efeito profissional e moderno

### Controle de Animações
```tsx
// Com animações (padrão)
<Logo animated={true} />

// Sem animações
<Logo animated={false} />
```

## 📱 Aplicações

- ✅ Website (Header/Footer)
- ✅ Emails
- ✅ Documentos
- ✅ Redes Sociais (com ajustes)
- ✅ Materiais de Marketing

---

**Criado em:** 2024
**Designer:** MarrengulaIT Team
**Inspiração:** Pichau.com.br
