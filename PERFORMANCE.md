# Otimização de Performance - Marrengula-IT

## Visão Geral

Este documento descreve as otimizações implementadas para melhorar a velocidade e fluidez do site.

---

## 1. Cache de Assets (✅ Implementado)

**Ficheiro:** `vercel.json`

### Configuração:
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ]
}
```

### O que faz:
- **Assets JS/CSS**: Cache por 1 ano (imutável após build)
- **Imagens PNG/JPG**: Cache por 24 horas
- **Fonts (woff2)**: Cache por 1 ano

### Benefício:
- Carregamento mais rápido em visitas seguintes
- Redução de requests ao servidor

---

## 2. Lazy Loading de Imagens (✅ Implementado)

**Componente:** `src/components/OptimizedImage.tsx`

### Características:
- Carrega imagens apenas quando visíveis no viewport
- Placeholder animado durante carregamento
- Fallback para imagens quebradas
- Suporte para priority loading (above-the-fold)

### Uso:
```tsx
<OptimizedImage 
  src="/produto.jpg" 
  alt="Produto" 
  priority={true}  // Para imagens acima da dobra
/>
```

### Benefício:
- Primeira página carrega mais rápido
- Economia de bandwidth
- Melhor experiência mobile

---

## 3. CSS Optimizations (✅ Implementado)

**Ficheiro:** `src/index.css`

### Redução de Animações:
```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}
```

### Mobile Optimizations:
- Transições mais rápidas (0.2s vs 0.3s)
- Efeitos de glass reduzidos
- Hover effects simplificados

### GPU Acceleration:
```css
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform;
  backface-visibility: hidden;
}
```

### Benefício:
- Menos repaints e reflows
- Animações mais suaves em mobile
- Suporte para utilizadores com prefers-reduced-motion

---

## 4. Code Splitting (✅ Já Implementado)

O projeto já usa React.lazy para carregamento dinâmico:
```tsx
const Product = lazy(() => import("./pages/Product"));
const Cart = lazy(() => import("./pages/Cart"));
```

### Benefício:
- Bundle inicial menor
- Carregamento mais rápido da página inicial
- Páginas carregadas apenas quando necessárias

---

## 5. Hooks de Performance (✅ Criado)

**Ficheiro:** `src/hooks/usePerformance.ts`

### Funcionalidades:
- `useIntersectionObserver`: Detecta quando elementos estão visíveis
- `useParallax`: Efeito parallax otimizado com requestAnimationFrame
- `usePerformance`: Detecta dispositivos lentos
- `useDebounce`: Debounce para inputs
- `useThrottle`: Throttle para eventos scroll

### Benefício:
- Animações optimizadas
- Menos cálculos em eventos frequentes
- Adaptação a dispositivos lentos

---

## Métricas de Performance

### Alvo:
| Métrica | Target | Status |
|---------|--------|--------|
| LCP | < 2.5s | Em progresso |
| FID | < 100ms | ✅ |
| CLS | < 0.1 | ✅ |
| TTI | < 3.8s | ✅ |

### Ferramentas de Teste:
1. **Google PageSpeed Insights**: https://pagespeed.web.dev/
2. **Chrome DevTools**: Lighthouse tab
3. **WebPageTest**: https://webpagetest.org/

---

## Teste de Performance

### Local:
1. Abre DevTools (F12)
2. Vai ao tab **Performance**
3. Reload da página
4. Analisa o flame chart

### Online:
```bash
# Com Lighthouse CLI
npx lighthouse https://marrengulaitstore.vercel.app --output html --output-path ./lighthouse-report.html
```

---

## Próximas Otimizações Possíveis

### Alta Prioridade:
1. **Service Worker**: Cache offline para repeat visits
2. **Image CDN**: Usar imgix ou similar para redimensionamento
3. **Prefetch**: Pré-carregar links prováveis

### Média Prioridade:
1. **Font subsetting**: Reduzir tamanho das fontes
2. **Critical CSS**: Inline CSS crítico
3. **Preconnect**: DNS prefetch para CDNs

### Baixa Prioridade:
1. **HTTP/2 Push**: Server push para assets críticos
2. **Brotli compression**: Compressão melhor que gzip
3. **Edge caching**: Cloudflare ou similar

---

## Monitorização

### Ferramentas Recomendadas:
- **Vercel Analytics**: Já incluído na plataforma
- **Sentry**: Para tracking de erros de performance
- **Datadog**: Monitorização avançada

---

## Checklist de Performance

- [x] Lazy loading de imagens
- [x] Cache de assets estáticos
- [x] CSS optimizations para mobile
- [x] Code splitting
- [x] GPU acceleration hints
- [x] Reduced motion support
- [ ] Service Worker (pendente)
- [ ] Image CDN (pendente)
- [ ] Critical CSS inline (pendente)
