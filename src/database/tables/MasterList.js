export const MasterList = {
    tableName: 'masterlist',
    tableFields: [
        { columnName: 'projectId', dataType: 'INTEGER' },
        { columnName: 'listCode', dataType: 'VARCHAR(32)' },
        { columnName: 'code', dataType: 'VARCHAR(32)' },
        { columnName: 'id', dataType: 'INTEGER' },
        { columnName: 'name', dataType: 'NVARCHAR(250)' },
        { columnName: 'nameVN', dataType: 'NVARCHAR(250)' },
        { columnName: 'ref_Id', dataType: 'INTEGER' },
        { columnName: 'ref_Code', dataType: 'VARCHAR(32)' },
        { columnName: 'isLock', dataType: 'INTEGER' },
        { columnName: 'sortList', dataType: 'INTEGER' },
        { columnName: 'groupId', dataType: 'INTEGER' },
        { columnName: 'groupName', dataType: 'NVARCHAR(250)' },
        { columnName: 'color', dataType: 'VARCHAR(50)' },
        { columnName: 'PRIMARY', dataType: 'KEY(projectId,listCode,code)' },
    ]
}