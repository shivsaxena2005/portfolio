import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json());

const user = (process.env.MAIL_USER || '').trim();
const pass = (process.env.MAIL_PASS || '').replace(/\s+/g, ''); // Google shows App Passwords with spaces; they must be removed

const mailer = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: { user, pass },
});

const hintFor = (err) => {
  if (err.code === 'EAUTH') return 'Gmail rejected the login. MAIL_PASS must be a 16-character Gmail App Password (needs 2-Step Verification), not your normal password.';
  if (err.code === 'ECONNECTION' || err.code === 'ETIMEDOUT' || err.code === 'ESOCKET') return 'Could not reach Gmail. Check your internet connection.';
  return `Mail error: ${err.code || err.message}`;
};

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' });
  if (!user || !pass) {
    console.error('MAIL_USER or MAIL_PASS is missing from .env');
    return res.status(500).json({ error: 'Mail not configured', hint: 'MAIL_USER or MAIL_PASS is missing from your .env file.' });
  }
  try {
    await mailer.sendMail({
      from: user,
      to: user,
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      text: `${message}\n\n— ${name} <${email}>`,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('sendMail failed:', err.code, err.message);
    res.status(500).json({ error: 'Mail failed', hint: hintFor(err) });
  }
});

// serve the built site in production
app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (_, res) => res.sendFile(path.join(__dirname, '../dist/index.html')));

app.listen(process.env.PORT || 5000, () => console.log('Server running on :5000'));
