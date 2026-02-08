import Image from 'next/image'

/* ===== Item Types ===== */
type ExplainTextItem = {
  type: 'text'
  leadText: string
  highlight?: string
}

type ExplainImageItem = {
  type: 'image'
  image: string
  text: string
  highlight?: string
  imagePosition?: 'left' | 'right'
}

type ExplainStepItem = {
  type: 'step'
  label: string
  image?: string
  leadText: string
  bodyText: string
}

type ExplainItem =
  | ExplainTextItem
  | ExplainImageItem
  | ExplainStepItem

/* ===== Label ===== */
type ExplainLabel = {
  text: string
  rounded?: boolean
  textColor: string
  backgroundColor: string
}

/* ===== Block ===== */
type ExplainBlockType = 'card' | 'band' | 'block'

export type ExplainBlockData = {
  type?: ExplainBlockType
  label?: ExplainLabel
  footerText?: string

  title: string
  thumbnail?: {
    src: string
    width?: number
    height?: number
  }

  highlightColor: string
  backgroundColor: string
  boxBackgroundColor: string

  textColor: string
  boxTextColor: string

  items: ExplainItem[]
}

type Props = {
  data: ExplainBlockData
}

/* ===== Highlight Utility ===== */
const renderHighlightText = (
  text: string,
  highlight?: string,
  highlightColor?: string,
  baseColor?: string
) => {
  if (!highlight || !text.includes(highlight)) {
    return <span style={{ color: baseColor }}>{text}</span>
  }

  const parts = text.split(highlight)

  return (
    <>
      {parts.map((part, i) => (
        <span key={i} style={{ color: baseColor }}>
          {part}
          {i < parts.length - 1 && (
            <span style={{ color: highlightColor }}>{highlight}</span>
          )}
        </span>
      ))}
    </>
  )
}

/* ===== Component ===== */
export const ExplainBlock = ({ data }: Props) => {
  const type: ExplainBlockType = data.type ?? 'card'
  const isCard = type === 'card'
  const isBand = type === 'band'
  const isBlock = type === 'block'

  return (
    <section
      className="px-[4px] py-[24px]"
      style={{ background: data.backgroundColor }}
    >
      {/* ===== ラベル ===== */}
      {data.label && (
        <div className="flex justify-center mb-6">
          <h2
            className={`inline-flex items-center justify-center
              px-[10px] py-[1.5px]
              font-black text-[14px]
              ${
                data.label.rounded !== false
                  ? 'rounded-full'
                  : 'rounded-none'
              }`}
            style={{
              color: data.label.textColor,
              backgroundColor: data.label.backgroundColor,
            }}
          >
            {data.label.text}
          </h2>
        </div>
      )}

      {/* ===== タイトル ===== */}
      <h2
        className="text-center font-black text-[22px] leading-[1.7] mb-12 whitespace-pre-line"
        style={{ color: data.textColor }}
      >
        {data.title}
      </h2>

      {/* ===== CARD ===== */}
      {isCard && (
        <div
          className="max-w-[720px] mx-auto rounded-[24px] p-[12px]"
          style={{ backgroundColor: data.boxBackgroundColor }}
        >
          <ExplainItems data={data} />
        </div>
      )}

      {/* ===== BAND ===== */}
      {isBand && (
        <div
          className="w-full px-4 py-12"
          style={{ backgroundColor: data.boxBackgroundColor }}
        >
          <div className="max-w-[720px] mx-auto">
            <ExplainItems data={data} />
          </div>
        </div>
      )}

      {/* ===== BLOCK（NEW） ===== */}
      {isBlock && (
        <div
          className="w-full px-[4px] py-[12px]"
          style={{ backgroundColor: data.backgroundColor }}
        >
          <div
            className="w-fit mx-auto"
            style={{ backgroundColor: data.backgroundColor }}
          >
            <div className="max-w-[620px] mx-auto flex flex-col gap-[6px]">
              <ExplainItems data={data} />
            </div>
          </div>
        </div>
      )}

      {/* ===== フッター ===== */}
      {data.footerText && (
        <h2
          className="mt-16 text-center font-black text-[22px] leading-[1.7] whitespace-pre-line"
          style={{ color: data.textColor }}
        >
          {data.footerText}
        </h2>
      )}
    </section>
  )
}

/* ===== Items ===== */
const ExplainItems = ({ data }: { data: ExplainBlockData }) => {
  return (
    <div className="flex flex-col gap-6 items-center">
      {data.items.map((item, index) => {
        /* ===== STEP ===== */
        if (item.type === 'step') {
          return (
            <div
              key={index}
              className="bg-white px-[6px] py-[6px] my-[10px] inline-block w-full"
              style={{ backgroundColor: data.boxBackgroundColor }}
            >
              <div className="flex flex-col gap-[4px] items-start">
                {/* label + image */}
                <div className="flex flex-row items-center gap-2 shrink-0">
                  <div className="w-[64px] h-[64px] flex items-center justify-center">
                    <h2 className="font-black text-[32px]">
                      {item.label}
                    </h2>
                  </div>
                  <h4 className="font-black leading-[1.6] whitespace-pre-line mb-2">
                    {item.leadText}
                  </h4>
                </div>

                {/* text */}
                <div className="flex flex-row max-w-[520px]">
                  <div className="flex-shrink-0 w-[64px] h-[64px] flex items-center justify-center">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt=""
                        width={64}
                        height={64}
                      />
                    )}
                  </div>
                  <p className="text-[14px] leading-[1.6] whitespace-pre-line">
                    {item.bodyText}
                  </p>
                </div>
              </div>
            </div>
          )
        }

        /* ===== TEXT ===== */
        if (item.type === 'text') {
          return (
            <p
              key={index}
              className="text-center font-black text-[18px] leading-[1.7] whitespace-pre-line"
            >
              {renderHighlightText(
                item.leadText,
                item.highlight,
                data.highlightColor,
                data.boxTextColor
              )}
            </p>
          )
        }

        /* ===== IMAGE ===== */
        const isLeft = item.imagePosition !== 'right'

        return (
          <div
            key={index}
            className={`flex justify-center items-center gap-6 ${
              isLeft ? 'flex-row' : 'flex-row-reverse'
            }`}
          >
            <Image
              src={item.image}
              alt=""
              width={96}
              height={96}
              className="shrink-0"
            />

            <p className="max-w-[360px] font-black leading-[1.7] whitespace-pre-line">
              {renderHighlightText(
                item.text,
                item.highlight,
                data.highlightColor,
                data.boxTextColor
              )}
            </p>
          </div>
        )
      })}
    </div>
  )
}
