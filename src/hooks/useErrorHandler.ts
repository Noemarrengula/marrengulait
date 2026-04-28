import { useCallback } from 'react';
import { toast } from 'sonner';

interface EnhancedError extends Error {
  code?: string;
  status?: number;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export const useErrorHandler = () => {
  const handleError = useCallback((error: unknown, context?: string) => {
    console.error(`❌ Error${context ? ` in ${context}` : ''}:`, error);

    let message = 'Algo correu mal. Por favor, tenta novamente.';
    let isNetworkError = false;
    let isAuthError = false;
    let isValidationError = false;

    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();

      if (
        errorMessage.includes('network') ||
        errorMessage.includes('fetch') ||
        errorMessage.includes('connection') ||
        errorMessage.includes('timeout')
      ) {
        message = 'Sem conexão à internet. Verifica a tua rede.';
        isNetworkError = true;
      } else if (
        errorMessage.includes('auth') ||
        errorMessage.includes('unauthorized') ||
        errorMessage.includes('401') ||
        errorMessage.includes('403') ||
        errorMessage.includes('token')
      ) {
        message = 'Sessão expirada. Por favor, faz login novamente.';
        isAuthError = true;
      } else if (
        errorMessage.includes('validation') ||
        errorMessage.includes('invalid') ||
        errorMessage.includes('400') ||
        errorMessage.includes('required')
      ) {
        message = error.message;
        isValidationError = true;
      } else if (
        errorMessage.includes('404') ||
        errorMessage.includes('not found')
      ) {
        message = 'O recurso não foi encontrado.';
      } else if (
        errorMessage.includes('500') ||
        errorMessage.includes('server')
      ) {
        message = 'Erro no servidor. Tenta novamente mais tarde.';
      } else {
        message = error.message;
      }
    }

    if (isNetworkError) {
      toast.error('🛜 ' + message, {
        description: 'Verifica a tua ligação à internet.',
      });
    } else if (isAuthError) {
      toast.error('🔐 ' + message, {
        description: 'Por favor, faz login novamente.',
        action: {
          label: 'Login',
          onClick: () => window.location.href = '/auth',
        },
      });
    } else if (isValidationError) {
      toast.warning('⚠️ ' + message);
    } else {
      toast.error('❌ ' + message);
    }

    return {
      message,
      isNetworkError,
      isAuthError,
      isValidationError,
    };
  }, []);

  const handleApiError = useCallback((error: ApiError, context?: string) => {
    const enhancedError = new Error(error.message) as EnhancedError;
    enhancedError.code = error.code;
    enhancedError.status = error.status;
    return handleError(enhancedError, context);
  }, [handleError]);

  return {
    handleError,
    handleApiError,
  };
};

export default useErrorHandler;
