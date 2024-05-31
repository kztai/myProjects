import { FieldAttrMap, FieldTypeMap } from "./def";
import { FieldInfo, FieldAttr, OtherTableAttr } from "@/types/db/db.type";
import { ResultType } from "@/types/index";
import { connect } from "../models/index";

// 创建表：
export function createTable(tableName: string, fieldInfo: FieldInfo, otherSet: OtherTableAttr = {}): Promise<ResultType> {
    let allSql = `CREATE TABLE IF NOT EXISTS ${tableName} (`;

    // 设置每个字段属性：
    allSql += _fieldSqlHandler(fieldInfo);

    // 设置单、多字段索引：
    if (otherSet.INDEX) {
        allSql += `INDEX ${otherSet.INDEX.indexName}(${otherSet.INDEX.indexField.join(",")}),`;
    }

    // 删除最后一个逗号：
    allSql = allSql.slice(0, -1);

    allSql += ")";

    delete otherSet.INDEX;

    // 设置其他表格的属性：
    Object.keys(otherSet).forEach((attrName: string) => {
        allSql += ` ${attrName} = ${otherSet[attrName]}`;
    });

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
                message: result.message
            });
        });
    });
}

// 显示当前数据库下有哪些表：
export function showAllTables(): Promise<ResultType> {
    const sql = "SHOW TABLES;";

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
                data: result.map((res: any) => res[Object.keys(res)[0]])
            });
        });
    });
}

// 删除表：
export function deleteTable(arrTableName: string[]): Promise<ResultType> {
    if (arrTableName.length === 0) return Promise.resolve({
        code: 200,
        message: ""
    });

    let sql = "DROP TABLE ";
    arrTableName.forEach((tableName: string) => {
        sql += tableName + ",";
    });
    sql = sql.replace(/,$/, ";");

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

// 表重命名：
export function alterTableName(oldTableName: string, newTableName: string): Promise<ResultType> {
    const sql = `ALTER TABLE ${oldTableName} RENAME ${newTableName};`;

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

// 表新增列：
export function tableColAdd(tableName: string, fieldInfo: FieldInfo): Promise<ResultType> {
    let sql = `ALTER TABLE ${tableName} ADD (`;
    sql += _fieldSqlHandler(fieldInfo);

    // 删除最后一个逗号：
    sql = sql.slice(0, -1);

    sql += ");";

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

// 表修改列：
export function tableColModify(tableName: string, oldColName: string, newColName: string, fieldAttr: FieldAttr): Promise<ResultType> {
    //    fieldAttr = {
    //         type: "INT",    // INT、TINYINT、BIGINT、FLOAT、DOUBLE、DECIMAL、YEAR、TIME、DATE、DATETIME、TIMESTAMP、CHAR、VARCHAR、TINYTEXT、TEXT、LONGTEXT、ENUM、BLOB
    //         length: 32,    // 存储长度
    //         scale: 2,      // 标度（浮点数和定点数类型特有）
    //         enumType: [],   // 枚举值（枚举字段特有）
    //         require: true,
    //         autoIncrement: true,   //是否自增
    //         unique: true,
    //         primaryKey: true,
    //         comment: "描述",
    //         default: "默认值",
    //         indexName: "id_index",    // 索引名：默认不传，传了表示该字段设索引
    //     }

    const tempFieldInfo = {
        [newColName]: fieldAttr
    };
    let sql = `ALTER TABLE ${tableName} CHANGE ${oldColName} `;
    sql += _fieldSqlHandler(tempFieldInfo);

    // 删除最后一个逗号：
    sql = sql.slice(0, -1);

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
                message: result.message
            });
        });
    });
}

