// components/QuizImportPanel.js
// Admin UI for the understanding-check CSV: validate -> attach images -> register.
import { useEffect, useMemo, useRef, useState } from 'react';
import { parseQuizCsv, validateQuizImage, buildAiFixPrompt, QUIZ_IMAGE_EXTENSIONS } from '../lib/quizCsv';

const TEMPLATE_CSV = '﻿問題種別,問題文,選択肢1,選択肢2,選択肢3,選択肢4,選択肢5,正解,解説\r\n'
  + '単一選択,日本の首都はどこですか。,大阪,東京,京都,名古屋,,2,日本の首都は東京です。\r\n'
  + '画像付き,図の地形の名称はどれですか。,扇状地,三角州,砂州,,,1,\r\n';

const typeLabel = { single: '単一選択', image: '画像付き' };

export default function QuizImportPanel({ video, quizSource, quizSourceLoading, onDownload, onImported, showNotice, supabase }) {
  const [parsed, setParsed] = useState(null);
  const [fileName, setFileName] = useState('');
  const [csvText, setCsvText] = useState('');
  const [images, setImages] = useState({});
  const [imageErrors, setImageErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [dragRow, setDragRow] = useState(null);
  const [promptCopied, setPromptCopied] = useState(false);
  const previewUrls = useRef({});
  const fileInputRef = useRef(null);

  const revokePreviews = () => {
    Object.values(previewUrls.current).forEach((url) => URL.revokeObjectURL(url));
    previewUrls.current = {};
  };
  useEffect(() => revokePreviews, []);

  const reset = () => {
    revokePreviews();
    setParsed(null); setFileName(''); setCsvText(''); setImages({}); setImageErrors({});
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  // Another lecture was opened in the modal.
  useEffect(() => { reset(); }, [video?.id]);

  const handleCsvSelected = async (event) => {
    const file = event.target.files?.[0];
    reset();
    if (!file) return;
    const text = (await file.text()).replace(/^﻿/, '');
    setFileName(file.name);
    setCsvText(text);
    setParsed(parseQuizCsv(text));
  };

  const setImage = (row, file) => {
    const message = validateQuizImage(file);
    setImageErrors((prev) => ({ ...prev, [row]: message }));
    if (message) return;
    if (previewUrls.current[row]) URL.revokeObjectURL(previewUrls.current[row]);
    previewUrls.current[row] = URL.createObjectURL(file);
    setImages((prev) => ({ ...prev, [row]: file }));
  };
  const removeImage = (row) => {
    if (previewUrls.current[row]) URL.revokeObjectURL(previewUrls.current[row]);
    delete previewUrls.current[row];
    setImages((prev) => { const next = { ...prev }; delete next[row]; return next; });
    setImageErrors((prev) => ({ ...prev, [row]: '' }));
  };

  const imageRows = useMemo(() => (parsed?.questions || []).filter((q) => q.question_type === 'image'), [parsed]);
  const missingImages = imageRows.filter((q) => !images[q.row]).length;
  const canRegister = Boolean(parsed && !parsed.errors.length && parsed.questions.length && !missingImages && !busy);

  const downloadTemplate = () => {
    const url = URL.createObjectURL(new Blob([TEMPLATE_CSV], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'understanding-check-template.csv'; link.click();
    URL.revokeObjectURL(url);
  };

  // Prompt for a chat AI: spec + the error text + the uploaded CSV (spec only before a file is chosen).
  const aiPrompt = useMemo(
    () => buildAiFixPrompt({ errors: parsed?.errors || [], warnings: parsed?.warnings || [], csvText, fileName }),
    [parsed, csvText, fileName],
  );
  const copyAiPrompt = async () => {
    try {
      await navigator.clipboard.writeText(aiPrompt);
    } catch {
      const area = document.createElement('textarea');
      area.value = aiPrompt; document.body.appendChild(area); area.select();
      try { document.execCommand('copy'); } finally { document.body.removeChild(area); }
    }
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2500);
  };

  const handleRegister = async () => {
    if (!canRegister || !supabase) return;
    setBusy(true);
    const uploaded = [];
    try {
      const questions = [];
      for (const question of parsed.questions) {
        let imagePath = null;
        if (question.question_type === 'image') {
          const file = images[question.row];
          const extension = QUIZ_IMAGE_EXTENSIONS[file.type] || 'png';
          imagePath = `${video.id}/${crypto.randomUUID()}.${extension}`;
          const { error } = await supabase.storage.from('quiz-images').upload(imagePath, file, { contentType: file.type, upsert: false });
          if (error) throw new Error(`${question.row}行目の画像をアップロードできませんでした: ${error.message}`);
          uploaded.push(imagePath);
        }
        questions.push({
          question_text: question.question_text,
          options: question.options,
          correct_option: question.correct_option,
          question_type: question.question_type,
          image_path: imagePath,
          explanation: question.explanation || '',
        });
      }
      const { data: oldPaths, error } = await supabase.rpc('replace_video_quiz', {
        p_video_id: video.id, p_file_name: fileName, p_csv: csvText, p_questions: questions,
      });
      if (error) throw error;
      if (Array.isArray(oldPaths) && oldPaths.length) {
        await supabase.storage.from('quiz-images').remove(oldPaths).catch(() => {});
      }
      showNotice(`${questions.length}問の理解度チェックを登録しました`);
      reset();
      onImported?.();
    } catch (error) {
      // Nothing was replaced: drop the images uploaded in this attempt.
      if (uploaded.length) await supabase.storage.from('quiz-images').remove(uploaded).catch(() => {});
      showNotice(error.message || 'CSVの登録に失敗しました。既存の問題は変更されていません。');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3 rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
      <div className="space-y-1">
        <p className="font-bold text-cyan-300">理解度チェック CSV</p>
        <p className="text-[11px] leading-relaxed text-slate-400">
          新形式: 問題種別(単一選択 / 画像付き)、問題文、選択肢1〜N(何個でも可)、正解(選択肢の番号)。
          旧形式(question, option_1〜4, correct_option)もそのまま登録できます。形式は自動で判定します。
          「画像付き」の行には、CSVの確認後に画像をアップロードします(4MBまで)。再登録するとこの講座の問題を置き換えます。
        </p>
        <button type="button" onClick={downloadTemplate} className="text-[11px] font-bold text-cyan-300 underline underline-offset-2">テンプレートCSVをダウンロード</button>
      </div>

      <input ref={fileInputRef} type="file" accept=".csv,text/csv" onChange={handleCsvSelected} className="block w-full min-w-0 rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-slate-300" />

      {imageRows.length > 0 && (
        <div className="space-y-2 rounded-xl border border-amber-400/40 bg-amber-500/5 p-3 text-xs">
          <p className="font-bold text-amber-200">画像アップロード({imageRows.length}枚必要 / 選択済み {imageRows.length - missingImages}枚)</p>
          {imageRows.map((question, index) => (
            <div
              key={question.row}
              onDragOver={(event) => { event.preventDefault(); setDragRow(question.row); }}
              onDragLeave={() => setDragRow(null)}
              onDrop={(event) => { event.preventDefault(); setDragRow(null); setImage(question.row, event.dataTransfer.files?.[0]); }}
              className={`rounded-lg border border-dashed p-2.5 ${dragRow === question.row ? 'border-cyan-400 bg-cyan-400/10' : images[question.row] ? 'border-slate-600 bg-slate-900' : 'border-amber-400/70 bg-amber-500/10'}`}
            >
              <p className="mb-1.5 truncate text-[11px] text-slate-300">
                <span className="mr-1.5 font-bold text-amber-200">画像{index + 1}</span>
                {question.row}行目: {question.question_text}
              </p>
              {images[question.row] ? (
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-slate-200">{images[question.row].name}</p>
                    <p className="text-[11px] text-slate-500">{(images[question.row].size / 1024).toFixed(0)}KB</p>
                  </div>
                  <button type="button" onClick={() => removeImage(question.row)} className="rounded-lg border border-slate-600 px-2 py-1 text-[11px] text-slate-300">外す</button>
                </div>
              ) : (
                <label className="block cursor-pointer py-1 text-center font-bold text-amber-200">
                  <span className="underline underline-offset-2">画像を選択</span>またはここにドラッグ&ドロップ
                  <span className="mt-0.5 block text-[10px] font-normal text-amber-200/80">PNG / JPEG / WebP / GIF、4MBまで</span>
                  <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" onChange={(event) => { setImage(question.row, event.target.files?.[0]); event.target.value = ''; }} />
                </label>
              )}
              {imageErrors[question.row] && <p role="alert" className="mt-1.5 text-rose-300">{imageErrors[question.row]}</p>}
            </div>
          ))}
        </div>
      )}

      <div className={`space-y-2 rounded-xl border p-3 text-xs ${parsed?.errors?.length ? 'border-amber-400/40 bg-amber-500/10' : 'border-slate-800 bg-slate-900'}`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-bold text-slate-200">{parsed?.errors?.length ? 'AIにCSVの修正を任せる' : 'AIでCSVを作る・直す'}</p>
          <button type="button" onClick={copyAiPrompt} className="rounded-lg bg-cyan-500 px-3 py-1.5 font-bold text-slate-950 transition hover:bg-cyan-400">{promptCopied ? 'コピーしました' : 'AI用プロンプトをコピー'}</button>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-400">
          {csvText
            ? 'CSVの仕様、いま出ているエラー、選んだCSVの中身が入っています。コピーしてChatGPTやClaudeなどに貼り付けるだけで、修正後のCSVが返ってきます。'
            : 'CSVの仕様が入っています。コピーしてChatGPTやClaudeなどに貼り付け、問題を渡すとCSVを作ってもらえます。エラーが出たときは、CSVを選ぶと、エラーと中身も入ったプロンプトになります。'}
        </p>
        <details>
          <summary className="cursor-pointer text-[11px] font-bold text-cyan-300">プロンプトの内容を見る</summary>
          <textarea readOnly value={aiPrompt} rows={10} onFocus={(event) => event.target.select()} className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 font-mono text-[11px] leading-relaxed text-slate-300" />
        </details>
      </div>

      {parsed && (
        <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {parsed.format && <span className="rounded-full bg-cyan-500/15 px-2 py-0.5 font-bold text-cyan-200">{parsed.format === 'new' ? '新形式' : '旧形式'}として読み込みました</span>}
            <span className="text-slate-300">{parsed.questions.length}問{imageRows.length ? `(うち画像付き ${imageRows.length}問)` : ''}</span>
          </div>

          {parsed.warnings.map((warning) => <p key={warning} className="text-amber-300">注意: {warning}</p>)}

          {parsed.errors.length > 0 && (
            <div role="alert" className="space-y-1 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-rose-200">
              <p className="font-bold">修正が必要です(ヘッダ行を1行目とした番号です)。直して選び直してください。</p>
              <ul className="list-disc space-y-0.5 pl-5">
                {parsed.errors.slice(0, 30).map((error, index) => <li key={index}>{error.row ? `${error.row}行目: ` : ''}{error.message}</li>)}
              </ul>
              {parsed.errors.length > 30 && <p>ほか {parsed.errors.length - 30} 件</p>}
            </div>
          )}

          {parsed.questions.length > 0 && (
            <div className="max-h-96 space-y-2 overflow-auto pr-1">
              {parsed.questions.map((question, index) => (
                <div key={question.row} className="space-y-2 rounded-lg border border-slate-800 bg-slate-950 p-3">
                  <p className="font-bold text-slate-200">
                    <span className="mr-2 text-slate-500">{index + 1}.</span>{question.question_text}
                    <span className="ml-2 rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-normal text-slate-300">{typeLabel[question.question_type]}</span>
                  </p>
                  <ol className="space-y-0.5 text-[11px] text-slate-400">
                    {question.options.map((option, optionIndex) => (
                      <li key={optionIndex} className={optionIndex + 1 === question.correct_option ? 'font-bold text-emerald-300' : ''}>
                        {optionIndex + 1}. {option}{optionIndex + 1 === question.correct_option ? '(正解)' : ''}
                      </li>
                    ))}
                  </ol>
                  {question.explanation && <p className="text-[11px] text-slate-400">解説: {question.explanation}</p>}
                  {question.question_type === 'image' && (
                    images[question.row]
                      ? <img src={previewUrls.current[question.row]} alt="アップロードした画像のプレビュー" className="max-h-40 rounded-md bg-slate-800 object-contain" />
                      : <p className="rounded-md border border-dashed border-amber-400/50 px-2 py-1 text-[11px] text-amber-200">画像: 未選択(上の「画像アップロード」で選んでください)</p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button type="button" disabled={!canRegister} onClick={handleRegister} className="rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 disabled:opacity-50">{busy ? '登録中…' : '登録する'}</button>
            <button type="button" disabled={busy} onClick={reset} className="rounded-xl border border-slate-600 px-4 py-2 text-xs font-bold text-slate-300 disabled:opacity-50">やり直す</button>
            {missingImages > 0 && <span className="text-amber-300">画像が未選択の問題が {missingImages} 問あります</span>}
          </div>
        </div>
      )}

      {quizSourceLoading && <p className="text-xs text-slate-400">登録済みCSVを読み込み中…</p>}
      {quizSource && (
        <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900 p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold text-slate-200">登録済み: {quizSource.file_name || '理解度チェックCSV'}</p>
              <p className="text-[11px] text-slate-500">{quizSource.updated_at ? new Date(quizSource.updated_at).toLocaleString('ja-JP') : ''}</p>
            </div>
            <button type="button" onClick={onDownload} className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-cyan-200 transition hover:bg-cyan-500/20">CSVをダウンロード</button>
          </div>
          <details>
            <summary className="cursor-pointer text-xs font-bold text-cyan-300">CSVをプレビュー</summary>
            <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-slate-950 p-3 text-[11px] leading-relaxed text-slate-300">{quizSource.csv_content}</pre>
          </details>
        </div>
      )}
      {!quizSourceLoading && !quizSource && <p className="text-xs text-slate-500">この動画には登録済みCSVがありません。</p>}
    </div>
  );
}
