import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

const useAuth = () => {
    const { isLoggedIn, userInfo, login, logout, forgotPassword } = useContext(AuthContext);
    return { isLoggedIn, userInfo, login, logout, forgotPassword }
};

export default useAuth;
