import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';

const CommonInput = ({
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

      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={[
          styles.input,
          inputStyle,
          error && styles.inputError,
          !editable && styles.inputDisabled
        ]}
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
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputDisabled: {
    backgroundColor: colors.borderLight,
    color: colors.textTertiary,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default CommonInput;
export { default as IconInput } from './IconInput';
