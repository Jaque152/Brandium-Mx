import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { es } from '@/dictionaries/es';
import { en } from '@/dictionaries/en';

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_FROM = process.env.EMAIL_FROM || 'techdesk@brandiummx.com'; 
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'techdesk@brandiummx.com';

// ==========================================
// Plantilla Base HTML para los correos
// ==========================================
const generateEmailTemplate = (title: string, content: string) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    /* Estilos base para clientes que soportan clases */
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap');
    body {
      margin: 0;
      padding: 0;
      background-color: #0f0f0f;
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #f5f0eb;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #0f0f0f;
      padding: 40px 20px;
    }
    .card {
      background-color: #171717;
      border: 1px solid #2e2e2e;
      border-radius: 24px;
      padding: 40px 30px;
      margin-top: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-family: 'DM Serif Display', serif;
      font-size: 28px;
      color: #f5f0eb;
      text-decoration: none;
      font-weight: normal;
    }
    .logo-accent {
      color: #E07A5F;
    }
    h1, h2 {
      font-family: 'DM Serif Display', serif;
      font-weight: normal;
      margin-top: 0;
    }
    h2 {
      font-size: 24px;
      color: #F2CC8F;
      margin-bottom: 20px;
    }
    p {
      font-size: 16px;
      line-height: 1.6;
      color: #a6a6a6;
      margin: 0 0 15px 0;
    }
    .data-row {
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid #2e2e2e;
    }
    .data-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #E07A5F;
      margin-bottom: 4px;
      display: block;
    }
    .data-value {
      font-size: 16px;
      color: #f5f0eb;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      font-size: 12px;
      color: #666666;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #E07A5F 0%, #F2CC8F 100%);
      background-color: #E07A5F; /* Fallback */
      color: #0f0f0f !important;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 50px;
      font-weight: 600;
      margin-top: 20px;
      text-align: center;
    }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #0f0f0f;">
    <tr>
      <td align="center">
        <div class="container">
          <div class="header">
            <a href="https://brandiummx.com" class="logo">Brandium <span class="logo-accent">Mx</span></a>
          </div>
          <div class="card">
            <h2>${title}</h2>
            ${content}
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Brandium Mx. Todos los derechos reservados.</p>
            <p>Avenida Tamaulipas, No. 150, Piso 18, Colonia Hipodromo, CDMX</p>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export async function POST(req: Request) {
  try {
    const { type, data, lang } = await req.json();
    const t = lang === 'en' ? en : es;

    if (type === 'contact') {
      // 1. Notificación al Administrador (Contacto)
      const adminContent = `
        <p>Has recibido una nueva solicitud de contacto a través del sitio web.</p>
        <div class="data-row">
          <span class="data-label">${t.email.labels.name}</span>
          <span class="data-value">${data.name}</span>
        </div>
        <div class="data-row">
          <span class="data-label">${t.email.labels.email}</span>
          <span class="data-value">${data.email}</span>
        </div>
        <div class="data-row">
          <span class="data-label">${t.email.labels.phone}</span>
          <span class="data-value">${data.phone || 'No proporcionado'}</span>
        </div>
        <div class="data-row" style="border-bottom: none;">
          <span class="data-label">${t.email.labels.message}</span>
          <span class="data-value">${data.message}</span>
        </div>
      `;

      await resend.emails.send({
        from: `Brandium Mx <${EMAIL_FROM}>`,
        to: ADMIN_EMAIL,
        subject: `${t.email.contactAdminSubject} ${data.name}`,
        html: generateEmailTemplate("Nuevo Contacto Registrado", adminContent)
      });

      // 2. Correo de Confirmación al Cliente (Contacto)
      const clientContent = `
        <p style="color: #f5f0eb; font-size: 18px;">${t.email.contactClientGreeting} ${data.name},</p>
        <p>${t.email.contactClientBody}</p>
        <div style="background-color: #0f0f0f; padding: 20px; border-radius: 12px; margin-top: 20px;">
          <p style="margin: 0; font-style: italic;">"${data.message}"</p>
        </div>
      `;

      await resend.emails.send({
        from: `Brandium Mx <${EMAIL_FROM}>`,
        to: data.email,
        subject: t.email.contactClientSubject,
        html: generateEmailTemplate("Hemos recibido tu mensaje", clientContent)
      });
    } 
    else if (type === 'checkout') {
      // 1. Notificación al Administrador (Pago Exitoso)
      const adminCheckoutContent = `
        <p>Se ha procesado un nuevo pago de forma exitosa.</p>
        <div class="data-row">
          <span class="data-label">${t.email.labels.name}</span>
          <span class="data-value">${data.name}</span>
        </div>
        <div class="data-row">
          <span class="data-label">${t.email.labels.email}</span>
          <span class="data-value">${data.email}</span>
        </div>
        <div class="data-row">
          <span class="data-label">${t.email.labels.phone}</span>
          <span class="data-value">${data.phone}</span>
        </div>
        <div class="data-row" style="border-bottom: none;">
          <span class="data-label">${t.email.labels.total}</span>
          <span class="data-value" style="color: #F2CC8F; font-size: 24px; font-weight: bold;">$${data.grandTotal.toLocaleString()} MXN</span>
        </div>
      `;

      await resend.emails.send({
        from: `Brandium Mx <${EMAIL_FROM}>`,
        to: ADMIN_EMAIL,
        subject: `${t.email.checkoutAdminSubject} ${data.name}`,
        html: generateEmailTemplate("Nuevo Pago Registrado", adminCheckoutContent)
      });

      // 2. Recibo de Compra al Cliente (Pago Exitoso)
      const clientCheckoutContent = `
        <p style="color: #f5f0eb; font-size: 18px;">${t.email.contactClientGreeting} ${data.name},</p>
        <p>${t.email.checkoutClientBody}</p>
        
        <div style="background-color: #0f0f0f; padding: 25px; border-radius: 16px; margin: 25px 0; text-align: center; border: 1px solid #2e2e2e;">
          <span class="data-label" style="text-align: center; margin-bottom: 10px;">${t.email.labels.total}</span>
          <span style="font-size: 32px; color: #F2CC8F; font-weight: bold;">$${data.grandTotal.toLocaleString()} MXN</span>
        </div>

        <p>${lang === 'es' ? 'Nos pondremos en contacto contigo en las próximas 24 horas para dar inicio a tu proyecto.' : 'We will contact you within the next 24 hours to start your project.'}</p>
      `;

      await resend.emails.send({
        from: `Brandium Mx <${EMAIL_FROM}>`,
        to: data.email,
        subject: t.email.checkoutClientSubject,
        html: generateEmailTemplate(lang === 'es' ? "¡Gracias por tu compra!" : "Thank you for your purchase!", clientCheckoutContent)
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}