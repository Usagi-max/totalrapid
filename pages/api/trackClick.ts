// pages/api/trackClick.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { pushClickLog } from "../../lib/clickQueue";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).end();

  try {
    const {
      timestamp,
      session_id,
      type,
      label,
      page,
      parameters,
      fullUrl,
    } = req.body || {};

    if (!session_id || !type) {
      return res.status(200).json({ ok: false });
    }

    pushClickLog({
      timestamp,
      session_id,
      type,
      buttonName: label,
      page,
      parameters,
      fullUrl,
    });

    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(200).json({ ok: false });
  }
}
