'use client';
import { useEffect, useState } from 'react';
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
      '中学１年生',
      '中学２年生',
      '中学３年生',
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
      'もっと家で勉強するようになってほしい',
      '学校の定期試験対策をしたい',
      '英検対策をしたい',
      '受験対策をしたい',
      '部活や習い事と両立したい',
      '学校や塾での指導が子どもに合っていない',
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
  bgLight?: string;
};

export default function SurveyWidget({
  primaryColor = 'orange',
  primaryDark = 'darkorange',
  bgLight = '#eee',
}: SurveyWidgetProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  // mode: menu = LINE/メール選択, form = フォーム表示
  const [mode, setMode] = useState<'menu' | 'form' | null>(null);

  // visible: 判定が終わったら true にして CSS の非表示を上書きする
  const [visible, setVisible] = useState(false);

  // debug モードは URL に ?survey_debug=1 を付けると on
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      setDebugMode(urlParams.get('survey_debug') === '1');
    } catch (e) {
      setDebugMode(false);
    }
  }, []);

  useEffect(() => {
    const detectDevice = () => {
      const inner = window.innerWidth || 0;
      const vw = window.visualViewport?.width ?? inner;
      const mm = (() => {
        try {
          return window.matchMedia('(max-width: 768px)').matches;
        } catch (e) {
          return false;
        }
      })();

      const isMobile = vw <= 768 || mm;

      if (debugMode) {
        console.debug('[SurveyWidget] detectDevice:', { inner, vw, matchMedia: mm, isMobile });
      }

      setMode(isMobile ? 'menu' : 'form');

      // safety: visible を遅延して set（CSS transition のため）
      setTimeout(() => setVisible(true), 50);
    };

    // initial detect inside useEffect to avoid SSR mismatch
    detectDevice();

    // listen to visualViewport resize if available (iOS address bar, pinch zoom)
    if (window.visualViewport && typeof window.visualViewport.addEventListener === 'function') {
      window.visualViewport.addEventListener('resize', detectDevice);
    }

    // fallback resize
    window.addEventListener('resize', detectDevice);

    return () => {
      if (window.visualViewport && typeof window.visualViewport.removeEventListener === 'function') {
        window.visualViewport.removeEventListener('resize', detectDevice);
      }
      window.removeEventListener('resize', detectDevice);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debugMode]);

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

  // ---- 判定が終わるまで描画しない（初期チラつき防止） ----
  if (mode === null) return null;

  // Build CSS variable style object (and override visibility if necessary)
  const cssVars: React.CSSProperties = {
    // custom properties used by SurveyWidget.module.css
    '--color-primary': primaryColor,
    '--color-primary-dark': primaryDark,
    '--color-bg-light': bgLight,
  } as React.CSSProperties;

  // Visibility override: in case global CSS has opacity:0/transform, force visible
  const visibleOverride: React.CSSProperties = visible
    ? {
        opacity: 1,
        transform: 'translateX(0)',
        transition: 'all 0.35s ease',
      }
    : {
        opacity: 0,
        transform: 'translateX(10%)',
        transition: 'all 0.35s ease',
      };

  // Small debug panel toggle (only shown when ?survey_debug=1 is present)
  const DebugPanel = () => {
    if (!debugMode) return null;
    const inner = typeof window !== 'undefined' ? window.innerWidth : 0;
    const vw = typeof window !== 'undefined' ? (window.visualViewport?.width ?? inner) : inner;
    const mm = typeof window !== 'undefined' ? (() => {
      try { return window.matchMedia('(max-width: 768px)').matches; } catch { return false; }
    })() : false;
    return (
      <div
        style={{
          position: 'fixed',
          left: 12,
          bottom: 12,
          zIndex: 99999,
          padding: 8,
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          fontSize: 12,
          borderRadius: 6,
          maxWidth: 360,
        }}
      >
        <div style={{fontWeight: 'bold', marginBottom: 6}}>SurveyWidget Debug</div>
        <div>mode: {mode}</div>
        <div>visible: {String(visible)}</div>
        <div>innerWidth: {inner}px</div>
        <div>visualViewport.width: {vw}px</div>
        <div>matchMedia('(max-width:768px)'): {String(mm)}</div>
        <div style={{marginTop:6, opacity:0.8}}>Note: ?survey_debug=1 を URL に付けて表示</div>
      </div>
    );
  };

  // --- スマホ幅 UI（LINE / メール選択） ---
  if (mode === 'menu') {
    return (
      <>
        <div
          className={`${styles.widget} ${styles.half}`}
          style={{ ...cssVars, ...visibleOverride }}
          data-testid="survey-widget"
        >
          <div className={styles.header}>お問い合わせ方法を選択</div>
          <div className={styles.body} style={{ textAlign: 'center' }}>
            <button
              className={styles.lineBtn}
              onClick={() =>
                window.open('https://lin.ee/Nwh2C8u', '_blank', 'noopener,noreferrer')
              }
            >
              LINEで問い合わせる
            </button>
            <button className={styles.mailBtn} onClick={() => setMode('form')}>
              メールで問い合わせる
            </button>
          </div>
        </div>
        <DebugPanel />
      </>
    );
  }

  // --- PC版 / メールフォーム ---
  return (
    <>
      <div
        className={styles.widget}
        style={{ ...cssVars, ...visibleOverride }}
        data-testid="survey-widget"
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

              {current.type === 'choice' && current.options && (
                <div className={styles.options}>
                  {current.options.map((opt, idx) => {
                    const active = Array.isArray(selected) && selected.includes(opt);
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
                  {step < questions.length - 1 ? '次へ ▶' : loading ? '送信中…' : '送信'}
                </button>
              </div>

              <div className={styles.progress}>
                <span>{progress}%</span>
                <div className={styles.bar}>
                  <div className={styles.fill} style={{ width: `${progress}%` }} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <DebugPanel />
    </>
  );
}
