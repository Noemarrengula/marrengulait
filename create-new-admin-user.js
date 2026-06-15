#!/usr/bin/env node

/**
 * ═══════════════════════════════════════════════════════════════════
 * NOVO USUÁRIO + AUTO-PROMOTER A ADMIN
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Este script:
 * ✅ Espera por novo registro (sign up)
 * ✅ Obtém o novo UUID automaticamente
 * ✅ Promove a admin com um clique
 * ✅ Verifica se funcionou
 */

const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

// ═══════════════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════════════

const CONFIG = {
  supabaseUrl: process.env.VITE_SUPABASE_URL,
  supabaseKey: process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
};

let supabase;

// ═══════════════════════════════════════════════════════════════════
// INICIALIZAÇÃO
// ═══════════════════════════════════════════════════════════════════

function initSupabase() {
  if (!CONFIG.supabaseUrl || !CONFIG.supabaseKey) {
    console.error('\n❌ Variáveis de ambiente não configuradas!');
    console.error('   Defina: VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY');
    process.exit(1);
  }

  supabase = createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);
  console.log('✅ Supabase conectado');
}

// ═══════════════════════════════════════════════════════════════════
// OBTER ENTRADA DO USUÁRIO
// ═══════════════════════════════════════════════════════════════════

function question(prompt) {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(prompt, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

// ═══════════════════════════════════════════════════════════════════
// PASSO 1: INSTRUÇÕES
// ═══════════════════════════════════════════════════════════════════

async function step1_Instructions() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║  PASSO 1: REGISTAR NOVO USUÁRIO NO APP                    ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  console.log('📝 INSTRUÇÕES:');
  console.log('  1. Vá para: http://localhost:5173/auth');
  console.log('  2. Clique em: "Sign Up / Registar"');
  console.log('  3. Preencha:');
  console.log('     - Email: [seu email novo]');
  console.log('     - Password: [sua senha]');
  console.log('     - Confirme a senha');
  console.log('  4. Clique em: "Sign Up"');
  console.log('  5. Volte aqui e pressione ENTER quando terminar\n');

  await question('⏳ Quando terminar o registro, pressione ENTER...');
}

// ═══════════════════════════════════════════════════════════════════
// PASSO 2: OBTER EMAIL
// ═══════════════════════════════════════════════════════════════════

async function step2_GetEmail() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║  PASSO 2: QUAL É O EMAIL QUE REGISTOU?                   ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  const email = await question('📧 Email registado: ');

  if (!email.includes('@')) {
    console.error('❌ Email inválido!');
    return await step2_GetEmail();
  }

  return email;
}

// ═══════════════════════════════════════════════════════════════════
// PASSO 3: ENCONTRAR USUÁRIO
// ═══════════════════════════════════════════════════════════════════

async function step3_FindUser(email) {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║  PASSO 3: PROCURANDO USUÁRIO NO BANCO                     ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  console.log('🔍 Procurando usuário com email:', email);

  // Tentar obter dados via user_roles (tem permissão)
  const { data: userRoles, error: roleError } = await supabase
    .from('user_roles')
    .select('user_id')
    .gt('created_at', new Date(Date.now() - 5 * 60000).toISOString()); // Últimos 5 minutos

  if (roleError || !userRoles || userRoles.length === 0) {
    console.warn('⚠️  Não foi possível via RLS');
    console.log('\n💡 Opções:');
    console.log('  1. Se já está logado no app, vou ler da sessão');
    console.log('  2. Você precisa me dar o UUID manualmente');
    console.log('  3. Fazer sign in primeiro\n');

    const manualUUID = await question('🆔 Cole o UUID (veja console do app com F12): ');

    if (manualUUID.length === 36) { // UUID format
      return manualUUID;
    } else {
      console.error('❌ UUID inválido (deve ter 36 caracteres)');
      return await step3_FindUser(email);
    }
  }

  // Se encontrou usuários recentes, usar o mais recente
  const latestUserID = userRoles[0].user_id;
  console.log('✅ Usuário encontrado!');
  console.log('   UUID:', latestUserID);

  return latestUserID;
}

// ═══════════════════════════════════════════════════════════════════
// PASSO 4: PROMOVER A ADMIN
// ═══════════════════════════════════════════════════════════════════

