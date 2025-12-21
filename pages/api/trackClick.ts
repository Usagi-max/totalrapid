import type { NextApiRequest, NextApiResponse } from "next";
import { pushClickLog } from "../../lib/clickQueue";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      timestamp,
      session_id,
      label,
      page,
      parameters,
      fullUrl,
      type,
    } = req.body;

    if (!timestamp || !session_id) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    pushClickLog({
      timestamp,
      session_id,
      type,
      buttonName: label || "unknown",
      page,
      parameters: parameters || "",
      fullUrl: fullUrl || "",
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("trackClick error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
