// Script para testar conexão e verificar tabelas do Supabase
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ynfnegxufykueofehvzm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluZm5lZ3h1ZnlrdWVvZmVodnptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NTA5MzgsImV4cCI6MjA3OTEyNjkzOH0.BmLSptmvf9Q4XLzWG7ZiO3I40Ay5luJgHMNE0dCtUKg';

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
