import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

const CustomTab = ({
  tabs = [],
  activeTab = 0,
  onTabChange = () => { },
  style = {},
  tabStyle = {},
  activeTabStyle = {},
  textStyle = {},
  activeTextStyle = {}
}) => {
  const { colors } = useTheme();

  const renderTabButton = (tab, index) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.tabButton,
        {
          backgroundColor: activeTab === index ? colors.primary : colors.surface,
          borderColor: colors.border,
        },
        tabStyle,
        activeTab === index && activeTabStyle
      ]}
      onPress={() => onTabChange(index)}
    >
      <Text style={[
        styles.tabButtonText,
        {
          color: activeTab === index ? colors.surface : colors.textPrimary,
          fontFamily: activeTab === index ? 'Roboto-Bold' : 'Roboto-Medium',
        },
        textStyle,
        activeTab === index && activeTextStyle
      ]}>
        {tab}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.tabContainer, { backgroundColor: colors.surface }, style]}>
      {tabs.map((tab, index) => renderTabButton(tab, index))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  tabButtonText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default CustomTab;
