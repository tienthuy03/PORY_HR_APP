import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const AlertPopup = ({
  visible = false,
  type = 'info', // 'success', 'error', 'warning', 'info'
  title,
  titleKey,
  message,
  messageKey,
  confirmText,
  confirmTextKey,
  cancelText,
  cancelTextKey,
  showCancel = false,
  onConfirm,
  onCancel,
  onRequestClose,
  transparent = true,
  animationType = 'fade',
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
  const translatedConfirmText = getTranslatedText(confirmTextKey, confirmText);
  const translatedCancelText = getTranslatedText(cancelTextKey, cancelText);

  // Get icon and color based on type
  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'check-circle',
          iconColor: colors.success,
          backgroundColor: colors.successLight,
        };
      case 'error':
        return {
          icon: 'close-circle',
          iconColor: colors.error,
          backgroundColor: colors.errorLight,
        };
      case 'warning':
        return {
          icon: 'alert-circle',
          iconColor: colors.warning,
          backgroundColor: colors.warningLight,
        };
      case 'info':
      default:
        return {
          icon: 'information',
          iconColor: colors.info,
          backgroundColor: colors.infoLight,
        };
    }
  };

  const typeConfig = getTypeConfig();
  const styles = createStyles(colors, typeConfig);

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

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
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Icon
              name={typeConfig.icon}
              size={48}
              color={typeConfig.iconColor}
            />
          </View>

          {/* Title */}
          {translatedTitle && (
            <Text style={styles.title}>{translatedTitle}</Text>
          )}

          {/* Message */}
          {translatedMessage && (
            <Text style={styles.message}>{translatedMessage}</Text>
          )}

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {showCancel && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>
                  {translatedCancelText || t('cancel')}
                </Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                !showCancel && styles.fullWidthButton
              ]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>
                {translatedConfirmText || t('confirm')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors, typeConfig) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 280,
    maxWidth: width * 0.85,
    shadowColor: colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  iconContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 50,
    backgroundColor: typeConfig.backgroundColor,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Roboto-Medium',
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    fontFamily: 'Roboto-Regular',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  fullWidthButton: {
    flex: 1,
  },
  cancelButton: {
    backgroundColor: colors.border,
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    fontFamily: 'Roboto-Medium',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.surface,
    fontFamily: 'Roboto-Medium',
  },
});

export default AlertPopup;
