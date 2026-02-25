import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PROJECT_ID = process.env.VITE_SUPABASE_PROJECT_ID;

async function promoteToAdmin(email) {
  console.log(`\n📧 Procurando utilizador: ${email}`);
  console.log('═'.repeat(50));

  // Se não temos SERVICE_ROLE_KEY, vamos usar SQL editor do Supabase
  if (!SERVICE_ROLE_KEY) {
    console.log('\n⚠️  Não foi encontrada a SERVICE_ROLE_KEY no ambiente');
    console.log('\n📝 Por favor, execute este comando SQL no Supabase SQL Editor:');
    console.log('═'.repeat(50));
    console.log(`
-- 1. Encontrar o user_id do email
SELECT u.id as user_id, u.email FROM auth.users u WHERE u.email = '${email}';

-- 2. Após confirmar o user_id, execute:
-- Substitua {USER_ID} pelo valor obtido acima
DELETE FROM user_roles WHERE user_id = '{USER_ID}';

INSERT INTO user_roles (user_id, role, granted_at)
VALUES ('{USER_ID}', 'admin', now());

-- Verificar se foi aplicado:
SELECT * FROM user_roles WHERE user_id = '{USER_ID}';
    `);
    console.log('═'.repeat(50));
    console.log('\n🔗 Aceda a: https://supabase.com/dashboard/project/' + PROJECT_ID + '/sql/new');
    return false;
  }

  try {
    // Chamar função RPC para promover a admin
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/promote_to_admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY
      },
      body: JSON.stringify({ email: email })
    });

    if (!response.ok) {
      // Alternativa: usar SQL direto via edge function
      console.log('\n📝 Executando promoção via SQL...');
      
      // Buscar o user_id
      const getUserResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/auth.users?email=eq.${encodeURIComponent(email)}`,
        {
          headers: {
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            'apikey': SERVICE_ROLE_KEY
          }
        }
      );

      if (!getUserResponse.ok) {
        console.error('❌ Erro ao buscar utilizador');
        return false;
      }

      const users = await getUserResponse.json();
      if (!users || users.length === 0) {
        console.error('❌ Utilizador não encontrado');
        return false;
      }

      const userId = users[0].id;
      console.log(`✅ Utilizador encontrado! ID: ${userId}`);

      // Atribuir role de admin
      const roleResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/user_roles`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            'apikey': SERVICE_ROLE_KEY
          },
          body: JSON.stringify({
            user_id: userId,
            role: 'admin',
            granted_at: new Date().toISOString()
          })
        }
      );

      if (!roleResponse.ok) {
        console.error('❌ Erro ao atribuir papel de admin');
        return false;
      }

      console.log('\n✅ SUCESSO!');
      console.log('═'.repeat(50));
      console.log(`✓ ${email} agora é administrador!`);
      console.log('✓ Papel atribuído em: ' + new Date().toLocaleString('pt-PT'));
      console.log('\n📝 Próximo passo: Faça login novamente e aceda ao painel de administrador');
      console.log('🔗 URL: https://marrengulaitstore.vercel.app/admin');
      return true;
    }

    const data = await response.json();
    console.log('✅ Sucesso!', data);
    return true;
  } catch (error) {
    console.error('❌ Erro:', error.message);
    return false;
  }
}

// Executar
const email = process.argv[2] || 'noemarrengula1@gmail.com';
promoteToAdmin(email).then(success => {
  process.exit(success ? 0 : 1);
});
