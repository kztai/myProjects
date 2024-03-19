import { ConditionType, NestCondType } from "@/types/db/db.type";
import { ResultType } from "@/types/index";
import { connect } from "../app";

/**
 * 功能：插入数据
 * @param tableName 表名
 * @param arrField 指定字段（可为null、[]，表示插入所有字段）
 * @param arrDatas 插入的数据（需保证数组长度一致，无数据则用null占位）
 * @returns [Promise]  { code: xxx, message: xxxxx, data: [] }
 * 示例：
 * arrField = ['id', 'name', 'age']
 * data = [
 *   [1, "kk", 20],
 *   [2, "zz", 21],
 *   [3, "tt", 22],
 * ]
 */
export function insertData(tableName: string, arrField: string[] | null, arrDatas: any[][]): Promise<ResultType> {
    const fieldSql = arrField ? `(${arrField.join(",")})` : "";
    let allSql = `INSERT INTO ${tableName} ${fieldSql} VALUES `;

    arrDatas.forEach((arrData: any[]) => {
        const arrTemp = arrData.map((data: any) => typeof data === "string" ? `'${data}'` : data);
        // 补充id字段的值：
        if (!arrField) arrTemp.unshift(null);

        // 注意：这里不能用join()，因为join会把undefined和null当做空字符串处理：
        let sql = "";
        arrTemp.forEach((value) => {
            if(value === undefined) value = null;
            sql += value + ",";
        });
        sql = sql.slice(0, -1);

        allSql += `(${sql}),`;
    });

    // 删除最后一个逗号：
    allSql = allSql.slice(0, -1);
    allSql += ";";

    return new Promise((resolve, reject) => {
        connect.query(allSql, (err: any, result: any) => {
            if (err) {
                reject({
                    code: err.errno,
                    message: err.message
                });
                return;
            }
            resolve({
                code: 200,
                message: result.message,
                // 组织返回的新增id
                data: new Array(result.affectedRows).fill(null).map((item, index) => result.insertId + index)
            });
        });
    });
}

/**
 * 功能：按id修改
 * @param tableName 表名
 * @param fieldData 修改数据，结构：{ 字段: 值 }
 * @param arrId 修改行对应的id（不传表示不修改）
 * @returns [Promise]  { code: xxx, message: xxxxx }
 * 示例：
 * fieldData = {name: "kzt", age: 100}
 */
export function updateDataById(tableName: string, fieldData: any, arrId: number[]): Promise<ResultType> {
    let sql = `UPDATE ${tableName} SET `;
    const arrKey = Object.keys(fieldData);

    // 没有修改数据，或者没有修改行对应的id，则默认不修改，直接返回：
    if (arrKey.length === 0 || arrId.length === 0) {
        Promise.resolve({
            code: 200,
            message: ""
        });
        return;
    }

    arrKey.forEach((key) => {
        const value = typeof fieldData[key] === "number" ? fieldData[key] : `'${fieldData[key]}'`;
        sql += `${key} = ${value}, `;
    });

    // 将末尾的 , 删除：
    sql = sql.replace(/, $/, " ");

    sql += `WHERE id IN (${arrId.join(",")});`;

    return new Promise((resolve, reject) => {
        connect.query(sql, (err: any, result: any) => {
            if (err) {
                reject({
                    code: err.errno,
                    message: err.message
                });
                return;
            }
            resolve({
                code: 200,
                message: result.message
            });
        });
    });
}

/**
 * 功能：按条件修改
 * @param tableName 表名
 * @param fieldData 修改数据，结构：{ 字段: 值 }
 * @param conditions 修改条件（可不传，表示修改所有行）
 * @returns [Promise]  { code: xxx, message: xxxxx }
 * 示例：
 * fieldData = {name: "kzt", age: 100}
 * conditions: {
 *    condtion: ['name@like:小明', 'year@>:16', ['id@=:1', 'name@=:kk']],  // 其中 @ 和 ：为固定格式。运算符包含： !=, =, >, >=, <, <=, IN, NOTIN, LIKE, BETWEENAND 。数组内元素为数组时，该元素内部条件用 OR 连接。
 *    otherCond: "likes LIKE '%dog_'"   //其他已经组织好的sql语句
 */
