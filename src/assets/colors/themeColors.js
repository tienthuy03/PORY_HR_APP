// Light Theme Colors
export const lightColors = {
  // Primary colors
  mainColor: '#164085',
  primary: '#0d6efd',
  secondary: '#5856D6',

  // Background colors
  background: '#F4F6FF',
  surface: '#FFFFFF',
  card: '#FFFFFF',

  // Text colors
  textPrimary: '#1A1A1A',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textPrimary2: '#1A1A1A',
  textPrimary3: '#666666',

  // Border colors
  border: '#E0E0E0',
  borderLight: '#F0F0F0',

  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  successLight: '#E8F5E8',
  warningLight: '#FFF3E0',
  errorLight: '#FFEBEE',
  infoLight: '#E3F2FD',

  // Shadow
  shadow: '#000000',

  // Switch colors
  switchTrack: '#767577',
  switchThumb: '#f4f3f4',
};

// Dark Theme Colors
export const darkColors = {
  // Primary colors
  mainColor: '#0A84FF',
  primary: '#0A84FF',
  secondary: '#5E5CE6',

  // Background colors
  background: '#000000',
  surface: '#1C1C1E',
  card: '#2C2C2E',

  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#EBEBF5',
  textTertiary: '#EBEBF599',
  textPrimary2: '#FFFFFF',
  textPrimary3: '#EBEBF5',

  // Border colors
  border: '#38383A',
  borderLight: '#48484A',

  // Status colors
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
  info: '#0A84FF',
  successLight: '#1C3A1C',
  warningLight: '#3D2A0A',
  errorLight: '#3D1A1A',
  infoLight: '#0A1A3D',

  // Shadow
  shadow: '#000000',

  // Switch colors
  switchTrack: '#38383A',
  switchThumb: '#FFFFFF',
};

// Theme configuration
export const themes = {
  light: lightColors,
  dark: darkColors,
};

// Get current theme colors
export const getThemeColors = (theme) => {
  return themes[theme] || lightColors;
};
