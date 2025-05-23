export const AxleList = {
    tableName: 'axleList',
    tableFields: [
        { columnName: 'id', dataType: 'INTEGER' },
        { columnName: 'carCode', dataType: 'VARCHAR(125)' },
        { columnName: 'axleCode', dataType: 'VARCHAR(125)' },
        { columnName: 'masterName', dataType: 'NVARCHAR(256)' },
        { columnName: 'dataAxle', dataType: 'NVARCHAR(5000)' },
        { columnName: 'PRIMARY', dataType: 'KEY(id)' },
    ]
}