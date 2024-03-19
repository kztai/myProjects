import { createDB, useDB } from "./db/db.database";
import { queryDataByCond_union, queryDataByCond_nest, updateDataById, updateDataByCond } from "./db/db.crud";
import { createTable, showAllTables } from "./db/db.table";



export function init() {
    // createDB("db11");
    // useDB("db11");


    const obj: any = {
        "id": {
            "type": "INT",    // INT、TINYINT、BIGINT、FLOAT、DOUBLE、DECIMAL、YEAR、TIME、DATE、DATETIME、TIMESTAMP、CHAR、VARCHAR、TINYTEXT、TEXT、LONGTEXT、ENUM、BLOB
            "length": 32,    // 存储长度
            "require": true,
            "autoIncrement": true,   //是否自增
            "primaryKey": true,
            "comment": "id",
        },
        "name11": {
            "type": "VARCHAR",    // INT、TINYINT、BIGINT、FLOAT、DOUBLE、DECIMAL、YEAR、TIME、DATE、DATETIME、TIMESTAMP、CHAR、VARCHAR、TINYTEXT、TEXT、LONGTEXT、ENUM、BLOB
            "comment": "姓名",
            length: 32,
        },
        number: {
            "type": "DOUBLE",    // INT、TINYINT、BIGINT、FLOAT、DOUBLE、DECIMAL、YEAR、TIME、DATE、DATETIME、TIMESTAMP、CHAR、VARCHAR、TINYTEXT、TEXT、LONGTEXT、ENUM、BLOB
            "length": 22,    // 存储长度
            "comment": "数字",
            scale: 4,      // 标度（浮点数和定点数类型特有）
            default: 12.58888,
            unique: true,
        },
        "enum1": {
            "type": "ENUM",    // INT、TINYINT、BIGINT、FLOAT、DOUBLE、DECIMAL、YEAR、TIME、DATE、DATETIME、TIMESTAMP、CHAR、VARCHAR、TINYTEXT、TEXT、LONGTEXT、ENUM、BLOB
            "length": 600,    // 存储长度
            "comment": "enum1",
            enumType: [1, 2, 3],
        },
        datetime: {
            "type": "TIMESTAMP",    // INT、TINYINT、BIGINT、FLOAT、DOUBLE、DECIMAL、YEAR、TIME、DATE、DATETIME、TIMESTAMP、CHAR、VARCHAR、TINYTEXT、TEXT、LONGTEXT、ENUM、BLOB
            "length": 60,    // 存储长度
            "comment": "日期1",
            default: "2023-10-12 11:11:11",
        }
    };

    const OtherTableAttr = {
        INDEX: {
            indexName: "index1",
            indexField: ["id", "name11"]
        },
        ENGINE: "MyISAM",
        AUTO_INCREMENT: 10,
        "CHARACTER SET": "utf8mb4",
        COLLATE: "utf8mb4_unicode_ci",
        ROW_FORMAT: "Dynamic",
    };
    // createTable("kzt_test17", obj, OtherTableAttr);


    showAllTables().then((res: any) => {
        console.log(res.data);
    });







    const addCol = {
        "cc": {
            "type": "INT",    // INT、TINYINT、BIGINT、FLOAT、DOUBLE、DECIMAL、YEAR、TIME、DATE、DATETIME、TIMESTAMP、CHAR、VARCHAR、TINYTEXT、TEXT、LONGTEXT、ENUM、BLOB
            "length": 22,    // 存储长度
            "require": true,
            "comment": "aaa",
        },
        "dd": {
            "type": "VARCHAR",    // INT、TINYINT、BIGINT、FLOAT、DOUBLE、DECIMAL、YEAR、TIME、DATE、DATETIME、TIMESTAMP、CHAR、VARCHAR、TINYTEXT、TEXT、LONGTEXT、ENUM、BLOB
            "comment": "姓名-bbb",
            length: 25,
        },
    };

    // database.insertData("db11", ["name", "number", "datetime"], [
    //     ["kk", 1233345, "2024-02-23 11:11:22"],
    //     ["zz", 1234345, "2024-02-24 11:11:22"],
    //     ["tt", 1245345, "2024-02-25 11:11:22"],
    // ]).then((res:any) => {
    //     console.log(res);
    // });

    // const condObj = [["id@=:11", "number@in:111,222", "age@>=:131", "name@like:kzt1"], ["id@=:11", "number@in:111,222", "age@>=:131", "name@like:kzt1"]];
    const conditions: any = {
        condition: ["id@>:43", "name@like:k"],
        otherCond: "number LIKE '123%'",
        groupby: "id",
        orderby: ["name@desc", "id@asc"],
        limit: [10, 0],
    };
    const conditions1:any = {
        condition: ["id@>:1", "name@like:k"],
        otherCond: "number LIKE '123%'",
        // groupby: "id",
        orderby: ["name@desc", "id@asc"],
        limit: [10, 0],
    };
    queryDataByCond_union(["db11", "students"], [["id", "name"], ["id", "name"]], [conditions, conditions1], "ALL").then((res: any) => {
        console.log(res.data);
    });


    // SELECT *  FROM  goods  WHERE  goodsId  IN  (SELECT  goodsId  FROM  order WHERE  xxfield  IN  (SELECT  xxFields  FROM  xxTable));
    const objData: any = {
        tableName: "db11",
        arrField: ["name", "id"],
        selectField: "name",
        conditions: {
            condition: ["age@=:56"]
        },
        children: {
            tableName: "students",
            arrField: ["name"],
            selectField: "id",
            conditions: {
                condition: ["id@>:0"]
            },
            children: {
                tableName: "kzttest5",
                arrField: ["id"],
                selectField: "",
                conditions: {
                    condition: ["id@>:0"]
                },
            }
        }
    };
    queryDataByCond_nest(objData).then((res: any) => {
        console.log(res.data);
    });




    const fieldData = {
        name: "ppp",
        money: 555,
        age: 6667,
    };
    // updateDataById("db11", fieldData, [47, 48]).then((res: any) => {
    //     console.log(res.data);
    // });



    updateDataByCond("db11", fieldData, conditions1).then((res: any) => {
        console.log(res.data);
    });

}


