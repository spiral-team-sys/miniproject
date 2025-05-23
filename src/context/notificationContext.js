import { createContext, useEffect, useState } from "react";
import notifee, { RepeatFrequency, TriggerType } from '@notifee/react-native';
import { NOTIFICATION_CONTROLLER } from "../controllers/NotificationController";
import { toastError, toastSuccess } from "../utils/configToast";
import useAuth from "../hooks/useAuth";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { isLoggedIn } = useAuth()
    const [statusTrigger, setStatusTrigger] = useState(false)
    const [countNotification, setCountNotification] = useState(0)

    // Thông báo mặc định
    const handlerCountNotification = async () => {
        if (isLoggedIn)
            await NOTIFICATION_CONTROLLER.CountNotification(setCountNotification)
    }
    // Thông báo đẩy tự động
    const getStatusTrigger = async () => {
        const triggerList = await notifee.getTriggerNotifications();
        setStatusTrigger(triggerList.length > 0)
    }
    const cancelTrigger = async () => {
        try {
            await notifee.cancelTriggerNotifications()
            await getStatusTrigger()
        } catch (error) {
            toastError('Lỗi thiết lập', `Không thể hủy thông báo tự động: ${error}`)
        }
    }
    const triggerNotification = async (time, channelId) => {
        try {
            const notifications = {
                title: 'Thông báo',
                body: `Bạn đã gửi hết báo cáo chưa, hãy kiểm tra lại dữ liệu của bạn`,
                android: {
                    channelId,
                    pressAction: {
                        launchActivity: 'default',
                        id: 'openReportScreen'
                    },
                },
                ios: {
                    categoryId: 'openReportScreen'
                }
            }
            const trigger = {
                alarmManager: {
                    allowWhileIdle: true,
                },
                timestamp: time.getTime(),
                type: TriggerType.TIMESTAMP,
                repeatFrequency: RepeatFrequency.DAILY
            };
            await notifee.createTriggerNotification(notifications, trigger);
            await getStatusTrigger()
            toastSuccess('Thông báo', 'Thiết lập nhắc nhở thành công')
        } catch (error) {
            toastError('Lỗi thiết lập', `Không thể tạo mới thông báo tự động: ${error}`)
        }
    }
    //
    useEffect(() => {
        let isMounted = true
        if (!isMounted)
            return
        handlerCountNotification()
        getStatusTrigger()
        return () => { isMounted = false }
    }, [statusTrigger])

    return (
        <NotificationContext.Provider value={{ countNotification, statusTrigger, handlerCountNotification, cancelTrigger, triggerNotification }}>
            {children}
        </NotificationContext.Provider>
    );
}