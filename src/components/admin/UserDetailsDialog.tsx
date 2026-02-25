import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

interface UserData {
  id: string;
  email: string;
  created_at: string;
  roles: string[];
}

interface UserDetailsDialogProps {
  user: UserData | null;
  open: boolean;
  onClose: () => void;
  onUpdateRoles: (userId: string, roles: string[]) => Promise<void>;
}

const availableRoles = [
  { value: 'admin', label: 'Administrador' },
  { value: 'vendor', label: 'Vendedor' },
  { value: 'user', label: 'Utilizador' }
];

const UserDetailsDialog = ({ user, open, onClose, onUpdateRoles }: UserDetailsDialogProps) => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { locale } = useSettings();

  const handleOpen = (isOpen: boolean) => {
    if (isOpen && user) {
      setSelectedRoles(user.roles);
    }
    if (!isOpen) onClose();
  };

  const handleRoleToggle = (role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await onUpdateRoles(user.id, selectedRoles);
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar roles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes do Utilizador</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-muted-foreground">Email</Label>
            <p className="font-medium">{user.email}</p>
          </div>

          <div>
            <Label className="text-muted-foreground">Data de Registo</Label>
            <p className="font-medium">
              {new Date(user.created_at).toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          <div>
            <Label className="mb-3 block">Roles</Label>
            <div className="space-y-2">
              {availableRoles.map((role) => (
                <div key={role.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={role.value}
                    checked={selectedRoles.includes(role.value)}
                    onCheckedChange={() => handleRoleToggle(role.value)}
                  />
                  <Label htmlFor={role.value} className="cursor-pointer">
                    {role.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog;
