import {
  Message,
} from 'element-ui'
import type { AxiosError } from 'axios'
import type { ResInterceptor } from '@/request/interceptor/response/index'
import { IS_DEV } from '@/const'
import { openLogoutMsgBox } from '@/utils/message'
import Vue from 'vue'

const HTTP_STATUS = {
  UNAUTHORIZED: 401, // 未授权, 后台目前通过 HTTP Code 判断是否授权
  NOT_FOUND: 404,
}

// 自定义 axios http 请求响应异常时的 error 对象
type IRequestErrorType =
  | 'axios' // axios 内部异常
  | 'custom' // 拦截器中抛出的异常, 如 业务异常

/**
 * 前端自定义错误码
 * 用字符串方式记录, 便于在日志中直接判断异常类型
 * 如果用纯数字方式记录, 还需再到这里对应关系
 */
export enum IRequestErrorCode {
  UNKNOWN = 'UNKNOWN',
  TIME_OUT = 'TIME_OUT',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UN_AUTH = 'UN_AUTH 401',
  NOT_FOUND = 'NOT_FOUND 404',
}

export interface IRequestErrorSchema {
  // 这里的 code 包含两种情况
  // 1. HTTP Status 200, 但业务接口返回的 code 为异常情况: 此时的 code 值 = 业务接口返回的 code 值
  // 2. axios 内部异常: 比如超时,404,接口鉴权失败 401等, 此时 code 值 = IRequestErrorCode
  // TODO: 和后端沟通, 枚举出所有的错误 code
  code: string | IRequestErrorCode
  message: string
  errorType: IRequestErrorType
  axiosInfo: Pick<AxiosError, 'config' | 'request' | 'response'>
  hasShownErrorMsg?: boolean
}

const interceptor: ResInterceptor = {
  fulfilled: undefined, // 等效于 res => res,
  rejected(error: AxiosError | IRequestErrorSchema): Promise<never> {
    if (IS_DEV) {
      console.log('axios 请求异常. response 拦截器中捕获异常:', error) // for debug
    }
    let normalizedError: IRequestErrorSchema

    if ('isAxiosError' in error) {
      let msg = ''
      let errorCode

      if (error.code === 'ECONNABORTED') { // timeout error code: https://stackoverflow.com/a/50620317
        msg = '请求失败， 服务器未返回内容，请稍后再试'
        errorCode = IRequestErrorCode.TIME_OUT
      } else if (error.message === 'Network Error') { // 网络错误, 比如和服务端无法建立连接
        msg = '请求失败， 请检查网络连接并重启客户端'
        errorCode = IRequestErrorCode.NETWORK_ERROR
      } else {
        const status = error.response?.status ?? -999
        if (status === HTTP_STATUS.UNAUTHORIZED) {
          errorCode = IRequestErrorCode.UN_AUTH
          msg = '访问未授权'
        } else if (status === HTTP_STATUS.NOT_FOUND) {
          errorCode = IRequestErrorCode.NOT_FOUND
          msg = '请求地址不存在'
        } else {
          errorCode = error.code ?? IRequestErrorCode.UNKNOWN
          msg = error.message
        }
      }

      normalizedError = {
        errorType: 'axios',
        message: msg,
        code: errorCode,
        axiosInfo: {
          request: error.request,
          config: error.config,
          response: error.response,
        },
        hasShownErrorMsg: false,
      }

      if (errorCode === IRequestErrorCode.UN_AUTH) {
        // normalizedError.message = '你已被登出，请重新登录'
        // const hintText = error.config?.errorMessageFormatter?.(normalizedError) ?? normalizedError.message
        // normalizedError.hasShownErrorMsg = true
        // openLogoutMsgBox(hintText)
      }
    } else {
      // Axios 内部或者其他拦截器 fulfilled()/rejected() 执行过程中抛出的异常, 应该继续抛出去
      normalizedError = error
    }

    return Promise.reject(normalizedError)
  },
}

