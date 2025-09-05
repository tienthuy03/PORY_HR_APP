import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

const CommonButton = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  loading = false,
  loadingColor,
  backgroundColor,
  borderRadius,
  titleColor,
  fontSize = 16,
  fontWeight = '500',
  paddingVertical = 12,
  paddingHorizontal = 20,
  width,
  height,
  ...props
}) => {
  const { colors } = useTheme();

  // Sử dụng props tùy chỉnh hoặc fallback về theme colors
  const buttonBackgroundColor = backgroundColor || colors.primary;
  const buttonBorderRadius = borderRadius || 8;
  const buttonTitleColor = titleColor || colors.surface;
  const buttonLoadingColor = loadingColor || colors.surface;

  const styles = createStyles({
    backgroundColor: buttonBackgroundColor,
    borderRadius: buttonBorderRadius,
    titleColor: buttonTitleColor,
    fontSize,
    fontWeight,
    paddingVertical,
    paddingHorizontal,
    width,
    height,
    disabled: disabled || loading,
    colors,
  });

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={buttonLoadingColor}
        />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const createStyles = ({
  backgroundColor,
  borderRadius,
  titleColor,
  fontSize,
  fontWeight,
  paddingVertical,
  paddingHorizontal,
  width,
  height,
  disabled,
  colors,
}) => StyleSheet.create({
  button: {
    backgroundColor: disabled ? colors.border : backgroundColor,
    borderRadius: borderRadius,
    paddingVertical: paddingVertical,
    paddingHorizontal: paddingHorizontal,
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    height: height,
    minHeight: 44, // Đảm bảo button đủ lớn để touch
  },
  buttonText: {
    color: titleColor,
    fontSize: fontSize,
    fontWeight: fontWeight,
    textAlign: 'center',
  },
});

export default CommonButton;
