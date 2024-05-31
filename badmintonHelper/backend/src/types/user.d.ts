export interface UserInfoType {
    openid: string //该小程序下用户唯一标识 OpenID。每个微信用户在同一个小程序中的 OpenID 是唯一的，不同的小程序之间的 OpenID 是不同的。
    session_key: string  // 会话密钥
    unionid: string   // 在微信平台下的多个关联公众号、小程序和移动应用中，对一个用户的唯一标识。
    userId: string
    nickName: string
    avatarUrl: string
    gender: number  //0未知，1男，2女
    country: string
    province: string
    city: string
}

export enum TestEnum {
    a = 0,
}