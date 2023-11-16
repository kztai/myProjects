// import printLog from '@/request/interceptor/response/print-log'
import normalizeResponse from '@/request/interceptor/response/normalize'
import error from '@/request/interceptor/response/error'

import type {
  AxiosError,
  AxiosResponse,
} from 'axios'
import printLog from '@/request/interceptor/response/print-log'

export interface ResInterceptor {
  fulfilled?: (response: AxiosResponse) => Promise<any>
  rejected?: (response: AxiosError) => Promise<any>
}

/*
* 响应拦截器将会按照这里的顺序进行挂载, 类似以下效果:
* axios.get('/')
*   .then(responseInterceptors[0].fulfilled, responseInterceptors[0].rejected)
*   .then(responseInterceptors[1].fulfilled, responseInterceptors[1].rejected)
* */
const responseInterceptors: ResInterceptor[] = [
  printLog,
  normalizeResponse,
  error, // 异常处理要放最后, 达到 promise.then().then().catch() 的目的
]

export default responseInterceptors
