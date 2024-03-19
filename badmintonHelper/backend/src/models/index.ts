import { createTable } from "@/db/db.table";
import { FieldInfo, OtherTableAttr } from "@/types/db/db.type";
import { ResultType } from "@/types/index";

export function initTable(): Promise<ResultType> {
    const fieldInfo: any = [
        {
            id: {
                type: "INT",
                autoIncrement: true,
                unique: true,
                require: true,
                primaryKey: true,
                comment: "id"
            },
            goodname: {
                type: "VARCHAR",
                length: 32,
                require: true,
                comment: "商品名称",
                indexName: "goodname"
            },
            price: {
                type: "DOUBLE",
                length: 20,
                scale: 2,
                require: true,
                comment: "商品单价",
            },
            desc1: {
                type: "VARCHAR",
                length: 255,
                comment: "商品描述",
            }
        },
        {
            id: {
                type: "INT",
                autoIncrement: true,
                unique: true,
                require: true,
                primaryKey: true,
                comment: "id"
            },
            username: {
                type: "VARCHAR",
                length: 32,
                require: true,
                comment: "用户名",
                indexName: "username"
            },
            password: {
                type: "VARCHAR",
                length: 20,
                require: true,
                comment: "密码",
            },
            desc1: {
                type: "VARCHAR",
                length: 255,
                comment: "用户描述",
            }
        }
    ];
    return createBaseTable(["good", "user"], fieldInfo, []);
}

export async function createBaseTable(arrTableName: string[], arrFieldInfo: FieldInfo[], arrOtherSet: OtherTableAttr[]): Promise<ResultType> {
    try {
        const arrPromise: Promise<ResultType>[] = [];
        arrTableName.forEach(async (tableName, index) => {
            arrPromise.push(createTable(tableName, arrFieldInfo[index], arrOtherSet[index]));
        });

        return Promise.all(arrPromise).then(() => {
            return Promise.resolve({
                code: 200,
                message: "创建表成功！"
            });
        }).catch((err) => {
            return Promise.reject({
                code: 10001,
                message: "创建表失败：" + err
            });
        });
    } catch (err) {
        console.log("创建表失败：", err);
        return Promise.reject({
            code: 10001,
            message: "创建表失败：" + err
        });
    }
}