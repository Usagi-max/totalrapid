// pages/api/_debug/health.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

const LINE_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const results: any = {};

    // 1) ENV チェック（マスク）
    results.env = {
      hasToken: !!LINE_TOKEN,
      tokenLength: LINE_TOKEN.length,
      tokenLooksQuoted: /^\s*["'].*["']\s*$/.test(LINE_TOKEN),
      tokenLooksShort: LINE_TOKEN ? LINE_TOKEN.length < 20 : false,
    };

    // 2) ファイル書き込みテスト
    const dir = path.join(process.cwd(), 'data', '_debug');
    await fs.mkdir(dir, { recursive: true });
    const p = path.join(dir, `health_${Date.now()}.txt`);
    await fs.writeFile(p, 'ok', 'utf8');
    results.fs = { ok: true, wrote: p };

    // 3) LINE トークン有効性（簡易チェック）
    // 参考: /v2/bot/info は認証に成功すれば 200 でボット情報が返る想定
    if (LINE_TOKEN) {
      try {
        const resp = await fetch('https://api.line.me/v2/bot/info', {
          headers: { Authorization: `Bearer ${LINE_TOKEN}` },
        });
        const text = await resp.text();
        results.line = {
          status: resp.status,
          bodySnippet: text.slice(0, 400),
          ok: resp.ok,
        };
      } catch (e: any) {
        results.line = { ok: false, error: e?.message || 'request failed' };
      }
    } else {
      results.line = { skipped: true, reason: 'no token' };
    }

    return res.status(200).json({ ok: true, results });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || 'health error' });
  }
}
