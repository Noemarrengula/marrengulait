import { Badge } from '@/components/ui/badge';
import { useSettings } from '@/context/SettingsContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, User, Store as StoreIcon } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  created_at: string;
  roles: string[];
}

interface UsersTableProps {
  users: UserData[];
  onViewUser: (user: UserData) => void;
}

const UsersTable = ({ users, onViewUser }: UsersTableProps) => {
  const { locale } = useSettings();
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-3 w-3" />;
      case 'vendor': return <StoreIcon className="h-3 w-3" />;
      default: return <User className="h-3 w-3" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'default';
      case 'vendor': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Roles</TableHead>
          <TableHead>Data de Registo</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.email}</TableCell>
            <TableCell>
              <div className="flex gap-1">
                {user.roles.length > 0 ? (
                  user.roles.map((role) => (
                    <Badge key={role} variant={getRoleBadgeVariant(role) as any}>
                      {getRoleIcon(role)}
                      <span className="ml-1">{role}</span>
                    </Badge>
                  ))
                ) : (
                  <Badge variant="outline">user</Badge>
                )}
              </div>
            </TableCell>
            <TableCell className="text-sm">
              {new Date(user.created_at).toLocaleDateString(locale)}
            </TableCell>
            <TableCell>
              <Button size="sm" variant="ghost" onClick={() => onViewUser(user)}>
                Ver Detalhes
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UsersTable;
