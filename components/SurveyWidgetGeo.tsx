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
    options: ['高校１年生', '高校２年生', '高校３年生', '既卒生'],
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
  const [mode, setMode] = useState<'menu' | 'form'>('menu');

  const [visible, setVisible] = useState(false);
  const [scrollStarted, setScrollStarted] = useState(false);

  // ▼ 初期位置 bottom = 0（画面最下部）
  const [dynamicBottom, setDynamicBottom] = useState(0);

  // ▼ 表示開始
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollStarted) {
        setScrollStarted(true);
        setTimeout(() => setVisible(true), 1000);
      }
    };
    window.addEventListener('scroll', handleScroll, { once: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollStarted]);

  // ▼ フッター干渉チェック
  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const overlap = window.innerHeight - entry.boundingClientRect.top;
          setDynamicBottom(overlap + 20); // フッター回避
        } else {
          setDynamicBottom(0); // ← 画面最下部ぴったり！
        }
      },
      { root: null, threshold: 0 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const current = questions[step];
  const selected = answers[step];
  const progress = Math.round((step / questions.length) * 100);

  const handleChoice = (opt: string) => {
    if (!current.options) return;
    const prev = answers[step];
    if (Array.isArray(prev)) {
      setAnswers({
        ...answers,
        [step]: prev.includes(opt)
          ? prev.filter((o) => o !== opt)
          : [...prev, opt],
      });
    } else {
      setAnswers({ ...answers, [step]: [opt] });
    }
  };

  const handleText = (val: string) => setAnswers({ ...answers, [step]: val });

  const handleNext = async () => {
    if (step < questions.length - 1) return setStep(step + 1);

    setLoading(true);
    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          answers: questions.map((q, i) => ({
            key: q.question,
            value: Array.isArray(answers[i])
              ? (answers[i] as string[]).join(', ')
              : (answers[i] as string) || '',
          })),
        }),
      });
      setCompleted(true);
    } catch (err) {
      alert('送信中にエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  const designVars = {
    '--color-primary': primaryColor,
    '--color-primary-dark': primaryDark,
    '--color-secondary': secondaryColor,
    '--color-secondary-dark': secondaryDark,
    '--color-bg-light': bgLight,
    bottom: `${dynamicBottom}px`, // ← 完全に動的化
  } as React.CSSProperties;

  // --- menu ---
  if (mode === 'menu') {
    return (
      <div className={`${styles.widget} ${styles.hiddenRight}`} style={designVars}>
        <div className={styles.header}>お問い合わせ方法を選択</div>
        <div className={styles.body} style={{ textAlign: 'center' }}>
          <button className={styles.lineBtn} onClick={() => window.open('https://lin.ee/Nwh2C8u', '_blank')}>
            LINEで問い合わせる
          </button>
          <button className={styles.mailBtn} onClick={() => setMode('form')}>
            メールで問い合わせる
          </button>
        </div>
      </div>
    );
  }

  // --- form ---
  return (
    <div className={`${styles.widget} ${styles.slideIn}`} style={designVars}>
      <div className={styles.header}>
        お問い合わせ
        <button className={styles.closeBtn} onClick={() => setMode('menu')}>×</button>
      </div>

      <div className={styles.body}>
        {completed ? (
          <div className={styles.completed}>
            <p>回答完了しました。ありがとうございます！</p>
            <button className={styles.retryBtn} onClick={() => { setCompleted(false); setStep(0); }}>
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
                {current.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleChoice(opt)}
                    className={Array.isArray(selected) && selected.includes(opt) ? styles.selected : ''}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* 入力 */}
            {(current.type === 'text' || current.type === 'email') && (
              <div className={styles.inputWrap}>
                {current.type === 'text' ? (
                  <textarea value={String(selected || '')} onChange={(e) => handleText(e.target.value)} />
                ) : (
                  <input type="email" value={String(selected || '')} onChange={(e) => handleText(e.target.value)} />
                )}
              </div>
            )}

            {/* navigation */}
            <div className={styles.nav}>
              {step > 0 && <button className={styles.prevBtn} onClick={() => setStep(step - 1)}>◀ 戻る</button>}
              <button
                className={styles.nextBtn}
                onClick={handleNext}
                disabled={current.required && !selected?.toString().trim()}
              >
                {step < questions.length - 1 ? '次へ ▶' : loading ? '送信中…' : '送信'}
              </button>
            </div>

            {/* progress */}
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
  );
}
