// components/VoicesBubble.tsx
import React from 'react'
import type { VoicesData } from '../src/types/voices'

type Props = {
  data: VoicesData
}

/* ===== ハイライト描画（順序保持） ===== */
const renderHighlightText = (
  text: string,
  highlight?: string,
  color?: string
) => {
  if (!highlight || !color || !text.includes(highlight)) {
    return text
  }

  const parts = text.split(highlight)

  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <span style={{ color }}>{highlight}</span>
          )}
        </span>
      ))}
    </>
  )
}

export const VoicesBubble = ({ data }: Props) => {
  const {
    border,
    background,
    textColor = '#000000',
    boxColor = '#ffffff',
    items,
    align,
    widthPercent = 100, 
    highlightColor,
  } = data

  const borderRadius = border?.radius ?? 10
  const borderWidth = border?.width ?? 2
  const borderColor = border?.color ?? '#000'

  /* ===== 背景 ===== */
  const bgStyle =
    background?.colors[0] === background?.colors[1]
      ? background.colors[0]
      : `linear-gradient(${
          background?.direction === 'horizontal' ? '90deg' : '180deg'
        }, ${background?.colors[0]}, ${background?.colors[1]})`

  /* ===== 三角位置 ===== */
  const getArrowStyle = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'left':
        return { left: 24 }
      case 'right':
        return { right: 24 }
      default:
        return { left: '50%', transform: 'translateX(-50%)' }
    }
  }

  /* ===== 三角サイズ ===== */
  const outerSize = borderRadius + borderWidth
  const innerSize = borderRadius + borderWidth

  return (
    <section className="px-4 py-10" style={{ background: bgStyle }}>
      <div className="max-w-[560px] mx-[15px]">
        {items.map((voice, index) => {
          const arrowAlign =
            (voice as any).align ?? align ?? 'center'

          return (
            <div
              key={index}
              className="relative mt-[26px] px-[12px] py-[10px]
                        font-bold leading-[1.7] text-center whitespace-pre-line mx-auto"
              style={{
                width: `${widthPercent}%`,
                backgroundColor: boxColor,
                color: textColor,
                borderRadius: `${borderRadius}px`,
                border: `${borderWidth}px solid ${borderColor}`,
              }}
            >

              {renderHighlightText(
                voice.text,
                (voice as any).highlight,
                highlightColor
              )}

              {/* ===== author がある場合のみ表示 ===== */}
              {voice.author && (
                <>
                  <br />
                  <span className="text-[13px] font-normal">
                    （{voice.author}）
                  </span>
                </>
              )}

              {/* ===== 三角（後ろ：枠線） ===== */}
              <span
                className="absolute w-0 h-0"
                style={{
                  ...getArrowStyle(arrowAlign),
                  bottom: -outerSize,
                  borderLeft: `${outerSize}px solid transparent`,
                  borderRight: `${outerSize}px solid transparent`,
                  borderTop: `${outerSize}px solid ${borderColor}`,
                }}
              />

              {/* ===== 三角（前：中身） ===== */}
              <span
                className="absolute w-0 h-0"
                style={{
                  ...getArrowStyle(arrowAlign),
                  bottom: -innerSize + (borderWidth + 1),
                  borderLeft: `${innerSize}px solid transparent`,
                  borderRight: `${innerSize}px solid transparent`,
                  borderTop: `${innerSize}px solid ${boxColor}`,
                }}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}
