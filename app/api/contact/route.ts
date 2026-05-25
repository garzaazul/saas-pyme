import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Transporter Gmail SMTP — credenciales desde variables de entorno
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, phone, business } = body;

        // Validación básica
        if (!name || !email || !business) {
            return NextResponse.json(
                { error: "Faltan campos obligatorios" },
                { status: 400 }
            );
        }

        const now = new Date().toLocaleString("es-CL", {
            timeZone: "America/Santiago",
            dateStyle: "full",
            timeStyle: "short",
        });

        // ── EMAIL 1: Admin — datos internos del lead ──────────────────────────
        const adminEmail = {
            from: `"FLUXU Leads" <${process.env.GMAIL_USER}>`,
            to: process.env.GMAIL_USER,
            subject: `🔔 Nueva solicitud de acceso — ${business}`,
            html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, sans-serif; background: #f8fafc; margin: 0; padding: 20px; }
    .container { max-width: 560px; margin: 0 auto; background: white; border-radius: 12px;
                 overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .header { background: #091226; padding: 28px 32px; }
    .header h1 { color: white; margin: 0; font-size: 20px; font-weight: 700; }
    .header p { color: rgba(255,255,255,0.6); margin: 4px 0 0; font-size: 13px; }
    .body { padding: 32px; }
    .badge { display: inline-block; background: #dcfce7; color: #16a34a; font-size: 11px;
             font-weight: 700; padding: 4px 10px; border-radius: 99px;
             text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 20px; }
    .field { margin-bottom: 16px; }
    .field-label { display: block; font-size: 11px; font-weight: 700; color: #94a3b8;
                   text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
    .field-value { display: block; font-size: 15px; color: #0f172a; font-weight: 500; }
    .divider { height: 1px; background: #f1f5f9; margin: 24px 0; }
    .cta { display: block; background: #091226; color: white !important; text-decoration: none;
           padding: 12px 24px; border-radius: 8px; text-align: center;
           font-weight: 700; font-size: 14px; margin-top: 24px; }
    .footer { padding: 16px 32px; background: #f8fafc; border-top: 1px solid #f1f5f9; }
    .footer p { margin: 0; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 Nueva solicitud de acceso</h1>
      <p>${now}</p>
    </div>
    <div class="body">
      <span class="badge">Lead nuevo</span>
      <div class="field">
        <span class="field-label">Nombre</span>
        <span class="field-value">${name}</span>
      </div>
      <div class="field">
        <span class="field-label">Negocio</span>
        <span class="field-value">${business}</span>
      </div>
      <div class="field">
        <span class="field-label">Email</span>
        <span class="field-value">${email}</span>
      </div>
      <div class="field">
        <span class="field-label">Teléfono</span>
        <span class="field-value">${phone || "No proporcionado"}</span>
      </div>
      <div class="divider"></div>
      <p style="font-size:13px; color:#64748b; margin:0">
        Recuerda contactar en menos de 24 horas para activar su cuenta.
      </p>
      <a href="mailto:${email}" class="cta">Responder a ${name} →</a>
    </div>
    <div class="footer">
      <p>FLUXU · Sistema de gestión comercial para PyMEs chilenas</p>
    </div>
  </div>
</body>
</html>`,
        };

        // ── EMAIL 2: Prospecto — copy comercial ───────────────────────────────
        const firstName = name.split(" ")[0];
        const clientEmail = {
            from: `"FLUXU" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: `Recibimos tu solicitud, ${firstName} 👋`,
            html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, sans-serif; background: #f8fafc; margin: 0; padding: 20px; }
    .container { max-width: 560px; margin: 0 auto; background: white; border-radius: 12px;
                 overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .header { background: #091226; padding: 36px 32px; text-align: center; }
    .logo { display: inline-block; background: white; color: #091226; font-weight: 900;
            font-size: 22px; padding: 8px 20px; border-radius: 10px;
            letter-spacing: -0.5px; font-style: italic; }
    .body { padding: 36px 32px; }
    .body h2 { font-size: 22px; color: #0f172a; margin: 0 0 12px; font-weight: 700; }
    .body p { font-size: 15px; color: #475569; line-height: 1.6; margin: 0 0 16px; }
    .highlight { background: #f0fdf4; border-left: 3px solid #16a34a;
                 padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 24px 0; }
    .highlight p { margin: 0; color: #15803d; font-weight: 600; }
    .steps { margin: 24px 0; }
    .step { display: flex; gap: 12px; margin-bottom: 14px; align-items: flex-start; }
    .step-num { background: #091226; color: white; width: 24px; height: 24px;
                border-radius: 50%; font-size: 12px; font-weight: 700; flex-shrink: 0;
                text-align: center; line-height: 24px; }
    .step-text { font-size: 14px; color: #475569; padding-top: 3px; line-height: 1.5; }
    .divider { height: 1px; background: #f1f5f9; margin: 24px 0; }
    .footer { padding: 20px 32px; background: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center; }
    .footer p { margin: 0 0 4px; font-size: 12px; color: #94a3b8; }
    .footer a { color: #091226; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">FLUXU</div>
    </div>
    <div class="body">
      <h2>Hola, ${firstName} 👋</h2>
      <p>
        Recibimos tu solicitud de acceso para <strong>${business}</strong>.
        Estamos muy contentos de que quieras ordenar tu PyME con FLUXU.
      </p>
      <div class="highlight">
        <p>✅ Tu solicitud fue recibida. Te contactamos en menos de 24 horas para activar tu cuenta.</p>
      </div>
      <p>Mientras tanto, esto es lo que viene:</p>
      <div class="steps">
        <div class="step">
          <div class="step-num">1</div>
          <div class="step-text">
            Te enviamos acceso a tu cuenta con <strong>primer mes gratis</strong>.
          </div>
        </div>
        <div class="step">
          <div class="step-num">2</div>
          <div class="step-text">
            Configuras tu empresa, subes tus productos y creas tu primera cotización.
          </div>
        </div>
        <div class="step">
          <div class="step-num">3</div>
          <div class="step-text">
            Tu catálogo público queda activo para que tus clientes te escriban por WhatsApp.
          </div>
        </div>
      </div>
      <div class="divider"></div>
      <p style="font-size:13px; color:#94a3b8; margin:0">
        ¿Tienes alguna pregunta antes? Escríbenos a
        <a href="mailto:carlosgarcesaguilar@gmail.com" style="color:#091226">carlosgarcesaguilar@gmail.com</a>
        o por WhatsApp al +56 9 7242 0708.
      </p>
    </div>
    <div class="footer">
      <p><a href="https://fluxu.cl">fluxu.cl</a> · Hecho en Chile 🇨🇱 para PyMEs</p>
      <p>© 2026 FLUXU · Carlos Garcés Aguilar · Agencia bestIA</p>
    </div>
  </div>
</body>
</html>`,
        };

        // Enviar ambos emails en paralelo
        await Promise.all([
            transporter.sendMail(adminEmail),
            transporter.sendMail(clientEmail),
        ]);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error enviando email:", error);
        return NextResponse.json(
            { error: "Error interno al enviar el email" },
            { status: 500 }
        );
    }
}
