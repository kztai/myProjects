
export interface ILoginReq {
  username: string
  password: string
  captcha: string
}

export interface IUser {
  username: string
  nickName: string
  avatar?: string
  id: string
  token: string
}
