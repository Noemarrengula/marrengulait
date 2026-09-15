import { Save, HelpCircle, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAdmin } from "../AdminContext";

export function SettingsTab() {
  const { editingSettings, setEditingSettings, handleSaveSettings } = useAdmin();
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Configurações do Sistema</h3>
      <Card><CardHeader><CardTitle className="text-base">Informações Gerais</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><Label>Nome do Site</Label><Input value={editingSettings.siteName} onChange={e => setEditingSettings({ ...editingSettings, siteName: e.target.value })} /></div>
            <div><Label>WhatsApp</Label><Input value={editingSettings.whatsappNumber} onChange={e => setEditingSettings({ ...editingSettings, whatsappNumber: e.target.value })} /></div>
            <div><Label>Email</Label><Input value={editingSettings.email} onChange={e => setEditingSettings({ ...editingSettings, email: e.target.value })} /></div>
            <div><Label>Endereço</Label><Input value={editingSettings.address} onChange={e => setEditingSettings({ ...editingSettings, address: e.target.value })} /></div>
          </div>
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle className="text-base">Comércio</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><Label>Moeda</Label><Input value={editingSettings.currency} onChange={e => setEditingSettings({ ...editingSettings, currency: e.target.value })} /></div>
            <div><Label>Taxa de IVA (%)</Label><Input type="number" value={editingSettings.taxRate} onChange={e => setEditingSettings({ ...editingSettings, taxRate: Number(e.target.value) })} /></div>
            <div><Label>Frete Grátis acima de (MZN)</Label><Input type="number" value={editingSettings.freeShippingThreshold} onChange={e => setEditingSettings({ ...editingSettings, freeShippingThreshold: Number(e.target.value) })} /></div>
          </div>
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle className="text-base">Métodos de Pagamento</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center"><HelpCircle className="h-4 w-4 text-green-600" /></div><div><p className="font-medium text-sm">M-Pesa</p><p className="text-xs text-gray-500 dark:text-gray-400">Vodacom</p></div></div><Switch checked={editingSettings.mpesaEnabled} onCheckedChange={v => setEditingSettings({ ...editingSettings, mpesaEnabled: v })} /></div>
            <div className="flex items-center justify-between p-3 border rounded-lg"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center"><HelpCircle className="h-4 w-4 text-orange-600" /></div><div><p className="font-medium text-sm">E-Mola</p><p className="text-xs text-gray-500 dark:text-gray-400">Movitel</p></div></div><Switch checked={editingSettings.emolaEnabled} onCheckedChange={v => setEditingSettings({ ...editingSettings, emolaEnabled: v })} /></div>
            <div className="flex items-center justify-between p-3 border rounded-lg"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"><DollarSign className="h-4 w-4 text-blue-600" /></div><div><p className="font-medium text-sm">Dinheiro / Transferência</p><p className="text-xs text-gray-500 dark:text-gray-400">Pagamento na entrega</p></div></div><Switch checked={editingSettings.cashEnabled} onCheckedChange={v => setEditingSettings({ ...editingSettings, cashEnabled: v })} /></div>
          </div>
        </CardContent>
      </Card>
      <Button onClick={handleSaveSettings} className="gap-2"><Save className="h-4 w-4" /> Guardar Configurações</Button>
    </div>
  );
}