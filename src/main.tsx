import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import { SettingsProvider } from "./context/SettingsContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./index.css";

if (!crypto.randomUUID) {
  crypto.randomUUID = function() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === "x" ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Erro crítico: Elemento #root não encontrado no DOM");
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: system-ui, -apple-system, sans-serif;">
      <div style="text-align: center; padding: 2rem;">
        <h1 style="color: #ef4444; margin-bottom: 1rem;">Erro ao carregar aplicação</h1>
        <p style="color: #6b7280;">O elemento root não foi encontrado. Por favor, verifique o arquivo index.html.</p>
      </div>
    </div>
  `;
} else {
  try {
    createRoot(rootElement).render(
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <SettingsProvider>
            <NotificationProvider>
              <App />
            </NotificationProvider>
          </SettingsProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error("Erro ao renderizar aplicação:", error);
    rootElement.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: system-ui, -apple-system, sans-serif;">
        <div style="text-align: center; padding: 2rem;">
          <h1 style="color: #ef4444; margin-bottom: 1rem;">Erro ao inicializar</h1>
          <p style="color: #6b7280;">Ocorreu um erro ao carregar a aplicação. Por favor, recarregue a página.</p>
          <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 0.375rem; cursor: pointer;">Recarregar</button>
        </div>
      </div>
    `;
  }
}
