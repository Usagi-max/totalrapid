// pages/api/submit.ts
// pages/api/submit.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';
import nodemailer from 'nodemailer';

// LINE Messaging API
const LINE_ENDPOINT = 'https://api.line.me/v2/bot/message/broadcast';
const LINE_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || '';

type AnswerItem = { key: string; value: string };
type Payload = { timestamp: string; answers: AnswerItem[]; email: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('[api/submit] method:', req.method, 'url:', req.url);

  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const body = req.body as Payload;
    if (!body || !Array.isArray(body.answers) || !body.timestamp) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    // --- 1) ファイル保存 ---
    const dir = path.join(process.cwd(), 'data', 'submissions');
    await fs.mkdir(dir, { recursive: true });

    const iso = body.timestamp.replace(/[:.]/g, '-');
    const id = Math.random().toString(36).slice(2, 8);
    const base = `${iso}_${id}`;

    // JSON 保存
    const jsonPath = path.join(dir, `${base}.json`);
    await fs.writeFile(jsonPath, JSON.stringify(body, null, 2), 'utf8');

    // CSV 保存
    const csv = toCSV(body);
    const csvPath = path.join(dir, `${base}.csv`);
    await fs.writeFile(csvPath, csv, 'utf8');

    // --- 2) LINE ブロードキャスト通知 ---
    let lineResult: any = { skipped: true };
    if (LINE_TOKEN) {
      const title = '新しいお問い合わせが届きました';
      const summary = body.answers
        .map((a) => `${a.key}: ${a.value || '-'}`)
        .join('\n')
        .slice(0, 800);

      const resp = await fetch(LINE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${LINE_TOKEN}`,
        },
        body: JSON.stringify({
          messages: [
            {
              type: 'text',
              text: `${title}\n\n${summary}\n\nメール: ${body.email}\n\n（このメッセージは自動送信です）`,
            },
          ],
        }),
      });

      if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        throw new Error(`LINE通知エラー: ${resp.status} ${text}`);
      }

      lineResult = await resp.json().catch(() => ({ ok: true }));
    }

    // --- 3) Nodemailer で控えメール送信 ---
    if (body.email) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
          },
        });

        const textSummary = body.answers
          .map((a) => `${a.key}: ${a.value || '-'}`)
          .join('\n');

        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: body.email,
          subject: '【控え】お問い合わせありがとうございます',
          text: `以下の内容でお問い合わせを受け付けました。\n\n${textSummary}\n\n送信日時: ${body.timestamp}`,
        });

        console.log('メール送信成功:', body.email);
      } catch (mailErr) {
        console.error('メール送信エラー:', mailErr);
      }
    }

    return res.status(200).json({
      ok: true,
      saved: { json: jsonPath, csv: csvPath },
      line: lineResult,
    });
  } catch (err: any) {
    console.error('[survey/submit] error:', err);
    return res.status(500).json({ error: err?.message || 'Internal Server Error' });
  }
}

// --- CSV 変換関数 ---
function toCSV(payload: Payload): string {
  const header = ['timestamp', ...payload.answers.map((a) => a.key), 'email'];
  const values = [payload.timestamp, ...payload.answers.map((a) => a.value ?? ''), payload.email];
  const esc = (s: string) =>
    /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  return [header.map(esc).join(','), values.map(esc).join(',')].join('\n');
}
