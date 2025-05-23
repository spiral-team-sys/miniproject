import { AttendanceModes } from "./tables/AttendanceModes";
import { Audios } from "./tables/Audios";
import { AxleList } from "./tables/AxleList";
import { MasterList } from "./tables/MasterList";
import { Menulist } from "./tables/MenuList";
import { MobileRaw } from "./tables/MobileRaw";
import { Notification } from "./tables/Notification";
import { Photos } from "./tables/Photos";
import { ProvinceList } from "./tables/ProvinceList";
import { StoreList } from "./tables/StoreList";

export const Tables = {
    storeList: StoreList,
    mobileRaw: MobileRaw,
    audios: Audios,
    photos: Photos,
    menuList: Menulist,
    attendanceMode: AttendanceModes,
    masterList: MasterList,
    notification: Notification,
    provinceList: ProvinceList,
    axleList: AxleList
}