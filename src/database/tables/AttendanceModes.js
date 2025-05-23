export const AttendanceModes = {
    tableName: 'attendanceModes', tableFields: [
        { columnName: 'id', dataType: 'INTEGER' },
        { columnName: 'shopId', dataType: 'BIGINT' },
        { columnName: 'auditDate', dataType: 'INTEGER' },
        { columnName: 'mode', dataType: 'VARCHAR(10)' },
        { columnName: 'reasonId', dataType: 'INTEGER' },
        { columnName: 'reasonName', dataType: 'NVARCHAR(512)' },
        { columnName: 'note', dataType: 'NVARCHAR(512)' },
        { columnName: 'isDoneReport', dataType: 'INTEGER' },
        { columnName: 'PRIMARY', dataType: 'KEY(shopId,auditDate)' },
    ]
}