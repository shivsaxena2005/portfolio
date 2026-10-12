import nodemailer from 'nodemailer';

// Runs on Netlify at POST /api/contact (same URL the form already uses)
export const config = { path: '/api/contact' };

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const hintFor = (err) => {
  if (err.code === 'EAUTH') return 'Gmail rejected the login. MAIL_PASS must be a 16-character Gmail App Password (needs 2-Step Verification), not your normal password.';
  if (err.code === 'ECONNECTION' || err.code === 'ETIMEDOUT' || err.code === 'ESOCKET') return 'Could not reach Gmail from the server. Try again, or check Netlify function logs.';
  return `Mail error: ${err.code || err.message}`;
};

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  let data;
  try { data = await req.json(); } catch { return json({ error: 'Bad request' }, 400); }

  const { name, email, message } = data || {};
  if (!name || !email || !message) return json({ error: 'Missing fields' }, 400);

  const user = (process.env.MAIL_USER || '').trim();
  const pass = (process.env.MAIL_PASS || '').replace(/\s+/g, ''); // Google shows App Passwords with spaces; they must be removed
  if (!user || !pass) {
    console.error('MAIL_USER or MAIL_PASS is not set in Netlify environment variables');
    return json({ error: 'Mail not configured', hint: 'MAIL_USER or MAIL_PASS is missing in Netlify. Add both under Site configuration, Environment variables, then redeploy.' }, 500);
  }

  const mailer = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  try {
    await mailer.sendMail({
      from: user,
      to: user,
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      text: `${message}\n\n— ${name} <${email}>`,
    });
    return json({ ok: true });
  } catch (err) {
    console.error('sendMail failed:', err.code, err.message);
    return json({ error: 'Mail failed', hint: hintFor(err) }, 500);
  }
};
