import { supabase } from '@/integrations/supabase/client';

const BUCKET = 'products';

export async function uploadProductImage(file: File, productId: string): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `${productId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file, { upsert: true, contentType: file.type });

  if (error) throw new Error(`Erro ao fazer upload: ${error.message}`);

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

export async function deleteProductImage(fileName: string): Promise<void> {
  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([fileName]);

  if (error) console.error('Erro ao remover imagem:', error.message);
}

export function getProductImageUrl(fileName: string): string {
  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(fileName);

  return data.publicUrl;
}
