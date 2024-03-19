import { connect } from "../app";

// 创建数据库：
export function createDB(dbName: string) {
    const sql = "CREATE DATABASE IF NOT EXISTS " + dbName + ";";

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

// 删除数据库：
export function deleteDB(dbName: string) {
    const sql = "DROP DATABASE " + dbName + ";";

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

// 切换当前数据库：
export function useDB(dbName: string) {
    const sql = "USE " + dbName + ";";

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

// 显示所有数据库名称：
export function showAllDBName() {
    const sql = "SHOW DATABASES;";

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
                data: result.map((res: any) => res.Database)
            });
        });
    });
}

// 显示当前所使用的数据库名称：
export function showCurDBName() {
    const sql = "SELECT DATABASE();";

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
                data: result[0]["DATABASE()"]
            });
        });
    });
}


