import { supabase } from '@/integrations/supabase/client';

export const userService = {
  async getAllUsers() {
    try {
      // Buscar todos os usuários
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;

      // Buscar roles de cada usuário
      const usersWithRoles = await Promise.all(
        authUsers.users.map(async (user) => {
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id);

          return {
            id: user.id,
            email: user.email || '',
            created_at: user.created_at,
            roles: roles?.map(r => r.role) || []
          };
        })
      );

      return usersWithRoles;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return [];
    }
  },

  async updateUserRoles(userId: string, roles: string[]) {
    try {
      // Remover roles existentes
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Adicionar novas roles
      if (roles.length > 0) {
        const roleInserts = roles.map(role => ({
          user_id: userId,
          role
        }));

        const { error } = await supabase
          .from('user_roles')
          .insert(roleInserts);

        if (error) throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar roles:', error);
      throw error;
    }
  }
};
