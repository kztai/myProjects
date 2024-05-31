import { createTable } from "@/db/db.table";
// import { FieldInfo, OtherTableAttr } from "@/types/db/db.type";
import { ResultType } from "@/types/index";
import { dbConnect } from "@/db/db.index";
import { createDB, useDB } from "@/db/db.database";
import { activityTable, applyTable, userTable } from "./fieldConfig";
import { TableNameMap } from "./def";

const connect = dbConnect("mysql");
export { connect };

export async function init(dbName: string): Promise<ResultType> {
    try {
        await createDB(dbName);
        await useDB(dbName);
        // 初始化数据库表：
        await initTable();
    } catch (err) {
        console.log("数据库初始化失败：", err);
        return Promise.reject({
            code: 11000,
            message: "数据库初始化失败：" + err
        });
    }
}

function initTable(): Promise<ResultType> {
    const arrFieldInfo: any = [activityTable, applyTable, userTable];
    const arrTableName = Object.values(TableNameMap);

    try {
        const arrPromise: Promise<ResultType>[] = [];
        arrTableName.forEach(async (tableName, index) => {
            arrPromise.push(createTable(tableName, arrFieldInfo[index]));
        });

        return Promise.all(arrPromise).then(() => {
            return Promise.resolve({
                code: 200,
                message: "创建表成功！"
            });
        }).catch((err) => {
            return Promise.reject({
                code: 11001,
                message: "创建表失败：" + err
            });
        });
    } catch (err) {
        console.log("创建表失败：", err);
        return Promise.reject({
            code: 11001,
            message: "创建表失败：" + err
        });
    }
}

// async function createBaseTable(arrTableName: string[], arrFieldInfo: FieldInfo[], arrOtherSet: OtherTableAttr[]): Promise<ResultType> {
//     try {
//         const arrPromise: Promise<ResultType>[] = [];
//         arrTableName.forEach(async (tableName, index) => {
//             arrPromise.push(createTable(tableName, arrFieldInfo[index], arrOtherSet[index]));
//         });

//         return Promise.all(arrPromise).then(() => {
//             return Promise.resolve({
//                 code: 200,
//                 message: "创建表成功！"
//             });
//         }).catch((err) => {
//             return Promise.reject({
//                 code: 10001,
//                 message: "创建表失败：" + err
//             });
//         });
//     } catch (err) {
//         console.log("创建表失败：", err);
//         return Promise.reject({
//             code: 10001,
//             message: "创建表失败：" + err
//         });
//     }
// }