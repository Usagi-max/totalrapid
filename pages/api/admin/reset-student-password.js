import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(503).json({ error: 'サーバー側のSupabase設定が不足しています' });
  }

  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  const { userId, password } = req.body || {};
  if (!token) return res.status(401).json({ error: '管理者ログインが必要です' });
  if (typeof userId !== 'string' || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'パスワードは8文字以上で入力してください' });
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  const { data: authData, error: authError } = await adminClient.auth.getUser(token);
  if (authError || authData.user?.app_metadata?.role !== 'admin') {
    return res.status(403).json({ error: '管理者権限を確認できませんでした' });
  }

  const { error } = await adminClient.auth.admin.updateUserById(userId, { password });
  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json({ ok: true });
}
