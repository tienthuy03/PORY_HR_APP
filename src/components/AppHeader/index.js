import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import AppIcon from '../AppIcon';

const Header = ({ children, goBack = null, rightComponent = null, showBackButton = true }) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      flex: 0,
      paddingTop: 40,
      paddingBottom: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border || colors.textSecondary + '20',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    content: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    backButton: {
      paddingVertical: 8,
      paddingHorizontal: 8,
      borderRadius: 8,
      backgroundColor: colors.primary + '15',
      marginRight: 12,
    },
    titleContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    titleContainerCentered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontFamily: 'Roboto-Medium',
      fontSize: 18,
      color: colors.textPrimary,
      textAlign: 'left',
    },
    rightButton: {
      paddingVertical: 8,
      paddingHorizontal: 8,
      borderRadius: 8,
      backgroundColor: colors.primary + '15',
    },
  });

  const handleGoBack = async () => {
    if (goBack) {
      await goBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {showBackButton && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            activeOpacity={0.7}>
            <AppIcon
              name="arrow-left"
              library="MaterialCommunityIcons"
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>
        )}
        <View style={showBackButton ? styles.titleContainer : styles.titleContainerCentered}>
          <Text style={styles.title}>
            {children}
          </Text>
        </View>
        {rightComponent && (
          <View style={styles.rightButton}>
            {rightComponent}
          </View>
        )}
      </View>
    </View>
  );
};

export default Header;