export function updateDataByCond(tableName: string, fieldData: any, conditions?: ConditionType): Promise<ResultType> {
    let sql = `UPDATE ${tableName} SET `;
    const arrKey = Object.keys(fieldData);

    if (arrKey.length === 0) {
        Promise.resolve({
            code: 200,
            message: ""
        });
        return;
    }

    arrKey.forEach((key) => {
        const value = typeof fieldData[key] === "number" ? fieldData[key] : `'${fieldData[key]}'`;
        sql += `${key} = ${value}, `;
    });

    // 将末尾的 , 删除：
    sql = sql.replace(/, $/, " ");

    if (!conditions) {
        sql += ";";
    } else {
        // 条件删函数，不允许有分组、排序、限制条数等配置：
        delete conditions?.groupby;
        delete conditions?.orderby;
        delete conditions?.limit;
        sql += _formatCondSql(conditions) + ";";
    }

    return new Promise((resolve, reject) => {
        connect.query(sql, (err: any, result: any) => {
            if (err) {
                reject({
                    code: err.errno,
                    message: err.message
                });
                return;
            }
            resolve({
                code: 200,
                message: result.message
            });
        });
    });
}

/**
 * 功能：按id删除
 * @param tableName 表名
 * @param arrId 需删除的id集合（空数组表示不删除）
 * @returns [Promise]  { code: xxx, message: xxxxx }
 */
export function delDataById(tableName: string, arrId: number[]): Promise<ResultType> {
    if (arrId?.length === 0) {
        Promise.resolve({
            code: 200,
            message: ""
        });
        return;
    }

    const sql = `DELETE FROM ${tableName} WHERE id IN (${arrId.join(",")});`;

    return new Promise((resolve, reject) => {
        connect.query(sql, (err: any, result: any) => {
            if (err) {
                reject({
                    code: err.errno,
                    message: err.message
                });
                return;
            }
            resolve({
                code: 200,
                message: result.message
            });
        });
    });
}

/**
 * 功能：条件删
 * @param tableName 表名
 * @param conditions 删除条件（可不传，或者为{}，表示删除所有数据）
 * @returns [Promise]  { code: xxx, message: xxxxx }
 * 示例：
 * conditions: {
 *    condtion: ['name@like:小明', 'year@>:16', ['id@=:1', 'name@=:kk']],  // 其中 @ 和 ：为固定格式。运算符包含： !=, =, >, >=, <, <=, IN, NOTIN, LIKE, BETWEENAND 。数组内元素为数组时，该元素内部条件用 OR 连接。
 *    otherCond: "likes LIKE '%dog_'"   //其他已经组织好的sql语句
 * }
 */
export function delDataByCond(tableName: string, conditions?: ConditionType): Promise<ResultType> {
    // 条件删函数，不允许有分组、排序、限制条数等配置：
    delete conditions?.groupby;
    delete conditions?.orderby;
    delete conditions?.limit;

    let sql = "";
    if (!conditions) {
        // 删除所有数据：
        sql = `DELETE FROM ${tableName};`;
    } else {
        sql = _formatCondSql(conditions);
        sql = `DELETE FROM ${tableName} ` + sql + ";";
    }

    return new Promise((resolve, reject) => {
        connect.query(sql, (err: any, result: any) => {
            if (err) {
                reject({
                    code: err.errno,
                    message: err.message
                });
                return;
            }
            resolve({
                code: 200,
                message: result.message
            });
        });
    });
}

/**
 * 功能：通过id查询数据
 * @param tableName 表名
 * @param arrField 查询的字段 [array] （为[]表示查询所有字段）
 * @param arrId 查询的id [array] （为[]表示不查询）
 * @returns [Promise]  { code: xxx, message: xxxxx, data: [] }
 */
