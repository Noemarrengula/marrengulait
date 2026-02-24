// 🧪 TESTE DE SINCRONIZAÇÃO - Cole no Console (F12)

console.log('🧪 INICIANDO TESTE DE SINCRONIZAÇÃO');
console.log('═'.repeat(50));

// ===== TESTE 1: Ver dados na sessão =====
console.log('\n📋 TESTE 1: Dados na Sessão');
console.log('─'.repeat(50));

const keys = Object.keys(localStorage).filter(k => 
  k.includes('supabase') || k.includes('auth')
);

console.log(`Encontradas ${keys.length} chaves de auth no localStorage:`);
keys.forEach((k, idx) => {
  try {
    const data = JSON.parse(localStorage.getItem(k) || '{}');
    console.log(`  ${idx + 1}. ${k}`);
    if (data.user?.id) {
      console.log(`     UUID: ${data.user.id}`);
      console.log(`     Email: ${data.user.email}`);
    }
  } catch (e) {
    console.log(`  ${idx + 1}. ${k} (não é JSON)`);
  }
});

// ===== TESTE 2: Ver usuário atual no Supabase =====
console.log('\n📋 TESTE 2: Verificar User no Hook useAuth');
console.log('─'.repeat(50));

// Criar um listener para o primeiro carregamento
window.authTestData = {
  user: null,
  roles: null,
  timestamp: null
};

console.log('⏳ Aguardando que o hook useAuth sincronize...');
console.log('   (pode levar até 15 segundos por causa do auto-sync)');

// ===== TESTE 3: Informações de debug =====
console.log('\n📋 TESTE 3: Informações de Debug');
console.log('─'.repeat(50));
console.log(`URL do site: ${window.location.href}`);
console.log(`Timestamp: ${new Date().toISOString()}`);
console.log(`User Agent: ${navigator.userAgent.substring(0, 100)}`);

// ===== TESTE 4: Limpar cache se necessário =====
console.log('\n📋 TESTE 4: Opções de Limpeza (se necessário)');
console.log('─'.repeat(50));
console.log('Se houver erro, execute:');
console.log(`
  // Limpar localStorage
  Object.keys(localStorage)
    .filter(k => k.includes('supabase') || k.includes('auth'))
    .forEach(k => localStorage.removeItem(k));
  
  // Recarregar
  location.reload();
`);

// ===== TESTE 5: Monitorar próxima sincronização =====
console.log('\n📋 TESTE 5: Monitorar Sincronização');
console.log('─'.repeat(50));
console.log('A cada 10 segundos, procure no console por:');
console.log('  ✅ [SYNC] Sincronização completada');
console.log('ou');
console.log('  🔄 [AUTO-SYNC] Sincronização automática cada 10s');

// ===== TESTE 6: Verificar painel de admin =====
console.log('\n📋 TESTE 6: Testar Acesso ao Admin');
console.log('─'.repeat(50));
console.log('Verifique:');
console.log(`  1. Você vê mensagem ✅ ou ❌?`);
console.log(`  2. Se ❌ negado, clique no botão "🔄 Forçar Sincronização"`);
console.log(`  3. Procure por: "✅ Roles carregados do Supabase"`);
console.log(`  4. Procure por: "roles" com valor ['admin']`);

console.log('\n═'.repeat(50));
console.log('🧪 TESTE CONCLUÍDO - Verifique os resultados acima');
console.log('═'.repeat(50));

// ===== RESUMO =====
console.log('\n📊 RESUMO DO QUE OBSERVAR:');
console.log('═'.repeat(50));
console.table({
  'LocalStorage Auth Keys': keys.length > 0 ? '✅ Encontradas' : '⚠️ Nenhuma',
  'Autu-Sync': '✅ Cada 10s',
  'Force Sync Button': '✅ Disponível em Admin',
  'Source of Truth': '🗄️ Supabase (não cache)',
});

console.log('\n💡 DICA: Mantenha este console aberto enquanto testa!');
