export interface InviteEmailData {
  inviteCode: string;
  courseNames: string[];
  registerUrl: string;
  whatsappNumber: string;
  instagramHandle: string;
}

export const inviteEmailTemplate = (data: InviteEmailData): string => {
  const courseList = data.courseNames
    .map(name => `<li style="padding: 8px 0; border-bottom: 1px solid #f0e1e1;">${name}</li>`)
    .join('');

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Convite Basic Studio</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f6f8; -webkit-font-smoothing: antialiased;">
  
  <!-- Container Principal -->
  <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.05);">
    
    <!-- Header com Gradiente -->
    <tr>
      <td style="padding: 50px 40px; text-align: center; background: linear-gradient(135deg, #d4a5a5 0%, #8b6b8f 100%);">
        <div style="margin-bottom: 20px;">
          <span style="font-size: 50px;">💅</span>
        </div>
        <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          Você foi convidada!
        </h1>
        <p style="color: rgba(255,255,255,0.95); margin: 15px 0 0; font-size: 18px; font-weight: 500;">
          Basic Studio • Nail Art Academy
        </p>
      </td>
    </tr>

    <!-- Conteúdo Principal -->
    <tr>
      <td style="padding: 40px;">
        
        <!-- Mensagem de Boas Vindas -->
        <p style="font-size: 18px; color: #232222; line-height: 1.6; margin: 0 0 25px;">
          Olá! 👋
        </p>
        
        <p style="font-size: 16px; color: #555; line-height: 1.8; margin: 0 0 25px;">
          Você recebeu um convite exclusivo para fazer parte da <strong style="color: #8b6b8f;">Basic Studio</strong>, 
          a academia online de nail art onde você vai aprender as técnicas mais avançadas e 
          transformar sua paixão em profissão!
        </p>

        <!-- Destaque do Código -->
        <div style="background-color: #f5f6f8; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; border: 1px solid #eee;">
          <p style="margin: 0 0 10px; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">
            Seu código de acesso
          </p>
          <p style="margin: 0; font-size: 36px; font-weight: 800; color: #232222; letter-spacing: 4px; font-family: 'Courier New', monospace;">
            ${data.inviteCode}
          </p>
          <p style="margin: 15px 0 0; color: #888; font-size: 12px;">
            Use este código ao criar sua conta
          </p>
        </div>

        <!-- Cursos Incluídos -->
        <div style="margin: 30px 0;">
          <h3 style="margin: 0 0 15px; color: #232222; font-size: 16px; border-bottom: 2px solid #f5f6f8; padding-bottom: 10px;">
            ✨ Cursos incluídos no seu convite:
          </h3>
          <ul style="margin: 0; padding: 0 0 0 20px; list-style: none;">
            ${courseList || '<li style="padding: 8px 0; color: #666;">Cursos serão definidos após o cadastro</li>'}
          </ul>
        </div>

        <!-- O que você vai aprender -->
        <div style="margin: 30px 0;">
          <h3 style="margin: 0 0 20px; color: #232222; font-size: 18px;">
            💎 O que você vai encontrar:
          </h3>
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="padding: 10px 0; vertical-align: top; width: 30px;">
                <span style="font-size: 20px;">📹</span>
              </td>
              <td style="padding: 10px 0; color: #555; font-size: 14px;">
                <strong style="color: #232222;">Vídeo-aulas exclusivas</strong> com passo a passo detalhado
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; vertical-align: top; width: 30px;">
                <span style="font-size: 20px;">📋</span>
              </td>
              <td style="padding: 10px 0; color: #555; font-size: 14px;">
                <strong style="color: #232222;">Checklists práticos</strong> para cada técnica
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; vertical-align: top; width: 30px;">
                <span style="font-size: 20px;">🎓</span>
              </td>
              <td style="padding: 10px 0; color: #555; font-size: 14px;">
                <strong style="color: #232222;">Certificado de conclusão</strong> para valorizar seu currículo
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; vertical-align: top; width: 30px;">
                <span style="font-size: 20px;">💬</span>
              </td>
              <td style="padding: 10px 0; color: #555; font-size: 14px;">
                <strong style="color: #232222;">Suporte direto</strong> para tirar suas dúvidas
              </td>
            </tr>
          </table>
        </div>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 40px 0;">
          <a href="${data.registerUrl}" 
             style="display: inline-block; padding: 18px 45px; background: linear-gradient(135deg, #d4a5a5 0%, #8b6b8f 100%); color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(139, 107, 143, 0.25); transition: all 0.3s;">
            Criar Minha Conta Agora
          </a>
        </div>

        <p style="font-size: 13px; color: #999; text-align: center; margin: 20px 0 0;">
          Ou copie e cole o código <strong style="color: #232222;">${data.inviteCode}</strong> ao se cadastrar
        </p>

      </td>
    </tr>

    <!-- Seção de Contato -->
    <tr>
      <td style="padding: 40px; background-color: #232222; text-align: center;">
        <p style="color: #ffffff; margin: 0 0 25px; font-size: 18px; font-weight: 600;">
          Dúvidas? Fale conosco!
        </p>
        
        <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
          <tr>
            <td style="padding: 0 10px;">
              <a href="https://wa.me/${data.whatsappNumber.replace(/\+/g, '').replace(/\s/g, '')}" 
                 style="display: inline-flex; align-items: center; padding: 12px 24px; background-color: #25d366; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;">
                📱 WhatsApp
              </a>
            </td>
            <td style="padding: 0 10px;">
              <a href="https://instagram.com/${data.instagramHandle.replace('@', '')}" 
                 style="display: inline-flex; align-items: center; padding: 12px 24px; background: #ffffff; color: #232222; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;">
                📸 ${data.instagramHandle}
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 30px; background-color: #f5f6f8; text-align: center;">
        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
          © ${new Date().getFullYear()} Basic Studio. Todos os direitos reservados.
        </p>
        <p style="margin: 10px 0 0; color: #d1d5db; font-size: 11px;">
          Este email foi enviado automaticamente.
          <br>Se não reconhece este convite, pode ignorar esta mensagem.
        </p>
      </td>
    </tr>

  </table>

  <!-- Espaço extra no final -->
  <table cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td style="height: 40px;"></td>
    </tr>
  </table>

</body>
</html>
  `;
};