export function queryDataById(tableName: string, arrField: string[], arrId: number[]): Promise<ResultType> {
    if (arrId?.length === 0) {
        Promise.resolve({
            code: 200,
            message: "",
            data: []
        });
        return;
    }

    const fieldSql = arrField?.length === 0 ? "*" : arrField.join(",");
    const sql = `SELECT ${fieldSql} FROM ${tableName} WHERE id IN (${arrId.join(",")});`;

    return new Promise((resolve, reject) => {
        connect.query(sql, (err: any, result: any) => {
            if (err) {
                reject({
                    code: err.errno,
                    message: err.message
                });
                return;
            }
            resolve({
                code: 200,
                message: "",
                data: result
            });
        });
    });
}


/**
 * 功能：普通条件查询
 * @param tableName 表名
 * @param arrField 查询的字段 [array] （为[]表示查询所有字段）
 * @param conditions 查询条件（可不传，或者为{}，表示查询所有数据）
 * @returns [Promise]  { code: xxx, message: xxxxx, data: [] }
 * 示例：
 * conditions: {
 *    condtion: ['name@like:小明', 'year@>:16', ['id@=:1', 'name@=:kk']],  // 其中 @ 和 ：为固定格式。运算符包含： !=, =, >, >=, <, <=, IN, NOTIN, LIKE, BETWEENAND 。数组内元素为数组时，该元素内部条件用 OR 连接。
 *    otherCond: "likes LIKE '%dog_'"   //其他已经组织好的sql语句
 *    orderby: ['name@desc', 'id@asc'],   // 其中 @ 为固定格式。值包含： desc、asc
 *    groupby: name,   // 分组
 *    limit: [n, s],   // limit限制条件：从结果的第s条时（s是下标，从0开始）保留n条数据，一般用做分页功能；使用limit必须带上order by
 * }
 */
export function queryDataByCond(tableName: string, arrField: string[], conditions?: ConditionType): Promise<ResultType> {
    const sql = _formatQuerySql(tableName, arrField, conditions) + ";";

    return new Promise((resolve, reject) => {
        connect.query(sql, (err: any, result: any) => {
            if (err) {
                reject({
                    code: err.errno,
                    message: err.message
                });
                return;
            }
            resolve({
                code: 200,
                message: "",
                data: result
            });
        });
    });
}

/**
 * 功能：UNION联合条件查询
 * 描述：
 * 1、传参结构可以理解为 queryDataByCond 方法传参的；
 * 2、UNION联合查询，限制、排序、分组等功能只能放在最后写，所以只有最后一个条件定义的才生效
 * 3、SQL语句：SELECT field1,field2 FROM table_name [WHERE conditions]  UNION [ALL | DISTINCT]  SELECT field1,field2 FROM table_name1 [WHERE conditions];
 * @param arrTableName 表名的集合
 * @param arrFields 查询的字段集合 （为[][]表示查询所有字段）
 * @param arrConditions 查询条件集合（null[]，或者为{}[]，表示查询所有数据）
 * @param unionType 联合的方式：ALL-保留重复的值、DISTINCT-默认值，合并重复的值
 * @returns [Promise]  { code: xxx, message: xxxxx, data: [] }
 * 示例：
 * conditions: {
 *    condtion: ['name@like:小明', 'year@>:16', ['id@=:1', 'name@=:kk']],  // 其中 @ 和 ：为固定格式。运算符包含： !=, =, >, >=, <, <=, IN, NOTIN, LIKE, BETWEENAND 。数组内元素为数组时，该元素内部条件用 OR 连接。
 *    otherCond: "likes LIKE '%dog_'"   //其他已经组织好的sql语句
 *    orderby: ['name@desc', 'id@asc'],   // 其中 @ 为固定格式。值包含： desc、asc
 *    groupby: name,   // 分组
 *    limit: [n, s],   // limit限制条件：从结果的第s条时（s是下标，从0开始）保留n条数据，一般用做分页功能；使用limit必须带上order by
 * }
 */
