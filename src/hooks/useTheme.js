import { useSelector } from 'react-redux';
import { getThemeColors } from '../assets/colors/themeColors';

export const useTheme = () => {
  const { theme } = useSelector((state) => state.settings);
  
  // Get current theme colors
  const colors = getThemeColors(theme);
  
  return {
    theme,
    colors,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };
};
