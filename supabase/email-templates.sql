-- ============================================
-- EMAIL TEMPLATES CONFIGURATION
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- CONFIRM EMAIL TEMPLATE
-- ============================================
-- Configure in: Supabase Dashboard > Authentication > Email Templates > Confirm signup

/*
Subject: Confirme o seu email - Marrengula-IT

---

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #FF3131 0%, #FF5555 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">MARRENGULA-IT</h1>
        <p style="color: #ffffff; margin: 10px 0 0; font-size: 14px; opacity: 0.9;">Tecnologia de Ponta em Moçambique</p>
      </td>
    </tr>
    
    <!-- Content -->
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="color: #333333; margin: 0 0 20px; font-size: 24px;">Bem-vindo! 👋</h2>
        
        <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
          Olá <strong>{{ .Data.username }}</strong>,
        </p>
        
        <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
          Obrigado por criar uma conta na Marrengula-IT. Por favor, confirme o seu email clicando no botão abaixo:
        </p>
        
        <!-- CTA Button -->
        <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
          <tr>
            <td style="border-radius: 8px; background: linear-gradient(135deg, #FF3131 0%, #FF5555 100%);">
              <a href="{{ .ConfirmationURL }}" target="_blank" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px; border-radius: 8px;">
                Confirmar Email
              </a>
            </td>
          </tr>
        </table>
        
        <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 30px 0 0; text-align: center;">
          Ou copie este link no seu navegador:<br>
          <a href="{{ .ConfirmationURL }}" style="color: #FF3131; word-break: break-all;">{{ .ConfirmationURL }}</a>
        </p>
        
        <p style="color: #999999; font-size: 12px; line-height: 1.6; margin: 30px 0 0; text-align: center;">
          Este link expira em 24 horas.<br>
          Se não criou esta conta, ignore este email.
        </p>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="background-color: #f9f9f9; padding: 20px 30px; text-align: center; border-top: 1px solid #eeeeee;">
        <p style="color: #999999; font-size: 12px; margin: 0;">
          © 2026 Marrengula-IT. Todos os direitos reservados.<br>
          Maputo, Moçambique<br>
          <a href="https://marrengulait.com" style="color: #FF3131;">marrengulait.com</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
*/

-- ============================================
-- MAGIC LINK EMAIL TEMPLATE
-- ============================================
-- Configure in: Supabase Dashboard > Authentication > Email Templates > Magic link

/*
Subject: Seu Link de Acesso - Marrengula-IT

---

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #FF3131 0%, #FF5555 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">MARRENGULA-IT</h1>
        <p style="color: #ffffff; margin: 10px 0 0; font-size: 14px; opacity: 0.9;">Tecnologia de Ponta em Moçambique</p>
      </td>
    </tr>
    
    <!-- Content -->
    <tr>
      <td style="padding: 40px 30px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #FF3131 0%, #FF5555 100%); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
            <span style="font-size: 36px;">✨</span>
          </div>
        </div>
        
        <h2 style="color: #333333; margin: 0 0 20px; font-size: 24px; text-align: center;">Acesso Rápido</h2>
        
        <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 10px; text-align: center;">
          Olá!
        </p>
        
        <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px; text-align: center;">
          Clique no botão abaixo para fazer login na sua conta Marrengula-IT:
        </p>
        
        <!-- CTA Button -->
        <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
          <tr>
            <td style="border-radius: 8px; background: linear-gradient(135deg, #FF3131 0%, #FF5555 100%);">
              <a href="{{ .ConfirmationURL }}" target="_blank" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px; border-radius: 8px;">
                Entrar na Conta
              </a>
            </td>
          </tr>
        </table>
        
        <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 30px 0 0; text-align: center;">
          Ou copie este link:<br>
          <a href="{{ .ConfirmationURL }}" style="color: #FF3131; word-break: break-all;">{{ .ConfirmationURL }}</a>
        </p>
        
        <div style="background-color: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 15px; margin-top: 30px;">
          <p style="color: #856404; font-size: 13px; margin: 0; text-align: center;">
            ⚠️ Este link é válido apenas por <strong>15 minutos</strong> e pode ser usado apenas uma vez.
          </p>
        </div>
        
        <p style="color: #999999; font-size: 12px; line-height: 1.6; margin: 30px 0 0; text-align: center;">
          Se não solicitou este acesso, ignore este email.
        </p>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="background-color: #f9f9f9; padding: 20px 30px; text-align: center; border-top: 1px solid #eeeeee;">
        <p style="color: #999999; font-size: 12px; margin: 0;">
          © 2026 Marrengula-IT. Todos os direitos reservados.<br>
          Maputo, Moçambique<br>
          <a href="https://marrengulait.com" style="color: #FF3131;">marrengulait.com</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
*/

-- ============================================
-- RESET PASSWORD EMAIL TEMPLATE
-- ============================================
-- Configure in: Supabase Dashboard > Authentication > Email Templates > Reset password

