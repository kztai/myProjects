import { insertData, queryDataByCond, queryDataById, delDataById, updateDataById, updateDataByCond, queryDataByCond_union } from "@/db/db.crud";
import { TableNameMap, activityFieldMap, applyFieldMap, ApplyStatusEnum } from "./def";
import { objPick } from "@/util/util";
import { ResultType } from "@/types/index";
import { ActivityFieldType, ApplyFieldType } from "@/types/activity";
import { ConditionType } from "@/types/db/db.type";



// 查询活动列表信息：
export function queryActivityList(arrActivityId?: number[]): Promise<ResultType> {
    try {
        const arrField = [activityFieldMap.id, activityFieldMap.title, activityFieldMap.date, activityFieldMap.time, activityFieldMap.addressData, activityFieldMap.maxApply, activityFieldMap.browse, activityFieldMap.status, activityFieldMap.organizerName, activityFieldMap.organizerAvatarUrl];

        if (arrActivityId) {
            return queryDataById(TableNameMap.activity, arrField, arrActivityId);
        } else {
            return queryDataByCond(TableNameMap.activity, arrField);
        }
    } catch (err) {
        return Promise.reject({
            code: 10001,
            message: "查询活动列表失败：" + err
        });
    }
}

// 查询该用户发布的活动：
export function queryActivityByUserId(userId: string): Promise<ResultType> {
    try {
        const arrField = [activityFieldMap.id];

        const conditions: ConditionType = {
            condition: [`${activityFieldMap.organizerId}@=:${userId}`],
        };

        return queryDataByCond(TableNameMap.activity, arrField, conditions);
    } catch (err) {
        return Promise.reject({
            code: 10011,
            message: "查询该用户发布的活动失败：" + err
        });
    }
}

// 查询我报名的活动：
export function queryMyJoinActivity(userId: string): Promise<ResultType> {
    try {
        const arrField: string[] = [applyFieldMap.parentId];
        const conditions: ConditionType = {
            condition: [`${applyFieldMap.userId}@=:${userId}`, `${applyFieldMap.status}@!=:${ApplyStatusEnum.NotApplied}`],
        };

        return queryDataByCond(TableNameMap.apply, arrField, conditions);
    } catch (err) {
        return Promise.reject({
            code: 10002,
            message: "查询我报名的活动失败：" + err
        });
    }
}

// 查询报名列表信息：
export function queryApplyList(): Promise<ResultType> {
    try {
        const arrField: string[] = [applyFieldMap.id, applyFieldMap.parentId, applyFieldMap.avatarUrl];
        const conditions: ConditionType = {
            condition: [`${applyFieldMap.status}@!=:${ApplyStatusEnum.NotApplied}`],
        };

        return queryDataByCond(TableNameMap.apply, arrField, conditions);
    } catch (err) {
        return Promise.reject({
            code: 10002,
            message: "查询报名列表失败：" + err
        });
    }
}

// 新增活动数据：
export function insertActivityData(activityData: ActivityFieldType): Promise<ResultType> {
    try {
        const arrField = Object.keys(activityData);
        const arrData = Object.values(activityData);
        return insertData(TableNameMap.activity, arrField, [arrData]);
    } catch (err) {
        return Promise.reject({
            code: 10003,
            message: "新增活动数据失败：" + err
        });
    }
}

// 修改活动数据：
export function updateActivityData(activityData: ActivityFieldType): Promise<ResultType> {
    try {
        const data = objPick(Object.keys(activityFieldMap), activityData) as ActivityFieldType;
        const id = data.id;
        delete data.id;
        return updateDataById(TableNameMap.activity, data, [id]);
    } catch (err) {
        return Promise.reject({
            code: 10003,
            message: "修改活动数据失败：" + err
        });
    }
}

// 查询活动详情数据
export function queryActivityDetail(activityId: number): Promise<ResultType> {
    try {
        const arrField: any[] = [];

        return queryDataById(TableNameMap.activity, arrField, [activityId]);
    } catch (err) {
        return Promise.reject({
            code: 10004,
            message: "查询活动详情数据失败：" + err
        });
    }
}

// 查询已报名人员数据
export function queryActivityAppliedInfo(activityId: number, status?: number): Promise<ResultType> {
    try {
        const arrField: string[] = [];
        const conditions: ConditionType = {
            condition: [`${applyFieldMap.parentId}@=:${activityId}`],
        };
        if (status !== undefined) {
            conditions.condition.push(`${applyFieldMap.status}@=:${status}`);
        }

        return queryDataByCond(TableNameMap.apply, arrField, conditions);
    } catch (err) {
        return Promise.reject({
            code: 10005,
            message: "查询已报名人员数据失败：" + err
        });
    }
}

// 查询候补报名人数：
export function queryAlternatedAppliedNum(activityId: number, alternateField: string): Promise<ResultType> {
    try {
        const arrField: string[] = [alternateField];
        const conditions: ConditionType = {
            condition: [`${applyFieldMap.parentId}@=:${activityId}`, `${applyFieldMap.status}@=:${ApplyStatusEnum.AlternatedApplied}`],
        };

        return queryDataByCond(TableNameMap.apply, arrField, conditions);
    } catch (err) {
        return Promise.reject({
            code: 10006,
            message: "查询候补报名人数失败：" + err
        });
    }
}

// 查询自己是否报名：
export function querySelfApply(activityId: number, userId: string): Promise<ResultType> {
    try {
        const arrField: string[] = [applyFieldMap.status];
        const conditions: ConditionType = {
            condition: [`${applyFieldMap.parentId}@=:${activityId}`, `${applyFieldMap.userId}@=:${userId}`],
        };

        return queryDataByCond(TableNameMap.apply, arrField, conditions);
    } catch (err) {
        return Promise.reject({
            code: 10007,
            message: "查询自己是否报名失败：" + err
        });
    }
}

// 删除活动：
export function delActivity(activityId: number): Promise<ResultType> {
    try {
        return delDataById(TableNameMap.activity, [activityId]);
    } catch (err) {
        return Promise.reject({
            code: 10008,
            message: "删除活动失败：" + err
        });
    }
}

// 新增活动报名数据：
export function insertApplyData(applyData: ApplyFieldType): Promise<ResultType> {
    try {
        const arrField = Object.keys(applyData);
        const arrData = Object.values(applyData);
        return insertData(TableNameMap.apply, arrField, [arrData]);
    } catch (err) {
        return Promise.reject({
            code: 10009,
            message: "新增活动报名失败：" + err
        });
    }
}
// 修改活动报名状态：
export function updateApplyData(activityId: number, userId: string, applyData: any): Promise<ResultType> {
    try {
        const conditions: ConditionType = {
            condition: [`${applyFieldMap.parentId}@=:${activityId}`, `${applyFieldMap.userId}@=:${userId}`],
        };
        return updateDataByCond(TableNameMap.apply, applyData, conditions);
    } catch (err) {
        return Promise.reject({
            code: 10010,
            message: "修改活动报名状态失败：" + err
        });
    }
}