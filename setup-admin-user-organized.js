#!/usr/bin/env node

/**
 * ═══════════════════════════════════════════════════════════════════
 * SCRIPT DE SETUP ORGANIZADO - ADMIN USER
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Email: noemarrengula1@gmail.com
 * UUID: 8d28b443-b574-46c9-9f6c-02dd416cdb63
 * Role: admin
 * 
 * Este script:
 * ✅ Valida a existência da conta
 * ✅ Verifica as roles
 * ✅ Testa a autenticação
 * ✅ Gera relatórios detalhados
 */

const { createClient } = require('@supabase/supabase-js');

// ═══════════════════════════════════════════════════════════════════
// CONFIGURAÇÃO
// ═══════════════════════════════════════════════════════════════════

const CONFIG = {
  email: 'noemarrengula1@gmail.com',
  correctUUID: '8d28b443-b574-46c9-9f6c-02dd416cdb63',
  requiredRole: 'admin',
  supabaseUrl: process.env.VITE_SUPABASE_URL,
  supabaseKey: process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
};

// ═══════════════════════════════════════════════════════════════════
// VALIDAÇÃO DE AMBIENTE
// ═══════════════════════════════════════════════════════════════════

function validateEnvironment() {
  console.log('\n📋 VALIDANDO AMBIENTE...\n');
  
  const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Variáveis de ambiente faltando:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.log('\nDefina no arquivo .env ou execute com:');
    console.log('export VITE_SUPABASE_URL="your-url"');
    console.log('export VITE_SUPABASE_PUBLISHABLE_KEY="your-key"');
    process.exit(1);
  }
  
  console.log('✅ Ambiente validado');
  console.log(`   URL: ${CONFIG.supabaseUrl.substring(0, 30)}...`);
  console.log(`   Key: ${CONFIG.supabaseKey.substring(0, 20)}...`);
}

// ═══════════════════════════════════════════════════════════════════
// INICIALIZAÇÃO DO CLIENTE
// ═══════════════════════════════════════════════════════════════════

function initializeSupabase() {
  console.log('\n🔌 CONECTANDO AO SUPABASE...\n');
  
  const supabase = createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);
  console.log('✅ Cliente Supabase inicializado');
  
  return supabase;
}

// ═══════════════════════════════════════════════════════════════════
// VERIFICAÇÕES
// ═══════════════════════════════════════════════════════════════════

