import { mockUser } from './mock'
import type { ILoginReq } from './type'

export function loginApi(param: ILoginReq) {
  return Promise.resolve(mockUser())
}
