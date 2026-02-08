import type { ChecklistData } from '../src/types/checklist'

export const checklistData = {
  /** 相談時の注意事項 */
  consultNotes: {
    type: 'card',
    backgroundColor: '#ffffff',
    textColor: '#111111',
    items: [
      '無理な勧誘は一切行いません',
      '相談のみで終了しても問題ありません',
      '保護者の方のみのご相談も可能です',
    ],
  },

  /** 不安チェック */
  anxietyCheck: {
    type: 'card',
    backgroundColor: '#ffffff',
    textColor: '#111111',
    items: [
      '今の勉強法で合っているか不安',
      '成績が伸び悩んでいる',
      'このままで志望校に届くか心配',
    ],
  },

  /** バンド表示用（例） */
  simpleBand: {
    type: 'band',
    backgroundColor: '#f7f6ef',
    textColor: '#000000',
    items: [
      '地理は暗記だけでは伸びません',
      '考え方を身につけることが重要です',
    ],
  },
} satisfies Record<string, ChecklistData>
