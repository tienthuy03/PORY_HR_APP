import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/useTheme';

const EmptyState = ({
  title = 'Không có dữ liệu',
  subtitle = 'Vui lòng thử lại sau',
  iconName = 'database-off',
  iconSize = 64,
  showIcon = true,
  customStyles = {},
  customIcon,
  customTitle,
  customSubtitle
}) => {
  const { colors } = useTheme();

  const displayTitle = customTitle || title;
  const displaySubtitle = customSubtitle || subtitle;
  const displayIcon = customIcon || iconName;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
      paddingVertical: 40,
    },
    iconContainer: {
      marginBottom: 24,
      opacity: 0.6,
    },
    title: {
      fontSize: 18,
      fontFamily: 'Roboto-Medium',
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: 8,
      lineHeight: 24,
    },
    subtitle: {
      fontSize: 14,
      fontFamily: 'Roboto-Regular',
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
      opacity: 0.8,
    },
    ...customStyles
  });

  return (
    <View style={styles.container}>
      {showIcon && (
        <View style={styles.iconContainer}>
          <Icon
            name={displayIcon}
            size={iconSize}
            color={colors.textSecondary}
          />
        </View>
      )}

      <Text style={styles.title}>
        {displayTitle}
      </Text>

      <Text style={styles.subtitle}>
        {displaySubtitle}
      </Text>
    </View>
  );
};

export default EmptyState;
