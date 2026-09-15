import { Search, Users as UsersIcon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAdmin } from "../AdminContext";
import { formatDate } from "../utils";
import { exportUsersPDF } from "@/utils/exportPDF";

export function UsersTab() {
  const { filteredUsers, userSearch, setUserSearch, users } = useAdmin();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h3 className="text-xl font-bold">Gestão de Clientes</h3><p className="text-sm text-gray-500 dark:text-gray-400">{filteredUsers.length} clientes</p></div>
        <Button variant="outline" onClick={async () => { await exportUsersPDF(users); }} className="gap-2"><Download className="h-4 w-4" /> Exportar</Button>
      </div>
      <Card><CardContent className="pt-6 space-y-4">
        <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><Input placeholder="Pesquisar clientes..." value={userSearch} onChange={e => setUserSearch(e.target.value)} className="pl-10" /></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-950"><tr><th className="text-left py-3 px-4 font-medium">Cliente</th><th className="text-left py-3 px-4 font-medium">Email</th><th className="text-left py-3 px-4 font-medium hidden md:table-cell">Desde</th><th className="text-left py-3 px-4 font-medium hidden lg:table-cell">Último Login</th></tr></thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} className="border-t dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 dark:bg-gray-950/50">
                  <td className="py-3 px-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><span className="text-primary font-medium text-xs">{u.full_name?.[0] || u.email?.[0]?.toUpperCase() || "U"}</span></div><span className="font-medium">{u.full_name || "Sem nome"}</span></div></td>
                  <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{u.email}</td>
                  <td className="py-3 px-4 text-xs hidden md:table-cell">{u.created_at ? formatDate(u.created_at) : "-"}</td>
                  <td className="py-3 px-4 text-xs text-gray-500 dark:text-gray-400 hidden lg:table-cell">{u.last_login_at ? formatDate(u.last_login_at) : "Nunca"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (<div className="text-center py-12 text-gray-500 dark:text-gray-400"><UsersIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" /><p>Nenhum cliente encontrado</p></div>)}
      </CardContent></Card>
    </div>
  );
}