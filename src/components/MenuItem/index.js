import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';

const MenuItem_Children = ({
  item,
  index,
  onPress,
  iconName,
  title,
  showChevron = true,
  customIcon,
  customTitle,
  customStyles = {}
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  // Lấy title từ props hoặc từ item
  const displayTitle = customTitle || title || item?.vie || item?.title || item?.eng || item?.menu_cd || t('unknown');

  // Lấy icon từ props hoặc từ item
  const displayIcon = customIcon || iconName || item?.icon || 'menu';

  const styles = StyleSheet.create({
    itemContainer: {
      marginBottom: 10,
      borderRadius: 8,
      backgroundColor: colors.card,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    menuButton: {
      borderRadius: 8,
      backgroundColor: colors.surface,
      shadowColor: colors.shadow || colors.textSecondary,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
      backgroundColor: colors.primary + '20', // 20 = 12% opacity
    },
    menuText: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Roboto-Medium',
      textAlign: 'left',
      color: colors.textPrimary,
      lineHeight: 22,
    },
    chevronContainer: {
      marginLeft: 'auto',
      paddingLeft: 10,
    },
    ...customStyles
  });

  const handlePress = () => {
    if (onPress) {
      onPress(item);
    }
  };

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={styles.buttonContent}>
          <View style={styles.iconContainer}>
            <Icon
              name={displayIcon}
              color={colors.primary}
              size={24}
            />
          </View>
          <Text style={styles.menuText} numberOfLines={2}>
            {displayTitle}
          </Text>

          {showChevron && (
            <View style={styles.chevronContainer}>
              <Icon
                name="chevron-right"
                color={colors.textSecondary}
                size={20}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MenuItem_Children;
