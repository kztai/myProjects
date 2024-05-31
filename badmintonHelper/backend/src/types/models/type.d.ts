export interface GoodFieldType {
    id: number
    goodname: string
    price: number
    desc?: string
}

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

export interface UserFieldType {
    id: number
    username: string
    password: string
    desc?: string
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