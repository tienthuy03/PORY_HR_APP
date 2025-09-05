import React from 'react';
import { View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import Foundation from 'react-native-vector-icons/Foundation';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Zocial from 'react-native-vector-icons/Zocial';

/**
 * AppIcon Component - Custom icon component with multiple icon libraries support
 * 
 * @param {string} name - Icon name
 * @param {string} library - Icon library name (default: 'MaterialCommunityIcons')
 * @param {number} size - Icon size (default: 24)
 * @param {string} color - Icon color (default: '#000')
 * @param {object} style - Additional styles
 * @param {function} onPress - Press handler
 * @param {boolean} disabled - Disable icon interaction
 * @param {object} ...props - Other props to pass to the icon component
 */
const AppIcon = ({
  name,
  library = 'MaterialCommunityIcons',
  size = 24,
  color = '#000',
  style,
  onPress,
  disabled = false,
  ...props
}) => {
  // Icon library mapping
  const iconLibraries = {
    MaterialCommunityIcons,
    MaterialIcons,
    Ionicons,
    FontAwesome,
    FontAwesome5,
    AntDesign,
    Entypo,
    EvilIcons,
    Feather,
    Foundation,
    Octicons,
    SimpleLineIcons,
    Zocial,
  };

  // Get the icon component from library
  const IconComponent = iconLibraries[library];

  // If library doesn't exist, fallback to MaterialCommunityIcons
  if (!IconComponent) {
    console.warn(`Icon library "${library}" not found. Falling back to MaterialCommunityIcons.`);
    return (
      <MaterialCommunityIcons
        name={name}
        size={size}
        color={color}
        style={style}
        {...props}
      />
    );
  }

  // If onPress is provided, wrap in TouchableOpacity
  if (onPress) {
    const TouchableOpacity = require('react-native').TouchableOpacity;
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={style}
        activeOpacity={disabled ? 1 : 0.7}
        {...props}
      >
        <IconComponent
          name={name}
          size={size}
          color={disabled ? '#999' : color}
        />
      </TouchableOpacity>
    );
  }

  // Return regular icon
  return (
    <IconComponent
      name={name}
      size={size}
      color={color}
      style={style}
      {...props}
    />
  );
};

export default AppIcon;
