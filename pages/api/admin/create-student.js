import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!supabaseUrl || !serviceRoleKey) return res.status(503).json({ error: 'サーバー側のSupabase設定が不足しています' });

  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  const { email, password, full_name, address, phone_number, registration_date, notes, plans } = req.body || {};
  if (!token) return res.status(401).json({ error: '管理者ログインが必要です' });
  if (typeof email !== 'string' || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'メールアドレスと8文字以上のパスワードを入力してください' });
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  const { data: authData, error: authError } = await adminClient.auth.getUser(token);
  if (authError || authData.user?.app_metadata?.role !== 'admin') {
    return res.status(403).json({ error: '管理者権限を確認できませんでした' });
  }

  const { data: created, error: createError } = await adminClient.auth.admin.createUser({
    email: email.trim(),
    password,
    email_confirm: true,
    user_metadata: { full_name: full_name || '' },
  });
  if (createError || !created.user) return res.status(400).json({ error: createError?.message || 'アカウントを作成できませんでした' });

  const userId = created.user.id;
  const { error: profileError } = await adminClient.from('profiles').upsert({
    id: userId, email: email.trim(), full_name: full_name || '', address: address || '',
    phone_number: phone_number || '', registration_date: registration_date || new Date().toISOString().slice(0, 10), notes: notes || '',
  });
  if (profileError) {
    await adminClient.auth.admin.deleteUser(userId);
    return res.status(400).json({ error: `プロフィールを保存できませんでした: ${profileError.message}` });
  }

  const safePlans = Array.isArray(plans) ? plans.filter((plan) => ['video', 'tutoring'].includes(plan?.plan_type)) : [];
  if (safePlans.length) {
    const { error: plansError } = await adminClient.from('user_plans').upsert(safePlans.map((plan) => ({
      user_id: userId, plan_type: plan.plan_type, contract_start_date: plan.contract_start_date || registration_date, status: 'active',
    })));
    if (plansError) return res.status(400).json({ error: `受講プランを保存できませんでした: ${plansError.message}` });
  }
  return res.status(201).json({ id: userId });
}