/*
Subject: Redefinir Senha - Marrengula-IT

---

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #FF3131 0%, #FF5555 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">MARRENGULA-IT</h1>
        <p style="color: #ffffff; margin: 10px 0 0; font-size: 14px; opacity: 0.9;">Tecnologia de Ponta em Moçambique</p>
      </td>
    </tr>
    
    <!-- Content -->
    <tr>
      <td style="padding: 40px 30px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #FF3131 0%, #FF5555 100%); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
            <span style="font-size: 36px;">🔑</span>
          </div>
        </div>
        
        <h2 style="color: #333333; margin: 0 0 20px; font-size: 24px; text-align: center;">Redefinir Senha</h2>
        
        <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px; text-align: center;">
          Recebemos um pedido para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha:
        </p>
        
        <!-- CTA Button -->
        <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
          <tr>
            <td style="border-radius: 8px; background: linear-gradient(135deg, #FF3131 0%, #FF5555 100%);">
              <a href="{{ .ConfirmationURL }}" target="_blank" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px; border-radius: 8px;">
                Redefinir Senha
              </a>
            </td>
          </tr>
        </table>
        
        <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 30px 0 0; text-align: center;">
          Ou copie este link:<br>
          <a href="{{ .ConfirmationURL }}" style="color: #FF3131; word-break: break-all;">{{ .ConfirmationURL }}</a>
        </p>
        
        <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; padding: 15px; margin-top: 30px;">
          <p style="color: #721c24; font-size: 13px; margin: 0; text-align: center;">
            ⚠️ Este link expira em <strong>60 minutos</strong>. Se não solicitou esta redefinição, ignore este email.
          </p>
        </div>
        
        <p style="color: #999999; font-size: 12px; line-height: 1.6; margin: 30px 0 0; text-align: center;">
          Por segurança, se não foi você quem solicitou, informe-nos imediatamente.
        </p>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="background-color: #f9f9f9; padding: 20px 30px; text-align: center; border-top: 1px solid #eeeeee;">
        <p style="color: #999999; font-size: 12px; margin: 0;">
          © 2026 Marrengula-IT. Todos os direitos reservados.<br>
          Maputo, Moçambique<br>
          <a href="https://marrengulait.com" style="color: #FF3131;">marrengulait.com</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
*/

-- ============================================
-- CHANGE EMAIL CONFIRMATION TEMPLATE
-- ============================================
-- Configure in: Supabase Dashboard > Authentication > Email Templates > Confirm email change

/*
Subject: Confirmar Alteração de Email - Marrengula-IT

---

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #FF3131 0%, #FF5555 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">MARRENGULA-IT</h1>
      </td>
    </tr>
    
    <!-- Content -->
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="color: #333333; margin: 0 0 20px; font-size: 24px; text-align: center;">Confirmar Alteração de Email</h2>
        
        <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px; text-align: center;">
          Clique no botão para confirmar a alteração do seu email:
        </p>
        
        <!-- CTA Button -->
        <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
          <tr>
            <td style="border-radius: 8px; background: linear-gradient(135deg, #FF3131 0%, #FF5555 100%);">
              <a href="{{ .ConfirmationURL }}" target="_blank" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px; border-radius: 8px;">
                Confirmar
              </a>
            </td>
          </tr>
        </table>
        
        <p style="color: #999999; font-size: 12px; line-height: 1.6; margin: 30px 0 0; text-align: center;">
          Este link expira em 60 minutos.
        </p>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="background-color: #f9f9f9; padding: 20px 30px; text-align: center; border-top: 1px solid #eeeeee;">
        <p style="color: #999999; font-size: 12px; margin: 0;">
          © 2026 Marrengula-IT<br>
          <a href="https://marrengulait.com" style="color: #FF3131;">marrengulait.com</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
*/

-- ============================================
-- INSTRUCTIONS
-- ============================================
DO $$ 
BEGIN
  RAISE NOTICE '============================================';
  RAISE NOTICE 'EMAIL TEMPLATES GUIDE';
  RAISE NOTICE '============================================';
  RAISE NOTICE '';
  RAISE NOTICE '1. Go to Supabase Dashboard';
  RAISE NOTICE '2. Authentication > Email Templates';
  RAISE NOTICE '3. Configure each template:';
  RAISE NOTICE '   - Confirm signup';
  RAISE NOTICE '   - Magic link';
  RAISE NOTICE '   - Reset password';
  RAISE NOTICE '   - Confirm email change';
  RAISE NOTICE '';
  RAISE NOTICE '4. Use the HTML templates provided above';
  RAISE NOTICE '5. Save each template';
  RAISE NOTICE '';
  RAISE NOTICE 'Available variables:';
  RAISE NOTICE '  - {{ .ConfirmationURL }}';
  RAISE NOTICE '  - {{ .Data.username }}';
  RAISE NOTICE '  - {{ .Data.email }}';
  RAISE NOTICE '  - {{ .Token }}';
  RAISE NOTICE '  - {{ .TokenHash }}';
  RAISE NOTICE '  - {{ .NewEmail }}';
  RAISE NOTICE '  - {{ .SiteURL }}';
  RAISE NOTICE '============================================';
END $$;
