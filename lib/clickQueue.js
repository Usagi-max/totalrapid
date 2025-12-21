// /lib/clickQueue.js
import { google } from "googleapis";

let queue = [];
let isProcessing = false;
let sheetsClient = null;

async function getSheets() {
  if (!sheetsClient) {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(
        process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "{}"
      ),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    sheetsClient = google.sheets({ version: "v4", auth });
  }
  return sheetsClient;
}

export function pushClickLog(log) {
  if (!log.timestamp || !log.session_id) return;

  queue.push({
    timestamp: log.timestamp,
    session_id: log.session_id,
    type: log.type || "unknown",
    buttonName: log.buttonName || "unknown",
    page: log.page || "",
    parameters: log.parameters || "",
    fullUrl: log.fullUrl || "",
  });
}

async function processQueue() {
  if (isProcessing || queue.length === 0) return;
  isProcessing = true;

  let logsToWrite = [];

  try {
    logsToWrite = [...queue];
    queue = [];

    const sheets = await getSheets();

    const rows = logsToWrite.map((log) => {
      const jst = new Date(log.timestamp).toLocaleString("ja-JP", {
        timeZone: "Asia/Tokyo",
      });

      return [
        jst,
        log.session_id,
        log.type,
        log.buttonName,
        log.page,
        log.parameters,
        log.fullUrl,
      ];
    });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "クリック履歴!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: rows },
    });

    console.log(`📊 [BatchUpdate] ${rows.length} 件書き込み成功`);
  } catch (err) {
    console.error("❌ batchUpdate エラー:", err);
    queue = [...logsToWrite, ...queue];
  } finally {
    isProcessing = false;
  }
}

setInterval(processQueue, 1000);
