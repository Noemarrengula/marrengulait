import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import MegaMenu from '@/components/MegaMenu';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Share2, Copy, Check, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function PublicWishlist() {
  const { user } = useAuth();
  const [wishlistId, setWishlistId] = useState('');
  const [wishlist, setWishlist] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: userWishlists } = useQuery({
    queryKey: ['userWishlists'],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('wishlists')
        .select('*, wishlist_items(count)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const loadWishlist = async () => {
    if (!wishlistId.trim()) {
      toast.error('Introduza um código de wishlist');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          *,
          profiles(full_name),
          wishlist_items(
            *,
            products(*)
          )
        `)
        .eq('id', wishlistId)
        .single();

      if (error || !data) {
        toast.error('Wishlist não encontrada');
        setWishlist(null);
        return;
      }

      if (!data.is_public && data.user_id !== user?.id) {
        toast.error('Esta wishlist é privada');
        setWishlist(null);
        return;
      }

      setWishlist(data);
    } catch (err) {
      toast.error('Erro ao carregar wishlist');
    } finally {
      setLoading(false);
    }
  };

  const shareWishlist = async (wishlistId: string) => {
    const shareUrl = `${window.location.origin}/wishlist/${wishlistId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Link copiado!');
    } catch {
      toast.error('Erro ao copiar link');
    }
  };

  const makePublic = async (id: string) => {
    const { error } = await supabase
      .from('wishlists')
      .update({ is_public: true })
      .eq('id', id);
    if (error) {
      toast.error('Erro ao tornar pública');
    } else {
      toast.success('Wishlist agora é pública!');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MegaMenu />
      
      <div className="container mx-auto px-4 py-4">
        <Breadcrumbs items={[{ label: 'Wishlist' }]} />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Minhas Wishlists</h1>

        {!user ? (
          <Card className="p-8 text-center">
            <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Inicie sessão para ver suas wishlists</h2>
            <p className="text-muted-foreground mb-4">
              Crie wishlists públicas para partilhar com amigos e família.
            </p>
            <Button asChild>
              <a href="/auth">Iniciar Sessão</a>
            </Button>
          </Card>
        ) : (
          <div className="space-y-8">
            <Card className="p-6">
              <h2 className="font-semibold mb-4">Ver Wishlist Pública</h2>
              <div className="flex gap-2">
                <Input
                  placeholder="Cole o código ou link da wishlist..."
                  value={wishlistId}
                  onChange={(e) => setWishlistId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadWishlist()}
                />
                <Button onClick={loadWishlist} disabled={loading}>
                  {loading ? 'A carregar...' : 'Ver'}
                </Button>
              </div>
            </Card>

            {wishlist && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{wishlist.name || 'Wishlist'}</h2>
                    <p className="text-sm text-muted-foreground">
                      Por {wishlist.profiles?.full_name || 'Usuário'}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareWishlist(wishlist.id)}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="ml-2">Copiar Link</span>
                  </Button>
                </div>

                {wishlist.wishlist_items?.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {wishlist.wishlist_items.map((item: any) => (
                      <a
                        key={item.id}
                        href={`/produto/${item.products?.id}`}
                        className="block group"
                      >
                        <div className="bg-muted rounded-lg overflow-hidden mb-2">
                          <img
                            src={item.products?.image_url || "https://via.placeholder.com/200"}
                            alt={item.products?.name}
                            className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary">
                          {item.products?.name}
                        </h3>
                        <p className="text-primary font-bold">
                          {item.products?.price?.toLocaleString('pt-MZ')} MT
                        </p>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Esta wishlist está vazia.
                  </p>
                )}
              </Card>
            )}

            {userWishlists && userWishlists.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">As Minhas Wishlists</h2>
                <div className="grid gap-4">
                  {userWishlists.map((wl: any) => (
                    <Card key={wl.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{wl.name || 'Wishlist sem nome'}</h3>
                          <p className="text-sm text-muted-foreground">
                            {wl.wishlist_items?.[0]?.count || 0} produtos
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {!wl.is_public && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => makePublic(wl.id)}
                            >
                              Tornar Pública
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => shareWishlist(wl.id)}
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button asChild variant="ghost" size="sm">
                            <a href={`/wishlist/${wl.id}`}>
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
