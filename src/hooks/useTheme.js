import { useContext } from 'react';
import { ThemeContext } from '../context/themeContext';

const useTheme = () => {
    const { appColors, theme, styleDefault, toggleTheme } = useContext(ThemeContext);
    return { appColors, theme, styleDefault, toggleTheme }
};

export default useTheme; 