import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { es } from '@/dictionaries/es';
import { en } from '@/dictionaries/en';

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_FROM = process.env.EMAIL_FROM || 'techdesk@brandiumx.com'; 
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'techdesk@brandiumx.com';

interface OrderItem {
  name: string;
  description?: string;
  quantity?: number;
  price: number;
}

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
    h1, h2, h3 {
      font-family: 'DM Serif Display', serif;
      font-weight: normal;
      margin-top: 0;
    }
    h2 {
      font-size: 24px;
      color: #F2CC8F;
      margin-bottom: 20px;
    }
    h3 {
      font-size: 18px;
      color: #E07A5F;
      margin-bottom: 15px;
      border-bottom: 1px solid #2e2e2e;
      padding-bottom: 10px;
      margin-top: 30px;
    }
    p {
      font-size: 15px;
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
    .item-row {
      padding: 15px 0;
      border-bottom: 1px dashed #2e2e2e;
    }
    .item-title {
      color: #f5f0eb;
      font-weight: 500;
      margin: 0 0 5px 0;
      font-size: 16px;
    }
    .item-desc {
      color: #a6a6a6;
      font-size: 14px;
      margin: 0 0 5px 0;
    }
    .item-price {
      color: #F2CC8F;
      font-size: 15px;
      font-weight: 500;
      margin: 0;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      font-size: 12px;
      color: #666666;
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
      // ----------------------------------------------------
      // 1. Notificación al Administrador (Contacto)
      // ----------------------------------------------------
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
        html: generateEmailTemplate(lang === 'es' ? "Nuevo Contacto" : "New Contact", adminContent)
      });

      // ----------------------------------------------------
      // 2. Correo de Confirmación al Cliente (Contacto)
      // ----------------------------------------------------
      const clientContent = `
        <p style="color: #f5f0eb; font-size: 18px;">${t.email.contactClientGreeting} ${data.name},</p>
        <p>${t.email.contactClientBody}</p>
        <div style="background-color: #0f0f0f; padding: 20px; border-radius: 12px; margin-top: 20px; border: 1px solid #2e2e2e;">
          <span class="data-label">${t.email.labels.message}</span>
          <p style="margin: 10px 0 0 0; font-style: italic; color: #f5f0eb;">"${data.message}"</p>
        </div>
      `;

      await resend.emails.send({
        from: `Brandium Mx <${EMAIL_FROM}>`,
        to: data.email,
        subject: t.email.contactClientSubject,
        html: generateEmailTemplate(lang === 'es' ? "Hemos recibido tu mensaje" : "Message received", clientContent)
      });
    } 
    else if (type === 'checkout') {
      
      // Aplicación de la interfaz OrderItem para evitar el error any[]
      const renderItems = (items: OrderItem[]) => {
        if (!items || items.length === 0) return '<p>No se encontraron detalles de los servicios.</p>';
        return items.map((item) => `
          <div class="item-row">
            <p class="item-title">${item.name}</p>
            <p class="item-desc">${(item.quantity ?? 1) > 1 ? `Cantidad: ${item.quantity} &times; ` : ''}${item.description || ''}</p>
            <p class="item-price">$${(item.price * (item.quantity ?? 1)).toLocaleString()} MXN</p>
          </div>
        `).join('');
      };

      const orderDetailsHtml = renderItems(data.items);
      const subtotal = data.grandTotal / 1.16;
      const iva = data.grandTotal - subtotal;

      // ----------------------------------------------------
      // 1. Notificación al Administrador (Pago Exitoso)
      // ----------------------------------------------------
      const adminCheckoutContent = `
        <p>Se ha procesado un nuevo pago de forma exitosa.</p>
        
        <h3>Datos del Cliente</h3>
        <div class="data-row">
          <span class="data-label">${t.email.labels.name}</span>
          <span class="data-value">${data.name}</span>
        </div>
        <div class="data-row">
          <span class="data-label">${t.email.labels.email}</span>
          <span class="data-value">${data.email}</span>
        </div>
        <div class="data-row" style="border-bottom: none;">
          <span class="data-label">${t.email.labels.phone}</span>
          <span class="data-value">${data.phone}</span>
        </div>

        <h3>Dirección de Facturación</h3>
        <p style="margin: 0; color: #f5f0eb;">${data.address1} ${data.address2 ? ', ' + data.address2 : ''}</p>
        <p style="margin: 5px 0 0 0; color: #f5f0eb;">${data.city}, ${data.state}, C.P. ${data.zip}</p>
        <p style="margin: 5px 0 0 0; color: #f5f0eb;">${data.country}</p>

        <h3>Servicios Contratados</h3>
        ${orderDetailsHtml}

        <div style="margin-top: 25px; padding-top: 20px; border-top: 2px solid #2e2e2e; text-align: right;">
          <p style="margin: 0 0 5px 0; color: #a6a6a6;">Subtotal: $${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} MXN</p>
          <p style="margin: 0 0 5px 0; color: #a6a6a6;">IVA (16%): $${iva.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} MXN</p>
          <p style="margin: 10px 0 0 0; font-size: 20px; color: #F2CC8F; font-weight: bold;">
            Total: $${data.grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} MXN
          </p>
        </div>
      `;

      await resend.emails.send({
        from: `Brandium Mx <${EMAIL_FROM}>`,
        to: ADMIN_EMAIL,
        subject: `${t.email.checkoutAdminSubject} ${data.name}`,
        html: generateEmailTemplate(lang === 'es' ? "Nuevo Pago Registrado" : "New Payment Registered", adminCheckoutContent)
      });

      // ----------------------------------------------------
      // 2. Recibo de Compra al Cliente (Pago Exitoso)
      // ----------------------------------------------------
      const clientCheckoutContent = `
        <p style="color: #f5f0eb; font-size: 18px;">${t.email.contactClientGreeting} ${data.name},</p>
        <p>${t.email.checkoutClientBody}</p>
        
        <h3>${lang === 'es' ? 'Resumen de tu pedido' : 'Order Summary'}</h3>
        <div style="background-color: #0f0f0f; padding: 20px; border-radius: 16px; margin: 20px 0; border: 1px solid #2e2e2e;">
          ${orderDetailsHtml}
          
          <div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #2e2e2e; text-align: right;">
            <p style="margin: 0 0 5px 0; color: #a6a6a6;">Subtotal: $${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} MXN</p>
            <p style="margin: 0 0 5px 0; color: #a6a6a6;">IVA: $${iva.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} MXN</p>
            <p style="margin: 10px 0 0 0; font-size: 22px; color: #F2CC8F; font-weight: bold;">
              Total: $${data.grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} MXN
            </p>
          </div>
        </div>

        <p>${lang === 'es' ? 'Nos pondremos en contacto contigo pronto para dar inicio a tu proyecto.' : 'We will contact you shortly to start your project.'}</p>
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