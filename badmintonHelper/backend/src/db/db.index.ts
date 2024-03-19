import mysql from "mysql";

/**
 * 连接数据库
 * dbName：数据库名称
 */
export function dbConnect(dbName: string) {
    const db = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "806146",
        database: dbName,
        debug: true,
        multipleStatements: true,
        connectTimeout: 1000 * 60 * 60
    });

    db.connect();

    return db;
}

