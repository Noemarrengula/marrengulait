import { MessageCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import analytics from '@/services/analyticsService';

const WHATSAPP_NUMBER = '258864738133';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export default function WhatsAppBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('whatsapp-banner-dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('whatsapp-banner-dismissed', 'true');
  };

  const handleWhatsAppClick = () => {
    analytics.trackWhatsAppClick('banner');
  };

  if (isDismissed) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden" data-hide-in-app>
        <div 
          className={`bg-green-500 text-white px-4 py-3 transform transition-transform duration-300 ${
            isVisible ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="flex items-center justify-between max-w-lg mx-auto">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              className="flex items-center gap-3 flex-1"
            >
              <div className="bg-white rounded-full p-2">
                <MessageCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="font-semibold text-sm">Fale connosco!</p>
                <p className="text-xs opacity-90">Resposta rápida no WhatsApp</p>
              </div>
            </a>
            <button
              onClick={handleDismiss}
              className="p-2 hover:bg-green-600 rounded-full transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-40 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group hidden md:flex items-center gap-2"
        aria-label="Contactar via WhatsApp"
      >
        <MessageCircle className="w-6 h-6 group-hover:animate-bounce" />
        <span className="absolute right-full mr-3 bg-black text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Fale no WhatsApp
        </span>
      </a>
    </>
  );
}
