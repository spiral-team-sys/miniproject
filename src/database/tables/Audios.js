export const Audios = {
    tableName: 'audios', tableFields: [
        { columnName: 'id', dataType: 'INTEGER PRIMARY KEY AUTOINCREMENT' },
        { columnName: 'shopId', dataType: 'BIGINT' },
        { columnName: 'audioDate', dataType: 'INTEGER' },
        { columnName: 'audioTime', dataType: 'INTEGER' },
        { columnName: 'reportId', dataType: 'INTEGER' },
        { columnName: 'dataUpload', dataType: 'INTEGER' },
        { columnName: 'fileUpload', dataType: 'INTEGER' },
        { columnName: 'fileTime', dataType: 'VARCHAR(32)' },
        { columnName: 'fileName', dataType: 'VARCHAR(128)' },
        { columnName: 'audioPath', dataType: 'VARCHAR(500)' },
        { columnName: 'guid', dataType: 'VARCHAR(32)' }
    ]
}