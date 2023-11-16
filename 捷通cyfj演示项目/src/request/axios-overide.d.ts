/* eslint-disable @typescript-eslint/method-signature-style */
/*
* 因为在 axios 的 response 拦截器中对响应进行了处理
* 所以需要对 axios 请求返回的参数类型进行重新定义
* 采用模块扩充的方式, 对 AxiosInstance 的方法进行覆盖
* 参考自:
* */

import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { IRequestErrorSchema } from './interceptor/response/error'

export interface IResPage {
  pageNum: number
  pageSize: number
  pages: number
  total: number
}

export interface ResponseSchema<T = any> {
  code: string
  data: T
  message: string
  page?: IResPage
  axiosRes: AxiosResponse
}

export type IResponse<T = any> = Promise<ResponseSchema<T>>

declare module 'axios' {
  export interface AxiosRequestConfig {
    // 以下为 axios config 拓展字段

    // 将会把 返回值赋值给 ElMessage.error ，用于自定义错误信息
    errorMessageFormatter?: (err: IRequestErrorSchema) => string

    /**
     * 表示接口是否需要授权访问
     *
     * 是前端鉴权体系中的一项配置, 用于 request interceptor 中
     *
     * true 代表该接口需要授权访问(比如获取用户信息)
     *
     * false 表示不需要(比如登录接口)
     * 默认 true
    **/
    needAuth?: boolean
  }
  export interface AxiosInstance {
    <T = any>(config: AxiosRequestConfig): Promise<T>
    <T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    request<T = any> (config: AxiosRequestConfig): Promise<T>
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  }
}