async function checkUserExists(supabase) {
  console.log('\n👤 VERIFICANDO USUÁRIO...\n');
  
  try {
    // Verificar se existem usuários (sem filter - pode não ter permissão em RLS)
    const { data: userRoles, error } = await supabase
      .from('user_roles')
      .select('user_id, role')
      .eq('user_id', CONFIG.correctUUID);
    
    if (error) {
      console.warn('⚠️  Não foi possível verificar via RLS query');
    }
    
    const hasAdminRole = userRoles?.some(ur => ur.role === 'admin');
    
    if (hasAdminRole) {
      console.log(`✅ Usuário EXISTE e TEM ROLE ADMIN`);
      console.log(`   Email: ${CONFIG.email}`);
      console.log(`   UUID: ${CONFIG.correctUUID}`);
      console.log(`   Roles: ${userRoles.map(ur => ur.role).join(', ')}`);
      return true;
    } else {
      console.warn(`⚠️  Usuário NÃO TEM ROLE ADMIN`);
      console.log(`   Roles atuais: ${userRoles?.map(ur => ur.role).join(', ') || 'nenhuma'}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Erro ao verificar usuário:`, error.message);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════
// SETUP
// ═══════════════════════════════════════════════════════════════════

async function ensureAdminRole(supabase) {
  console.log('\n🔐 CONFIGURANDO ROLES...\n');
  
  try {
    // Verificar se já tem admin
    const { data: existing } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', CONFIG.correctUUID)
      .eq('role', 'admin');
    
    if (existing && existing.length > 0) {
      console.log('✅ Usuário já TEM role ADMIN');
      return true;
    }
    
    // Adicionar role admin
    console.log('➕ Adicionando role ADMIN...');
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: CONFIG.correctUUID,
        role: 'admin',
      });
    
    if (error) {
      if (error.message.includes('duplicate') || error.message.includes('violates unique')) {
        console.log('✅ Role ADMIN já existe');
        return true;
      }
      console.error(`❌ Erro ao inserir role:`, error.message);
      return false;
    }
    
    console.log('✅ Role ADMIN adicionada com sucesso');
    return true;
  } catch (error) {
    console.error(`❌ Erro ao configurar roles:`, error.message);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════
// TESTES
// ═══════════════════════════════════════════════════════════════════

async function testAuthentication(supabase) {
  console.log('\n🧪 TESTANDO AUTENTICAÇÃO...\n');
  
  try {
    // Obter sessão atual (se houver)
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.log('ℹ️  Nenhuma sessão ativa (normal para novo teste)');
      console.log('   Para testar login, execute no browser:');
      console.log(`   Email: ${CONFIG.email}`);
      console.log('   Password: [sua senha]');
      return null;
    }
    
    if (user) {
      console.log(`✅ Sessão ativa encontrada`);
      console.log(`   Email: ${user.email}`);
      console.log(`   UUID: ${user.id}`);
      
      // Verificar se é o usuário esperado
      if (user.id === CONFIG.correctUUID) {
        console.log('✅ UUID CORRESPONDE AO ESPERADO');
        return true;
      } else {
        console.warn(`⚠️  UUID NÃO CORRESPONDE`);
        console.log(`   Esperado: ${CONFIG.correctUUID}`);
        console.log(`   Recebido: ${user.id}`);
        return false;
      }
    }
  } catch (error) {
    console.log(`ℹ️  Erro ao testar autenticação:`, error.message);
    console.log('   (Isso é esperado se nenhuma sessão está ativa)');
  }
}

// ═══════════════════════════════════════════════════════════════════
// GERAÇÃO DE RELATÓRIO
// ═══════════════════════════════════════════════════════════════════

async function generateReport(supabase) {
  console.log('\n📊 RELATÓRIO FINAL\n');
  console.log('═'.repeat(60));
  
  // Verificar configuration
  console.log('\n🔧 CONFIGURAÇÃO:');
  console.log(`   Email: ${CONFIG.email}`);
  console.log(`   UUID: ${CONFIG.correctUUID}`);
  console.log(`   Role esperado: ${CONFIG.requiredRole}`);
  
  // Verificar banco
  console.log('\n💾 STATUS DO BANCO:');
  try {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', CONFIG.correctUUID);
    
    if (data && data.length > 0) {
      console.log(`   ✅ Roles encontradas: ${data.map(r => r.role).join(', ')}`);
      const hasAdmin = data.some(r => r.role === 'admin');
      console.log(`   ✅ Admin role: ${hasAdmin ? 'SIM' : 'NÃO'}`);
    } else {
      console.log('   ⚠️  Nenhuma role encontrada');
    }
  } catch (error) {
    console.log(`   ⚠️  Não foi possível verificar:`, error.message);
  }
  
  // Próximos passos
  console.log('\n📝 PRÓXIMOS PASSOS:');
  console.log('   1. Faça login no app com:');
  console.log(`      Email: ${CONFIG.email}`);
  console.log('      Password: [sua senha]');
  console.log('   2. Vá para: http://localhost:5173/admin');
  console.log('   3. O painel admin deve aparecer');
  console.log('\n🔍 VERIFICAÇÃO NO CONSOLE (F12):');
  console.log('   Procure por ✅ Roles carregados do Supabase');
  console.log('   que incluir: admin');
  
  console.log('\n═'.repeat(60));
  console.log('✅ SETUP CONCLUÍDO\n');
}

// ═══════════════════════════════════════════════════════════════════
// EXECUÇÃO PRINCIPAL
// ═══════════════════════════════════════════════════════════════════

async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║  SETUP ORGANIZADO - ADMIN USER                            ║');
  console.log('║  noemarrengula1@gmail.com                                 ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');

  try {
    // 1. Validar ambiente
    validateEnvironment();
    
    // 2. Inicializar Supabase
    const supabase = initializeSupabase();
    
    // 3. Verificar usuário
    const userExists = await checkUserExists(supabase);
    
    // 4. Configurar roles
    if (!userExists) {
      console.log('\n⚙️  CONFIGURANDO...\n');
      const roleSet = await ensureAdminRole(supabase);
      if (!roleSet) {
        console.error('\n❌ Falha ao configurar roles');
        process.exit(1);
      }
    }
    
    // 5. Testar autenticação
    await testAuthentication(supabase);
    
    // 6. Gerar relatório
    await generateReport(supabase);
    
  } catch (error) {
    console.error('\n❌ ERRO FATAL:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Executar
main();
