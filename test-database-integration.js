#!/usr/bin/env node

/**
 * Script de Verificação da Integração Supabase
 * 
 * Execute este script após configurar a base de dados para garantir que
 * todas as tabelas, funções e políticas foram criadas corretamente.
 * 
 * Usage: node test-database-integration.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas');
  console.error('Certifique-se de que .env tem VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TABLES_TO_CHECK = [
  'profiles',
  'user_roles',
  'products',
  'orders',
  'order_items',
  'product_questions',
  'price_history',
  'recently_viewed',
  'loyalty_points',
  'points_transactions',
  'price_alerts',
  'product_badges',
  'payment_methods',
  'affiliates'
];

const FUNCTIONS_TO_CHECK = [
  'has_role',
  'track_product_view',
  'create_order',
  'create_affiliate'
];

async function checkTable(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      return { status: '❌', table: tableName, error: error.message };
    }
    return { status: '✅', table: tableName };
  } catch (error) {
    return { status: '❌', table: tableName, error: error.message };
  }
}

async function checkFunction(functionName) {
  try {
    // Tentar executar a função com valores dummy
    let result;
    
    switch (functionName) {
      case 'has_role':
        result = await supabase.rpc('has_role', {
          _user_id: '00000000-0000-0000-0000-000000000000',
          _role: 'user'
        });
        break;
      
      case 'track_product_view':
        result = await supabase.rpc('track_product_view', {
          p_product_id: '00000000-0000-0000-0000-000000000000'
        });
        break;
      
      case 'create_order':
        result = await supabase.rpc('create_order', {
          p_customer_name: 'Test',
          p_customer_email: 'test@test.com',
          p_delivery_address: 'Test Address',
          p_delivery_city: 'Test City',
          p_payment_method: 'card'
        });
        break;
      
      case 'create_affiliate':
        result = await supabase.rpc('create_affiliate', {
          target_user_id: '00000000-0000-0000-0000-000000000000'
        });
        break;
      
      default:
        return { status: '❓', function: functionName, error: 'Unknown function' };
    }
    
    // Se chegou aqui sem erro de existência, a função existe
    if (result.error && result.error.message.includes('does not exist')) {
      return { status: '❌', function: functionName, error: 'Function not found' };
    }
    
    return { status: '✅', function: functionName };
  } catch (error) {
    return { status: '❌', function: functionName, error: error.message };
  }
}

async function testIntegration() {
  console.log('\n🔍 Verificando Integração Supabase\n');
  console.log(`📍 Projeto: ${SUPABASE_URL}`);
  console.log('─'.repeat(50));
  
  // Verificar conexão
  console.log('\n📡 Testando Conexão...');
  try {
    const { data: session, error } = await supabase.auth.getSession();
    if (error) throw error;
    console.log('✅ Conexão com Supabase estabelecida');
  } catch (error) {
    console.error('❌ Erro ao conectar ao Supabase:', error.message);
    process.exit(1);
  }
  
  // Verificar Tabelas
  console.log('\n📊 Verificando Tabelas...');
  console.log('─'.repeat(50));
  const tableResults = await Promise.all(
    TABLES_TO_CHECK.map(table => checkTable(table))
  );
  
  const tablesCreated = tableResults.filter(r => r.status === '✅').length;
  tableResults.forEach(result => {
    if (result.error) {
      console.log(`${result.status} ${result.table} - ${result.error}`);
    } else {
      console.log(`${result.status} ${result.table}`);
    }
  });
  console.log(`\n✅ ${tablesCreated}/${TABLES_TO_CHECK.length} tabelas criadas`);
  
  // Verificar Funções
  console.log('\n⚙️  Verificando Funções SQL...');
  console.log('─'.repeat(50));
  const functionResults = await Promise.all(
    FUNCTIONS_TO_CHECK.map(func => checkFunction(func))
  );
  
  const functionsCreated = functionResults.filter(r => r.status === '✅').length;
  functionResults.forEach(result => {
    if (result.error) {
      console.log(`${result.status} ${result.function} - ${result.error}`);
    } else {
      console.log(`${result.status} ${result.function}`);
    }
  });
  console.log(`\n✅ ${functionsCreated}/${FUNCTIONS_TO_CHECK.length} funções criadas`);
  
  // Resumo Final
  console.log('\n' + '═'.repeat(50));
  console.log('📋 RESUMO FINAL');
  console.log('═'.repeat(50));
  
  const totalTests = TABLES_TO_CHECK.length + FUNCTIONS_TO_CHECK.length;
  const totalPassed = tablesCreated + functionsCreated;
  
  if (totalPassed === totalTests) {
    console.log('✅ TUDO OK! Base de dados completamente configurada!');
    console.log('\nVocê pode agora:');
    console.log('1. Executar: npm run dev');
    console.log('2. Testar login na aplicação');
    console.log('3. Testar criação de produtos');
    console.log('4. Testar criação de pedidos');
  } else {
    console.log(`⚠️  Configuração Incompleta: ${totalPassed}/${totalTests} testes passados`);
    console.log('\nPor favor:');
    console.log('1. Verifique o ficheiro SETUP_DATABASE_MANUAL.sql');
    console.log('2. Execute o script no Supabase Console');
    console.log('3. Execute este teste novamente');
  }
  
  console.log('\n');
  process.exit(totalPassed === totalTests ? 0 : 1);
}

// Executar
testIntegration().catch(error => {
  console.error('❌ Erro durante testes:', error);
  process.exit(1);
});