export function queryDataByCond_union(arrTableName: string[], arrFields: string[][], arrConditions?: ConditionType[], unionType?: "ALL" | "DISTINCT" | ""): Promise<ResultType> {
    let allSql = "";

    if (!unionType) unionType = "";

    arrTableName.forEach((tableName, index) => {
        if (index === arrTableName.length - 1) {
            const sql = _formatQuerySql(tableName, arrFields[index], arrConditions[index]);
            allSql += `${sql};`;
        } else {
            // UNION联合查询，限制、排序、分组等功能只能放在最后写，所以只有最后一个条件定义的才生效：
            delete arrConditions[index].groupby;
            delete arrConditions[index].orderby;
            delete arrConditions[index].limit;
            const sql = _formatQuerySql(tableName, arrFields[index], arrConditions[index]);
            allSql += `${sql} UNION ${unionType} `;
        }
    });

    return new Promise((resolve, reject) => {
        connect.query(allSql, (err: any, result: any) => {
            if (err) {
                reject({
                    code: err.errno,
                    message: err.message
                });
                return;
            }
            resolve({
                code: 200,
                message: "",
                data: result
            });
        });
    });
}

/**
 * 功能：嵌套条件查询
 * 描述：
 * 1、objData参数中，根arrField属性可以有多个字段，其他都只能有一个字段
 * 2、SQL语句：SELECT *  FROM  goods  WHERE  goodsId  IN  (SELECT  goodsId  FROM  order WHERE  xxfield  IN  (SELECT  xxFields  FROM  xxTable));
 * @param objData 嵌套查询结构体，见示例
 * @returns [Promise]  { code: xxx, message: xxxxx, data: [] }
 * 示例：
 * const objData = {
 *     tableName: "db11",
 *     arrField: ["name", "id"],
 *     selectField: "name",
 *     conditions: {
 *         condition: ["age@=:56"]
 *     },
 *     children: {
 *         tableName: "students",
 *         arrField: ["name"],  // 只能有一个字段
 *         selectField: "id",
 *         conditions: {
 *             condition: ["id@>:0"]
 *         },
 *         children: {
 *             tableName: "kzttest5",
 *             arrField: ["id"],  // 只能有一个字段
 *             selectField: "",
 *             conditions: {
 *                 condition: ["id@>:0"]
 *             },
 *         }
 *     }
 * };
 * conditions: {
 *    condtion: ['name@like:小明', 'year@>:16', ['id@=:1', 'name@=:kk']],  // 其中 @ 和 ：为固定格式。运算符包含： !=, =, >, >=, <, <=, IN, NOTIN, LIKE, BETWEENAND 。数组内元素为数组时，该元素内部条件用 OR 连接。
 *    otherCond: "likes LIKE '%dog_'"   //其他已经组织好的sql语句
 * }
 */
export function queryDataByCond_nest(objData: NestCondType): Promise<ResultType> {
    let sql = "";

    sql += _formatNestQuery(objData.selectField, objData);

    // 将开头多余的部分： `${selectField} IN (` ，以及末尾多出来的 ）删除：
    const indexTemp = sql.indexOf("(");
    sql = sql.slice(indexTemp + 1, -1);
    sql += ";";

    return new Promise((resolve, reject) => {
        connect.query(sql, (err: any, result: any) => {
            if (err) {
                reject({
                    code: err.errno,
                    message: err.message
                });
                return;
            }
            resolve({
                code: 200,
                message: "",
                data: result
            });
        });
    });
}

/**
 * 功能：嵌套查询函数的循环部分
 * @param selectField 需查询字段
 * @param data 嵌套查询结构体，见示例
 * @returns 输出SQL语句结构：goodsId IN (SELECT goodsId FROM order WHERE id > 1 AND ...)
 * 示例：
 * const data = {
 *     tableName: "db11",
 *     arrField: ["name", "id"],
 *     selectField: "name",
 *     conditions: {
 *         condition: ["age@=:56"]
 *     },
 *     children: {
 *         tableName: "students",
 *         arrField: ["name"],  // 只能有一个字段
 *         selectField: "id",
 *         conditions: {
 *             condition: ["id@>:0"]
 *         },
 *         children: {
 *             tableName: "kzttest5",
 *             arrField: ["id"],  // 只能有一个字段
 *             selectField: "",
 *             conditions: {
 *                 condition: ["id@>:0"]
 *             },
 *         }
 *     }
 * };
 */