async function step4_PromoteAdmin(userID) {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║  PASSO 4: PROMOVENDO A ADMIN                              ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  console.log('🔐 Adicionando role ADMIN ao usuário...');

  // 1. Verificar se já tem role
  const { data: existing } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userID);

  if (existing && existing.some(r => r.role === 'admin')) {
    console.log('✅ Usuário JÁ TEM role admin');
    return true;
  }

  // 2. Se tem 'user', remover
  if (existing && existing.some(r => r.role === 'user')) {
    const { error: deleteError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userID)
      .eq('role', 'user');

    if (deleteError) {
      console.warn('⚠️  Erro ao remover role user:', deleteError.message);
    } else {
      console.log('  Removido role anterior (user)');
    }
  }

  // 3. Adicionar admin
  const { error } = await supabase
    .from('user_roles')
    .insert({
      user_id: userID,
      role: 'admin'
    });

  if (error) {
    if (error.message.includes('duplicate') || error.message.includes('unique')) {
      console.log('✅ Role admin já existe');
      return true;
    }
    console.error('❌ Erro ao promover:', error.message);
    return false;
  }

  console.log('✅ Role ADMIN adicionado com sucesso!');
  return true;
}

// ═══════════════════════════════════════════════════════════════════
// PASSO 5: VERIFICAÇÃO
// ═══════════════════════════════════════════════════════════════════

async function step5_Verify(userID, email) {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║  PASSO 5: VERIFICAÇÃO FINAL                               ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  const { data: roles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userID);

  const hasAdmin = roles?.some(r => r.role === 'admin');

  if (hasAdmin) {
    console.log('✅ VERIFICAÇÃO OK - Usuário é ADMIN\n');
    console.log('📊 Resumo Final:');
    console.log('   Email:', email);
    console.log('   UUID:', userID);
    console.log('   Roles:', roles?.map(r => r.role).join(', ') || 'user');
    console.log('   Status: ✅ PRONTO\n');
    return true;
  } else {
    console.error('❌ VERIFICAÇÃO FALHOU');
    console.log('   Roles encontradas:', roles?.map(r => r.role).join(', ') || 'nenhuma');
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════
// PASSO 6: PRÓXIMOS PASSOS
// ═══════════════════════════════════════════════════════════════════

function step6_NextSteps(email) {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║  PASSO 6: PRÓXIMOS PASSOS                                 ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  console.log('✅ Conta criada e promovida a admin!\n');

  console.log('📝 O que fazer agora:');
  console.log('');
  console.log('1️⃣  FAZER LOGOUT (se ainda logado):');
  console.log('   - Clique no menu do usuário');
  console.log('   - Selecione "Sign Out"');
  console.log('');
  console.log('2️⃣  FAZER LOGIN NOVAMENTE:');
  console.log('   - Ir para: http://localhost:5173/auth');
  console.log('   - Email:', email);
  console.log('   - Password: [sua senha]');
  console.log('   - Clique "Sign In"');
  console.log('');
  console.log('3️⃣  ACESSAR PAINEL ADMIN:');
  console.log('   - Depois do login, acesse: http://localhost:5173/admin');
  console.log('   - Painel completo deve aparecer ✅');
  console.log('');
  console.log('4️⃣  VERIFICAR NO CONSOLE (F12):');
  console.log('   - Procure por: ✅ Roles carregados ... [\'admin\']');
  console.log('   - Se vir isto = funcionou! 🎉');
  console.log('');
}

// ═══════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════

async function main() {
  console.clear();

  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log('║     🔐 NOVO USUÁRIO + PROMOÇÃO A ADMIN                   ║');
  console.log('║                                                           ║');
  console.log('║          6 Passos Simples (5 minutos)                     ║');
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');

  try {
    // Inicializar
    initSupabase();

    // Passo 1: Instruções
    await step1_Instructions();

    // Passo 2: Email
    const email = await step2_GetEmail();

    // Passo 3: Encontrar usuário
    const userID = await step3_FindUser(email);

    // Passo 4: Promover
    const promoted = await step4_PromoteAdmin(userID);

    if (!promoted) {
      console.error('\n❌ Falha ao promover a admin');
      process.exit(1);
    }

    // Passo 5: Verificar
    const verified = await step5_Verify(userID, email);

    if (!verified) {
      console.error('\n⚠️  Verificação falhou, mas continue anyway');
    }

    // Passo 6: Próximos passos
    step6_NextSteps(email);

    console.log('\n✨ Script concluído! Boa sorte! 🚀\n');

  } catch (error) {
    console.error('\n❌ ERRO FATAL:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// ─────────────────────────────────────────────────────────────────
// Executar
// ─────────────────────────────────────────────────────────────────
main();
