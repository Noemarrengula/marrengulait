import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAdmin } from "../AdminContext";
import { useToast } from "@/hooks/use-toast";
import { formatDateTime } from "../utils";

export function ActivityTab() {
  const { activityLog } = useAdmin();
  const { toast } = useToast();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Log de Atividade</h3>
        {activityLog.length > 0 && (
          <Button variant="outline" size="sm" onClick={async () => { if (confirm("Limpar todo o log?")) { /* setActivityLog([]); await supabase.from("activity_log").delete(); */ toast({ title: "Funcionalidade desativada temporariamente" }); } }}>
            <Trash2 className="h-4 w-4 mr-1" /> Limpar
          </Button>
        )}
      </div>
      <Card><CardContent className="pt-6">
        {activityLog.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8 text-sm">Nenhuma atividade registada ainda</p>
        ) : (
          <div className="space-y-2">
            {activityLog.slice(0, 50).map(log => (
              <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg border bg-white dark:bg-gray-900">
                <div className="w-2 h-2 rounded-full bg-[#FF3131] flex-shrink-0" />
                <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate"><span className="text-[#FF3131]">{log.action}</span> — {log.details}</p><p className="text-xs text-gray-500 dark:text-gray-400">{log.entity} • {log.user_email}</p></div>
                <span className="text-xs text-gray-400 flex-shrink-0">{formatDateTime(log.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent></Card>
    </div>
  );
}