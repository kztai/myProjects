const { ActivityStatusEnum, ChargingMethoEnum, RefundTicketEnum, ApplyStatusEnum, GenderEnum } = require("./enum");

const activityStatus = {
  [ActivityStatusEnum.Ended]: "已结束",
  [ActivityStatusEnum.InProgress]: "进行中",
  [ActivityStatusEnum.Cancel]: "已取消"
}
const applyStatusMap = {
  [ApplyStatusEnum.Applied]: "已报名",
  [ApplyStatusEnum.AlternatedApplied]: "候补报名",
  [ApplyStatusEnum.NotApplied]: "未报名"
}

const refundTicketMap = {
  [RefundTicketEnum.Before12]: "活动开始前12小时可退坑",
  [RefundTicketEnum.Before6]: "活动开始前6小时可退坑",
  [RefundTicketEnum.Before1]: "活动开始前1小时可退坑",
  [RefundTicketEnum.Before0]: "活动开始前可退坑",
  [RefundTicketEnum.No]: "不可退坑",
}

const chargingMethodMap = {
  [ChargingMethoEnum.Before]: "报名时收款",
  [ChargingMethoEnum.After]: "活动后AA收款",
}

const userFieldMap = {
  id: 'id',
  userId: 'userId',
  nickName: 'nickName',
  avatarUrl: 'avatarUrl',
  gender: 'gender',
  level: 'level',
  realName: 'realName',
  phone: 'phone',
}

const activityFieldMap = {
  id: 'id',
  title: 'title',
  date: 'date',
  time: 'time',
  addressData: 'addressData',
  fieldNum: 'fieldNum',
  maxApply: 'maxApply',
  chargingMethod: 'chargingMethod',
  malePay: 'malePay',
  femalePay: 'femalePay',
  refundTicket: 'refundTicket',
  supplement: 'supplement',
  browse: 'browse',
  browsePerson: 'browsePerson',
  status: 'status',
  organizerId: "organizerId",
  organizerName: "organizerName",
  organizerAvatarUrl: "organizerAvatarUrl",
}

const activityDetailMap = {
  [activityFieldMap.title]: '名称',
  [activityFieldMap.date]: '日期',
  [activityFieldMap.time]: '时间',
  [activityFieldMap.addressData]: '地点',
  [activityFieldMap.fieldNum]: '场地号',
  [activityFieldMap.maxApply]: '总人数',
  [activityFieldMap.chargingMethod]: '报名费方式',
  [activityFieldMap.malePay]: '男士金额',
  [activityFieldMap.femalePay]: '女士金额',
  [activityFieldMap.refundTicket]: '退坑方式',
  [activityFieldMap.supplement]: '补充',
  [activityFieldMap.browse]: '浏览量',
  [activityFieldMap.browsePerson]: '浏览人数',
  [activityFieldMap.status]: '活动状态',
  [activityFieldMap.browse]: '浏览量',
  [activityFieldMap.browsePerson]: '浏览人数',
  [activityFieldMap.status]: '活动状态',
  [activityFieldMap.organizerId]: '组织者Id',
  [activityFieldMap.organizerName]: '组织者名称',
  [activityFieldMap.organizerAvatarUrl]: '组织者头像',
}

const applyFieldMap = {
  id: 'id',
  parentId: 'parentId',
  name: 'name',
  avatarUrl: 'avatarUrl',
  curApply: 'curApply',
  alternate: 'alternate',
  status: 'status',  //0已报名，1候补，2未报名（已退坑）
}

const genderMap = {
  [GenderEnum.Unknow]: '保密',
  [GenderEnum.Male]: "男",
  [GenderEnum.Female]: "女",
}

const levelMap = {
  0: '萌新',
  1: "1级",
  2: "2级",
  3: "3级",
  4: "4级",
  5: "5级",
  6: "6级",
  7: "7级",
  8: "8级",
  9: "9级",
  10: "专业级",
}

module.exports = {
  activityStatus,
  refundTicketMap,
  chargingMethodMap,
  activityFieldMap,
  activityDetailMap,
  applyStatusMap,
  applyFieldMap,
  genderMap,
  levelMap,
  userFieldMap
};