
export const activityFieldMap = {
    id: "id",
    title: "title",
    date: "date",
    time: "time",
    addressData: "addressData",
    fieldNum: "fieldNum",
    maxApply: "maxApply",
    chargingMethod: "chargingMethod",
    malePay: "malePay",
    femalePay: "femalePay",
    refundTicket: "refundTicket",
    supplement: "supplement",
    browse: "browse",
    browsePerson: "browsePerson",
    status: "status",
    organizerId: "organizerId",
    organizerName: "organizerName",
    organizerAvatarUrl: "organizerAvatarUrl",
};

export const applyFieldMap = {
    id: "id",
    parentId: "parentId",
    userId: "userId",
    nickName: "nickName",
    avatarUrl: "avatarUrl",
    gender: "gender",
    applyTime: "applyTime",
    level: "level",
    status: "status",  //0已报名，1候补，2未报名（已退坑）
};

export const userFieldMap = {
    id: "id",
    userId: "userId",
    nickName: "nickName",
    avatarUrl: "avatarUrl",
    password: "password",
    gender: "gender",
    country: "country",
    province: "province",
    city: "city",
    realName: "realName",
    phone: "phone",
    level: "level",
    singleSession: "singleSession",
    singleWinRate: "singleWinRate",
    doubleSession: "doubleSession",
    doubleWinRate: "doubleWinRate",
    singleRefereeSession: "singleRefereeSession",
    doubleRefereeSession: "doubleRefereeSession",
    loginStatus: "loginStatus"
};

// 表映射
export const TableNameMap = {
    activity: "activity",
    apply: "apply",
    user: "user",
};

export const ApplyStatusEnum = {
    Applied: 0,
    AlternatedApplied: 1,
    NotApplied: 2,
};

export const ActivityStatusEnum = {
    Ended: 0,
    InProgress: 1,
    Cancel: 2,
};

export const ChargingMethoEnum = {
    Before: 0,
    After: 1,
};

export const RefundTicketEnum = {
    Before12: 0,
    Before6: 1,
    Before1: 2,
    Before0: 3,
    No: 4,
};

export const LoginStatusEnum = {
    Out: 0,
    In: 1,
};

