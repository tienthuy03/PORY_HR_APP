// Font mapping for React Native
export const fonts = {
  'Roboto-Regular': 'Roboto-Regular',
  'Roboto-Medium': 'Roboto-Medium',
  'Roboto-Bold': 'Roboto-Bold',
  'Roboto-Light': 'Roboto-Light',
  'Roboto-Thin': 'Roboto-Thin',
};

// Platform specific font names
import { Platform } from 'react-native';

export const getFontFamily = (fontName) => {
  if (Platform.OS === 'ios') {
    return fonts[fontName] || 'System';
  } else {
    return fonts[fontName] || 'sans-serif';
  }
};
