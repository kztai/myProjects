import request from '@/request'

import type {
  GetNerParams,
  NerResult,
} from '@/apis/ner/type'

function getNerResult(params: GetNerParams) {
  return request.post<NerResult>('/ner/get', {
    data: params,
  })
}
