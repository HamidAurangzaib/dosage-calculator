import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

// The one on-demand route in an otherwise fully static site.
export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body: Record<string, unknown>, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request }) => {
  let payload: { name?: unknown; email?: unknown; message?: unknown };

  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }

  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const message = typeof payload.message === 'string' ? payload.message.trim() : '';

  if (!name || !email || !message) {
    return json({ error: 'All fields are required.' }, 400);
  }

  if (!EMAIL_RE.test(email)) {
    return json({ error: 'Invalid email address.' }, 400);
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_EMAIL } = import.meta.env;

  // Fail loudly in the logs but generically to the caller — a misconfigured
  // mailbox is an operator problem, not something to leak to a visitor.
  if (!SMTP_USER || !SMTP_PASS) {
    console.error('Contact form: SMTP_USER / SMTP_PASS are not configured.');
    return json({ error: 'Failed to send message. Please try again later.' }, 500);
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST || 'smtp.gmail.com',
      port: Number(SMTP_PORT ?? 587),
      secure: false,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"CreatineCalc Contact" <${SMTP_USER}>`,
      to: CONTACT_EMAIL || SMTP_USER,
      replyTo: email,
      subject: `[CreatineCalc] New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    return json({ success: true }, 200);
  } catch (error) {
    console.error('Contact form error:', error);
    return json({ error: 'Failed to send message. Please try again later.' }, 500);
  }
};
