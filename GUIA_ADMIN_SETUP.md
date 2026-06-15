# 🔐 Guia: Elevar Para Administrador

## Seu Email
📧 **noemarrengula1@gmail.com**

---

## ✅ Passo 1: Aceder ao SQL Editor do Supabase

1. Abra este link:
   ```
   https://supabase.com/dashboard/project/jmefqzhoumdcgcxtdssu/sql/new
   ```
   
2. Ou:
   - Vá a https://supabase.com/dashboard
   - Selecione o projeto **jmefqzhoumdcgcxtdssu**
   - Clique em **SQL Editor** (no menu esquerdo)
   - Clique em **New Query**

---

## ✅ Passo 2: Executar o Comando SQL

Copie e Cole este comando completo no editor SQL:

```sql
-- Encontrar e promover para admin
WITH user_data AS (
  SELECT u.id as user_id FROM auth.users u 
  WHERE u.email = 'noemarrengula1@gmail.com'
)
DELETE FROM user_roles WHERE user_id = (SELECT user_id FROM user_data);

INSERT INTO user_roles (user_id, role)
SELECT user_id, 'admin' FROM user_data;

-- Verificar resultado
SELECT ur.user_id, ur.role, u.email
FROM user_roles ur
JOIN auth.users u ON ur.user_id = u.id
WHERE u.email = 'noemarrengula1@gmail.com';
```

3. Clique em **Run** (botão azul ou Ctrl+Enter)

---

## ✅ Passo 3: Verificar o Resultado

Você deverá ver uma linha na resposta mostrando:
- ✅ **email**: noemarrengula1@gmail.com
- ✅ **role**: admin
- ✅ **granted_at**: (data atual)

---

## ✅ Passo 4: Fazer Login Novamente

1. Aceda a: https://marrengulaitstore.vercel.app
2. **Logout** (se estiver logado)
3. Faça **Login** novamente com noemarrengula1@gmail.com
4. Clique em **Admin** no menu (deve aparecer agora)
5. Aceda a: https://marrengulaitstore.vercel.app/admin

---

## 🎉 Pronto!

Agora tem acesso completo ao painel de administrador!

**Funcionalidades de Admin:**
- 📊 Dashboard com estatísticas
- 📦 Gerir produtos
- 👥 Gerir utilizadores
- 📋 Gerir pedidos
- ⚙️ Configurações do site

---

### 💡 Dicas Importantes

- Se o comando não funcionar, verifique se o email está exatamente igual
- Após executar SQL, pode levar alguns segundos para atualizar
- Se não ver "Admin" no menu, faça logout e login novamente
- Limpe o cache do navegador se necessário (Ctrl+Shift+Delete)

