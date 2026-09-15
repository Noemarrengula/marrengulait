import { AlertTriangle, Edit2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdmin } from "../AdminContext";

export function InventoryTab() {
  const { products, stats, setInlineEdit, handleNavClick } = useAdmin();
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Gestão de Inventário</h3>
      <Card className="border-red-200">
        <CardHeader><CardTitle className="flex items-center gap-2 text-red-700"><AlertTriangle className="h-5 w-5" />Stock Baixo ({stats.lowStockProducts} produtos)</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-red-50 dark:bg-red-950/20"><tr><th className="text-left py-2 px-3 font-medium">Produto</th><th className="text-left py-2 px-3 font-medium">Stock Atual</th><th className="text-left py-2 px-3 font-medium">Categoria</th><th className="text-left py-2 px-3 font-medium">Ação Rápida</th></tr></thead>
              <tbody>
                {products.filter(p => p.stock <= 10).sort((a, b) => a.stock - b.stock).map(product => (
                  <tr key={product.id} className="border-t dark:border-gray-800">
                    <td className="py-2 px-3 font-medium">{product.title || product.name}</td>
                    <td className="py-2 px-3"><Badge variant={product.stock === 0 ? "destructive" : "outline"} className={product.stock === 0 ? "" : "bg-orange-100 text-orange-700 border-orange-200"}>{product.stock === 0 ? "Esgotado" : `${product.stock} un.`}</Badge></td>
                    <td className="py-2 px-3 text-gray-500 dark:text-gray-400">{product.category || "—"}</td>
                    <td className="py-2 px-3"><Button size="sm" variant="outline" onClick={() => { setInlineEdit({ productId: product.id, field: "stock", value: String(product.stock) }); }}><Edit2 className="h-3.5 w-3.5 mr-1" /> Repor</Button></td>
                  </tr>
                ))}
                {stats.lowStockProducts === 0 && <tr><td colSpan={4} className="py-8 text-center text-gray-500 dark:text-gray-400">Todos os produtos com stock adequado</td></tr>}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Visão Geral do Inventário</CardTitle><CardDescription>{products.length} produtos no catálogo</CardDescription></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg text-center"><p className="text-2xl font-bold text-green-700">{products.filter(p => p.is_active !== false).length}</p><p className="text-xs text-green-600">Ativos</p></div>
            <div className="p-4 bg-gray-50 dark:bg-gray-950 rounded-lg text-center"><p className="text-2xl font-bold text-gray-700 dark:text-gray-200">{products.filter(p => p.is_active === false).length}</p><p className="text-xs text-gray-600 dark:text-gray-300">Inativos</p></div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-center"><p className="text-2xl font-bold text-blue-700">{products.filter(p => p.is_featured || p.featured).length}</p><p className="text-xs text-blue-600">Em Destaque</p></div>
            <div className="p-4 bg-orange-50 rounded-lg text-center"><p className="text-2xl font-bold text-orange-700">{products.filter(p => p.is_on_sale || p.on_sale).length}</p><p className="text-xs text-orange-600">Em Promoção</p></div>
          </div>
          <h4 className="font-semibold mb-3">Atualização Rápida de Stock</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Clique no valor do stock na tabela de produtos para editar inline, ou use a acção em massa para atualizar vários produtos.</p>
          <Button variant="outline" onClick={() => handleNavClick("products")}><Package className="h-4 w-4 mr-2" /> Ir para Produtos</Button>
        </CardContent>
      </Card>
    </div>
  );
}