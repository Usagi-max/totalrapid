// pages/api/submit.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';

// LINE Messaging API 設定
const LINE_ENDPOINT = 'https://api.line.me/v2/bot/message/broadcast';
const LINE_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || '';

type AnswerItem = { key: string; value: string };
type Payload = { timestamp: string; answers: AnswerItem[]; email: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('[api/submit] method:', req.method, 'url:', req.url);

  try {
    // POST メソッド以外は拒否
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const body = req.body as Payload;

    // リクエストチェック
    if (!body || !Array.isArray(body.answers) || !body.timestamp) {
      console.error('[api/submit] Invalid payload:', body);
      return res.status(400).json({ error: 'Invalid payload' });
    }

    // 環境変数ログ（デバッグ用・本番では不要）
    console.log('SPREADSHEET_ID:', process.env.SPREADSHEET_ID);
    console.log('Service account email:', JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}').client_email);

    // --- 1) Google Sheets 書き込み ---
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // スプレッドシートに書き込む行を作成
    const row = [
      new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
      body.email,
      ...body.answers.map((a) => a.value || ''),
    ];

    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.SPREADSHEET_ID!,
        range: '問い合わせ履歴!A1',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [row] },
      });
      console.log('Google Sheets 書き込み成功');
    } catch (sheetErr) {
      console.error('[Sheets] 書き込みエラー:', sheetErr);
      return res.status(500).json({ error: 'Google Sheets 書き込みエラー', details: sheetErr });
    }

    // --- 2) LINE 通知 ---
    let lineResult: any = { skipped: true };
    if (LINE_TOKEN) {
      const title = '新しいお問い合わせが届きました';
      const summary = body.answers
        .map((a) => `${a.key}: ${a.value || '-'}`)
        .join('\n')
        .slice(0, 800); // LINE通知文字制限

      try {
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
        console.log('LINE通知成功');
      } catch (lineErr) {
        console.error('[LINE] 通知エラー:', lineErr);
      }
    }

    // --- 3) メールで控え送信 ---
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

        console.log('控えメール送信成功:', body.email);
      } catch (mailErr) {
        console.error('[Mail] 送信エラー:', mailErr);
      }
    }

    // --- 成功レスポンス ---
    return res.status(200).json({
      ok: true,
      line: lineResult,
    });

  } catch (err: any) {
    console.error('[api/submit] その他エラー:', err);
    return res.status(500).json({ error: err?.message || 'Internal Server Error' });
  }
}
