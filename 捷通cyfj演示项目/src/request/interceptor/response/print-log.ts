/* eslint-disable @typescript-eslint/restrict-template-expressions */
import type {
  AxiosResponse,
} from 'axios'
import type { ResInterceptor } from '@/request/interceptor/response/index'
import { IS_DEV } from '@/const'

const interceptor: ResInterceptor = {
  fulfilled: (response: AxiosResponse): Promise<AxiosResponse> => {
    if (IS_DEV) {
      const { config } = response
      try {
        console.log(
          `%c ${config?.method?.toUpperCase()} %c ${config.baseURL}${config.url}  %c`,
          'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
          'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
          'background:transparent',
        )
        console.log(
          '%c Params:',
          'background:#41b883 ; padding: 1px; border-radius: 3px;  color: #fff',
          JSON.stringify(config.params ?? null, null, 2),
        )
        console.log(
          '%c Request Body:',
          'background:#41b883 ; padding: 1px; border-radius: 3px;  color: #fff',
          JSON.parse(JSON.stringify(config.data ?? null, null, 2)),
        )
        console.log(
          '%c Response:',
          'background:#41b883 ; padding: 1px; border-radius: 3px;  color: #fff',
          JSON.parse(JSON.stringify(response.data)),
        )
      } catch (e) {
        console.error('axios 拦截器: print-log 异常:', e)
      }
    }

    return Promise.resolve(response)
  },
  rejected: undefined, // 保证 Axios 或者前面的拦截器抛出的异常可以继续抛给下一个拦截器
}

export default interceptor
