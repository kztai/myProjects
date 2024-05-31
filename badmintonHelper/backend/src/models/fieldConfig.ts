
import { activityFieldMap, applyFieldMap, userFieldMap } from "./def";

// 活动表字段结构
export const activityTable = {
    [activityFieldMap.id]: {
        type: "INT",
        autoIncrement: true,
        unique: true,
        require: true,
        primaryKey: true,
        comment: "id"
    },
    [activityFieldMap.title]: {
        type: "VARCHAR",
        length: 32,
        require: true,
        unique: true,
        comment: "活动名称",
    },
    [activityFieldMap.date]: {
        type: "VARCHAR",
        length: 20,
        require: true,
        comment: "日期",
    },
    [activityFieldMap.time]: {
        type: "VARCHAR",
        length: 20,
        require: true,
        comment: "时间",
    },
    [activityFieldMap.addressData]: {
        type: "VARCHAR",
        length: 500,
        require: true,
        comment: "地址"
    },
    [activityFieldMap.fieldNum]: {
        type: "VARCHAR",
        length: 32,
        require: true,
        comment: "场地号",
    },
    [activityFieldMap.maxApply]: {
        type: "INT",
        length: 20,
        comment: "总人数",
    },
    [activityFieldMap.chargingMethod]: {
        type: "TINYINT",
        length: 2,
        require: true,
        comment: "付款方式",
    },
    [activityFieldMap.malePay]: {
        type: "INT",
        length: 20,
        comment: "男士金额"
    },
    [activityFieldMap.femalePay]: {
        type: "INT",
        length: 20,
        comment: "女士金额",
    },
    [activityFieldMap.refundTicket]: {
        type: "TINYINT",
        length: 2,
        require: true,
        comment: "退坑方式",
    },
    [activityFieldMap.supplement]: {
        type: "VARCHAR",
        length: 255,
        comment: "补充",
    },
    [activityFieldMap.browse]: {
        type: "INT",
        length: 20,
        comment: "浏览量",
    },
    [activityFieldMap.browsePerson]: {
        type: "INT",
        length: 20,
        comment: "浏览人数",
    },
    [activityFieldMap.status]: {
        type: "TINYINT",
        length: 2,
        comment: "活动状态",
    },
    [activityFieldMap.organizerId]: {
        type: "INT",
        length: 20,
        comment: "组织者Id",
    },
    [activityFieldMap.organizerName]: {
        type: "VARCHAR",
        length: 32,
        comment: "组织者名称",
    },
    [activityFieldMap.organizerAvatarUrl]: {
        type: "VARCHAR",
        length: 255,
        comment: "组织者头像",
    },
};

// 活动报名表字段结构
export const applyTable = {
    [applyFieldMap.id]: {
        type: "INT",
        autoIncrement: true,
        unique: true,
        require: true,
        primaryKey: true,
        comment: "id"
    },
    [applyFieldMap.parentId]: {
        type: "INT",
        length: 20,
        require: true,
        comment: "parentId",
        indexName: "parentId"
    },
    [applyFieldMap.userId]: {
        type: "INT",
        length: 20,
        require: true,
        comment: "报名者id",
        indexName: "userId"
    },
    [applyFieldMap.name]: {
        type: "VARCHAR",
        length: 32,
        require: true,
        comment: "报名者名称",
    },
    [applyFieldMap.avatarUrl]: {
        type: "VARCHAR",
        length: 255,
        require: true,
        comment: "报名者头像",
    },
    [applyFieldMap.sex]: {
        type: "VARCHAR",
        length: 10,
        comment: "报名者性别"
    },
    [applyFieldMap.status]: {
        type: "TINYINT",
        length: 2,
        comment: "报名状态",
    },
};

// 用户信息表字段结构
export const userTable = {
    [userFieldMap.id]: {
        type: "INT",
        autoIncrement: true,
        unique: true,
        require: true,
        primaryKey: true,
        comment: "id"
    },
    [userFieldMap.userId]: {
        type: "VARCHAR",
        length: 50,
        unique: true,
        require: true,
        comment: "userId",
    },
    [userFieldMap.nickName]: {
        type: "VARCHAR",
        length: 32,
        require: true,
        comment: "用户名称",
    },
    [userFieldMap.avatarUrl]: {
        type: "VARCHAR",
        length: 255,
        require: true,
        comment: "用户头像",
    },
    [userFieldMap.gender]: {
        type: "TINYINT",
        length: 2,
        comment: "用户性别"
    },
    [userFieldMap.password]: {
        type: "VARCHAR",
        length: 20,
        comment: "密码"
    },
    [userFieldMap.country]: {
        type: "VARCHAR",
        length: 32,
        comment: "国家",
    },
    [userFieldMap.province]: {
        type: "VARCHAR",
        length: 32,
        comment: "省份",
    },
    [userFieldMap.city]: {
        type: "VARCHAR",
        length: 32,
        comment: "城市"
    },
    [userFieldMap.openid]: {
        type: "VARCHAR",
        length: 100,
        comment: "wx-openid"
    },
    [userFieldMap.session_key]: {
        type: "VARCHAR",
        length: 100,
        comment: "wx-session_key"
    },
    [userFieldMap.unionid]: {
        type: "VARCHAR",
        length: 100,
        comment: "wx-unionid"
    },
};

