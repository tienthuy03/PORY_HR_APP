import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const IconInput = ({
  value,
  onChangeText,
  placeholder,
  placeholderKey,
  label,
  labelKey,
  error,
  errorKey,
  style,
  inputStyle,
  labelStyle,
  errorStyle,
  iconName,
  iconSize = 20,
  iconColor,
  secureTextEntry = false,
  autoCapitalize = 'none',
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  editable = true,
  maxLength,
  onFocus,
  onBlur,
  onSubmitEditing,
  returnKeyType = 'done',
  autoCorrect = false,
  autoComplete = 'off',
  textContentType,
  ...props
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  // Get translated text
  const getTranslatedText = (key, fallback) => {
    if (key) {
      return t(key);
    }
    return fallback || '';
  };

  const translatedPlaceholder = getTranslatedText(placeholderKey, placeholder);
  const translatedLabel = getTranslatedText(labelKey, label);
  const translatedError = getTranslatedText(errorKey, error);

  const styles = createStyles(colors);

  return (
    <View style={[styles.container, style]}>
      {translatedLabel && (
        <Text style={[styles.label, labelStyle]}>
          {translatedLabel}
        </Text>
      )}

      <View style={[
        styles.inputContainer,
        inputStyle,
        error && styles.inputError,
        !editable && styles.inputDisabled
      ]}>
        {iconName && (
          <Icon
            name={iconName}
            size={iconSize}
            color={iconColor || colors.textTertiary}
            style={styles.inputIcon}
          />
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
          placeholder={translatedPlaceholder}
          placeholderTextColor={colors.textTertiary}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          maxLength={maxLength}
          onFocus={onFocus}
          onBlur={onBlur}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType}
          autoCorrect={autoCorrect}
          autoComplete={autoComplete}
          textContentType={textContentType}
          {...props}
        />
      </View>

      {translatedError && (
        <Text style={[styles.errorText, errorStyle]}>
          {translatedError}
        </Text>
      )}
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    height: 48,
  },
  inputIcon: {
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputDisabled: {
    backgroundColor: colors.borderLight,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default IconInput;
