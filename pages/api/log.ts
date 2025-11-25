// pages/api/log.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const body = req.body;

    if (!body) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    console.log("📥 [Click Log]", body);

    // --------------------------------------------------------
    // Google Sheets 認証（submit.ts と全く同じ）
    // --------------------------------------------------------
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "{}"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // --------------------------------------------------------
    // 記録する行を作成（JSTに変換）
    // --------------------------------------------------------
    const jst = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });

    const row = [
      jst,                // クリック日時（JST）
      body.clientId,      // クリック者（UUID）
      body.eventName,     // ボタン名
      body.page,          // ページ名
    ];

    // --------------------------------------------------------
    // 「クリック履歴」タブへ append
    // --------------------------------------------------------
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID!,
      range: "クリック履歴!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [row] },
    });

    console.log("📊 Sheets書き込み成功");

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error("❌ /api/log Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
