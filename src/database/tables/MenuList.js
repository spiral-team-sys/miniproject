export const Menulist = {
    tableName: 'menulist',
    tableFields:
        [
            { columnName: 'id', dataType: 'INTEGER PRIMARY KEY' },
            { columnName: 'menuName', dataType: 'VARCHAR(250)' },
            { columnName: 'menuNameVN', dataType: 'NVARCHAR(250)' },
            { columnName: 'byShop', dataType: 'INTEGER' },
            { columnName: 'pageName', dataType: 'VARCHAR(64)' },
            { columnName: 'iconName', dataType: 'VARCHAR(64)' },
            { columnName: 'iconType', dataType: 'VARCHAR(64)' },
            { columnName: 'reportTime', dataType: 'INTEGER' },
            { columnName: 'reportItem', dataType: 'TEXT' },
            { columnName: 'guiLine', dataType: 'TEXT' },
            { columnName: 'sortList', dataType: 'INTEGER' },
        ]
}