// 表删除列：
export function tableColDelete(tableName: string, colName: string): Promise<ResultType> {
    const sql = `ALTER TABLE ${tableName} drop ${colName};`;

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

// 组织字段属性的SQL语句：
function _fieldSqlHandler(fieldInfo: FieldInfo): string {
    // fieldInfo = {
    //     id: {
    //         type: "INT",    // INT、TINYINT、BIGINT、FLOAT、DOUBLE、DECIMAL、YEAR、TIME、DATE、DATETIME、TIMESTAMP、CHAR、VARCHAR、TINYTEXT、TEXT、LONGTEXT、ENUM、BLOB
    //         length: 32,    // 存储长度
    //         scale: 2,      // 标度（浮点数和定点数类型特有）
    //         enumType: [],   // 枚举值（枚举字段特有）
    //         require: true,
    //         autoIncrement: true,   //是否自增
    //         unique: true,
    //         primaryKey: true,
    //         comment: "描述",
    //         default: "默认值",
    //         indexName: "id_index",    // 索引名：默认不传，传了表示该字段设索引
    //     }
    // };
    let allSql = "";
    Object.keys(fieldInfo).forEach((fieldName: string) => {
        let sql = `${fieldName} `;
        const fieldAttr: FieldAttr = fieldInfo[fieldName];

        for (const key in fieldAttr) {
            switch (key) {
                case FieldAttrMap.type:
                    sql += _fieldTypeHandler(fieldAttr[key], fieldAttr);
                    break;
                case FieldAttrMap.require:
                    sql += fieldAttr[key] ? "NOT NULL " : "";
                    break;
                case FieldAttrMap.autoIncrement:
                    sql += fieldAttr[key] ? "AUTO_INCREMENT " : "";
                    break;
                case FieldAttrMap.unique:
                    sql += fieldAttr[key] ? "UNIQUE " : "";
                    break;
                case FieldAttrMap.primaryKey:
                    sql += fieldAttr[key] ? "PRIMARY KEY " : "";
                    break;
                case FieldAttrMap.comment:
                    sql += `COMMENT "${fieldAttr[key]}" `;
                    break;
                case FieldAttrMap.default:
                    sql += typeof fieldAttr[key] === "string" ? `DEFAULT "${fieldAttr[key]}" ` : `DEFAULT ${fieldAttr[key]} `;
                    break;
            }
        }

        sql += ",";

        // 设置单字段索引：
        if (fieldAttr[FieldAttrMap.indexName]) {
            sql += `INDEX ${fieldAttr[FieldAttrMap.indexName]}(${fieldName}),`;
        }

        allSql += sql;
    });

    return allSql;
}

// 创建表-处理字段类型：
function _fieldTypeHandler(fieldType: string, objFieldAttr: FieldAttr): string {
    fieldType = fieldType.toLocaleUpperCase();
    let sql = "";
    switch (fieldType) {
        case FieldTypeMap.float:
        case FieldTypeMap.double:
        case FieldTypeMap.decimal:
            // 判断用户是否定义了精度与标度：
            sql += objFieldAttr[FieldAttrMap.length] && objFieldAttr[FieldAttrMap.scale] ? fieldType + `(${objFieldAttr[FieldAttrMap.length]}, ${objFieldAttr[FieldAttrMap.scale]}) ` : fieldType + " ";
            break;
        case FieldTypeMap.char:
        case FieldTypeMap.varchar:
        case FieldTypeMap.blob:
            // 判断用户是否定义了精度与标度：
            sql += objFieldAttr[FieldAttrMap.length] ? fieldType + `(${objFieldAttr[FieldAttrMap.length]}) ` : fieldType + "(255) ";
            break;
        case FieldTypeMap.enum:

            if (objFieldAttr[FieldAttrMap.enumType] && Array.isArray(objFieldAttr[FieldAttrMap.enumType])) {
                // sql中enum类型不能存string以外的值：
                sql += fieldType + "(";
                objFieldAttr[FieldAttrMap.enumType].forEach(item => {
                    sql += `"${item}",`;
                });
                // 去除尾部逗号：
                sql = sql.slice(0, -1) + ") ";
            } else {
                sql += fieldType + " ";
            }
            break;
        default:
            sql += fieldType + " ";
            break;
    }

    return sql;
}

