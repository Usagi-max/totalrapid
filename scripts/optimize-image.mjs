// 画像をトリミング・縮小して WebP で public/images に保存する（生成画像や支給画像の仕上げ用）
// 使い方: node scripts/optimize-image.mjs <入力画像> <出力ファイル名.webp> [オプション]
//   --crop=left,top,width,height   … 元画像のピクセル座標で切り抜く
//   --aspect=16:10                 … 指定比率で切り抜く（--crop と併用不可）
//   --focus=0.5,0.5                … --aspect 時に残す中心（0〜1。左上=0,0）。既定は中央
//   --width=1600                   … この幅を超える場合だけ縮小（既定 1600）
//   --quality=82                   … WebP 品質（既定 82）
// 例: node scripts/optimize-image.mjs ~/Downloads/gen.jpg archive-review.webp --aspect=16:10 --focus=0.55,0.5
import { resolve, isAbsolute } from 'node:path';
import sharp from 'sharp';

const [input, output, ...flags] = process.argv.slice(2);
if (!input || !output) {
  console.error('usage: node scripts/optimize-image.mjs <input> <output.webp> [--crop=l,t,w,h | --aspect=W:H --focus=x,y] [--width=1600] [--quality=82]');
  process.exit(1);
}
const options = Object.fromEntries(flags.map((flag) => flag.replace(/^--/, '').split('=')));
const numbers = (value) => value.split(/[,:]/).map(Number);

const image = sharp(input).rotate();
const { width, height } = await image.metadata();

let region = { left: 0, top: 0, width, height };
if (options.crop) {
  const [left, top, cropWidth, cropHeight] = numbers(options.crop);
  region = { left, top, width: cropWidth, height: cropHeight };
} else if (options.aspect) {
  const [aspectW, aspectH] = numbers(options.aspect);
  const [focusX, focusY] = options.focus ? numbers(options.focus) : [0.5, 0.5];
  const cropWidth = Math.min(width, Math.round((height * aspectW) / aspectH));
  const cropHeight = Math.min(height, Math.round((cropWidth * aspectH) / aspectW));
  const clamp = (value, max) => Math.max(0, Math.min(max, value));
  region = {
    left: clamp(Math.round(width * focusX - cropWidth / 2), width - cropWidth),
    top: clamp(Math.round(height * focusY - cropHeight / 2), height - cropHeight),
    width: cropWidth,
    height: cropHeight,
  };
}

const maxWidth = Number(options.width ?? 1600);
const outPath = isAbsolute(output) ? output : resolve('public/images', output);
const info = await image
  .extract(region)
  .resize({ width: maxWidth, withoutEnlargement: true })
  .webp({ quality: Number(options.quality ?? 82) })
  .toFile(outPath);
console.log(`saved ${outPath} ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)}KB (from ${width}x${height}, crop ${region.left},${region.top},${region.width},${region.height})`);
