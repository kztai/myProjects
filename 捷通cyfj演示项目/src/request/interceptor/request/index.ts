import type {
  InternalAxiosRequestConfig,
  Canceler,
} from 'axios'
import axios from 'axios'
import {
  openLogoutMsgBox,
} from '@/utils/message'
import { getAccessToken } from '@/utils/auth'

const baseAxiosConfig: Partial<InternalAxiosRequestConfig> = {
  needAuth: false,
}
export async function authInterceptor(config: InternalAxiosRequestConfig) {
  config = Object.assign({}, baseAxiosConfig, config)

  if (config.needAuth) { // 需要预先验证 token 有效性
    let cancel!: Canceler
    config.cancelToken = new axios.CancelToken(c => { cancel = c })
    const token = getAccessToken()
    if (!token) {
      cancel('token 失效')
      openLogoutMsgBox()
    }
  }
  return config
}
