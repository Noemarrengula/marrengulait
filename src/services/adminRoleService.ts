import { supabase } from "@/integrations/supabase/client";

export const adminRoleService = {
  /**
   * Verifica e garante que um usuário tem pelo menos um role na tabela user_roles
   * Se não tiver, insere 'user' como padrão
   */
  async ensureUserHasRole(userId: string): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao verificar roles:', error);
        return 'user';
      }

      if (!data) {
        // Inserir role padrão
        const { data: inserted, error: insertError } = await supabase
          .from('user_roles')
          .insert([{ user_id: userId, role: 'user' }])
          .select()
          .single();

        if (insertError) {
          console.error('Erro ao inserir role padrão:', insertError);
          return 'user';
        }

        return inserted?.role || 'user';
      }

      return data.role;
    } catch (error) {
      console.error('Erro em ensureUserHasRole:', error);
      return 'user';
    }
  },

  /**
   * Promove um usuário a admin
   */
  async promoteToAdmin(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Primeiro, verifica se já é admin
      const { data: existingAdmin, error: checkError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        return { success: false, error: `Erro ao verificar status: ${checkError.message}` };
      }

      if (existingAdmin) {
        return { success: true }; // Já é admin
      }

      // Remove role anterior (asumindo que é 'user')
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) {
        console.warn('Aviso ao remover role anterior:', deleteError);
      }

      // Insere role de admin
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert([{ user_id: userId, role: 'admin' }]);

      if (insertError) {
        return { success: false, error: `Erro ao promover: ${insertError.message}` };
      }

      console.log('✅ Usuário promovido a admin:', userId);
      return { success: true };
    } catch (error) {
      return { success: false, error: `Erro desconhecido: ${error}` };
    }
  },

  /**
   * Muda o role de um usuário
   */
  async changeUserRole(userId: string, newRole: 'admin' | 'vendor' | 'user'): Promise<{ success: boolean; error?: string }> {
    try {
      // Remove roles anteriores
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError && deleteError.code !== 'PGRST116') {
        console.warn('Aviso ao remover roles anteriores:', deleteError);
      }

      // Insere novo role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert([{ user_id: userId, role: newRole }]);

      if (insertError) {
        return { success: false, error: `Erro ao atualizar role: ${insertError.message}` };
      }

      console.log(`✅ Role do usuário ${userId} alterado para ${newRole}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: `Erro desconhecido: ${error}` };
    }
  },

  /**
   * Obtém o role principal de um usuário
   */
  async getUserRole(userId: string): Promise<'admin' | 'vendor' | 'user' | null> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar role:', error);
        return null;
      }

      return data?.role || null;
    } catch (error) {
      console.error('Erro em getUserRole:', error);
      return null;
    }
  },

  /**
   * Lista todos os usuários admin
   */
  async listAdmins(): Promise<Array<{ id: string; email: string; role: string }>> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .eq('role', 'admin');

      if (error) {
        console.error('Erro ao listar admins:', error);
        return [];
      }

      // Agora busca os emails
      const adminIds = data?.map(d => d.user_id) || [];
      if (adminIds.length === 0) return [];

      // Nota: auth.users não é diretamente consultável pelo usuário normal
      // Você precisaria de uma função SQL SECURITY DEFINER para isso
      // Por enquanto, retorna apenas IDs e roles
      return data?.map(d => ({
        id: d.user_id,
        email: 'unknown',
        role: d.role
      })) || [];
    } catch (error) {
      console.error('Erro em listAdmins:', error);
      return [];
    }
  }
};
