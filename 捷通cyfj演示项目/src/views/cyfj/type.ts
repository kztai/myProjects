// interface recordData {
//   // date: string
//   content: string
// }

export interface caseInfo {
  key: string
  content: string
  like?: string[]
}

export interface nomalizeRecord {
  type: string
  show: boolean
  isComplete: boolean
  originalData: string
  normalizeData: string
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

// export interface successcallback {
//   (res: any): void
// }

// export interface errcallback {
//   (err: any): void
// }
