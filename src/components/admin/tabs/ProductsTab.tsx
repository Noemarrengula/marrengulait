import { Plus, Search, FilterX, Edit2, Trash2, ChevronLeft, ChevronRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAdmin } from "../AdminContext";
import { formatCurrency } from "../utils";

export function ProductsTab() {
  const { filteredProducts, paginatedProducts, categories, productSearch, setProductSearch, productCategory, setProductCategory, productPage, setProductPage, ITEMS_PER_PAGE, totalProductPages, selectedProducts, setSelectedProducts, inlineEdit, setInlineEdit, bulkAction, setBulkAction, openProductModal, handleInlineEditSave, handleBulkAction, setDeleteConfirm } = useAdmin();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h3 className="text-xl font-bold">Gestão de Produtos</h3><p className="text-sm text-gray-500 dark:text-gray-400">{filteredProducts.length} produtos encontrados</p></div>
        <Button onClick={() => openProductModal()} className="gap-2"><Plus className="h-4 w-4" /> Novo Produto</Button>
      </div>
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><Input placeholder="Pesquisar produtos..." value={productSearch} onChange={e => { setProductSearch(e.target.value); setProductPage(1); }} className="pl-10" /></div>
            <select value={productCategory} onChange={e => { setProductCategory(e.target.value); setProductPage(1); }} className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 text-sm">
              <option value="all">Todas Categorias</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            {(productSearch || productCategory !== "all") && (
              <Button variant="ghost" size="sm" onClick={() => { setProductSearch(""); setProductCategory("all"); }}><FilterX className="h-4 w-4 mr-1" /> Limpar</Button>
            )}
          </div>
          {selectedProducts.size > 0 && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border dark:border-gray-800 border-blue-200">
              <span className="text-sm font-medium text-blue-700">{selectedProducts.size} selecionados</span>
              <select value={bulkAction} onChange={e => setBulkAction(e.target.value)} className="px-3 py-1.5 border rounded-lg bg-white dark:bg-gray-900 text-sm">
                <option value="">Acção...</option><option value="featured">Marcar Destaque</option><option value="unfeatured">Remover Destaque</option><option value="active">Ativar</option><option value="inactive">Desativar</option><option value="delete">Eliminar</option>
              </select>
              <Button size="sm" onClick={handleBulkAction} disabled={!bulkAction}>Aplicar</Button>
              <Button size="sm" variant="ghost" onClick={() => setSelectedProducts(new Set())}>Limpar</Button>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-950">
                <tr>
                  <th className="text-left py-3 px-3 w-10"><input type="checkbox" onChange={e => { if (e.target.checked) setSelectedProducts(new Set(paginatedProducts.map(p => p.id))); else setSelectedProducts(new Set()); }} className="rounded" /></th>
                  <th className="text-left py-3 px-3 font-medium">Produto</th><th className="text-left py-3 px-3 font-medium">Preço</th><th className="text-left py-3 px-3 font-medium">Stock</th>
                  <th className="text-left py-3 px-3 font-medium hidden md:table-cell">Categoria</th><th className="text-left py-3 px-3 font-medium hidden lg:table-cell">Estado</th><th className="text-left py-3 px-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map(product => (
                  <tr key={product.id} className="border-t dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 dark:bg-gray-950/50">
                    <td className="py-2.5 px-3"><input type="checkbox" checked={selectedProducts.has(product.id)} onChange={e => { setSelectedProducts(prev => { const next = new Set(prev); if (e.target.checked) next.add(product.id); else next.delete(product.id); return next; }); }} className="rounded" /></td>
                    <td className="py-2.5 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {product.image_url ? <img src={product.image_url} alt="" width="40" height="40" className="w-full h-full object-cover" /> : <Package className="h-5 w-5 text-gray-300" />}
                        </div>
                        <div className="min-w-0"><p className="font-medium truncate">{product.title || product.name}</p><div className="flex gap-1 mt-0.5">{product.is_featured && <Badge variant="default" className="text-[10px] h-4 px-1">Destaque</Badge>}{product.is_on_sale && <Badge variant="destructive" className="text-[10px] h-4 px-1">Promo</Badge>}</div></div>
                          </div>
                    </td>
                    <td className="py-2.5 px-3">
                      {inlineEdit?.productId === product.id && inlineEdit.field === "price" ? (
                        <Input type="number" defaultValue={product.price} className="w-28 h-7 text-sm" autoFocus onBlur={e => handleInlineEditSave(product.id, "price", e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleInlineEditSave(product.id, "price", (e.target as HTMLInputElement).value); if (e.key === "Escape") setInlineEdit(null); }} />
                      ) : (
                        <button onClick={() => setInlineEdit({ productId: product.id, field: "price", value: String(product.price) })} className="font-bold text-primary text-sm hover:underline" title="Clique para editar">{formatCurrency(product.price)}</button>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      {inlineEdit?.productId === product.id && inlineEdit.field === "stock" ? (
                        <Input type="number" defaultValue={product.stock} className="w-20 h-7 text-sm" autoFocus onBlur={e => handleInlineEditSave(product.id, "stock", e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleInlineEditSave(product.id, "stock", (e.target as HTMLInputElement).value); if (e.key === "Escape") setInlineEdit(null); }} />
                      ) : (
                        <button onClick={() => setInlineEdit({ productId: product.id, field: "stock", value: String(product.stock) })} className={`text-sm ${product.stock <= 10 ? "text-red-600 font-bold" : "hover:underline"}`} title="Clique para editar">{product.stock}</button>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400 hidden md:table-cell">{product.category || "—"}</td>
                    <td className="py-2.5 px-3 hidden lg:table-cell">{product.is_active === false ? <Badge variant="secondary" className="text-[10px]">Inativo</Badge> : <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 text-[10px]">Ativo</Badge>}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" aria-label="Editar produto" onClick={() => openProductModal(product)} className="h-7 w-7 p-0"><Edit2 className="h-3.5 w-3.5" /></Button>
                        <Button size="sm" variant="ghost" aria-label="Eliminar produto" className="h-7 w-7 p-0 text-red-600" onClick={() => setDeleteConfirm({ type: "products", id: product.id })}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalProductPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">{(productPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(productPage * ITEMS_PER_PAGE, filteredProducts.length)} de {filteredProducts.length}</p>
              <div className="flex items-center gap-1">
                <Button size="sm" variant="outline" aria-label="Página anterior" disabled={productPage === 1} onClick={() => setProductPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
                {Array.from({ length: Math.min(5, totalProductPages) }, (_, i) => {
                  let page: number;
                  if (totalProductPages <= 5) page = i + 1;
                  else if (productPage <= 3) page = i + 1;
                  else if (productPage >= totalProductPages - 2) page = totalProductPages - 4 + i;
                  else page = productPage - 2 + i;
                  return <Button key={page} size="sm" variant={productPage === page ? "default" : "outline"} onClick={() => setProductPage(page)} className={`h-8 w-8 p-0 ${productPage === page ? "bg-[#FF3131]" : ""}`}>{page}</Button>;
                })}
                <Button size="sm" variant="outline" aria-label="Próxima página" disabled={productPage === totalProductPages} onClick={() => setProductPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400"><Package className="h-12 w-12 mx-auto mb-3 text-gray-300" /><p>Nenhum produto encontrado</p><Button variant="link" onClick={() => openProductModal()}>Criar primeiro produto</Button></div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}