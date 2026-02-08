// src/components/Checklist.tsx
import React from 'react'
import type { ChecklistData } from '../src/types/checklist'

/* ===== Props ===== */
type Props = {
  data: ChecklistData
}

/* ===== チェックマークSVG ===== */
const CheckCircleIcon = ({ strokeColor }: { strokeColor: string }) => {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="block"
    >
      <circle
        cx="12"
        cy="12"
        r="11"
        stroke={strokeColor}
        strokeWidth="2"
        fill="white"
      />
      <path
        d="M7 12.5L10.2 15.5L17 8.5"
        stroke={strokeColor}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ===== Component ===== */
export const Checklist = ({ data }: Props) => {
  const {
    type = 'card',
    backgroundColor = '#FFF9EF',
    textColor = '#111111',
    items,
  } = data

  const isCard = type === 'card'

  return (
    <section className="px-4">
      {/* ===== CARD ===== */}
      {isCard && (
        <div
          className="max-w-[560px] mx-auto rounded-[20px] p-6"
          style={{ backgroundColor }}
        >
          <ChecklistItems items={items} textColor={textColor} />
        </div>
      )}

      {/* ===== BAND ===== */}
      {!isCard && (
        <div
          className="w-full py-10"
          style={{ backgroundColor }}
        >
          <div className="max-w-[560px] mx-auto px-6">
            <ChecklistItems items={items} textColor={textColor} />
          </div>
        </div>
      )}
    </section>
  )
}

/* ===== Items ===== */
const ChecklistItems = ({
  items,
  textColor,
}: {
  items: string[]
  textColor: string
}) => {
  return (
    <div className="flex justify-center">
      <div className="w-fit">
        <ul className="list-none space-y-4">
          {items.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-3"
            >
              <span className="flex-shrink-0 px-[2px]">
                <CheckCircleIcon strokeColor={textColor} />
              </span>

              <span
                className="text-[15px] pl-[5px] leading-relaxed font-medium"
                style={{ color: textColor }}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
