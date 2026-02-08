import Image from 'next/image'
import Link from 'next/link'
import type {
  CTABlockData,
  CTAAnimation,
} from '../src/types/CTABlockData'

/* ===== Animation Map ===== */
const animationClassMap: Record<CTAAnimation, string> = {
  fade: 'animate-fadeIn',
  slide: 'animate-slideUp',
  pulse: 'animate-softPulse',
  shine: 'cta-shine',
  none: '',
}

type AnimationKey = keyof typeof animationClassMap

/* ===== Animation Control ===== */
const ENTRY_ANIMATIONS: CTAAnimation[] = ['fade', 'slide']
const ATTENTION_ANIMATIONS: CTAAnimation[] = ['pulse', 'shine']

const resolveAnimations = (
  animation?: CTAAnimation | readonly CTAAnimation[]
): string => {
  if (!animation) return ''

  const list = Array.isArray(animation)
    ? [...animation]
    : [animation]

  // none しかなければ何もしない
  const filtered = list.filter(a => a !== 'none')
  if (filtered.length === 0) return ''

  const result: CTAAnimation[] = []

  // entry 系は最初の1つだけ
  const entry = filtered.find(a =>
    ENTRY_ANIMATIONS.includes(a)
  )
  if (entry) {
    result.push(entry)
  }

  // attention 系は全部OK
  filtered.forEach(a => {
    if (ATTENTION_ANIMATIONS.includes(a)) {
      result.push(a)
    }
  })

  return result
    .map(a => animationClassMap[a as AnimationKey])
    .filter(Boolean)
    .join(' ')
}

/* ===== Highlight Utility（角丸背景・順序保持・改行対応） ===== */
const renderHighlightWithBg = (
  text: string,
  highlight?: string,
  bgColor?: string
) => {
  if (!highlight || !text.includes(highlight)) {
    return <span className="whitespace-pre-line">{text}</span>
  }

  const parts = text.split(highlight)

  return (
    <span className="whitespace-pre-line">
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <span
              className="inline-block px-[10px] py-[1px] mx-[3px] rounded-[6px]"
              style={{
                backgroundColor: bgColor ?? '#ffb347',
                fontWeight: 700,
              }}
            >
              {highlight}
            </span>
          )}
        </span>
      ))}
    </span>
  )
}

/* ===== Component ===== */
type Props = {
  data: CTABlockData
}

export const CTABlock = ({ data }: Props) => {
  const animationClass = resolveAnimations(data.animation)

  return (
    <section className="px-4 py-24 text-center">
      {/* ===== 主張テキスト ===== */}
      <p
        className="font-black text-[22px] leading-[1.8] mb-8"
        style={{ color: data.baseTextColor }}
      >
        {renderHighlightWithBg(
          data.mainText,
          data.highlightText,
          data.highlightBackgroundColor
        )}
      </p>

      {/* ===== 疑問テキスト ===== */}
      {data.questionText && (
        <p
          className="font-bold [&_*]:!font-bold text-[16px] mb-10 whitespace-pre-line"
          style={{ color: data.baseTextColor }}
        >
          {data.questionText}
        </p>
      )}

      {/* ===== CTA ===== */}
      <div className="flex flex-col items-center gap-6">
        <Link
          href={data.cta.url}
          className={`
            inline-flex items-center justify-center
            px-[8px] py-[4px]
            rounded-[5px]
            font-black text-[18px]
            shadow-lg
            transition
            ${animationClass}
          `}
          style={{
            backgroundColor:
              data.cta.backgroundColor ?? '#ffb347',
            color: data.buttonTextColor ?? data.baseTextColor,
          }}
        >
          {data.cta.text}
        </Link>

        {/* ===== サムネイル ===== */}
        {data.thumbnailImage && (
          <div className="flex justify-center mt-4">
            <Image
              src={data.thumbnailImage}
              alt=""
              width={96}
              height={96}
            />
          </div>
        )}
      </div>
    </section>
  )
}
