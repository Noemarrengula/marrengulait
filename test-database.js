// Script para testar conexão e verificar tabelas do Supabase
// Uso: node --env-file=.env test-database.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://seu-projeto.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_sua_chave';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testDatabase() {
  console.log('🔍 Verificando conexão com Supabase...\n');

  const tables = ['products', 'favorites', 'orders', 'order_items', 'service_requests', 'newsletter_subscribers'];
  
  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ Tabela "${table}": NÃO EXISTE`);
        console.log(`   Erro: ${error.message}\n`);
      } else {
        console.log(`✅ Tabela "${table}": EXISTE (${count || 0} registros)\n`);
      }
    } catch (err) {
      console.log(`❌ Tabela "${table}": ERRO`);
      console.log(`   ${err.message}\n`);
    }
  }
}

testDatabase();
