export interface GetNerParams {
  text: string
  config?: {
    containTypes?: string[]
  }
}

export interface NerEntity {
  word: string // "北京市朝阳区工体北路11号楼1层三里屯超市"
  tag: string // "案发地点"
}
export interface NerResult {
  result: {
    entities: NerEntity[]
  }
}
