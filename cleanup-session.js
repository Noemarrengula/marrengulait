// 🔧 SCRIPT DE LIMPEZA DE SESSÃO SUPABASE
// Cole isto no Console (F12 > Console) para limpar completamente a sessão

console.log('🧹 Iniciando limpeza completa de sessão Supabase...');

// ===== PASSO 1: Listar o que será deletado =====
console.log('📋 Dados a limpar:');
console.log('Local Storage:', localStorage);
console.log('Session Storage:', sessionStorage);

// ===== PASSO 2: Limpar Local Storage (dados persistidos) =====
const storageKeysToDelete = [
  'sb-ecybjpzugmtlqqwydsjq-auth-token',
  'supabase.auth.token',
  'sb_access_token',
  'sb_refresh_token',
  'SUPABASE_AUTH_USER'
];

// Deletar chaves conhecidas
storageKeysToDelete.forEach(key => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    console.log(`✅ Deletado: ${key}`);
  }
});

// Deletar tudo que contenha 'supabase' ou 'auth'
Object.keys(localStorage).forEach(key => {
  if (key.toLowerCase().includes('supabase') || key.toLowerCase().includes('auth')) {
    localStorage.removeItem(key);
    console.log(`✅ Deletado: ${key}`);
  }
});

// ===== PASSO 3: Limpar Session Storage =====
sessionStorage.clear();
console.log('✅ Session Storage limpo');

// ===== PASSO 4: Limpar Cookies (se houver) =====
document.cookie.split(";").forEach(c => {
  const eqPos = c.indexOf("=");
  const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
  if (name.toLowerCase().includes('supabase') || name.toLowerCase().includes('auth')) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    console.log(`✅ Cookie deletado: ${name}`);
  }
});

// ===== PASSO 5: Logout do Supabase via código =====
console.log('🚪 Tentando fazer logout no Supabase...');
try {
  // Importar e fazer logout (pode não funcionar se o módulo não estiver exposto)
  fetch('/api/logout', { method: 'POST' }).catch(() => {
    console.log('ℹ️ Endpoint /api/logout não encontrado (esperado)');
  });
} catch (e) {
  console.log('ℹ️ Erro ao chamar logout:', e.message);
}

// ===== PASSO 6: Limpar IndexedDB (se existir) =====
console.log('🔍 Limpando IndexedDB...');
const dbs = await indexedDB.databases();
dbs.forEach(db => {
  if (db.name && (db.name.includes('supabase') || db.name.includes('auth'))) {
    indexedDB.deleteDatabase(db.name);
    console.log(`✅ Banco deletado: ${db.name}`);
  }
});

// ===== PASSO 7: Informações finais =====
console.log('');
console.log('✅ LIMPEZA COMPLETA FINALIZADA!');
console.log('');
console.log('📝 PRÓXIMOS PASSOS:');
console.log('1. Recarregue a página: Ctrl+Shift+R (Windows) ou Cmd+Shift+R (Mac)');
console.log('2. Você será redirecionado para login');
console.log('3. Faça login com smartirriga.info@gmail.com');
console.log('4. Monitore o Console (F12) para ver as mensagens de sucesso');
console.log('');
console.log('🔍 Procure por: ✅ Roles carregadas para smartirriga.info@gmail.com : [\'admin\']');
console.log('');

// ===== PASSO 8: Forçar reload após 2 segundos =====
console.log('⏳ Recarregando página em 2 segundos...');
setTimeout(() => {
  location.reload();
}, 2000);