function _formatNestQuery(selectField: string, data: NestCondType):string {
    // 嵌套查询函数，不允许有分组、排序、限制条数等配置：
    delete data?.conditions?.groupby;
    delete data?.conditions?.orderby;
    delete data?.conditions?.limit;

    let sql = `${selectField} IN (`;
    sql += _formatQuerySql(data.tableName, data.arrField, data.conditions);
    if (data.children) {
        if (data.conditions && Object.keys(data.conditions).length > 0) {
            sql += "AND ";
        } else {
            sql += "WHERE ";
        }
        sql += _formatNestQuery(data.selectField, data.children);
    }
    sql += ")";
    return sql;
}

/**
 * 功能：普通条件查询，输出完整的SQL语句
 * @param tableName 表名
 * @param arrField 查询的字段 [array] （为[]表示查询所有字段）
 * @param conditions 查询条件（可不传，或者为{}，表示查询所有数据）
 * @returns [string] 完整的条件查询SQL语句
 * 示例：
 * conditions: {
 *    condtion: ['name@like:小明', 'year@>:16', ['id@=:1', 'name@=:kk']],  // 其中 @ 和 ：为固定格式。运算符包含： !=, =, >, >=, <, <=, IN, NOTIN, LIKE, BETWEENAND 。数组内元素为数组时，该元素内部条件用 OR 连接。
 *    otherCond: "likes LIKE '%dog_'"   //其他已经组织好的sql语句
 *    orderby: ['name@desc', 'id@asc'],   // 其中 @ 为固定格式。值包含： desc、asc
 *    groupby: name,   // 分组
 *    limit: [n, s],   // limit限制条件：从结果的第s条时（s是下标，从0开始）保留n条数据，一般用做分页功能；使用limit必须带上order by
 * }
 */
function _formatQuerySql(tableName: string, arrField: string[], conditions?: ConditionType):string {
    let sql = "";
    const fieldSql = arrField?.length === 0 ? "*" : arrField.join(",");
    if (!conditions) {
        sql = `SELECT ${fieldSql} FROM ${tableName} `;
    } else {
        sql = _formatCondSql(conditions);
        sql = `SELECT ${fieldSql} FROM ${tableName} ` + sql;
    }

    return sql;
}

/**
 * 功能：普通条件查询，输出条件部分（即 WHERE 后的语句）的SQL语句
 * 描述：
 * 1、LIKE 运算符：目前只能实现固定格式的匹配（%xxx%），如果需要更灵活的使用，请在 conditions.otherCond 中自行组织好sql语句。
 * 2、目前对于数组类型的数据，在SQL语句中也为其加上了引号，亲测查询没有问题。
 * @param conditions 查询条件（可不传，或者为{}，表示查询所有数据）
 * @returns [string]  条件部分的SQL语句
 * 示例：
 * conditions: {
 *    condtion: ['name@like:小明', 'year@>:16', ['id@=:1', 'name@=:kk']],  // 其中 @ 和 ：为固定格式。运算符包含： !=, =, >, >=, <, <=, IN, NOTIN, LIKE, BETWEENAND 。数组内元素为数组时，该元素内部条件用 OR 连接。
 *    otherCond: "likes LIKE '%dog_'"   //其他已经组织好的sql语句
 *    orderby: ['name@desc', 'id@asc'],   // 其中 @ 为固定格式。值包含： desc、asc
 *    groupby: name,   // 分组
 *    limit: [n, s],   // limit限制条件：从结果的第s条时（s是下标，从0开始）保留n条数据，一般用做分页功能；使用limit必须带上order by
 * }
 */
