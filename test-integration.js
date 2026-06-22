import { createClient } from '@supabase/supabase-js';

// Configuração
// Uso: node --env-file=.env test-integration.js
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://seu-projeto.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_sua_chave';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Cores para console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(emoji, message, color = colors.reset) {
  console.log(`${color}${emoji} ${message}${colors.reset}`);
}

async function testConnection() {
  log('🔌', 'Testando conexão com Supabase...', colors.cyan);
  
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) throw error;
    
    log('✅', 'Conexão estabelecida com sucesso!', colors.green);
    return true;
  } catch (error) {
    log('❌', `Erro de conexão: ${error.message}`, colors.red);
    return false;
  }
}

async function testTables() {
  log('\n📊', 'Testando tabelas do banco de dados...', colors.cyan);
  
  const tables = [
    'profiles',
    'products',
    'categories',
    'orders',
    'order_items',
    'reviews',
    'favorites',
    'user_roles',
    'product_questions',
    'price_alerts',
    'coupons',
    'affiliates',
    'loyalty_points',
    'product_badges'
  ];
  
  const results = [];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('count').limit(1);
      
      if (error) {
        log('❌', `Tabela ${table}: ${error.message}`, colors.red);
        results.push({ table, exists: false, error: error.message });
      } else {
        log('✅', `Tabela ${table}: OK`, colors.green);
        results.push({ table, exists: true });
      }
    } catch (error) {
      log('❌', `Tabela ${table}: ${error.message}`, colors.red);
      results.push({ table, exists: false, error: error.message });
    }
  }
  
  return results;
}

async function testAuth() {
  log('\n🔐', 'Testando autenticação...', colors.cyan);
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      log('✅', `Sessão ativa: ${session.user.email}`, colors.green);
      return { authenticated: true, user: session.user };
    } else {
      log('⚠️', 'Nenhuma sessão ativa', colors.yellow);
      return { authenticated: false };
    }
  } catch (error) {
    log('❌', `Erro de autenticação: ${error.message}`, colors.red);
    return { authenticated: false, error: error.message };
  }
}

async function testStorage() {
  log('\n📦', 'Testando Storage...', colors.cyan);
  
  const buckets = ['products', 'avatars', 'documents'];
  const results = [];
  
  for (const bucket of buckets) {
    try {
      const { data, error } = await supabase.storage.from(bucket).list('', { limit: 1 });
      
      if (error) {
        log('❌', `Bucket ${bucket}: ${error.message}`, colors.red);
        results.push({ bucket, exists: false, error: error.message });
      } else {
        log('✅', `Bucket ${bucket}: OK`, colors.green);
        results.push({ bucket, exists: true });
      }
    } catch (error) {
      log('❌', `Bucket ${bucket}: ${error.message}`, colors.red);
      results.push({ bucket, exists: false, error: error.message });
    }
  }
  
  return results;
}

async function testData() {
  log('\n📝', 'Testando dados...', colors.cyan);
  
  // Produtos
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .limit(5);
    
    if (error) throw error;
    
    log('✅', `${products.length} produtos encontrados`, colors.green);
    if (products.length > 0) {
      log('ℹ️', `Exemplo: ${products[0].title}`, colors.blue);
    }
  } catch (error) {
    log('❌', `Erro ao buscar produtos: ${error.message}`, colors.red);
  }
  
  // Categorias
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*');
    
    if (error) throw error;
    
    log('✅', `${categories.length} categorias encontradas`, colors.green);
  } catch (error) {
    log('❌', `Erro ao buscar categorias: ${error.message}`, colors.red);
  }
  
  // Pedidos
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .limit(5);
    
    if (error) throw error;
    
    log('✅', `${orders.length} pedidos encontrados`, colors.green);
  } catch (error) {
    log('❌', `Erro ao buscar pedidos: ${error.message}`, colors.red);
  }
}

async function testRLS() {
  log('\n🛡️', 'Testando Row Level Security...', colors.cyan);
  
  try {
    // Tentar inserir produto sem autenticação
    const { error } = await supabase
      .from('products')
      .insert({
        title: 'Teste RLS',
        price: 100,
        stock: 1,
        category: 'Hardware'
      });
    
    if (error && error.message.includes('policy')) {
      log('✅', 'RLS está ativo e funcionando', colors.green);
    } else if (!error) {
      log('⚠️', 'RLS pode não estar configurado corretamente', colors.yellow);
    }
  } catch (error) {
    log('❌', `Erro ao testar RLS: ${error.message}`, colors.red);
  }
}

async function generateReport(results) {
  log('\n📋', '=== RELATÓRIO DE INTEGRAÇÃO ===', colors.cyan);
  
  const { tables, storage, connection, auth } = results;
  
  // Resumo
  const totalTables = tables.length;
  const existingTables = tables.filter(t => t.exists).length;
  const totalBuckets = storage.length;
  const existingBuckets = storage.filter(b => b.exists).length;
  
  log('📊', `Tabelas: ${existingTables}/${totalTables}`, 
    existingTables === totalTables ? colors.green : colors.yellow);
  
  log('📦', `Buckets: ${existingBuckets}/${totalBuckets}`, 
    existingBuckets === totalBuckets ? colors.green : colors.yellow);
  
  log('🔐', `Autenticação: ${auth.authenticated ? 'Ativa' : 'Inativa'}`, 
    auth.authenticated ? colors.green : colors.yellow);
  
  // Tabelas faltando
  const missingTables = tables.filter(t => !t.exists);
  if (missingTables.length > 0) {
    log('\n⚠️', 'Tabelas faltando:', colors.yellow);
    missingTables.forEach(t => {
      log('  •', t.table, colors.yellow);
    });
  }
  
  // Buckets faltando
  const missingBuckets = storage.filter(b => !b.exists);
  if (missingBuckets.length > 0) {
    log('\n⚠️', 'Buckets faltando:', colors.yellow);
    missingBuckets.forEach(b => {
      log('  •', b.bucket, colors.yellow);
    });
  }
  
  // Status geral
  const allGood = existingTables === totalTables && 
                  existingBuckets === totalBuckets && 
                  connection;
  
  if (allGood) {
    log('\n🎉', 'INTEGRAÇÃO COMPLETA E FUNCIONANDO!', colors.green);
  } else {
    log('\n⚠️', 'INTEGRAÇÃO PARCIAL - Verifique os itens acima', colors.yellow);
  }
  
  log('\n📖', 'Consulte INTEGRACAO_SUPABASE_COMPLETA.md para mais detalhes', colors.blue);
}

async function main() {
  console.log('\n' + '='.repeat(50));
  log('🚀', 'TESTE DE INTEGRAÇÃO SUPABASE - MARRENGULA-IT', colors.cyan);
  console.log('='.repeat(50) + '\n');
  
  const connection = await testConnection();
  
  if (!connection) {
    log('\n❌', 'Não foi possível conectar ao Supabase. Verifique suas credenciais.', colors.red);
    process.exit(1);
  }
  
  const tables = await testTables();
  const auth = await testAuth();
  const storage = await testStorage();
  
  await testData();
  await testRLS();
  
  await generateReport({ tables, storage, connection, auth });
  
  console.log('\n' + '='.repeat(50) + '\n');
}

main().catch(console.error);
