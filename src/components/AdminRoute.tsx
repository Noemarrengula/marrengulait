import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, roles, loading, initialized } = useAuth();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (loading || !initialized) return;

    const verifyAdmin = async () => {
      if (!user) {
        navigate("/auth", { replace: true });
        return;
      }

      const sessionResult = await supabase.auth.getSession();
      const currentSession = sessionResult.data.session;

      if (!currentSession) {
        navigate("/auth", { replace: true });
        return;
      }

      const sessionExpiresAt = currentSession.expires_at;
      const now = Math.floor(Date.now() / 1000);

      if (sessionExpiresAt && sessionExpiresAt < now) {
        await supabase.auth.signOut();
        navigate("/auth", { replace: true });
        return;
      }

      if (!roles?.includes("admin")) {
        navigate("/", { replace: true });
        return;
      }

      setVerified(true);
      setVerifying(false);
    };

    verifyAdmin();
  }, [loading, user, roles, initialized, navigate]);

  if (loading || verifying || !initialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF3131]" />
      </div>
    );
  }

  if (!verified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
          <p className="text-gray-500 mb-4">Não tem permissão para acessar esta área.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;
