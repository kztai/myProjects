/*
* 对返回结果进行归一化的响应拦截器
* */

import type { AxiosResponse } from 'axios'
import type { ResInterceptor } from '@/request/interceptor/response/index'

const interceptor: ResInterceptor = {
  fulfilled: async(response: AxiosResponse) => {
    return response.data
  },
  rejected: undefined, // 保证 Axios 或者前面的拦截器抛出的异常可以继续抛给下一个拦截器
}

export default interceptor
