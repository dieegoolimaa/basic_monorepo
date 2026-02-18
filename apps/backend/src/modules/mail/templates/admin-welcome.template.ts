interface AdminWelcomeEmailData {
    name: string;
    email: string;
    password: string;
    loginUrl: string;
}

export const adminWelcomeEmailTemplate = (data: AdminWelcomeEmailData): string => {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sua conta de administrador</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f6f8; -webkit-font-smoothing: antialiased;">
  
  <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.05);">
    
    <!-- Header -->
    <tr>
      <td style="padding: 50px 40px; text-align: center; background: linear-gradient(135deg, #d4a5a5 0%, #8b6b8f 100%);">
        <div style="margin-bottom: 20px;">
          <span style="font-size: 50px;">🔐</span>
        </div>
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">
          Bem-vindo(a) à Equipe!
        </h1>
        <p style="color: rgba(255,255,255,0.95); margin: 15px 0 0; font-size: 16px; font-weight: 500;">
          Basic Studio • Painel Administrativo
        </p>
      </td>
    </tr>

    <!-- Content -->
    <tr>
      <td style="padding: 40px;">
        
        <p style="font-size: 18px; color: #232222; line-height: 1.6; margin: 0 0 25px;">
          Olá, ${data.name}! 👋
        </p>
        
        <p style="font-size: 16px; color: #555; line-height: 1.8; margin: 0 0 25px;">
          Você foi adicionado(a) como <strong style="color: #232222;">Administrador(a)</strong> do Basic Studio. 
          Abaixo estão suas credenciais de acesso ao painel de gerenciamento.
        </p>

        <!-- Credentials Box -->
        <div style="background-color: #f5f6f8; border-radius: 12px; padding: 30px; margin: 30px 0; border: 1px solid #eee;">
          <p style="margin: 0 0 15px; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">
            Suas credenciais de acesso
          </p>
          
          <div style="margin-bottom: 15px;">
            <span style="display: block; font-size: 12px; color: #888; margin-bottom: 4px;">Email:</span>
            <span style="font-size: 16px; font-weight: 600; color: #232222;">${data.email}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <span style="display: block; font-size: 12px; color: #888; margin-bottom: 4px;">Senha temporária:</span>
            <span style="font-size: 20px; font-weight: 700; color: #232222; font-family: 'Courier New', monospace; letter-spacing: 1px;">${data.password}</span>
          </div>
          
          <p style="margin: 20px 0 0; color: #e55; font-size: 13px;">
            ⚠️ Recomendamos que você altere sua senha após o primeiro acesso.
          </p>
        </div>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 40px 0;">
          <a href="${data.loginUrl}" 
             style="display: inline-block; padding: 18px 45px; background: #232222; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px;">
            Acessar Painel Administrativo
          </a>
        </div>

        <p style="font-size: 13px; color: #999; text-align: center; margin: 20px 0 0;">
          Se você não reconhece esta ação, ignore este email.
        </p>

      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 30px; background-color: #f5f6f8; text-align: center;">
        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
          © ${new Date().getFullYear()} Basic Studio. Todos os direitos reservados.
        </p>
      </td>
    </tr>

  </table>

  <table cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td style="height: 40px;"></td>
    </tr>
  </table>

</body>
</html>`;
};
