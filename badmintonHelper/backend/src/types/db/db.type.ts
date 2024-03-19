import { FieldAttrMap } from "@/db/def";

type FieldType = "INT" | "TINYINT" | "BIGINT" | "FLOAT" | "DOUBLE" | "DECIMAL" | "YEAR" | "TIME" | "DATE" | "DATETIME" | "TIMESTAMP" | "CHAR" | "VARCHAR" | "TINYTEXT" | "TEXT" | "LONGTEXT" | "ENUM" | "BLOB";

export interface FieldAttr {
    [FieldAttrMap.type]: FieldType;
    [FieldAttrMap.length]?: number;    // 存储长度
    [FieldAttrMap.scale]?: number;      // 标度（浮点数和定点数类型特有）
    [FieldAttrMap.enumType]?: any[];   // 枚举值（枚举字段特有）
    [FieldAttrMap.require]?: boolean;
    [FieldAttrMap.autoIncrement]?: boolean;   //是否自增
    [FieldAttrMap.unique]?: boolean;
    [FieldAttrMap.primaryKey]?: boolean;
    [FieldAttrMap.comment]?: string;
    [FieldAttrMap.default]?: any;           //默认值
    [FieldAttrMap.characterSet]?: string;   //字符集
    [FieldAttrMap.collate]?: string;    // 设置字符类型比较或排序的规则
    [FieldAttrMap.indexName]?: string    // 索引名：默认不传，传了表示该字段设索引
}

export interface FieldInfo {
    [propName: string]: FieldAttr
}

interface IndexType {
    indexName: string
    indexField: string[]
}
export interface OtherTableAttr {
    INDEX?: IndexType  //联合索引
    ENGINE?: string  // 引擎
    AUTO_INCREMENT?: number  // 按多少来自增
    "CHARACTER SET"?: string  //字符集
    COLLATE?: string  // 设置字符类型比较或排序的规则
    ROW_FORMAT?: string  //存储引擎使用的行数据格式(包括COMPACT、REDUNDANT和DYNAMIC)
}

export interface ConditionType {
    condition?: (string | string[])[]
    orderby?: string[]
    groupby?: string
    limit?: [number, number]
    otherCond?: string
}

export interface NestCondType {
    tableName: string
    arrField: string[]
    selectField?: string
    conditions?: ConditionType
    children?: NestCondType
}