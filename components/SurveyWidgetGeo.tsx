//SurveyWidgetGeo.tsx
'use client';
import { useState, useEffect } from 'react';
import styles from './SurveyWidget.module.css';

type QA = {
  question: string;
  options?: string[];
  type?: 'choice' | 'email' | 'text';
  required?: boolean;
};

const questions: QA[] = [
  {
    question: 'お子様の現在の学年を教えてください。',
    options: [
      '高校１年生',
      '高校２年生',
      '高校３年生',
      '既卒生',
    ],
    type: 'choice',
    required: true,
  },
  {
    question: '現在のお悩みを教えてください。（複数選択可）',
    options: [
      '学校の定期試験対策をしたい',
      '大学入試共通テスト地理の対策をしたい',
      '学校や塾での指導が子どもに合っていない',
      '学校で地理の授業が開講されていない',
      'その他',
    ],
    type: 'choice',
    required: true,
  },
  {
    question: 'ご希望の内容を教えてください。（複数選択可）',
    options: [
      'カリキュラムやコースについて知りたい',
      '指導料金やお見積りについて知りたい',
      '勉強のお悩みについて簡単に相談したい',
      '講師と保護者とお子様で３者面談をしたい',
      '体験授業を受けたい',
      'その他',
    ],
    type: 'choice',
    required: true,
  },
  {
    question: '具体的にご相談したい内容がある場合は教えてください',
    type: 'text',
    required: false,
  },
  {
    question:
      'ご連絡先メールアドレスをご入力ください（回答の控えをお送りします）',
    type: 'email',
    required: true,
  },
];


type SurveyWidgetProps = {
  primaryColor?: string;
  primaryDark?: string;
  secondaryColor?: string;
  secondaryDark?: string;
  bgLight?: string;
};

export default function SurveyWidget({
  primaryColor = 'orange',
  primaryDark = 'darkorange',
  secondaryColor = 'orange',
  secondaryDark = 'darkorange',
  bgLight = '#eee',
}: SurveyWidgetProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  // mode: menu = LINE/メール選択, form = フォーム表示
  const [mode, setMode] = useState<'menu' | 'form'>('form');

  // スマホ幅なら menu から始める
  useEffect(() => {
    if (window.innerWidth <= 2000) {
      setMode('menu');
    } else {
      setMode('form');
    }
  }, []);

  const current = questions[step];
  const progress = Math.round((step / questions.length) * 100);
  const selected = answers[step];

  const handleChoice = (opt: string) => {
    if (!current.options) return;
    const prev = answers[step];
    if (Array.isArray(prev)) {
      if (prev.includes(opt)) {
        setAnswers({ ...answers, [step]: prev.filter((o) => o !== opt) });
      } else {
        setAnswers({ ...answers, [step]: [...prev, opt] });
      }
    } else {
      setAnswers({ ...answers, [step]: [opt] });
    }
  };

  const handleText = (val: string) => {
    setAnswers({ ...answers, [step]: val });
  };

  const handleNext = async () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setLoading(true);
      const payload = {
        timestamp: new Date().toISOString(),
        answers: questions.map((q, i) => ({
          key: q.question,
          value: Array.isArray(answers[i])
            ? (answers[i] as string[]).join(', ')
            : (answers[i] as string) || '',
        })),
        email: (answers[questions.length - 1] as string) || '',
      };
      try {
        const res = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        setCompleted(true);
      } catch (err) {
        console.error('送信エラー:', err);
        alert('送信中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleRetry = () => {
    setCompleted(false);
    setStep(0);
  };

  // --- お問い合わせ方法選択画面 ---
  if (mode === 'menu') {
    return (
      <div
        className={`${styles.widget} ${styles.half}`}
        style={
          {
            '--color-primary': primaryColor,
            '--color-primary-dark': primaryDark,
            '--color-secondary': secondaryColor,
            '--color-secondary-dark': secondaryDark,
            '--color-bg-light': bgLight,
          } as React.CSSProperties
        }
      >
        <div className={styles.header}>お問い合わせ方法を選択</div>
        <div className={styles.body} style={{ textAlign: 'center' }}>
          <button
            className={styles.lineBtn}
            onClick={() =>
              window.open(
                'https://lin.ee/Nwh2C8u',
                '_blank',
                'noopener,noreferrer'
              )
            }
          >
            LINEで問い合わせる
          </button>
          <button className={styles.mailBtn} onClick={() => setMode('form')}>
            メールで問い合わせる
          </button>
        </div>
      </div>
    );
  }

  // --- フォーム表示 ---
  return (
    <div
      className={styles.widget}
      style={
        {
          '--color-primary': primaryColor,
          '--color-primary-dark': primaryDark,
          '--color-secondary': secondaryColor,        // ← 追加！
          '--color-secondary-dark': secondaryDark,    // ← 追加！
          '--color-bg-light': bgLight,
        } as React.CSSProperties
      }
    >
      <div className={styles.header}>
        お問い合わせ
        <button className={styles.closeBtn} onClick={() => setMode('menu')}>
          ×
        </button>
      </div>
      <div className={styles.body}>
        {completed ? (
          <div className={styles.completed}>
            <p>回答完了しました。ありがとうございます！</p>
            <button className={styles.retryBtn} onClick={handleRetry}>
              回答を修正して再送信する
            </button>
          </div>
        ) : (
          <>
            <div className={styles.required}>
              {current.required && <span>必須</span>} {current.question}
            </div>

            {/* 選択肢 */}
            {current.type === 'choice' && current.options && (
              <div className={styles.options}>
                {current.options.map((opt, idx) => {
                  const active =
                    Array.isArray(selected) && selected.includes(opt);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleChoice(opt)}
                      className={active ? styles.selected : ''}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {/* テキスト or メール */}
            {(current.type === 'text' || current.type === 'email') && (
              <div className={styles.inputWrap}>
                {current.type === 'text' ? (
                  <textarea
                    value={typeof selected === 'string' ? selected : ''}
                    onChange={(e) => handleText(e.target.value)}
                    placeholder="ご自由にご記入ください"
                  />
                ) : (
                  <input
                    type="email"
                    value={typeof selected === 'string' ? selected : ''}
                    onChange={(e) => handleText(e.target.value)}
                    placeholder="your@email.com"
                  />
                )}
              </div>
            )}

            <div className={styles.nav}>
              {step > 0 && (
                <button className={styles.prevBtn} onClick={handlePrev}>
                  ◀ 戻る
                </button>
              )}
              <button
                className={styles.nextBtn}
                onClick={handleNext}
                disabled={current.required && !selected?.toString().trim()}
              >
                {step < questions.length - 1
                  ? '次へ ▶'
                  : loading
                  ? '送信中…'
                  : '送信'}
              </button>
            </div>

            <div className={styles.progress}>
              <span>{progress}%</span>
              <div className={styles.bar}>
                <div
                  className={styles.fill}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
