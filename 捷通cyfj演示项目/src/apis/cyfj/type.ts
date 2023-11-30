// 命名实体识别接口
export interface nerRequestParam {
  text: string
  config?: {
    containTypes?: string[]
  }
}

export interface NerEntity {
  idx: number // 原文在texts中的索引，从0开始计数；text传入时，总是为0
  len?: number // 实体文本长度(字节数)
  word: string // 实体文本。  例："北京市朝阳区工体北路11号楼1层三里屯超市"
  tag: string // 实体类型标签。例：PER-人名； LOC-地名； ORG-机构名； PROD-产品名； DATE-日期；TIME-时间； MONEY-金钱；
}

export interface NerResponseResult {
  result: {
    entities: NerEntity[]
  }
}

// 大数据接口：
export interface llmRequestParam {
  text: string // 用户输入，长度受服务配置项限制，缺省为2048，必须以UTF-8格式编码。
  config?: {
    streamOutput?: boolean // 是否流式输出
  }
}

export interface llsResponseResult {
  traceToken: string // 服务内部的 token 字符串，可用于日志追溯。
  // 值为START时，表示开始生成结果; 值为RESULT时，表示正常生成结果，且生成未结束; 值为END时，表示正常生成结果，且生成结束;
  respType: string
  result: {
    response: string // 生成文本内容
    history: string[] // 返回历史问答记录(多轮)
  }
}
