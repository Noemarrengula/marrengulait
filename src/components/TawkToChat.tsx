import { useEffect } from 'react';

const TawkToChat = () => {
  useEffect(() => {
    // Tawk.to Script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://embed.tawk.to/YOUR_PROPERTY_ID/YOUR_WIDGET_ID';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    
    document.body.appendChild(script);

    return () => {
      // Cleanup
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default TawkToChat;

// INSTRUÇÕES DE CONFIGURAÇÃO:
// 1. Acesse https://www.tawk.to/
// 2. Crie uma conta gratuita
// 3. Adicione seu site
// 4. Copie o Property ID e Widget ID
// 5. Substitua YOUR_PROPERTY_ID e YOUR_WIDGET_ID acima
// 6. Importe este componente no App.tsx
