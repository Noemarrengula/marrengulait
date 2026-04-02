import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

const isDev = import.meta.env.DEV;

type UserRole = 'admin' | 'vendor' | 'user';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  const fetchRolesFromSupabase = useCallback(async (userId: string): Promise<UserRole[]> => {
    if (!userId) return [];

    try {
      if (isDev) console.log('Fetching roles for user:', userId);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) {
        console.error('Error loading roles:', error.message);
        return ['user'];
      }

      const userRoles = (data || []).map(r => r.role as UserRole);
      return userRoles.length > 0 ? userRoles : ['user'];
    } catch (error) {
      console.error('Critical error fetching roles');
      return ['user'];
    }
  }, []);

  const validateUserUUID = useCallback(async (sessionUser: User): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', sessionUser.email)
        .single();

      if (error || !data) {
        return true;
      }

      if (sessionUser.id !== data.id) {
        console.error('UUID MISMATCH DETECTED');
        return false;
      }

      return true;
    } catch (error) {
      return true;
    }
  }, []);

  const fixSessionUUID = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      
      const keysToRemove = Object.keys(localStorage).filter(k => 
        k.includes('supabase') || k.includes('auth') || k.includes('sb-')
      );
      keysToRemove.forEach(k => localStorage.removeItem(k));

      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Error fixing session:', error);
    }
  }, []);

  const fetchUserFromSupabase = useCallback(async (): Promise<User | null> => {
    try {
      if (isDev) console.log('Fetching user data...');
      
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Error fetching user:', error.message);
        return null;
      }

      if (user) {
        if (isDev) console.log('User authenticated');
        
        const isValid = await validateUserUUID(user);
        if (!isValid) {
          await fixSessionUUID();
          return null;
        }
        
        return user;
      }

      return null;
    } catch (error) {
      console.error('Critical error fetching user');
      return null;
    }
  }, [validateUserUUID, fixSessionUUID]);

  const syncFromSupabase = useCallback(async () => {
    try {
      if (isDev) console.log('Starting sync...');
      
      const currentUser = await fetchUserFromSupabase();
      setUser(currentUser);

      if (!currentUser) {
        setRoles([]);
        setLoading(false);
        return;
      }

      await ensureProfile(currentUser);

      const userRoles = await fetchRolesFromSupabase(currentUser.id);
      setRoles(userRoles);

      if (isDev) console.log('Sync completed');
    } catch (error) {
      console.error('Sync error:', error);
      setRoles(['user']);
    } finally {
      setLoading(false);
    }
  }, [fetchUserFromSupabase, fetchRolesFromSupabase]);

  useEffect(() => {
    syncFromSupabase();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (_event === 'SIGNED_IN' || _event === 'TOKEN_REFRESHED' || _event === 'INITIAL_SESSION') {
        syncFromSupabase();
      } else if (_event === 'SIGNED_OUT') {
        setUser(null);
        setRoles([]);
        setLoading(false);
      }
    });

    const interval = setInterval(() => {
      syncFromSupabase();
    }, 60000);

    setRefreshInterval(interval);

    return () => {
      subscription.unsubscribe();
      if (interval) clearInterval(interval);
    };
  }, [syncFromSupabase]);

  const forceSync = useCallback(async () => {
    await syncFromSupabase();
  }, [syncFromSupabase]);

  const hasRole = (role: UserRole) => roles.includes(role);
  const isAdmin = hasRole('admin');
  const isVendor = hasRole('vendor');

  const ensureProfile = async (authUser: User) => {
    try {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', authUser.id)
        .single();
      
      if (!existingProfile) {
        const fullName = authUser.user_metadata?.full_name || 
                        authUser.user_metadata?.name ||
                        authUser.email?.split('@')[0] || 
                        'Utilizador';
        
        await supabase.from('profiles').insert({
          user_id: authUser.id,
          full_name: fullName,
        });
        
        await supabase.from('loyalty_points').insert({
          user_id: authUser.id,
          points: 0,
          tier: 'bronze',
        });
      }
    } catch (error) {
      console.error('Error ensuring profile:', error);
    }
  };

  const signIn = async (email: string, password?: string) => {
    if (password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data.user) {
        await ensureProfile(data.user);
        await new Promise(resolve => setTimeout(resolve, 500));
        await syncFromSupabase();
      }

      return { data, error };
    }
    
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
      const keys = Object.keys(localStorage).filter(k => 
        k.includes('supabase') || k.includes('auth')
      );
      keys.forEach(k => localStorage.removeItem(k));
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
    forceSync,
  };
};
