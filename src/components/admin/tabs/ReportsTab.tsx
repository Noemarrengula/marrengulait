import { FileText, Package, ShoppingCart, Users, Bell, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdmin } from "../AdminContext";
import { downloadCSV } from "../utils";
import { exportOrdersPDF, exportUsersPDF, exportSalesSummaryPDF, exportProductsPDF, exportAlertsPDF } from "@/utils/exportPDF";

export function ReportsTab() {
  const { products, orders, users, alerts, questions } = useAdmin();
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Relatórios & Exportações</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => exportSalesSummaryPDF(orders, products, users)}><CardContent className="p-6 text-center"><FileText className="h-10 w-10 mx-auto mb-3 text-primary" /><h3 className="font-semibold text-sm">Resumo de Vendas</h3><p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Estatísticas completas</p></CardContent></Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => exportProductsPDF(products)}><CardContent className="p-6 text-center"><Package className="h-10 w-10 mx-auto mb-3 text-green-600" /><h3 className="font-semibold text-sm">Catálogo de Produtos</h3><p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Lista em PDF</p></CardContent></Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => exportOrdersPDF(orders)}><CardContent className="p-6 text-center"><ShoppingCart className="h-10 w-10 mx-auto mb-3 text-orange-600" /><h3 className="font-semibold text-sm">Relatório de Pedidos</h3><p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Vendas detalhadas</p></CardContent></Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => exportUsersPDF(users)}><CardContent className="p-6 text-center"><Users className="h-10 w-10 mx-auto mb-3 text-purple-600" /><h3 className="font-semibold text-sm">Base de Clientes</h3><p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Lista de clientes</p></CardContent></Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => exportAlertsPDF(alerts, questions)}><CardContent className="p-6 text-center"><Bell className="h-10 w-10 mx-auto mb-3 text-red-600" /><h3 className="font-semibold text-sm">Alertas e Perguntas</h3><p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Interações de clientes</p></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle className="text-base">Exportar CSV</CardTitle></CardHeader><CardContent><div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button variant="outline" size="sm" onClick={() => downloadCSV(products as unknown as Record<string, unknown>[], ["id", "title", "price", "stock", "category"], "produtos.csv")}><FileSpreadsheet className="h-4 w-4 mr-2" /> Produtos</Button>
        <Button variant="outline" size="sm" onClick={() => downloadCSV(orders as unknown as Record<string, unknown>[], ["id", "customer_name", "customer_email", "total_amount", "status"], "pedidos.csv")}><FileSpreadsheet className="h-4 w-4 mr-2" /> Pedidos</Button>
        <Button variant="outline" size="sm" onClick={() => downloadCSV(users as unknown as Record<string, unknown>[], ["id", "email", "created_at"], "clientes.csv")}><FileSpreadsheet className="h-4 w-4 mr-2" /> Clientes</Button>
        <Button variant="outline" size="sm" onClick={() => downloadCSV(alerts as unknown as Record<string, unknown>[], ["id", "user_id", "product_id", "target_price"], "alertas.csv")}><FileSpreadsheet className="h-4 w-4 mr-2" /> Alertas</Button>
      </div></CardContent></Card>
    </div>
  );
}