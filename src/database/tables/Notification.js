export const Notification = {
    tableName: 'notification',
    tableFields:
        [
            { columnName: 'id', dataType: 'INTEGER' },
            { columnName: 'title', dataType: 'VARCHAR(250)' },
            { columnName: 'body', dataType: 'NVARCHAR(8000)' },
            { columnName: 'userId', dataType: 'INTEGER' },
            { columnName: 'refId', dataType: 'INTEGER' },
            { columnName: 'activeDate', dataType: 'VARCHAR(20)' },
            { columnName: 'disableDate', dataType: 'VARCHAR(20)' },
            { columnName: 'remove', dataType: 'INTEGER' },
            { columnName: 'accountId', dataType: 'INTEGER' },
            { columnName: 'groupName', dataType: 'NVARCHAR(50)' },
            { columnName: 'typeReport', dataType: 'VARCHAR(50)' },
            { columnName: 'typeName', dataType: 'NVARCHAR(50)' },
            { columnName: 'sended', dataType: 'INTEGER' },
            { columnName: 'year', dataType: 'INTEGER' },
            { columnName: 'month', dataType: 'INTEGER' },
            { columnName: 'hyperLinks', dataType: 'VARCHAR(250)' },
            { columnName: 'imageUrl', dataType: 'VARCHAR(250)' },
            { columnName: 'createdBy', dataType: 'INTEGER' },
            { columnName: 'createdDate', dataType: 'VARCHAR(20)' },
            { columnName: 'PRIMARY', dataType: 'KEY(id)' },
        ]
}