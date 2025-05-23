const dataWork = [
    { ItemId: 1, ItemName: "Công việc", PageName: "WorkList" },
    { ItemId: 2, ItemName: "Thông tin", PageName: "ShopInfo" },
    { ItemId: 3, ItemName: "Thống kê", PageName: "Dashboard" },
    { ItemId: 4, ItemName: "Thư viện", PageName: "Gallary" }
]
const dataMode = [
    {
        ItemId: 1,
        ItemName: "Thành công",
        ItemCode: "TC",
        color: 'successColor',
        isActive: true
    },
    {
        ItemId: 2,
        ItemName: "Không thành công",
        ItemCode: "KTC",
        color: 'errorColor',
        isActive: false
    },
]
const dataGallary = [
    { ItemId: 1, ItemName: "Hình ảnh", PageName: "Photos" },
    { ItemId: 2, ItemName: "Ghi âm", PageName: "Audios" }
]
const dataGallaryImage = [
    { ItemId: 1, ItemName: "Hình ảnh", PageName: "Photos" }
]
const dataAutoDelete = [
    {
        ItemId: 1,
        ItemName: 'Ngày',
        ItemCode: 'DAYS',
        RangeValue: null,
        DateValue: null,
        Description: null,
        strError: null,
        isChoose: false
    },
    {
        ItemId: 2,
        ItemName: 'Tuần',
        ItemCode: 'WEEK',
        RangeValue: 7,
        Description: 'Tự động xoá sau 1 Tuần',
        strError: null,
        isChoose: false
    },
    {
        ItemId: 3,
        ItemName: 'Tháng',
        ItemCode: 'MONTH',
        RangeValue: 30,
        Description: 'Tự động xoá sau 1 Tháng',
        strError: null,
        isChoose: false
    },
    {
        ItemId: 4,
        ItemName: 'Năm',
        ItemCode: 'YEAR',
        RangeValue: 365,
        Description: 'Tự động xoá sau 1 Năm',
        strError: null,
        isChoose: false
    },
]
//
export const DATA_DEFAULT = { dataWork, dataMode, dataGallary, dataGallaryImage, dataAutoDelete }