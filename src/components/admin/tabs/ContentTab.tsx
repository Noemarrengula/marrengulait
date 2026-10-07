import { Image, Save, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAdmin } from "../AdminContext";

export function ContentTab() {
  const { editingSettings, setEditingSettings, bannerForm, setBannerForm, contentBanners, handleAddBanner, toggleBanner, deleteBanner, handleSaveSettings, bannerImageFile, setBannerImageFile } = useAdmin();
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Gestão de Conteúdo</h3>
      <Card>
        <CardHeader><CardTitle className="text-base">Hero Section</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Título Principal</Label><Input value={editingSettings.heroTitle} onChange={e => setEditingSettings({ ...editingSettings, heroTitle: e.target.value })} /></div>
          <div><Label>Subtítulo</Label><Textarea value={editingSettings.heroSubtitle} onChange={e => setEditingSettings({ ...editingSettings, heroSubtitle: e.target.value })} /></div>
          <div className="flex items-center gap-3"><Switch checked={editingSettings.showAugustBanner} onCheckedChange={v => setEditingSettings({ ...editingSettings, showAugustBanner: v })} /><Label className="cursor-pointer">Mostrar Banner Sazonal (topo da homepage)</Label></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Banner Sazonal — Imagem</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Imagem do Banner</Label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary text-sm text-gray-500 dark:text-gray-400">
                <Upload className="h-4 w-4" />
                {bannerImageFile ? bannerImageFile.name : "Upload do dispositivo"}
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setBannerImageFile(f); setEditingSettings({ ...editingSettings, seasonalBannerUrl: "" }); } }} />
              </label>
              <span className="text-xs text-gray-400">ou</span>
              <Input value={bannerImageFile ? "" : editingSettings.seasonalBannerUrl} onChange={e => { setEditingSettings({ ...editingSettings, seasonalBannerUrl: e.target.value }); setBannerImageFile(null); }} placeholder="https://..." className="flex-1" />
            </div>
            <p className="text-xs text-gray-400">Recomendado: 1920×822 px. Guardar as alterações faz o upload para o servidor.</p>
          </div>
          {(bannerImageFile || editingSettings.seasonalBannerUrl || "/assets/banner-agosto.png") && (
            <div className="relative w-full max-w-md rounded overflow-hidden border">
              <img src={bannerImageFile ? URL.createObjectURL(bannerImageFile) : (editingSettings.seasonalBannerUrl || "/assets/banner-agosto.png")} alt="Preview do banner sazonal" className="w-full h-auto" onError={e => { e.currentTarget.style.display = "none"; }} />
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Banners Promocionais</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><Label>Título</Label><Input value={bannerForm.title} onChange={e => setBannerForm({ ...bannerForm, title: e.target.value })} placeholder="Ofertas Relâmpago" /></div>
            <div><Label>Subtítulo</Label><Input value={bannerForm.subtitle} onChange={e => setBannerForm({ ...bannerForm, subtitle: e.target.value })} placeholder="Até 50% OFF" /></div>
            <div><Label>URL da Imagem</Label><Input value={bannerForm.imageUrl} onChange={e => setBannerForm({ ...bannerForm, imageUrl: e.target.value })} placeholder="https://..." /></div>
            <div><Label>URL do Link</Label><Input value={bannerForm.linkUrl} onChange={e => setBannerForm({ ...bannerForm, linkUrl: e.target.value })} placeholder="/produtos?promo=true" /></div>
          </div>
          <Button onClick={handleAddBanner} className="gap-2"><Image className="h-4 w-4" /> Adicionar Banner</Button>
          <Separator />
          <div className="space-y-3">
            {contentBanners.map(banner => (
              <div key={banner.id} className="flex items-center justify-between p-4 border rounded-lg bg-white dark:bg-gray-900">
                <div><p className="font-medium">{banner.title}</p><p className="text-sm text-gray-500 dark:text-gray-400">{banner.subtitle || "Sem subtítulo"}</p><p className="text-xs text-gray-400 mt-1">{banner.linkUrl}</p></div>
                <div className="flex items-center gap-2"><Switch checked={banner.active} onCheckedChange={() => toggleBanner(banner.id)} /><Button size="sm" variant="ghost" aria-label="Eliminar banner" className="h-7 w-7 p-0 text-red-600" onClick={() => deleteBanner(banner.id)}><Trash2 className="h-3.5 w-3.5" /></Button></div>
              </div>
            ))}
            {contentBanners.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">Nenhum banner configurado</p>}
          </div>
        </CardContent>
      </Card>
      <Button onClick={handleSaveSettings} className="gap-2"><Save className="h-4 w-4" /> Guardar Alterações de Conteúdo</Button>
    </div>
  );
}