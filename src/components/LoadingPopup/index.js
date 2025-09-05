import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

const LoadingPopup = ({
  visible = false,
  title,
  titleKey,
  message,
  messageKey,
  loadingColor,
  showSpinner = true,
  transparent = true,
  animationType = 'fade',
  onRequestClose,
  ...props
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  // Get translated text
  const getTranslatedText = (key, fallback) => {
    if (key) {
      return t(key);
    }
    return fallback || '';
  };

  const translatedTitle = getTranslatedText(titleKey, title);
  const translatedMessage = getTranslatedText(messageKey, message);

  const styles = createStyles(colors);

  return (
    <Modal
      visible={visible}
      transparent={transparent}
      animationType={animationType}
      onRequestClose={onRequestClose}
      {...props}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {showSpinner && (
            <ActivityIndicator
              size="large"
              color={loadingColor || colors.primary}
              style={styles.spinner}
            />
          )}
          
          {translatedTitle && (
            <Text style={styles.title}>{translatedTitle}</Text>
          )}
          
          {translatedMessage && (
            <Text style={styles.message}>{translatedMessage}</Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 24,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
    maxWidth: width * 0.8,
    shadowColor: colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  spinner: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Roboto-Medium',
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'Roboto-Regular',
  },
});

export default LoadingPopup;
