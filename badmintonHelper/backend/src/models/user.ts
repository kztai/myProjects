import { queryDataByCond } from "@/db/db.crud";
import { ResultType } from "@/types/index";
import { TableNameMap, UserFieldMap } from "./def";


export function queryUserInfo(params: Record<string, any>): Promise<ResultType> {
    try {
        // 查询商品信息：
        const arrCondition: string[] = [];
        Object.keys(params).forEach((key) => {
            // 判断该字段是否在商品表中：
            const arrField = Object.values(UserFieldMap);
            if (arrField.includes(key)) {
                // 判断值是否有多个：
                params[key].includes(",") ? arrCondition.push(`${key}@IN:${params[key]}`) : arrCondition.push(`${key}@=:${params[key]}`);
            }
        });
        return queryDataByCond(TableNameMap.user, [], { condition: arrCondition });
    } catch (err) {
        console.log("查询用户信息失败：", err);
        return Promise.reject({
            code: 10005,
            message: "查询用户信息失败：" + err
        });
    }
}
