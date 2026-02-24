-- ============================================
-- CORRIGIR POLÍTICAS DA TABELA USER_ROLES
-- ============================================

-- 1. REMOVER POLÍTICAS ANTIGAS
DROP POLICY IF EXISTS "Usuários veem suas próprias roles" ON user_roles;
DROP POLICY IF EXISTS "Admins podem ver todas as roles" ON user_roles;

-- 2. CRIAR POLÍTICA SIMPLES QUE PERMITE USUÁRIOS VEREM SUAS ROLES
CREATE POLICY "Usuários podem ver suas roles" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- 3. CRIAR POLÍTICA PARA INSERÇÃO (NECESSÁRIA PARA A FUNÇÃO)
CREATE POLICY "Sistema pode inserir roles" ON user_roles
  FOR INSERT WITH CHECK (true);

-- 4. VERIFICAR SE A ROLE FOI CRIADA
SELECT 
  u.email,
  ur.role,
  ur.created_at
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE u.email = 'noemarrengula1@gmail.com';
