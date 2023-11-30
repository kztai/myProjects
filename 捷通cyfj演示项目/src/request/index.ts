import axios from 'axios'
import responseInterceptors from './interceptor/response'
import { authInterceptor } from '@/request/interceptor/request'
import { IS_DEV } from '@/const'

const TimeoutLimit = 15 // 5s

/**
 * 业务代码中处理接口异常的情况示例:
 request.get<string>('/api/xx')
 .then((res) => {
    // 处理业务逻辑
  })
 .catch((err: IRequestErrorSchema) => {
    // 处理接口异常的情况
    if (err.code !== IRequestErrorCode.UN_AUTH) {
      // 非鉴权失败的情况下,可 弹窗/message 交互
      ElMessage.error(`请求失败：${err.message}`)
    }
    // 其他逻辑
  })

 注意: 如果不用 .catch() 捕获异常, 全局会通过 ElMessage 提示;
      如果使用 .catch() 捕获异常, 全局不会再提示;
 */
const axiosOpt = {
  baseURL: '',
  timeout: TimeoutLimit * 1000,
}
const request = axios.create(axiosOpt)
export const requestWithoutReqInterceptors = axios.create(axiosOpt)

// Request interceptor
request.interceptors.request.use(authInterceptor) // 请求头加上 token
request.interceptors.request.use(
  undefined,
  error => {
    // do something with request error
    if (IS_DEV) {
      console.error('axios 请求异常. request 拦截器中捕获异常:', error) // for debug
    }
    return Promise.reject(error)
  },
)

// Response interceptors
/*
 axios 内部是通过 Promise 链式调用的方式挂载拦截器
 service.interceptors.response.use(A1, A2)
 service.interceptors.response.use(B1, B2)

 等效于

 axios.request(...)
   .then(A1, A2)
   .then(B1, B2)
 */
responseInterceptors.forEach(interceptor => {
  request.interceptors.response.use(
    interceptor?.fulfilled,
    interceptor?.rejected,
  )
})

export default request
