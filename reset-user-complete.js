/**
 * SCRIPT DE LIMPEZA COMPLETA
 * Remove user_roles e profiles para UUID corrompido
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const ADMIN_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // Precisa da service role key

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Variáveis de ambiente não configuradas');
  console.log('Defina VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY');
  process.exit(1);
}

const { createClient } = require('@supabase/supabase-js');

// Cliente regular (para user_roles e profiles)
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Cliente admin (para deletar auth users) - opcional
const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = adminKey 
  ? createClient(SUPABASE_URL, adminKey) 
  : null;

const userEmail = 'smartirriga.info@gmail.com';
const correctUUID = '7ed44fba-1ef7-41e7-897f-2e53abaf3079';

async function cleanupAndReset() {
  console.log('\n🔍 DIAGNOSTICANDO ESTADO ATUAL...\n');

  // 1. Ver usuário CORRETO
  console.log(`✅ UUID CORRETO: ${correctUUID}`);
  
  // 2. Ver roles do UUID correto
  const { data: roles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', correctUUID);
  
  console.log(`✅ Roles do UUID correto:`, roles?.map(r => r.role) || []);

  // 3. Verificar profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', correctUUID)
    .single();
  
  console.log(`✅ Profile:`, profile ? `Existe (${profile.email || 'sem email'})` : 'NÃO EXISTE');

  console.log('\n📝 PASSOS PARA RESETAR:\n');
  console.log('1️⃣  NO DASHBOARD SUPABASE (https://app.supabase.com):');
  console.log(`    - Ir em "Authentication" > "Users"`);
  console.log(`    - Procurar por: ${userEmail}`);
  console.log(`    - Clicar nos 3 pontos (...) > "Delete user"`);
  console.log(`    - Confirmar deleção`);
  
  console.log('\n2️⃣  NO BANCO DE DADOS (OPCIONAL - Se ainda houver dados órfãos):');
  console.log(`    const { error } = await supabase`);
  console.log(`      .from('user_roles')`);
  console.log(`      .delete()`);
  console.log(`      .eq('user_id', 'dac583ee-0b85-4058-8dee-9291d592ed33'); // UUID fantasma`);
  
  console.log('\n3️⃣  DEPOIS DISSO:');
  console.log(`    - Limpar localStorage no browser: localStorage.clear()`);
  console.log(`    - Fazer Hard Refresh: Ctrl+Shift+R`);
  console.log(`    - Fazer Sign Out`);
  console.log(`    - Fazer Sign Up novamente com: ${userEmail}`);
  
  console.log('\n4️⃣  VERIFICAR QUE FUNCIONOU:');
  console.log(`    - Logar novamente`);
  console.log(`    - Console deve mostrar novo UUID (diferente de dac583ee)`);
  console.log(`    - Ir para /admin - painel deve aparecer`);

  console.log('\n🔧 ALTERNATIVA - Se preferir, use SQL diretamente:\n');
  console.log('-- Deletar dados órfãos do UUID fantasma:');
  console.log(`DELETE FROM public.user_roles WHERE user_id = 'dac583ee-0b85-4058-8dee-9291d592ed33';`);
  console.log(`DELETE FROM public.profiles WHERE id = 'dac583ee-0b85-4058-8dee-9291d592ed33';`);
}

cleanupAndReset().catch(error => {
  console.error('❌ Erro:', error.message);
  process.exit(1);
});
