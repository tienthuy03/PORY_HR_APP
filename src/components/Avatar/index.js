import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/useTheme';

const Avatar = ({
  source,
  size = 50,
  name,
  showInitials = true,
  style = {},
  iconName = 'account',
  iconSize,
  backgroundColor,
  textColor = 'white',
  defaultAvatarSource
}) => {
  const { colors } = useTheme();

  // Tính toán kích thước icon dựa trên size
  const calculatedIconSize = iconSize || Math.max(size * 0.4, 16);

  // Lấy màu nền
  const bgColor = backgroundColor || colors.mainColor;

  // Ảnh avatar mặc định giống Facebook
  const defaultAvatar = defaultAvatarSource || {
    uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
  };

  // Tạo initials từ tên
  const getInitials = (fullName) => {
    if (!fullName) return '?';
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: bgColor,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      ...style
    },
    image: {
      width: '100%',
      height: '100%',
    },
    initials: {
      fontSize: size * 0.35,
      fontFamily: 'Roboto-Bold',
      color: textColor,
      textAlign: 'center',
    },
    icon: {
      // Icon styles are handled by the Icon component
    }
  });

  // Nếu có hình ảnh và load thành công
  if (source && source.uri) {
    return (
      <View style={styles.container}>
        <Image
          source={source}
          style={styles.image}
          onError={() => {
            // Fallback to default avatar if image fails to load
            console.log('Avatar image failed to load, using default');
          }}
        />
      </View>
    );
  }

  // Hiển thị avatar mặc định giống Facebook
  if (defaultAvatar) {
    return (
      <View style={styles.container}>
        <Image
          source={defaultAvatar}
          style={styles.image}
          onError={() => {
            // Nếu ảnh mặc định cũng lỗi, fallback về initials hoặc icon
            console.log('Default avatar failed to load, using fallback');
          }}
        />
      </View>
    );
  }

  // Fallback: Hiển thị initials nếu có tên và showInitials = true
  if (name && showInitials) {
    return (
      <View style={styles.container}>
        <Text style={styles.initials}>
          {getInitials(name)}
        </Text>
      </View>
    );
  }

  // Fallback cuối cùng: hiển thị icon
  return (
    <View style={styles.container}>
      <Icon
        name={iconName}
        size={calculatedIconSize}
        color={textColor}
        style={styles.icon}
      />
    </View>
  );
};

export default Avatar;

