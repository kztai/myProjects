import { insertData, queryDataByCond, queryDataById } from "@/db/db.crud";
import { ResultType } from "@/types/index";
import { TableNameMap, GoodFieldMap } from "./def";
import { GoodFieldType } from "@/types/models/type";



export function queryGoodsInfo(params: Record<string, any>): Promise<ResultType> {
    try {
        // 查询商品信息：
        const arrCondition: string[] = [];
        Object.keys(params).forEach((key) => {
            // 判断该字段是否在商品表中：
            const arrGoodField = Object.values(GoodFieldMap);
            if (arrGoodField.includes(key)) {
                // 判断值是否有多个：
                params[key].includes(",") ? arrCondition.push(`${key}@IN:${params[key]}`) : arrCondition.push(`${key}@=:${params[key]}`);
            }
        });
        return queryDataByCond(TableNameMap.good, [], { condition: arrCondition });
    } catch (err) {
        console.log("查询商品信息失败：", err);
        return Promise.reject({
            code: 10002,
            message: "查询商品信息失败：" + err
        });
    }
}

export function insertGoodsInfo(arrData: GoodFieldType[]): Promise<ResultType> {
    try {
        // 设置商品信息：
        const arrGoodData: any[][] = [];
        const arrGoodField = Object.values(GoodFieldMap);
        arrData.forEach((data) => {
            const arrValue = arrGoodField.map(field => data[field]);
            arrGoodData.push(arrValue);
        });

        return insertData(TableNameMap.good, arrGoodField, arrGoodData);
    } catch (err) {
        console.log("插入商品信息失败：", err);
        return Promise.reject({
            code: 10003,
            message: "插入商品信息失败：" + err
        });
    }

}