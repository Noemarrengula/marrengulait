import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye } from 'lucide-react';

interface ServiceRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  service_type: string;
  status: string;
  created_at: string;
}

interface ServicesTableProps {
  services: ServiceRequest[];
  onStatusChange: (id: string, status: string) => void;
  onView: (service: ServiceRequest) => void;
}

const ServicesTable = ({ services, onStatusChange, onView }: ServicesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cliente</TableHead>
          <TableHead>Tipo de Serviço</TableHead>
          <TableHead>Contacto</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service) => (
          <TableRow key={service.id}>
            <TableCell className="font-medium">{service.name}</TableCell>
            <TableCell>{service.service_type}</TableCell>
            <TableCell className="text-sm">
              <div>{service.phone}</div>
              <div className="text-muted-foreground">{service.email}</div>
            </TableCell>
            <TableCell>
              <Select value={service.status} onValueChange={(value) => onStatusChange(service.id, value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="contacted">Contactado</SelectItem>
                  <SelectItem value="completed">Completo</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell className="text-sm">
              {new Date(service.created_at).toLocaleDateString('pt-MZ')}
            </TableCell>
            <TableCell>
              <Button size="sm" variant="ghost" onClick={() => onView(service)}>
                <Eye className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ServicesTable;
