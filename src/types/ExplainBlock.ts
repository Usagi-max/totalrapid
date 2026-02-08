// src/types/ExplainBlock.ts

/* ===== Item Types ===== */

/** 既存：テキストのみ */
export type ExplainTextItem = {
  type?: 'text'
  leadText: string
  highlight?: string
}

/** 既存：画像＋テキスト */
export type ExplainImageItem = {
  type?: 'image'
  image: string
  text: string
  highlight?: string
  imagePosition?: 'left' | 'right'
}

/** 新規：ステップカード */
export type ExplainStepItem = {
  type: 'step'
  label: string
  image?: string
  leadText: string
  bodyText: string
}

/** Union（後方互換あり） */
export type ExplainItem =
  | ExplainTextItem
  | ExplainImageItem
  | ExplainStepItem

/* ===== Label ===== */
export type ExplainLabel = {
  text: string
  rounded?: boolean
  textColor: string
  backgroundColor: string
}

/* ===== Block ===== */
export type ExplainBlockType = 'card' | 'band' |"block"

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

  /** 背景（単色 or グラデーション文字列） */
  backgroundColor: string

  /** ボックス背景（必ず反映） */
  boxBackgroundColor: string

  textColor: string
  boxTextColor: string

  items: ExplainItem[]
}
