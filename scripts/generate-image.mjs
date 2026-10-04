// 画像を生成して public/images に保存する（Cloudflare Workers AI → Gemini API の順に試す）
// 使い方: node scripts/generate-image.mjs <出力ファイル名> "<プロンプト>" [アスペクト比]
// 例:     node scripts/generate-image.mjs worry-test.jpg "..." 4:3
// 設定は .env.local から読み込む（環境変数があればそちらを優先）。設定のあるものだけ使う
//   CLOUDFLARE_ACCOUNT_ID=...          … Cloudflare のアカウントID（無料枠あり・FLUX.1 schnell）
//   CLOUDFLARE_API_TOKEN=...           … Workers AI 権限の API トークン
//   GEMINI_API_KEYS=key1,key2,key3     … 複数キー。先頭から順に使い、上限・課金エラーなら次のキーへ
//   GEMINI_API_KEY=key                 … 単一キー（GEMINI_API_KEYS が無い場合に使用）
//   GEMINI_IMAGE_MODELS=gemini-3-pro-image,gemini-3.1-flash-image … 全キーで失敗したら次のモデルへ
// ※ Cloudflare の FLUX.1 schnell はアスペクト比指定なし（正方形）。トリミングは CSS の object-fit で行う
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

function readEnv(name) {
  if (process.env[name]) return process.env[name];
  const envPath = resolve('.env.local');
  if (!existsSync(envPath)) return null;
  const line = readFileSync(envPath, 'utf8').split(/\r?\n/).find((l) => l.startsWith(`${name}=`));
  return line ? line.slice(name.length + 1).trim().replace(/^["']|["']$/g, '') : null;
}
const splitList = (value) => (value ?? '').split(',').map((s) => s.trim()).filter(Boolean);

const [fileName, prompt, aspectRatio = '4:3'] = process.argv.slice(2);
if (!fileName || !prompt) {
  console.error('usage: node scripts/generate-image.mjs <file.jpg> "<prompt>" [aspectRatio]');
  process.exit(1);
}

// 各試行は { label, run } を持ち、run() は { ok, skippable, base64, detail } を返す
const attempts = [];

const CF_ACCOUNT = readEnv('CLOUDFLARE_ACCOUNT_ID');
const CF_TOKEN = readEnv('CLOUDFLARE_API_TOKEN');
if (CF_ACCOUNT && CF_TOKEN) {
  attempts.push({
    label: 'cloudflare / flux-1-schnell',
    async run() {
      const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT}/ai/run/@cf/black-forest-labs/flux-1-schnell`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${CF_TOKEN}` },
        body: JSON.stringify({ prompt, steps: 8 }),
      });
      const json = await res.json();
      const detail = JSON.stringify(json.errors ?? json).slice(0, 300);
      // 429 / 4006 系 = 1日の無料枠超過。次の手段へ回す
      return { ok: res.ok && !!json.result?.image, skippable: res.status === 429 || res.status === 403 || /limit|quota|neuron/i.test(detail), base64: json.result?.image, detail: `HTTP ${res.status} ${detail}` };
    },
  });
}

const GEMINI_KEYS = splitList(readEnv('GEMINI_API_KEYS') ?? readEnv('GEMINI_API_KEY'));
const GEMINI_MODELS = splitList(readEnv('GEMINI_IMAGE_MODELS') ?? readEnv('GEMINI_IMAGE_MODEL') ?? 'gemini-3-pro-image');
for (const model of GEMINI_MODELS) {
  for (const [index, key] of GEMINI_KEYS.entries()) {
    attempts.push({
      label: `gemini / ${model} / key#${index + 1}`,
      async run() {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio } },
          }),
        });
        const json = await res.json();
        const message = json.error?.message ?? '';
        // 429=レート/クォータ上限, 403=課金未設定・権限なし, 400のAPIキー無効 は次のキーへ
        const skippable = res.status === 429 || res.status === 403 || (res.status === 400 && /API key|API_KEY_INVALID/i.test(message));
        const hint = /free_tier.*limit: 0/s.test(message) ? '（このプロジェクトは課金が未設定です）' : '';
        const part = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
        return { ok: res.ok && !!part, skippable, base64: part?.inlineData.data, detail: `HTTP ${res.status} ${json.error?.status ?? ''} ${message.slice(0, 120)}${hint}` };
      },
    });
  }
}

if (attempts.length === 0) {
  console.error('.env.local に CLOUDFLARE_ACCOUNT_ID と CLOUDFLARE_API_TOKEN、または GEMINI_API_KEYS を設定してください。');
  process.exit(1);
}

let done = false;
for (const { label, run } of attempts) {
  const { ok, skippable, base64, detail } = await run();
  if (ok) {
    const outPath = resolve('public/images', fileName);
    writeFileSync(outPath, Buffer.from(base64, 'base64'));
    console.log(`saved ${outPath} (${label})`);
    done = true;
    break;
  }
  if (skippable) {
    console.warn(`skip ${label}: ${detail}`);
    continue;
  }
  // プロンプト不備などキーを替えても直らないエラーは即終了
  console.error(`failed ${label}: ${detail}`);
  process.exitCode = 1;
  done = true;
  break;
}
// process.exit() は Windows で fetch 直後に libuv のアサーションを起こすため exitCode で終了する
if (!done) {
  console.error('すべての手段で上限または課金エラーになりました。');
  process.exitCode = 1;
}
