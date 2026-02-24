import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ServicesTable from './ServicesTable';
import ServiceDetailsDialog from './ServiceDetailsDialog';

const ServicesManagement = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      toast({ title: 'Erro ao carregar serviços', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('service_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'Status atualizado' });
      loadServices();
    } catch (error) {
      toast({ title: 'Erro ao atualizar status', variant: 'destructive' });
    }
  };

  const handleView = (service: any) => {
    setSelectedService(service);
    setDialogOpen(true);
  };

  useEffect(() => {
    loadServices();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (services.length === 0) {
    return <p className="text-muted-foreground">Nenhuma solicitação de serviço encontrada</p>;
  }

  return (
    <>
      <ServicesTable
        services={services}
        onStatusChange={handleStatusChange}
        onView={handleView}
      />
      <ServiceDetailsDialog
        service={selectedService}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
};

export default ServicesManagement;
