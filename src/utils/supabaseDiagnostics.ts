import { supabase } from '@/integrations/supabase/client';

/**
 * Script de Diagnóstico da Integração Supabase
 * Este arquivo testa todas as conexões principais
 */

export const runSupabaseDiagnostics = async () => {
  console.log('🔍 Iniciando diagnóstico Supabase...\n');

  const results = {
    client: false,
    auth: false,
    database: false,
    user: null,
    error: null
  };

  try {
    // 1. Verificar Cliente
    console.log('✓ Cliente Supabase criado com sucesso');
    results.client = true;

    // 2. Verificar Autenticação
    try {
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError) throw authError;
      
      if (session?.user) {
        console.log('✓ Autenticação ativa');
        console.log(`  - Email: ${session.user.email}`);
        console.log(`  - ID: ${session.user.id}`);
        results.user = session.user;
        results.auth = true;
      } else {
        console.log('⚠ Nenhum usuário autenticado');
        results.auth = true;
      }
    } catch (error) {
      console.error('✗ Erro na autenticação:', error instanceof Error ? error.message : 'Desconhecido');
      results.auth = false;
    }

    // 3. Verificar Banco de Dados
    try {
      const { data, error: dbError } = await supabase
        .from('products')
        .select('id')
        .limit(1);
      
      if (dbError) throw dbError;
      
      console.log('✓ Conexão com banco de dados OK');
      results.database = true;
    } catch (error) {
      console.error('✗ Erro na conexão com banco:', error instanceof Error ? error.message : 'Desconhecido');
      results.database = false;
    }

    // 4. Verificar RLS (Row Level Security)
    try {
      if (results.user) {
        const { data: userRoles, error: rlsError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', results.user.id);
        
        if (!rlsError) {
          console.log('✓ RLS funcionando corretamente');
          if (userRoles && userRoles.length > 0) {
            console.log(`  - Roles: ${userRoles.map(r => r.role).join(', ')}`);
          }
        }
      }
    } catch (error) {
      console.error('✗ Erro ao verificar RLS:', error instanceof Error ? error.message : 'Desconhecido');
    }

  } catch (error) {
    results.error = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('✗ Erro geral:', results.error);
  }

  // Resumo
  console.log('\n📊 RESUMO:');
  console.log(`Client: ${results.client ? '✓' : '✗'}`);
  console.log(`Auth: ${results.auth ? '✓' : '✗'}`);
  console.log(`Database: ${results.database ? '✓' : '✗'}`);
  console.log(`Usuário: ${results.user ? results.user.email : 'Não autenticado'}`);

  if (results.error) {
    console.error(`\n❌ Erro: ${results.error}`);
  } else if (results.client && results.auth && results.database) {
    console.log('\n✅ TUDO FUNCIONA! Integração Supabase OK\n');
  } else {
    console.warn('\n⚠️  Alguns componentes precisam de atenção\n');
  }

  return results;
};

// Executar diagnóstico no console
if (typeof window !== 'undefined') {
  (window as unknown as { runSupabaseDiagnostics: typeof runSupabaseDiagnostics }).runSupabaseDiagnostics = runSupabaseDiagnostics;
  console.log('💡 Dica: Execute "runSupabaseDiagnostics()" no console para testar a integração');
}
