import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

const TabBar = ({
  data = [],
  fullTab = false,
  scrollEnabled = true,
  onTabChange,
  initialIndex = 0
}) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const { colors } = useTheme();

  const handleTabPress = (index) => {
    setActiveIndex(index);
    if (onTabChange) {
      onTabChange(index);
    }
  };

  const renderTabBar = () => (
    <View style={[styles.tabBar, { backgroundColor: colors.card }]}>
      {data.map((item, index) => (
        <TouchableOpacity
          key={item.id || index}
          style={[
            styles.tabItem,
            fullTab && { flex: 1 },
            activeIndex === index && [
              styles.activeTab,
              { backgroundColor: colors.mainColor }
            ]
          ]}
          onPress={() => handleTabPress(index)}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeIndex === index ? '#fff' : colors.textSecondary },
              activeIndex === index && styles.activeTabText
            ]}
          >
            {item.name}
            {item.count !== null && item.count !== undefined && (
              <Text style={styles.countText}> ({item.count})</Text>
            )}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderContent = () => {
    const activeItem = data[activeIndex];
    return activeItem ? activeItem.screen : null;
  };

  return (
    <View style={styles.container}>
      {scrollEnabled ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {renderTabBar()}
        </ScrollView>
      ) : (
        renderTabBar()
      )}
      <View style={styles.content}>
        {renderContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  tabItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  countText: {
    fontSize: 14,
    opacity: 0.8,
  },
  content: {
    flex: 1,
  },
});

export default TabBar;
