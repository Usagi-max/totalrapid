/* ===== CTA Animation Type ===== */
export type CTAAnimation =
  | 'fade'
  | 'slide'
  | 'shine'
  | 'pulse'
  | 'none'

/* ===== CTA Link ===== */
export type CTALink = {
  text: string
  url: string
  backgroundColor?: string
}

export type CTABlockData = {
  baseTextColor: string

  mainText: string
  highlightText?: string
  highlightBackgroundColor?: string

  questionText?: string

  cta: CTALink

  buttonTextColor?: string
  thumbnailImage?: string

  /** CTAアニメーション（単体 / 複数 / readonly配列対応） */
  animation?: CTAAnimation | readonly CTAAnimation[]
}
