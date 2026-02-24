import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    // Verificação de ambiente: garante que window existe (SSR-safe)
    if (typeof window === 'undefined') {
      console.warn('useIsMobile: window não disponível (ambiente SSR)');
      setIsMobile(false); // Fallback para desktop em SSR
      return;
    }

    try {
      // Verifica se matchMedia é suportado
      if (!window.matchMedia) {
        console.warn('useIsMobile: matchMedia não suportado neste navegador');
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        return;
      }

      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
      
      const onChange = () => {
        try {
          setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        } catch (error) {
          console.error('useIsMobile: Erro ao atualizar estado:', error);
        }
      };
      
      mql.addEventListener("change", onChange);
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      
      return () => {
        try {
          mql.removeEventListener("change", onChange);
        } catch (error) {
          console.error('useIsMobile: Erro ao remover listener:', error);
        }
      };
    } catch (error) {
      console.error('useIsMobile: Erro ao inicializar:', error);
      setIsMobile(false); // Fallback seguro
    }
  }, []);

  return !!isMobile;
}
