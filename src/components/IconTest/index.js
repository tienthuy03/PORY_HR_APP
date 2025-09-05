import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AppIcon from '../AppIcon';
import { useTheme } from '../../hooks/useTheme';

const IconTest = () => {
  const { colors } = useTheme();

  const iconLibraries = [
    { name: 'MaterialCommunityIcons', icon: 'home', color: colors.primary },
    { name: 'MaterialIcons', icon: 'favorite', color: colors.error },
    { name: 'Ionicons', icon: 'heart', color: colors.error },
    { name: 'FontAwesome', icon: 'star', color: colors.warning },
    { name: 'FontAwesome5', icon: 'user', color: colors.primary },
    { name: 'AntDesign', icon: 'like1', color: colors.success },
    { name: 'Entypo', icon: 'thumbs-up', color: colors.success },
    { name: 'EvilIcons', icon: 'heart', color: colors.error },
    { name: 'Feather', icon: 'mail', color: colors.primary },
    { name: 'Foundation', icon: 'heart', color: colors.error },
    { name: 'Octicons', icon: 'star', color: colors.warning },
    { name: 'SimpleLineIcons', icon: 'user', color: colors.primary },
    { name: 'Zocial', icon: 'facebook', color: colors.primary },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 20,
      textAlign: 'center',
    },
    iconRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
      padding: 10,
      backgroundColor: colors.surface,
      borderRadius: 8,
    },
    iconContainer: {
      marginRight: 15,
    },
    iconText: {
      fontSize: 16,
      color: colors.textPrimary,
      fontFamily: 'Roboto-Medium',
    },
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Icon Test</Text>
      {iconLibraries.map((lib, index) => (
        <View key={index} style={styles.iconRow}>
          <View style={styles.iconContainer}>
            <AppIcon
              name={lib.icon}
              library={lib.name}
              size={24}
              color={lib.color}
            />
          </View>
          <Text style={styles.iconText}>
            {lib.name} - {lib.icon}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default IconTest;
