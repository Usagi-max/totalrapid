// /lib/clickQueue.js
import { google } from "googleapis";

let queue = []; // APIで受け取ったログをためるキュー
let isProcessing = false;

// Google Sheets クライアントのキャッシュ
let sheetsClient = null;

// --------------------------------------------------------------
// ★ Google Sheets クライアント（認証）
// --------------------------------------------------------------
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

// --------------------------------------------------------------
// ★ キューに追加
// --------------------------------------------------------------
export function pushClickLog(log) {
  // データチェック
  if (!log.timestamp || !log.session_id) {
    console.warn("⚠ pushClickLog: invalid log data", log);
    return;
  }

  queue.push({
    timestamp: log.timestamp,
    session_id: log.session_id,
    buttonName: log.buttonName || "unknown",
    page: log.page || "",
    parameters: log.parameters || "",
    fullUrl: log.fullUrl || "",
  });
}

// --------------------------------------------------------------
// ★ キューを1秒ごとにバッチ書き込み
// --------------------------------------------------------------
async function processQueue() {
  if (isProcessing || queue.length === 0) return;

  isProcessing = true;

  try {
    // 今回処理するログ
    const logsToWrite = [...queue];
    queue = []; // 即クリアして新規ログを受け付ける

    const sheets = await getSheets();

    // スプレッドシート書き込み行の生成
    const rows = logsToWrite.map((log) => {
      const jst = new Date(log.timestamp).toLocaleString("ja-JP", {
        timeZone: "Asia/Tokyo",
      });

      return [
        jst,               // A: 時刻（JST）
        log.session_id,    // B: セッションID
        log.buttonName,    // C: ボタン名
        log.page,          // D: ページパス
        log.parameters,    // E: URLパラメータ
        log.fullUrl,       // F: full URL
      ];
    });

    // Google Sheets に書き込み
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "クリック履歴!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: rows },
    });

    console.log(`📊 [BatchUpdate] ${rows.length} 件書き込み成功`);
  } catch (err) {
    console.error("❌ batchUpdate エラー:", err);

    // 失敗したらキューに戻す（ロスト防止）
    queue = [...logsToWrite, ...queue];
  } finally {
    isProcessing = false;
  }
}

// --------------------------------------------------------------
// ★ 1秒ごとにバッチ処理
// --------------------------------------------------------------
setInterval(processQueue, 1000);
