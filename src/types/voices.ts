export type VoicesData = {
  border?: {
    color?: string
    width?: number
    radius?: number
  }
  background?: {
    direction?: 'vertical' | 'horizontal' | 'diagonal'
    colors: [string, string]
  }
  textColor?: string
  boxColor?: string

  /** 共通ハイライト色 */
  highlightColor?: string

  /** 吹き出し全体の三角位置 */
  align?: 'left' | 'center' | 'right'

  /** 吹き出し横幅（％指定・未指定は100%） */
  widthPercent?: number

  items: {
    text: string
    author?: string
    highlight?: string
    align?: 'left' | 'center' | 'right'
  }[]
}
