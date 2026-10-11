// lib/quizCsv.js
// Parses and validates the "understanding check" CSV. Both the legacy format
//   question,option_1..option_4,correct_option
// and the new format
//   問題種別,問題文,選択肢1..選択肢N,正解
// are accepted; the format is detected from the header row.

export const QUIZ_IMAGE_MAX_BYTES = 4 * 1024 * 1024;
export const QUIZ_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
export const QUIZ_IMAGE_EXTENSIONS = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif' };

const normalizeHeader = (header) =>
  String(header ?? '')
    .replace(/^﻿/, '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\s_\-・]/g, '');

const QUESTION_ALIASES = ['question', '問題', '問題文', '設問'];
const TYPE_ALIASES = ['type', 'questiontype', '問題種別', '問題タイプ', '種別'];
const ANSWER_ALIASES = ['correctoption', 'correct', 'answer', '正解', '正解番号', '答え'];
const EXPLANATION_ALIASES = ['explanation', 'commentary', '解説', '解説文', '解答解説'];
const IMAGE_ALIASES = ['image', 'imageurl', '画像', '画像url'];
const OPTION_PATTERN = /^(?:option|choice|選択肢)(\d+)$/;

// RFC 4180 style parser: quoted cells, "" escapes, line breaks inside cells.
export function parseCsv(text, delimiter = ',') {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;
  const source = String(text ?? '').replace(/^﻿/, '');
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    if (inQuotes) {
      if (char === '"') {
        if (source[i + 1] === '"') { cell += '"'; i += 1; } else { inQuotes = false; }
      } else {
        cell += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === delimiter) {
      row.push(cell); cell = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && source[i + 1] === '\n') i += 1;
      row.push(cell); cell = '';
      rows.push(row); row = [];
    } else {
      cell += char;
    }
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

// Excel in some locales saves ";" or tab separated files.
function detectDelimiter(text) {
  const firstLine = String(text ?? '').replace(/^﻿/, '').split(/\r?\n/, 1)[0] || '';
  const counts = [',', '\t', ';'].map((d) => [d, firstLine.split(d).length - 1]);
  counts.sort((a, b) => b[1] - a[1]);
  return counts[0][1] > 0 ? counts[0][0] : ',';
}

const parseQuestionType = (value) => {
  const normalized = String(value ?? '').normalize('NFKC').trim().toLowerCase().replace(/\s/g, '');
  if (['', '単一選択', '単一', '通常', 'single', 'text'].includes(normalized)) return 'single';
  if (['画像付き', '画像付', '画像', 'image'].includes(normalized)) return 'image';
  return null;
};

/**
 * @returns {{ format: 'legacy'|'new'|null, questions: Array, errors: Array<{row:number|null,message:string}>, warnings: string[] }}
 * `row` is the line number of the record, counting the header as row 1.
 */
export function parseQuizCsv(text) {
  const result = { format: null, questions: [], errors: [], warnings: [] };
  const records = parseCsv(text, detectDelimiter(text));
  if (!records.length || records.every((r) => r.every((c) => !String(c).trim()))) {
    result.errors.push({ row: null, message: 'CSVが空です' });
    return result;
  }

  const headers = records[0].map(normalizeHeader);
  const find = (aliases) => headers.findIndex((h) => aliases.includes(h));
  const questionCol = find(QUESTION_ALIASES);
  const typeCol = find(TYPE_ALIASES);
  const answerCol = find(ANSWER_ALIASES);
  const explanationCol = find(EXPLANATION_ALIASES);
  const optionCols = [];
  const ignored = [];
  headers.forEach((h, index) => {
    const match = OPTION_PATTERN.exec(h);
    if (match) optionCols.push({ index, number: Number(match[1]) });
    else if (![questionCol, typeCol, answerCol, explanationCol].includes(index) && h) ignored.push(records[0][index].trim());
  });
  optionCols.sort((a, b) => a.number - b.number);

  const missing = [];
  if (questionCol < 0) missing.push('問題文(question)');
  if (answerCol < 0) missing.push('正解(correct_option)');
  if (optionCols.length < 2) missing.push('選択肢(選択肢1, 選択肢2 …)を2列以上');
  if (missing.length) {
    result.errors.push({ row: 1, message: `ヘッダに必要な列がありません: ${missing.join('、')}` });
    return result;
  }

  result.format = typeCol >= 0 ? 'new' : 'legacy';
  if (ignored.length) {
    const imageColumns = ignored.filter((h) => IMAGE_ALIASES.includes(normalizeHeader(h)));
    if (imageColumns.length) result.warnings.push(`「${imageColumns.join('」「')}」列は使用しません。画像は登録画面でアップロードします`);
    const others = ignored.filter((h) => !IMAGE_ALIASES.includes(normalizeHeader(h)));
    if (others.length) result.warnings.push(`未対応の列を無視しました: ${others.join('、')}`);
  }

  records.slice(1).forEach((record, offset) => {
    const row = offset + 2;
    if (record.every((cell) => !String(cell).trim())) return;
    const errors = [];
    const questionText = String(record[questionCol] ?? '').trim();
    if (!questionText) errors.push('問題文が空です');

    const type = typeCol >= 0 ? parseQuestionType(record[typeCol]) : 'single';
    if (type === null) errors.push(`問題種別「${String(record[typeCol]).trim()}」は使えません(単一選択 / 画像付き)`);

    const values = optionCols.map((col) => String(record[col.index] ?? '').trim());
    let last = values.length;
    while (last > 0 && !values[last - 1]) last -= 1;
    const options = values.slice(0, last);
    const gap = options.findIndex((v) => !v);
    if (gap >= 0) errors.push(`選択肢${optionCols[gap].number}が空で、後ろの選択肢があります`);
    if (options.length < 2) errors.push('選択肢は2つ以上必要です');

    const answerText = String(record[answerCol] ?? '').normalize('NFKC').trim();
    const answer = /^\d+$/.test(answerText) ? Number(answerText) : NaN;
    if (!Number.isInteger(answer) || answer < 1) errors.push(`正解「${answerText}」は選択肢の番号(1〜)で指定してください`);
    else if (answer > options.length) errors.push(`正解 ${answer} が選択肢の数 ${options.length} を超えています`);

    if (errors.length) {
      errors.forEach((message) => result.errors.push({ row, message }));
      return;
    }
    result.questions.push({
      row,
      question_text: questionText,
      options,
      correct_option: answer,
      question_type: type,
      explanation: explanationCol >= 0 ? String(record[explanationCol] ?? '').trim() : '',
    });
  });

  if (!result.questions.length && !result.errors.length) {
    result.errors.push({ row: null, message: 'CSVに問題がありません' });
  }
  return result;
}

export function validateQuizImage(file) {
  if (!file) return '画像が選択されていません';
  if (!QUIZ_IMAGE_TYPES.includes(file.type)) return '画像は PNG / JPEG / WebP / GIF のみ使えます';
  if (file.size > QUIZ_IMAGE_MAX_BYTES) return `画像は4MB以下にしてください(現在 ${(file.size / 1024 / 1024).toFixed(1)}MB)`;
  return '';
}

export const QUIZ_CSV_SPEC = `【CSVの仕様(理解度チェックテスト用)】
- 文字コードはUTF-8、区切りはカンマ、1行目はヘッダ行、2行目以降が問題(1行=1問)。
- 列(ヘッダ名はこの通りに書く。列の順番は自由):
  - 問題種別: 「単一選択」または「画像付き」。空欄は「単一選択」として扱う。
    「画像付き」の問題は、CSVを登録する画面で画像を後からアップロードするため、CSVには画像のURLやファイル名を書かない。
  - 問題文: 問題の本文。
  - 選択肢1, 選択肢2, 選択肢3 …: 選択肢の本文。2個以上、個数は問題ごとに違ってよい(右に増やしてよい)。使わない列は空欄にし、途中に空欄を挟まない(選択肢2が空で選択肢3があるのはエラー)。
  - 正解: 正解の選択肢の番号(1から始まる半角数字)。選択肢の数を超えてはいけない。
  - 解説(任意): 採点後に表示する解説文。1〜2文程度。列自体を省略しても、空欄でもよい(空欄の問題は解説を表示しない)。
- 本文にカンマ・改行・ダブルクォートを含むセルは、全体を「"」で囲み、セル内の「"」は「""」と書く。
- 旧形式(ヘッダが question, option_1〜option_4, correct_option)も読み込めるが、新しく作る場合は上の形式にする。`;

/**
 * Builds a prompt that can be pasted into any chat AI to create or repair a quiz CSV.
 * `errors` come from parseQuizCsv; `csvText` is the uploaded file content.
 */
export function buildAiFixPrompt({ errors = [], warnings = [], csvText = '', fileName = '' } = {}) {
  const lines = ['あなたは、学習サイトの「理解度チェックテスト」用CSVを作成・修正するアシスタントです。', '', QUIZ_CSV_SPEC, ''];
  if (csvText) {
    lines.push('【依頼】');
    lines.push('下の「アップロードしたCSV」を上の仕様に合わせて修正してください。エラーが出ている箇所を直し、問題文・選択肢・正解の内容は、直す必要がある所以外は変えないでください。');
    lines.push('エラー内容から正解が判断できない場合は、勝手に決めず、確認したい点を質問してください。');
    lines.push('', '【出力形式】', '1. 直した箇所の一覧(何行目を、どう直したか)', '2. 修正後のCSV全体を、コピーしやすいようコードブロック1つで出力', '');
    lines.push('【画面に表示されたエラー】');
    if (errors.length) errors.forEach((e) => lines.push(`- ${e.row ? `${e.row}行目: ` : ''}${e.message}`));
    else lines.push('(エラーなし)');
    if (warnings.length) { lines.push('', '【注意】'); warnings.forEach((w) => lines.push(`- ${w}`)); }
    lines.push('', `【アップロードしたCSV${fileName ? `(${fileName})` : ''}】`, '```csv', csvText.replace(/\r\n?/g, '\n').trimEnd(), '```');
  } else {
    lines.push('【依頼】');
    lines.push('これからテキスト・Excel・PDFなどで渡す問題を、上の仕様のCSVに変換してください。');
    lines.push('図や画像が必要な問題は問題種別を「画像付き」にしてください。', '', '【出力形式】', '修正後のCSV全体を、コピーしやすいようコードブロック1つで出力してください。', '', '【変換したい問題】', '(ここに問題を貼り付け)');
  }
  return lines.join('\n');
}
