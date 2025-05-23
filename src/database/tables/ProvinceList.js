export const ProvinceList = {
    tableName: 'provinceList',
    tableFields: [
        { columnName: 'id', dataType: 'INTEGER' },
        { columnName: 'provinceId', dataType: 'INTEGER' },
        { columnName: 'provinceName', dataType: 'VARCHAR(256)' },
        { columnName: 'provinceNameVN', dataType: 'NVARCHAR(256)' },
        { columnName: 'license', dataType: 'VARCHAR(256)' },
        { columnName: 'PRIMARY', dataType: 'KEY(id)' },
    ]
};