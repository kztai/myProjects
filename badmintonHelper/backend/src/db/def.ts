
export const FieldAttrMap = {
    type: "type",
    length: "length",    // 存储长度
    scale: "scale",      // 标度（浮点数和定点数类型特有）
    enumType: "enumType",   // 枚举值（枚举字段特有）
    require: "require",
    autoIncrement: "autoIncrement",   //是否自增
    unique: "unique",
    primaryKey: "primaryKey",
    comment: "comment",
    default: "default",           //默认值
    characterSet: "characterSet",   //字符集
    collate: "collate",    // 设置字符类型比较或排序的规则
    indexName: "indexName"
} as const;

// "INT" | "TINYINT" | "BIGINT" | "FLOAT" | "DOUBLE" | "DECIMAL" | "YEAR" | "TIME" | "DATE" | "DATETIME" | "TIMESTAMP" | "CHAR" | "VARCHAR" | "TINYTEXT" | "TEXT" | "LONGTEXT" | "ENUM" | "BLOB";
export const FieldTypeMap = {
    int: "INT",
    tinyint: "TINYINT",
    bigint: "BIGINT",
    float: "FLOAT",
    double: "DOUBLE",
    decimal: "DECIMAL",
    year: "YEAR",
    time: "TIME",
    date: "DATE",
    datetime: "DATETIME",
    timestamp: "TIMESTAMP",
    char: "CHAR",
    varchar: "VARCHAR",
    tinytext: "TINYTEXT",
    text: "TEXT",
    longtext: "LONGTEXT",
    enum: "ENUM",
    blob: "BLOB",
} as const;