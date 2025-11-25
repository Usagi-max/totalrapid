// /lib/clickQueue.js
import { google } from "googleapis";

let queue = []; // APIで受け取ったログをためるキュー
let isProcessing = false;

// Google Sheets 認証を準備（毎回作らない）
let sheetsClient = null;

async function getSheets() {
  if (!sheetsClient) {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "{}"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    sheetsClient = google.sheets({ version: "v4", auth });
  }
  return sheetsClient;
}

// ★ キューに追加
export function pushClickLog(log) {
  queue.push(log);
}

// ★ バックグラウンドで1秒ごとに batchUpdate
async function processQueue() {
  if (isProcessing) return;
  if (queue.length === 0) return;

  isProcessing = true;

  try {
    const logsToWrite = [...queue];
    queue = []; // 即クリア（新しいログを受け取れる）

    const sheets = await getSheets();

    // Google Sheets 用の rows
    const rows = logsToWrite.map((log) => [
      new Date(log.timestamp).toLocaleString("ja-JP", {
        timeZone: "Asia/Tokyo",
      }),
      log.session_id,
      log.buttonName,
      log.page,
    ]);

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "クリック履歴!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: rows,
      },
    });

    console.log(
      `📊 [BatchUpdate] ${rows.length} 件をまとめて書き込み成功`
    );
  } catch (err) {
    console.error("❌ batchUpdateエラー:", err);
    // 書き込み失敗 → キューに戻す
    queue = [...logsToWrite, ...queue];
  } finally {
    isProcessing = false;
  }
}

// ★ 1秒ごとに処理を走らせる
setInterval(processQueue, 1000);
