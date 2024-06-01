

export interface ActivityFieldType {
    id: number
    name: string
    date: string
    time: string
    addressData: string
    fieldNum: string
    maxApply: number
    chargingMethod: number
    malePay: number
    femalePay: number
    refundTicket: number
    supplement: string
    browse: number
    browsePerson: number
    status: number
    organizerId: number
    organizerName: string
    organizerAvatarUrl: string
}

export interface ApplyFieldType {
    id: number
    parentId: number
    userId: string
    nickName: string
    avatarUrl: string
    gender: number
    status: number //0已报名，1候补，2未报名（已退坑）
}

export enum ApplyStatusEnum {
    Applied = 0,
    AlternatedApplied,
    NotApplied
}

export enum ActivityStatusEnum {
    Ended = 0,
    InProgress,
    Cancel
}

export enum ChargingMethoEnum {
    Before = 0,
    After,
}

export enum RefundTicketEnum {
    Before12 = 0,
    Before6,
    Before1,
    Before0,
    No,
}