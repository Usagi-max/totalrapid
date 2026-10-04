---
name: generate-site-image
description: 学習塾RAPID サイト（特に /miyazaki-online LP）用の画像を Cloudflare Workers AI（FLUX.1 schnell、無料枠）→ Gemini の順で生成し、トリミング・WebP 化して public/images に配置する。「画像を生成して」「LP用の写真を作って」「この画像をトリミングして使って」「Cloudflareで画像生成」など、サイトに載せる画像の生成・差し替え・仕上げを頼まれたときに使う。ユーザーが自分で用意した画像の切り抜き・WebP 化にも使う。
---

# サイト用画像の生成と仕上げ

## 使うスクリプト（リポジトリ内）
- `scripts/generate-image.mjs` … 生成。Cloudflare Workers AI（`@cf/black-forest-labs/flux-1-schnell`）→ Gemini API の順に試し、上限・課金エラーなら次の手段へ自動で回す。
  - 使い方: `node scripts/generate-image.mjs <出力先> "<英語プロンプト>" [アスペクト比]`
  - 出力先が相対パスなら `public/images/` に保存される。**生の生成画像は公開フォルダに置かず、スクラッチパッドの絶対パスを渡す**こと。
  - FLUX.1 schnell は正方形のみ（アスペクト比は Gemini のときだけ効く）。正方形で作ってから次の手順で切り抜く前提で、主役を中央に置くプロンプトにする。
- `scripts/optimize-image.mjs` … 仕上げ。切り抜き・縮小（最大幅 1600px）・WebP 変換して `public/images/` に保存。
  - `--aspect=16:10 --focus=0.5,0.45` … 比率と残す中心（0〜1）で切り抜く
  - `--crop=left,top,width,height` … ピクセル指定で切り抜く（不要な背景を落とすとき）
  - 例: `node scripts/optimize-image.mjs <生画像> archive-review.webp --aspect=16:10 --focus=0.55,0.5`

認証情報は `.env.local` の `CLOUDFLARE_ACCOUNT_ID` / `CLOUDFLARE_API_TOKEN`（任意で `GEMINI_API_KEYS`）。**値を表示・ログ出力・コミットしない。** 存在確認はキー名だけ grep する。

## 手順
1. **置き場所と比率を決める**：どのセクション・コンポーネントに入るか、CSS の `aspect-ratio` / `object-fit` を確認する（例：ヒーローカードは 16:10、スマホでは 1:1 に切り抜かれる）。文字が重なる位置（数字カードなど）は空けておく。
2. **プロンプトを書く**：下の「ハウススタイル」をベースに、被写体と構図だけ差し替える。英語で書く。
3. **生成する**：
   ```bash
   node scripts/generate-image.mjs "<スクラッチパッド>/raw-<名前>.jpg" "<プロンプト>" 16:10
   ```
   どの手段で生成されたかは出力の `(cloudflare / ...)` / `(gemini / ...)` で分かる。全手段が上限なら、ユーザーに伝えて Gemini 等で手動生成してもらう（下のプロンプトを渡す）。
4. **目で確認する**：Read で画像を開き、次をチェックする。NG なら再生成（プロンプトに禁止事項を足す）。
   - 実在ブランドのロゴ・商品名（例：MONO 消しゴム、KURU TOGA、Campus ノート）が写っていない
   - 読める文字・数字、人の顔が不自然に出ていない
   - 既存の画像シリーズと色温度・机・光がそろっている
5. **仕上げる**：`optimize-image.mjs` で切り抜き・WebP 化。ファイル名は用途が分かる英小文字ケバブケース（`archive-review.webp`、`final-cta-desk.webp`）。
6. **組み込んで確認する**：ページの `src` を差し替え、PC 幅とスマホ幅（375px）で表示・切れ方を確認する。生画像は公開フォルダに残さない。

## ハウススタイル（このテイストにそろえる）
既存シリーズ：`strategy-analysis.webp`（過去問と分析ノートの机）、`archive-review.webp`（ノートPCで講義を見返しながらノート）、`final-cta-desk.webp`（窓辺の机に閉じたPCと教材）。

```text
A photorealistic photo of a light oak study desk, warm and calm mood, soft natural light
(morning light from the upper left, or warm late-afternoon light by a window).
<被写体と構図をここに書く>
Recurring props: cream notebooks and papers, pale orange and cream sticky notes, a ceramic cup of green tea on a cork coaster.
Color palette: cream, warm white, soft peach and orange accents, light wood.
<比率>, main subject centered<文字を重ねる場合: keep the <位置> area visually quiet for a text overlay>.
No faces, no logos, no brand names, plain unbranded stationery and devices, no readable text or numbers (blurred or abstract marks only).
Clean, minimal, editorial magazine style, high resolution.
```

- 人物は手元だけにする。塾長本人と誤認させる生成人物は使わない（塾長は実写 `principal.png` を使う）。
- 線画イラスト・フラットイラスト・寒色の写真は混ぜない。
