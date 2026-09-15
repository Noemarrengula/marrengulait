import { Package, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAdmin } from "../AdminContext";
import { formatCurrency, formatDate } from "../utils";

export function CouponsTab() {
  const { couponForm, setCouponForm, coupons, handleAddCoupon, toggleCoupon, deleteCoupon } = useAdmin();
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Cupões & Promoções</h3>
      <Card>
        <CardHeader><CardTitle className="text-base">Novo Cupão</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div><Label>Código *</Label><Input value={couponForm.code} onChange={e => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })} placeholder="EX: PROMO20" /></div>
            <div><Label>Tipo</Label><select value={couponForm.type} onChange={e => setCouponForm({ ...couponForm, type: e.target.value as "percent" | "fixed" })} className="w-full px-3 py-2 border rounded-lg text-sm"><option value="percent">Percentagem (%)</option><option value="fixed">Valor Fixo (MZN)</option></select></div>
            <div><Label>Valor *</Label><Input type="number" value={couponForm.value} onChange={e => setCouponForm({ ...couponForm, value: Number(e.target.value) })} placeholder={couponForm.type === "percent" ? "10" : "500"} /></div>
            <div><Label>Pedido Mínimo (MZN)</Label><Input type="number" value={couponForm.minOrder} onChange={e => setCouponForm({ ...couponForm, minOrder: Number(e.target.value) })} placeholder="0" /></div>
            <div><Label>Usos Máximos</Label><Input type="number" value={couponForm.maxUses} onChange={e => setCouponForm({ ...couponForm, maxUses: Number(e.target.value) })} placeholder="100" /></div>
            <div><Label>Data de Expiração</Label><Input type="date" value={couponForm.expiryDate} onChange={e => setCouponForm({ ...couponForm, expiryDate: e.target.value })} /></div>
          </div>
          <Button onClick={handleAddCoupon} className="mt-4 gap-2"><Package className="h-4 w-4" /> Criar Cupão</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Cupões Ativos ({coupons.filter(c => c.active).length})</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-950"><tr><th className="text-left py-3 px-3 font-medium">Código</th><th className="text-left py-3 px-3 font-medium">Tipo</th><th className="text-left py-3 px-3 font-medium">Valor</th><th className="text-left py-3 px-3 font-medium hidden sm:table-cell">Mín.</th><th className="text-left py-3 px-3 font-medium hidden md:table-cell">Usos</th><th className="text-left py-3 px-3 font-medium hidden lg:table-cell">Expira</th><th className="text-left py-3 px-3 font-medium">Estado</th><th className="text-left py-3 px-3 font-medium">Ações</th></tr></thead>
              <tbody>
                {coupons.map(coupon => (
                  <tr key={coupon.id} className="border-t dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 dark:bg-gray-950/50">
                    <td className="py-2.5 px-3 font-mono font-bold">{coupon.code}</td>
                    <td className="py-2.5 px-3"><Badge variant="outline" className="text-[10px]">{coupon.type === "percent" ? "%" : "MZN"}</Badge></td>
                    <td className="py-2.5 px-3 font-medium">{coupon.type === "percent" ? `${coupon.value}%` : formatCurrency(coupon.value)}</td>
                    <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400 hidden sm:table-cell">{coupon.min_order > 0 ? formatCurrency(coupon.min_order) : "—"}</td>
                    <td className="py-2.5 px-3 hidden md:table-cell"><span className={coupon.used_count >= coupon.max_uses ? "text-red-600 font-bold" : "text-green-600"}>{coupon.used_count}/{coupon.max_uses}</span></td>
                    <td className="py-2.5 px-3 text-xs text-gray-500 dark:text-gray-400 hidden lg:table-cell">{coupon.expiry_date ? formatDate(coupon.expiry_date) : "Sem limite"}</td>
                    <td className="py-2.5 px-3"><Badge className={coupon.active ? "bg-green-100 dark:bg-green-900/30 text-green-700" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"}>{coupon.active ? "Ativo" : "Inativo"}</Badge></td>
                    <td className="py-2.5 px-3"><div className="flex items-center gap-1"><Switch checked={coupon.active} onCheckedChange={() => toggleCoupon(coupon.id)} /><Button size="sm" variant="ghost" aria-label="Eliminar cupão" className="h-7 w-7 p-0 text-red-600" onClick={() => deleteCoupon(coupon.id)}><Trash2 className="h-3.5 w-3.5" /></Button></div></td>
                  </tr>
                ))}
                {coupons.length === 0 && <tr><td colSpan={8} className="py-8 text-center text-gray-500 dark:text-gray-400">Nenhum cupão criado</td></tr>}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}