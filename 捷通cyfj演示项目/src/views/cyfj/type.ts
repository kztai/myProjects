type recordData = {
  date: string
  content: string
}

export type caseInfo = {
  key: string
  content: string
}

export interface nomalizeRecord {
  type: string
  originalData: recordData
  normalizeData: recordData
}

export interface options {
  value: string | string[]
  class: string | string[]
}

export enum optionIndex {
  original = 0,
  correct,
  originalAndCorrect,
}
