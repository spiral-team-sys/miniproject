import { useContext } from 'react';
import { ConnectContext } from '../context/connectContext';

const useConnect = () => {
    const { isOnlyWifi, connectionType, toggleConnect } = useContext(ConnectContext);
    return { isOnlyWifi, connectionType, toggleConnect }
};

export default useConnect;
