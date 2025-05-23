'use strict'
import SQLite from 'react-native-sqlite-storage';
import { Tables } from './Tables';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KEYs } from '../utils/storageKeys';
import appConfig from '../utils/appConfig/appConfig';
SQLite.enablePromise(true);

export const getDatabaseName = async () => {
    const userinfo = JSON.parse(await AsyncStorage.getItem(KEYs.STORAGE.USER_INFO) || '{}')
    return `database_${appConfig.APPID}_${userinfo.employeeId}.db`
}
//
const openDatabase = async (employeeId) => {
    try {
        let databaseName = null;
        if (employeeId) {
            databaseName = `database_${appConfig.APPID}_${employeeId}.db`
        } else {
            databaseName = await getDatabaseName()
        }
        return await SQLite.openDatabase({ name: databaseName, location: 'default' });
    } catch (error) {
        console.log('Error opening database:', error);
    }
};
const closeDatabase = (db) => {
    db.close()
}
const initializeDatabase = async (employeeId) => {
    try {
        const db = await openDatabase(employeeId);
        await createTable(db, Tables.storeList);
        await createTable(db, Tables.mobileRaw);
        await createTable(db, Tables.audios)
        await createTable(db, Tables.photos)
        await createTable(db, Tables.menuList)
        await createTable(db, Tables.masterList)
        await createTable(db, Tables.attendanceMode)
        await createTable(db, Tables.notification)
        await createTable(db, Tables.provinceList)
        await createTable(db, Tables.axleList)
        return db;
    } catch (error) {
        console.error('Lỗi khởi tạo Database:', error);
    }
};
const updateColumnDatabase = async () => {
    try {

    } catch (e) {
        console.log(e);
    }
};
//
const createTable = async (db, tableinfo) => {
    try {
        const fields = tableinfo.tableFields.map(field => `${field.columnName} ${field.dataType}`).join(', ');
        const query = `CREATE TABLE IF NOT EXISTS ${tableinfo.tableName} (${fields});`;
        await db.executeSql(query);
    } catch (error) {
        console.error(`Lỗi tạo bảng ${tableinfo.tableName}:`, error);
    }
};
const executeSQL = async (sql, params = []) => {
    const db = await openDatabase();
    try {
        const results = await new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    sql,
                    params,
                    (_tx, results) => resolve(results),
                    (_tx, error) => reject(error)
                );
            });
        });
        // 
        const items = [];
        for (let i = 0; i < results.rows.length; i++) {
            items.push(results.rows.item(i));
        }
        return { items };
    } catch (error) {
        return { items: [], error };
    }
};
const executeINSERT = async (tableinfo, dataArray) => {
    try {
        const db = await openDatabase();
        if (!Array.isArray(tableinfo.tableFields)) {
            throw new Error(`Parameter tableFields expects an array but got ${typeof tableinfo.tableFields}`);
        }
        if (!Array.isArray(dataArray)) {
            throw new Error(`Parameter dataArray expects an array but got ${typeof dataArray}`);
        }
        let parameter = [];
        let columns = tableinfo.tableFields
            .map(col => col.columnName)
            .filter(col => col !== 'PRIMARY');
        columns.forEach(p => { parameter.push('?') })

        let stringSql = `INSERT OR IGNORE INTO ${tableinfo.tableName}(${columns.toString()}) VALUES(${parameter.toString()})`;
        let rowsAffected = 0;
        // 
        for (const rowData of dataArray) {
            let rowItem = columns.map(colName => rowData[colName] !== undefined ? rowData[colName] : null);
            await new Promise((resolve, reject) => {
                db.transaction(tx => {
                    tx.executeSql(stringSql, rowItem, (tx, results) => {
                        rowsAffected += results.rowsAffected;
                        resolve();
                    }, (error) => {
                        reject(error);
                    });
                });
            });
        }
        return rowsAffected;
    } catch (e) {
        console.error(`Lỗi thêm dữ liệu: ${tableinfo.tableName}: ${e.message}`);
        return { error: e };
    }
};
const executeDELETE = async (tableinfo, whereClause, whereArgs) => {
    try {
        const db = await openDatabase();
        let sql = `DELETE FROM ${tableinfo.tableName}`;
        if (!whereClause || !whereArgs) {
            await db.transaction(async (tx) => {
                await tx.executeSql(sql);
            });
        } else {
            await db.transaction(async (tx) => {
                await tx.executeSql(`${sql} WHERE ${whereClause}`, whereArgs);
            });
        }
        return { error: null, message: "Xóa thành công", isSuccess: true };
    } catch (error) {
        console.error("Lỗi khi thực hiện xóa:", error);
        return { error: error.message, isSuccess: false };
    }
};
// Update Table
const addColumn = async (tableinfo, columnName, columnType = 'TEXT') => {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`PRAGMA table_info(${tableinfo.tableName});`, [],
                (tx, result) => {
                    const columns = [];
                    for (let i = 0; i < result.rows.length; i++) {
                        columns.push(result.rows.item(i).name);
                    }
                    if (!columns.includes(columnName)) {
                        tx.executeSql(
                            `ALTER TABLE ${tableinfo.tableName} ADD COLUMN ${columnName} ${columnType};`,
                            [],
                            (tx, result) => { resolve(result) },
                            (tx, error) => { reject(error) }
                        );
                    } else {
                        resolve('Cột đã tồn tại');
                    }
                },
                (tx, error) => {
                    console.error(`Lỗi khi lấy thông tin bảng: ${error.message}`);
                    reject(error);
                }
            );
        });
    });
};
// Share Database
const refreshDatabase = async () => {
    const db = await openDatabase();
    await closeDatabase(db);
};
//
export const Database = {
    initializeDatabase,
    openDatabase,
    closeDatabase,
    createTable,
    executeSQL,
    executeINSERT,
    executeDELETE
}
export const UpdateDatabase = {
    addColumn, updateColumnDatabase, refreshDatabase
}