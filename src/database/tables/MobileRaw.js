export const MobileRaw = {
    tableName: 'mobileRaw',
    tableFields: [
        { columnName: 'id', dataType: 'INTEGER PRIMARY KEY AUTOINCREMENT' },
        { columnName: 'shopId', dataType: 'INTEGER' },
        { columnName: 'reportId', dataType: 'INTEGER' },
        { columnName: 'reportDate', dataType: 'INTEGER' },
        { columnName: 'jsonData', dataType: 'NVARCHAR(1024)' },
        { columnName: 'jsonPhoto', dataType: 'NVARCHAR(1024)' },
        { columnName: 'isUploaded', dataType: 'INTEGER' },
        { columnName: 'isLocked', dataType: 'INTEGER' },
        { columnName: 'lastUpdate', dataType: 'VARCHAR(256)' },
    ],
    constraints: 'UNIQUE (shopId, reportId, reportDate)'
};