import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function VideoQuiz({ videoId, onResult }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    setQuestions([]); setAnswers({}); setStarted(false); setResult(null);
    setLoaded(false); setLoadError(''); setSubmitError('');
    if (!isSupabaseConfigured || !supabase || !videoId) return;
    supabase.rpc('get_video_quiz', { p_video_id: videoId }).then(({ data, error }) => {
      setQuestions(data || []);
      setLoadError(error?.message || '');
      setLoaded(true);
    });
  }, [videoId]);

  const retry = () => {
    setAnswers({}); setResult(null); setSubmitError(''); setStarted(true);
  };

  const submit = async () => {
    if (Object.keys(answers).length !== questions.length) return;
    setBusy(true); setSubmitError('');
    const { data, error } = await supabase.rpc('submit_video_quiz_with_results', {
      p_video_id: videoId,
      p_answers: answers,
    });
    setBusy(false);
    if (error) {
      setSubmitError(`採点できませんでした: ${error.message}`);
      return;
    }
    if (!data?.[0]) {
      setSubmitError('採点結果を取得できませんでした。もう一度お試しください。');
      return;
    }
    setResult(data[0]);
    onResult?.(data[0]);
  };

  if (!isSupabaseConfigured || !loaded) return null;
  if (loadError) return <section className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-xs text-rose-200">理解度チェックを読み込めませんでした: {loadError}</section>;
  if (!questions.length) return <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-xs text-slate-400">この講座には、まだ理解度チェックが登録されていません。動画受講プラン・公開日・問題設定を確認してください。</section>;

  return <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h3 className="font-bold text-white">理解度チェック</h3><p className="mt-1 text-xs text-slate-400">何度でも挑戦できます。</p></div>
      {!started && <button type="button" onClick={() => setStarted(true)} className="rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950">挑戦する（{questions.length}問）</button>}
    </div>
    {submitError && <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{submitError}</p>}
    {result && <div className="space-y-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
      <p>今回の得点: <b>{result.score} / {result.total_questions}点</b>　最高得点: <b>{result.best_score}点</b></p>
      <div className="space-y-3">
        {questions.map((question, index) => {
          const correctOption = Number(result.correct_answers?.[question.id]);
          const selectedOption = Number(answers[question.id]);
          const correct = selectedOption === correctOption;
          return <div key={question.id} className={`rounded-xl border p-3 ${correct ? 'border-emerald-400/30 bg-emerald-500/10' : 'border-rose-400/30 bg-rose-500/10'}`}>
            <p className="font-semibold text-white">{index + 1}. {correct ? '正解' : '不正解'} — {question.question_text}</p>
            <p className="mt-1 text-xs">あなたの回答: {selectedOption}. {question.options?.[selectedOption - 1] || '未回答'}</p>
            {!correct && <p className="mt-1 text-xs text-emerald-200">正解: {correctOption}. {question.options?.[correctOption - 1]}</p>}
          </div>;
        })}
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={retry} className="rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950">もう一度挑戦する</button>
        <button type="button" onClick={() => { setStarted(false); setResult(null); setAnswers({}); }} className="rounded-xl border border-slate-600 px-4 py-2 text-xs font-bold text-slate-200">終了する</button>
      </div>
    </div>}
    {started && !result && <div className="space-y-5">
      {questions.map((question, index) => <fieldset key={question.id} className="border-t border-slate-800 pt-4">
        <legend className="text-sm font-semibold text-white">{index + 1}. {question.question_text}</legend>
        <div className="mt-3 grid gap-2">{(question.options || []).map((option, optionIndex) => <label key={optionIndex} className={`cursor-pointer rounded-xl border p-3 text-xs ${answers[question.id] === optionIndex + 1 ? 'border-cyan-400 bg-cyan-400/10 text-cyan-100' : 'border-slate-700 text-slate-300'}`}>
          <input className="sr-only" type="radio" name={question.id} checked={answers[question.id] === optionIndex + 1} onChange={() => setAnswers({ ...answers, [question.id]: optionIndex + 1 })} />
          {optionIndex + 1}. {option}
        </label>)}</div>
      </fieldset>)}
      <button type="button" disabled={busy || Object.keys(answers).length !== questions.length} onClick={submit} className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-sm font-bold text-white disabled:opacity-50">{busy ? '採点中…' : '回答を送信して採点'}</button>
    </div>}
  </section>;
}