function _formatCondSql(conditions: ConditionType):string {
    let sql = "";
    if (conditions.condition) {
        conditions.condition.forEach((conds) => {
            if (typeof conds === "string") {
                // arrTemp = [name, =, '小米']
                const arrTemp = conds.split(/@|:/);
                // 将英文运算法，转为大写：
                const upperOperator = arrTemp[1].toLocaleUpperCase();
                switch (upperOperator) {
                    case "IN":
                        let arrValue = arrTemp[2].split(",");
                        // 字符串数据，需要手动加上引号：
                        arrValue = arrValue.map((item: any) => `'${item}'`);
                        sql += `AND ${arrTemp[0]} ${upperOperator} (${arrValue.join(",")}) `;
                        break;
                    case "NOTIN":
                        let arrValue1 = arrTemp[2].split(",");
                        // 字符串数据，需要手动加上引号：
                        arrValue1 = arrValue1.map((item: any) => `'${item}'`);
                        sql += `AND ${arrTemp[0]} NOT IN (${arrValue1.join(",")}) `;
                        break;
                    case "BETWEENAND":
                        let arrValue2 = arrTemp[2].split(",");
                        // 字符串数据，需要手动加上引号：
                        arrValue2 = arrValue2.map((item: any) => `'${item}'`);
                        sql += `AND ${arrTemp[0]} BETWEEN ${arrValue2[0]} AND ${arrValue2[1]} `;
                        break;
                    case "LIKE":
                        // LIKE 运算符，目前只能实现固定格式的匹配（%xxx%），如果需要更灵活的使用，请在 conditions.otherCond 中自行组织好sql语句
                        sql += `AND ${arrTemp[0]} ${upperOperator} '%${arrTemp[2]}%' `;
                        break;
                    default:  /**  !=, =, >, >=, <, <=  */
                        sql += `AND ${arrTemp[0]} ${upperOperator} '${arrTemp[2]}' `;
                        break;
                }
            } else {
                sql += "AND (";
                // 数组内元素为数组时，该元素内部条件用 OR 连接。
                conds.forEach((cond: string) => {
                    // arrTemp = [name, =, '小米']
                    const arrTemp = cond.split(/@|:/);
                    // 将英文运算法，转为大写：
                    const upperOperator = arrTemp[1].toLocaleUpperCase();
                    switch (upperOperator) {
                        case "IN":
                            let arrValue = arrTemp[2].split(",");
                            // 字符串数据，需要手动加上引号：
                            arrValue = arrValue.map((item: any) => `'${item}'`);
                            sql += `${arrTemp[0]} ${upperOperator} (${arrValue.join(",")}) OR `;
                            break;
                        case "NOTIN":
                            let arrValue1 = arrTemp[2].split(",");
                            // 字符串数据，需要手动加上引号：
                            arrValue1 = arrValue1.map((item: any) => `'${item}'`);
                            sql += `${arrTemp[0]} NOT IN (${arrValue1.join(",")}) OR `;
                            break;
                        case "BETWEENAND":
                            let arrValue2 = arrTemp[2].split(",");
                            // 字符串数据，需要手动加上引号：
                            arrValue2 = arrValue2.map((item: any) => `'${item}'`);
                            sql += `${arrTemp[0]} BETWEEN ${arrValue2[0]} AND ${arrValue2[1]} OR `;
                            break;
                        case "LIKE":
                            // LIKE 运算符，目前只能实现固定格式的匹配（%xxx%），如果需要更灵活的使用，请在 conditions.otherCond 中自行组织好sql语句
                            sql += `${arrTemp[0]} ${upperOperator} '%${arrTemp[2]}%' OR `;
                            break;
                        default:  /**  !=, =, >, >=, <, <=  */
                            sql += `${arrTemp[0]} ${upperOperator} '${arrTemp[2]}' OR `;
                            break;
                    }
                });
                // 将末尾多余的 OR 替换为 )：
                sql = sql.replace(/ OR $/, ") ");
            }
        });
    }

    // 拼接上用户自定义SQL语句：
    if (conditions.otherCond) sql += "AND " + conditions.otherCond + " ";

    if (conditions.groupby) {
        sql += `GROUP BY ${conditions.groupby} `;
    }

    if (conditions.orderby) {
        sql += "ORDER BY ";
        conditions.orderby.forEach((order) => {
            const arrTemp = order.split("@");
            sql += `${arrTemp[0]} ${arrTemp[1].toLocaleUpperCase()}, `;
        });
        // 将末尾的 , 删除：
        sql = sql.replace(/, $/, " ");
    }

    if (conditions.limit) {
        sql += `LIMIT ${conditions.limit[0]} OFFSET ${conditions.limit[1]} `;
    }

    // 将开头的 AND\s 或者 OR\s 删除：
    sql = sql.replace(/AND | OR /, "");
    if (sql) sql = "WHERE " + sql;
    return sql;
}



