import { useContext } from 'react';
import { NotificationContext } from '../context/notificationContext';

const useNotificationManager = () => {
    const { countNotification, statusTrigger, cancelTrigger, triggerNotification, handlerCountNotification } = useContext(NotificationContext);
    return { countNotification, statusTrigger, cancelTrigger, triggerNotification, handlerCountNotification }
};

export default useNotificationManager;
