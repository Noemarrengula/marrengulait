import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useSettings } from '@/contexts/SettingsContext';

interface ServiceRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  service_type: string;
  message: string;
  status: string;
  created_at: string;
}

interface ServiceDetailsDialogProps {
  service: ServiceRequest | null;
  open: boolean;
  onClose: () => void;
}

const ServiceDetailsDialog = ({ service, open, onClose }: ServiceDetailsDialogProps) => {
  const { locale } = useSettings();
  if (!service) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes da Solicitação</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Cliente</h3>
            <p>{service.name}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-sm">{service.email}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Telefone</h3>
              <p className="text-sm">{service.phone}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Tipo de Serviço</h3>
            <p>{service.service_type}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Mensagem</h3>
            <p className="text-sm bg-muted p-3 rounded">{service.message}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Status</h3>
            <Badge>{service.status}</Badge>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Data da Solicitação</h3>
            <p className="text-sm">
              {new Date(service.created_at).toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDetailsDialog;
