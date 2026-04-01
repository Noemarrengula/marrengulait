import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

type UserRole = 'admin' | 'vendor' | 'user';

/**
 * Hook de autenticação refatorado para ler SEMPRE do Supabase
 * ⚠️ IMPORTANTE: Não depende de localStorage, tudo é sincronizado em tempo real
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  /**
   * Função para fetch roles SEMPRE FRESH do Supabase
   * Não usa cache, é busca direta ao banco
   */
  const fetchRolesFromSupabase = useCallback(async (userId: string): Promise<UserRole[]> => {
    if (!userId) {
      console.log('⚠️ User ID não fornecido');
      return [];
    }

    try {
      console.log('🔄 Buscando roles do Supabase para:', userId);
      
      // Query FRESH direto ao Supabase (sem cache)
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) {
        console.error('❌ Erro ao carregar roles:', error.message);
        return ['user']; // Default fallback
      }

      const userRoles = (data || []).map(r => r.role as UserRole);
      console.log(`✅ Roles carregados do Supabase para ${userId}:`, userRoles);
      
      return userRoles.length > 0 ? userRoles : ['user'];
    } catch (error) {
      console.error('❌ Erro crítico ao fetch roles:', error);
      return ['user'];
    }
  }, []);

  /**
   * Validar UUID: Detectar mismatches entre session e banco de dados
   */
  const validateUserUUID = useCallback(async (sessionUser: User): Promise<boolean> => {
    try {
      // Query o user real do banco de dados usando o email
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', sessionUser.email)
        .single();

      if (error || !data) {
        console.warn('⚠️ [UUID] Não conseguiu validar UUID contra profiles');
        return true; // Assume válido
      }

      // Se o UUID da session é diferente do banco, há mismatch
      if (sessionUser.id !== data.id) {
        console.error('❌ [UUID MISMATCH CRÍTICO]', {
          sessionUUID: sessionUser.id,
          databaseUUID: data.id,
          email: sessionUser.email
        });
        return false;
      }

      console.log('✅ [UUID] Validação OK:', sessionUser.id);
      return true;
    } catch (error) {
      console.warn('⚠️ [UUID] Erro ao validar:', error);
      return true; // Assume válido em caso de erro
    }
  }, []);

  /**
   * Corrigir session UUID inválida: Force refresh da session
   */
  const fixSessionUUID = useCallback(async () => {
    try {
      console.log('🔧 [FIX] Tentando corrigir UUID da session...');
      
      // 1. Sign out
      await supabase.auth.signOut();
      
      // 2. Limpar localStorage completamente
      const keysToRemove = Object.keys(localStorage).filter(k => 
        k.includes('supabase') || k.includes('auth') || k.includes('sb-')
      );
      keysToRemove.forEach(k => {
        console.log(`🗑️ Removendo localStorage: ${k}`);
        localStorage.removeItem(k);
      });

      // 3. Recarregar a página para obter nova session do Supabase
      console.log('🔄 Recarregando página para nova session...');
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('❌ [FIX] Erro ao corrigir session:', error);
    }
  }, []);

  /**
   * Função para fetch user ALWAYS FRESH
   */
  const fetchUserFromSupabase = useCallback(async (): Promise<User | null> => {
    try {
      console.log('🔄 Buscando dados do usuário do Supabase...');
      
      // Sempre busca fresh da sessão Supabase
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        console.error('❌ Erro ao buscar usuário:', error.message);
        return null;
      }

      if (user) {
        console.log(`✅ Usuário encontrado: ${user.email} (ID: ${user.id})`);
        
        // Validar UUID
        const isValid = await validateUserUUID(user);
        if (!isValid) {
          console.error('❌ UUID INVÁLIDO DETECTADO - Iniciando correção');
          await fixSessionUUID();
          return null;
        }
        
        return user;
      }

      console.log('⚠️ Nenhum usuário autenticado');
      return null;
    } catch (error) {
      console.error('❌ Erro crítico ao fetch user:', error);
      return null;
    }
  }, [validateUserUUID, fixSessionUUID]);

  /**
   * Sincronização completa: Fetch user + roles + ensure profile
   */
  const syncFromSupabase = useCallback(async () => {
    try {
      console.log('🔄 [SYNC] Iniciando sincronização com Supabase...');
      
      // 1. Buscar usuário
      const currentUser = await fetchUserFromSupabase();
      setUser(currentUser);

      if (!currentUser) {
        console.log('⚠️ [SYNC] Sem usuário autenticado');
        setRoles([]);
        setLoading(false);
        return;
      }

      // 2. Garantir que perfil existe
      await ensureProfile(currentUser);

      // 3. Buscar roles do usuário
      const userRoles = await fetchRolesFromSupabase(currentUser.id);
      setRoles(userRoles);

      console.log('✅ [SYNC] Sincronização completada', {
        email: currentUser.email,
        uuid: currentUser.id,
        roles: userRoles
      });
    } catch (error) {
      console.error('❌ [SYNC] Erro na sincronização:', error);
      setRoles(['user']);
    } finally {
      setLoading(false);
    }
  }, [fetchUserFromSupabase, fetchRolesFromSupabase]);

  /**
   * Inicialização e listeners
   */
  useEffect(() => {
    // Sincronização inicial
    syncFromSupabase();

    // Listener para mudanças de auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log(`🔔 [AUTH EVENT] ${_event}:`, session?.user?.email);
      
      if (_event === 'SIGNED_IN' || _event === 'TOKEN_REFRESHED' || _event === 'INITIAL_SESSION') {
        // Re-sincronizar quando autenticação muda
        syncFromSupabase();
      } else if (_event === 'SIGNED_OUT') {
        setUser(null);
        setRoles([]);
        setLoading(false);
      }
    });

    // Sync em tempo real: Re-sincronizar a cada 60 segundos
    // Isso garante que sempre temos dados FRESH do Supabase
    const interval = setInterval(() => {
      console.log('🔄 [AUTO-SYNC] Sincronização automática cada 60s');
      syncFromSupabase();
    }, 60000);

    setRefreshInterval(interval);

    // Cleanup
    return () => {
      subscription.unsubscribe();
      if (interval) clearInterval(interval);
    };
  }, [syncFromSupabase]);

  /**
   * Forçar sincronização manual
   */
  const forceSync = useCallback(async () => {
    console.log('⚡ [MANUAL] Sincronização forçada');
    await syncFromSupabase();
  }, [syncFromSupabase]);

  /**
   * Helpers
   */
  const hasRole = (role: UserRole) => roles.includes(role);
  const isAdmin = hasRole('admin');
  const isVendor = hasRole('vendor');

  /**
   * Garantir que perfil existe após login
   */
  const ensureProfile = async (authUser: User) => {
    try {
      // Verificar se perfil existe
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', authUser.id)
        .single();
      
      if (!existingProfile) {
        // Criar novo perfil
        const fullName = authUser.user_metadata?.full_name || 
                        authUser.user_metadata?.name ||
                        authUser.email?.split('@')[0] || 
                        'Utilizador';
        
        await supabase.from('profiles').insert({
          user_id: authUser.id,
          full_name: fullName,
        });
        
        // Criar loyalty_points
        await supabase.from('loyalty_points').insert({
          user_id: authUser.id,
          points: 0,
          tier: 'bronze',
        });
        
        console.log('✅ Perfil criado para:', authUser.email);
      }
    } catch (error) {
      console.error('❌ Erro ao garantir perfil:', error);
    }
  };

  /**
   * Auth methods (sem dependência de cache)
   */
  const signIn = async (email: string, password?: string) => {
    // Se tiver password, usa login normal
    if (password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Sincronizar após login
      if (!error && data.user) {
        await ensureProfile(data.user);
        await new Promise(resolve => setTimeout(resolve, 500));
        await syncFromSupabase();
      }

      return { data, error };
    }
    
    // Magic Link - sem password
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    return { data, error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (!error) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await syncFromSupabase();
    }

    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (!error) {
      setUser(null);
      setRoles([]);
      // Limpar localStorage de sessão Supabase
      const keys = Object.keys(localStorage).filter(k => 
        k.includes('supabase') || k.includes('auth')
      );
      keys.forEach(k => localStorage.removeItem(k));
      console.log('✅ Logout completo - cache limpo');
    }

    return { error };
  };

  return {
    user,
    roles,
    loading,
    hasRole,
    isAdmin,
    isVendor,
    signIn,
    signUp,
    signOut,
    forceSync, // Novo: permite sincronização manual
  };
};
