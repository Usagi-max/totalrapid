// /pages/api/trackClick.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { pushClickLog } from "../../lib/clickQueue";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { timestamp, session_id, buttonName, page, parameters, fullUrl } =
      req.body;

    if (!timestamp || !session_id)
      return res.status(400).json({ error: "Invalid payload" });

    // ★ キューへ追加
    pushClickLog({
      timestamp,
      session_id,
      buttonName,
      page,
      parameters: parameters || "",
      fullUrl: fullUrl || "",
    });

    return res.status(200).json({ ok: true, queued: true });
  } catch (err) {
    console.error("クリック記録APIエラー:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
