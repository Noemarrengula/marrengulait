import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session, AuthError } from '@supabase/supabase-js';
import type { PostgrestError } from '@supabase/supabase-js';

type UserRole = 'admin' | 'vendor' | 'user';

const QUERY_TIMEOUT = 10000;

interface RoleResult {
  data: { role: string }[] | null;
  error: PostgrestError | null;
}

interface ProfileResult {
  data: { user_id: string }[] | null;
  error: PostgrestError | null;
}

const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Query timeout')), timeoutMs)
  );
  return Promise.race([promise, timeout]);
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      const rolesResult = await withTimeout<RoleResult>(
        supabase.from('user_roles').select('role').eq('user_id', userId),
        QUERY_TIMEOUT
      );
      const profileResult = await withTimeout<ProfileResult>(
        supabase.from('profiles').select('user_id').eq('user_id', userId),
        QUERY_TIMEOUT
      );

      const rolesData = rolesResult?.data;
      const profileData = profileResult?.data;

      let userRoles: UserRole[] = ['user'];
      if (rolesData && rolesData.length > 0) {
        userRoles = rolesData.map((r: { role: string }) => r.role as UserRole);
      }

      if (!profileData || profileData.length === 0) {
        const sessionResult = await supabase.auth.getSession();
        const currentUser = sessionResult.data.session?.user;
        const fullName =
          currentUser?.user_metadata?.full_name ||
          currentUser?.user_metadata?.name ||
          currentUser?.email?.split('@')[0] ||
          'User';

        await supabase.from('profiles').insert({
          user_id: userId,
          full_name: fullName,
        }).select().single();
      }

      setRoles(userRoles);
      return userRoles;
    } catch (err) {
      console.error('[Auth] Error fetching user data:', err);
      setRoles(['user']);
      return ['user'];
    }
  }, []);

  const initializeAuth = useCallback(async () => {
    console.log('[Auth] Initializing...');
    setLoading(true);
    setError(null);

    try {
      const sessionResult = await withTimeout<
        { data: { session: Session | null }; error: AuthError | null }
      >(
        supabase.auth.getSession(),
        QUERY_TIMEOUT
      );

      if (sessionResult.error) {
        console.error('[Auth] Session error:', sessionResult.error);
        setUser(null);
        setRoles([]);
        setError('Erro ao verificar sessão');
        setLoading(false);
        setInitialized(true);
        return;
      }

      const session = sessionResult.data?.session;

      if (!session?.user) {
        console.log('[Auth] No session');
        setUser(null);
        setRoles([]);
        setLoading(false);
        setInitialized(true);
        return;
      }

      console.log('[Auth] User found:', session.user.email);
      setUser(session.user);

      await fetchUserData(session.user.id);

      setLoading(false);
      setInitialized(true);
    } catch (err) {
      console.error('[Auth] Init error:', err);
      setUser(null);
      setRoles([]);
      setError('Erro ao inicializar');
      setLoading(false);
      setInitialized(true);
    }
  }, [fetchUserData]);

  useEffect(() => {
    console.log('[Auth] Setting up listener');
    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Auth] State changed:', event);

        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          await fetchUserData(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setRoles([]);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          setUser(session.user);
        } else if (event === 'USER_UPDATED' && session?.user) {
          setUser(session.user);
        }
      }
    );

    return () => {
      console.log('[Auth] Cleanup');
      subscription.unsubscribe();
    };
  }, [initializeAuth, fetchUserData]);

  const signIn = useCallback(async (email: string, password?: string) => {
    if (!password) {
      return { data: null, error: new Error('Password required') };
    }

    console.log('[Auth] Signing in:', email);
    setLoading(true);
    setError(null);

    try {
      const result = await withTimeout<
        { data: { session: Session | null; user: User | null } | null; error: AuthError | null }
      >(
        supabase.auth.signInWithPassword({ email, password }),
        QUERY_TIMEOUT
      );

      if (result.error) {
        console.error('[Auth] Sign in error:', result.error.message);
        setError(result.error.message);
        setLoading(false);
        return { data: result.data, error: result.error };
      }

      console.log('[Auth] Sign in success');
      setLoading(false);
      return { data: result.data, error: null };
    } catch (err) {
      console.error('[Auth] Sign in exception:', err);
      const message = err instanceof Error ? err.message : 'Erro ao fazer login';
      setError(message);
      setLoading(false);
      return { data: null, error: new Error(message) };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    console.log('[Auth] Signing up:', email);
    setLoading(true);
    setError(null);

    try {
      const result = await withTimeout<
        { data: { session: Session | null; user: User | null } | null; error: AuthError | null }
      >(
        supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        }),
        QUERY_TIMEOUT
      );

      if (result.error) {
        console.error('[Auth] Sign up error:', result.error.message);
        setError(result.error.message);
        setLoading(false);
        return { data: result.data, error: result.error };
      }

      console.log('[Auth] Sign up success');
      setLoading(false);
      return { data: result.data, error: null };
    } catch (err) {
      console.error('[Auth] Sign up exception:', err);
      const message = err instanceof Error ? err.message : 'Erro ao criar conta';
      setError(message);
      setLoading(false);
      return { data: null, error: new Error(message) };
    }
  }, []);

  const signOut = useCallback(async () => {
    console.log('[Auth] Signing out...');
    setLoading(true);

    try {
      const result = await withTimeout<{ error: AuthError | null }>(
        supabase.auth.signOut(),
        QUERY_TIMEOUT
      );

      setUser(null);
      setRoles([]);
      setLoading(false);
      return { error: result?.error };
    } catch (err) {
      console.error('[Auth] Sign out exception:', err);
      setLoading(false);
      return { error: err instanceof Error ? err : new Error('Erro ao fazer logout') };
    }
  }, []);

  const forceSync = useCallback(async () => {
    console.log('[Auth] Force sync...');
    await initializeAuth();
  }, [initializeAuth]);

  const hasRole = useCallback(
    (role: UserRole) => roles.includes(role),
    [roles]
  );

  return useMemo(() => ({
    user,
    roles,
    loading,
    initialized,
    error,
    hasRole,
    isAdmin: roles.includes('admin'),
    isVendor: roles.includes('vendor'),
    signIn,
    signUp,
    signOut,
    forceSync,
  }), [user, roles, loading, initialized, error, hasRole, signIn, signUp, signOut, forceSync]);
};
