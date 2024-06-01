import { insertData, queryDataByCond, queryDataById, delDataByCond } from "@/db/db.crud";
import { ResultType } from "@/types/index";
import { TableNameMap, userFieldMap } from "./def";
import { ConditionType } from "@/types/db/db.type";

import { UserInfoType } from "@/types/user";



// 新增用户信息：
export function insertUserInfo(userInfo: UserInfoType): Promise<ResultType> {
    try {
        const arrData: any[] = [];
        const arrUserTableField = Object.values(userFieldMap);
        arrUserTableField.forEach((field:string) => {
            userInfo[field] === undefined ? arrData.push(null) : arrData.push(userInfo[field]);
        });
        return insertData(TableNameMap.user, arrUserTableField, [arrData]);
    } catch (err) {
        return Promise.reject({
            code: 12000,
            message: "新增用户信息失败：" + err
        });
    }
}

// 删除用户信息：
export function deleteUserInfo(userId: string): Promise<ResultType> {
    try {
        const conditions: ConditionType = {
            condition: [`${userFieldMap.userId}@=:${userId}`],
        };
        return delDataByCond(TableNameMap.user, conditions);
    } catch (err) {
        return Promise.reject({
            code: 12001,
            message: "删除用户信息失败：" + err
        });
    }
}

// 获取用户信息：
export function queryUserInfo(userId: string): Promise<ResultType> {
    try {
        const conditions: ConditionType = {
            condition: [`${userFieldMap.userId}@=:${userId}`],
        };
        return queryDataByCond(TableNameMap.user, [], conditions);
    } catch (err) {
        return Promise.reject({
            code: 12002,
            message: "获取用户信息失败：" + err
        });
    }
}