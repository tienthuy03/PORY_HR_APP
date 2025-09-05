import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/useTheme';

const MenuItemWithCounts = ({
  item,
  index,
  onPress,
  language = 'vi',
  style = {}
}) => {
  const { colors } = useTheme();

  // Function to get language text
  const setLanguageItem = (item, lang) => {
    if (lang === 'en' && item.eng) {
      return item.eng;
    } else if (item.vie) {
      return item.vie;
    } else if (item.title) {
      return item.title;
    } else if (item.chi) {
      return item.chi;
    }
    return item.menu_cd || t('unknown');
  };

  const styles = StyleSheet.create({
    container: {
      marginHorizontal: 12,
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
      ...style
    },
    button: {
      height: 60,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
    },
    iconContainer: {
      marginLeft: 10,
      height: 40,
      width: 40,
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary + '20', // 20% opacity
    },
    contentContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    titleContainer: {
      flex: 1,
    },
    titleText: {
      fontSize: 17,
      fontFamily: 'Roboto-Medium',
      color: colors.textPrimary,
      paddingLeft: 10,
      lineHeight: 20,
    },
    countsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    countItem: {
      minWidth: 5,
      minHeight: 30,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 5,
      marginLeft: 1,
      marginVertical: 5,
      marginHorizontal: 2,
    },
    countText: {
      fontSize: 17,
      fontWeight: 'bold',
    },
    countText1: {
      color: '#FFA800', // Orange
    },
    countText2: {
      color: '#009E00', // Green
    },
    countText3: {
      color: 'red',
    },
    chevronContainer: {
      marginRight: 10,
    }
  });

  const handlePress = () => {
    if (onPress) {
      onPress(item);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Icon
            name={item.icon || 'menu'}
            color={colors.primary}
            size={24}
          />
        </View>

        {/* Title */}
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText} numberOfLines={1}>
              {setLanguageItem(item, language)}
            </Text>
          </View>
        </View>

        {/* Counts */}
        <View style={styles.countsContainer}>
          {/* Count 1 - Orange */}
          <View style={styles.countItem}>
            <Text style={[styles.countText, styles.countText1]}>
              {item.count_approve_1 || 0}
            </Text>
          </View>

          {/* Count 2 - Green */}
          <View style={styles.countItem}>
            <Text style={[styles.countText, styles.countText2]}>
              {item.count_approve_2 || 0}
            </Text>
          </View>

          {/* Count 3 - Red */}
          <View style={styles.countItem}>
            <Text style={[styles.countText, styles.countText3]}>
              {item.count_approve_3 || 0}
            </Text>
          </View>
        </View>

        {/* Chevron */}
        <View style={styles.chevronContainer}>
          <Icon
            name="chevron-right"
            color={colors.textSecondary}
            size={20}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MenuItemWithCounts;
