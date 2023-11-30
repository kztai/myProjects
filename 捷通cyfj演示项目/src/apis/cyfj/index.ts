
import request from '@/request'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import type { Ref } from 'vue'
import type { nomalizeRecord } from '@/views/cyfj/type'

import type {
  nerRequestParam,
  NerResponseResult,
  llmRequestParam,
  llsResponseResult,
} from '@/apis/cyfj/type'

let token: string | null = null

getToken().then((res) => {
  token = res.token
}).catch((err) => {
  console.error(err)
})

function getToken() {
  // getToken url：https://10.0.3.73:22891/v10/auth/get-access-token?appkey=aicp_app
  // base64("aicp_app:QWxhZGRpbjpvcGVuIHNlc2FtZQ")

  const authentication = 'Basic ' + btoa('aicp_app:QWxhZGRpbjpvcGVuIHNlc2FtZQ')

  return request({
    url: '/v10/auth/get-access-token?appkey=aicp_app',
    method: 'get',
    // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
    baseURL: '/apiToken',
    // `headers` 是即将被发送的自定义请求头
    headers: {
      'Content-Type': 'application/json',
      Authorization: authentication,
    },
  })
}

// 实体识别接口：
export async function getCaseInfoResult(data: nerRequestParam) {
  // 命名实体识别url：http://10.0.3.73:22890/v10/nlp/recog/cn_yesorno_fz/ner?appkey=aicp_app

  return await request<NerResponseResult>({
    url: '/v10/nlp/recog/cn_yesorno_fz/ner?appkey=aicp_app',
    method: 'post',
    data, // `data` 是作为请求主体被发送的数据。只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'。类型可为对象或字符串。
    // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
    baseURL: '/apiNER',
    // `headers` 是即将被发送的自定义请求头
    headers: {
      'Content-Type': 'application/json',
      // 'X-Hci-Access-Token': 'axcCwsuFHhqns17xade47eb263592534',
      'X-Hci-Access-Token': token,
    },
  })
}

// 大数据接口：
export function getLLMResult(data: llmRequestParam) {
  // 大数据url：http://10.0.1.168:35751/v10/llm/chat/common/completion

  return request<llsResponseResult>({
    url: '/v10/llm/chat/common/completion',
    method: 'post',
    data, // `data` 是作为请求主体被发送的数据。只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'。类型可为对象或字符串。
    // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
    baseURL: '/apiLLM',
    // `headers` 是即将被发送的自定义请求头
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

/**
 * 获取大数据智能续写结果
*/
export async function getSuggest(ctrl: any, typeRef: Ref<string | nomalizeRecord[]>, index: number | null, data: llmRequestParam, successCallback: (res: any) => void, errCallback: (err: any) => void) {
  ctrl = new AbortController()
  // 判断是接口类型是简要案情、适用法条，还是笔录规整：
  const baseURL: string = typeof typeRef.value === 'string' ? '/apiLLM' : '/apiNormalize'
  fetchEventSource(baseURL + '/v10/llm/chat/common/completion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    signal: ctrl.signal,
    openWhenHidden: true,

    async onopen(response: any) {
      if (response.ok && response.headers.get('content-type')?.includes('text/event-stream')) {
        return await Promise.resolve()
      } else {
        return await Promise.reject(await response.json())
      }
    },
    onmessage(res: any) {
      try {
        const resData = JSON.parse(res.data)
        if (typeof typeRef.value === 'string') {
          // 表示是获取简要案情、适用法条数据：
          typeRef.value += (resData.result?.response ?? '') as string
        } else {
          // 表示是获取规整数据
          typeRef.value[index as number].normalizeData += (resData.result?.response ?? '') as string
        }
      } catch (error) {
        errCallback(error)
      }
    },
    onclose() {
      // 表示是笔录规整模块：
      if (typeof typeRef.value !== 'string') {
        typeRef.value[index as number].isComplete = true
        showNormalizeItem(typeRef, index as number)
      }
      ctrl = undefined
      successCallback('数据传输完成')
    },
    onerror(e: any) {
      ctrl?.abort()
      ctrl = undefined
      const err = {
        code: e?.code,
        message: e?.message ?? '续写失败',
      }
      errCallback(err)
    },
  })
}

function showNormalizeItem(recordRef: Ref, index: number) {
  for (let i = 0; i <= index; i++) {
    if (!recordRef.value[i].isComplete) {
      return
    }
  }

  recordRef.value[index].show = true

  while (++index < recordRef.value.length) {
    recordRef.value[index].show = true
    if (!recordRef.value[index].isComplete) {
      return
    }
  }
}
