import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

const SimpleTest = () => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    text: {
      fontSize: 24,
      color: colors.textPrimary,
      fontFamily: 'Roboto-Medium',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Simple Test - Icons Working!</Text>
    </View>
  );
};

export default SimpleTest;