function isObject(v: any) {
  return typeof v === 'object' && v !== null
}
/**
 * 新增全局 Promise reject 异常捕获
 * 配合 axios 拦截器, 处理接口异常并且业务中未捕获该异常的情况
 * 对于以上情况, 弹窗提示用户
 *
 *  1. 使用 promise 的 .catch() 捕获
 *  如果不用 .catch() 捕获异常, 全局会通过 ElMessage 提示;
 *  如果使用 .catch() 捕获异常, 全局不会再提示;
 *
 *  举例 1, 会有 ElMessage 提示:
 *  request.get<string>('/api/xx')
 *   .then((res) => {
 *      // 处理业务逻辑
 *    })
 *
 *  举例 2, 不会有 ElMessage 提示
 *  request.get<string>('/api/xx')
 *   .then((res) => {
 *      // 处理业务逻辑
 *    })
 *   .catch((err) => {})
 *
 *  2. 使用 trycatch 捕获
 *  如果在 catch(e) {} 中继续抛出异常, 全局会通过 unhandledrejection 来 ElMessage 提示;
 *  如果在 catch(e) {} 中继续抛出异常, 但抛出的异常中 hasShownErrorMsg 设置为 true,  全局会通过 unhandledrejection 时不再 ElMessage 提示;
 *  如果在 catch(e) {} 中不再抛出异常, 则认为已经处理异常，将不再触发 unhandledrejection;
 *
 *  举例1, 会有 ElMessage 提示:
 *  try {
 *    await getApiData()
 *  } catch(err) {
 *    // 其他操作
 *    // 抛出异常，由上层或 unhandledrejection 处理，若没上层 unhandledrejection 弹框
 *    throw err
 *  }
 *
 *  举例2, 没有 ElMessage 提示:
 *  try {
 *    await getApiData()
 *  } catch(err) {
 *    // 其他操作
 *    // 抛出异常, 但设置 hasShownErrorMsg 为 true, 上层或 unhandledrejection 处理时可检测 err.hasShownErrorMsg === true 为以弹过框不再弹框处理
 *    err.hasShownErrorMsg = true
 *    throw err
 *  }
 *
 *  举例3, 没有 ElMessage 提示:
 *  try {
 *    await getApiData()
 *  } catch(err) {
 *    // 其他操作
 *    // 不抛出异常， 上层或 unhandledrejection 不再会收到异常信息
 *  }
 */

/**
 * 处理接口异常导致的 rejected promise: 弹窗提示用户
 * @param reason Promise rejected reason
 */
export function unhandledRejectionHandler(reason: any) {
  if (isObject(reason) && 'errorType' in reason) {
    const normalizedError = (reason as IRequestErrorSchema)
    if (!normalizedError.hasShownErrorMsg) {
      const hintText = normalizedError.axiosInfo.config?.errorMessageFormatter?.(normalizedError) ?? normalizedError.message
      Message({
        message: hintText,
        type: 'error',
        duration: 5 * 1000,
      })
    }
  }
}

/**
 * 为了能够捕获接口异常导致的 rejected Promise
 * 分别通过 vue2 全局 errorHandler 和 window unhandledrejection 注册事件回调
 */
export function addAxiosUnhandledRejectionEvent() {
  console.log('addAxiosUnhandledRejectionEvent: ')
  // vue2 生产环境会对 template 中 vnode 绑定的事件回调进行拦截, 会对 rejected promise 进行 .catch() 兜底处理, 然后不会继续抛出异常
  // 所以需要挂载 app.config.errorHandler 事件处理
  Vue.config.errorHandler = unhandledRejectionHandler

  // 对于 vue 未拦截的 rejected promise 的情况
  // 比如: setup () {
  //  getUserInfo() // 这里接口异常 vue2 没有拦截, 需要在全局注册 unhandledrejection 事件回调来处理
  // }
  window.addEventListener('unhandledrejection', e => {
    console.log('unhandledrejection-e: ', e)
    unhandledRejectionHandler(e.reason)
  })
}

export default interceptor
