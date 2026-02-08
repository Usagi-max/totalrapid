//src/types/checkList.ts
export type ChecklistType = 'card' | 'band'

export type ChecklistData = {
  type?: ChecklistType
  backgroundColor?: string
  textColor?: string
  items: string[]
}
