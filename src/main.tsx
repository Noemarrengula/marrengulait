import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Validação do elemento root
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
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
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
