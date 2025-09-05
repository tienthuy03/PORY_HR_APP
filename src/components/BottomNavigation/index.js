import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BottomNavigation = ({ state, descriptors, navigation }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const tabs = [
    {
      key: 'home',
      title: t('home'),
      icon: 'home',
    },
    {
      key: 'dashboard',
      title: t('navDashboard'),
      icon: 'group',
    },
    {
      key: 'notification',
      title: t('navNotification'),
      icon: 'bell',
    },
    {
      key: 'profile',
      title: t('profile'),
      icon: 'account',
    },
    {
      key: 'settings',
      title: t('settings'),
      icon: 'cog',
    },

  ];

  return (
    <View style={[styles.container, {
      backgroundColor: colors.surface,
      borderTopColor: colors.border,
    }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        // Find tab config by route name
        const tabConfig = tabs.find(tab => tab.key === route.name);

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tab}
            onPress={onPress}
          >
            <Icon
              name={tabConfig?.icon || 'help'}
              size={24}
              color={isFocused ? colors.mainColor : colors.textPrimary3}
            />
            <Text
              style={[
                styles.tabText,
                {
                  color: isFocused ? colors.mainColor : colors.textPrimary3,
                },
              ]}
            >
              {tabConfig?.title || route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingBottom: 10,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
    marginTop: 4,
  },
});

export default BottomNavigation;
