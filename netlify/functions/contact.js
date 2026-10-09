import nodemailer from 'nodemailer';

// Runs on Netlify at POST /api/contact (same URL the form already uses)
export const config = { path: '/api/contact' };

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  let data;
  try { data = await req.json(); } catch { return json({ error: 'Bad request' }, 400); }

  const { name, email, message } = data || {};
  if (!name || !email || !message) return json({ error: 'Missing fields' }, 400);

  const mailer = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
  });

  try {
    await mailer.sendMail({
      from: process.env.MAIL_USER,
      to: process.env.MAIL_USER,
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      text: `${message}\n\n— ${name} <${email}>`,
    });
    return json({ ok: true });
  } catch (err) {
    console.error(err);
    return json({ error: 'Mail failed' }, 500);
  }
};
