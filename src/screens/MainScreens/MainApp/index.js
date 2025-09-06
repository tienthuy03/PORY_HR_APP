import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../../../hooks/useTheme';
import HomeScreen from '../HomeScreen';
import SettingsScreen from '../SettingsScreen';
import ProfileScreen from '../ProfileScreen';
import MBHRIN_TruyVanThongTin from '../MBHRIN_TruyVanThongTin';
import MBHRRE_DangKyXacNhan from '../MBHRRE_DangKyXacNhan';
import MBHRTI_ChamCongKhuonMat from '../MBHRTI_ChamCongKhuonMat';
import DashboardScreen from '../DashBoardScreen';
import NotificationScreen from '../NotificationScreen';
import BottomNavigation from '../../../components/BottomNavigation';
import MBHRAP_QuanLyPheDuyet from '../MBHRAP_QuanLyPheDuyet';
import MBHRIN001_ThongTinCaNhan from '../../MainScreens/MBHRIN_TruyVanThongTin/MBHRIN001_ThongTinCaNhan';
import MBHRIN002_ThongTinNgayCong from '../../MainScreens/MBHRIN_TruyVanThongTin/MBHRIN002_ThongTinNgayCong';
import MBHRIN003_ThongTinCongThang from '../../MainScreens/MBHRIN_TruyVanThongTin/MBHRIN003_ThongTinCongThang';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Wrapper component for ProfileScreen
const ProfileScreenWrapper = ({ onLogout, ...props }) => {
  return <ProfileScreen {...props} onLogout={onLogout} />;
};

// Bottom Tab Navigator cho main screens
const MainTabNavigator = ({ onLogout }) => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      tabBar={(props) => <BottomNavigation {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="home" component={HomeScreenWrapper} />
      <Tab.Screen name="dashboard" component={DashboardScreen} />
      <Tab.Screen name="notification" component={NotificationScreen} />
      <Tab.Screen name="profile">
        {(props) => <ProfileScreenWrapper {...props} onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen name="settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

// Wrapper cho HomeScreen để handle navigation
const HomeScreenWrapper = ({ navigation }) => {
  const navigateToScreen = (screenName, data = null) => {
    if (screenName === 'MBHRIN') {
      navigation.navigate('MBHRIN', { menuData: data });
    } else {
      navigation.navigate(screenName, data);
    }
  };

  return <HomeScreen onNavigate={navigateToScreen} />;
};

// Wrapper for MainTabNavigator
const MainTabNavigatorWrapper = ({ onLogout, ...props }) => {
  return <MainTabNavigator {...props} onLogout={onLogout} />;
};

// Main Stack Navigator
const MainApp = ({ onLogout }) => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        options={{ headerShown: false }}
      >
        {(props) => <MainTabNavigatorWrapper {...props} onLogout={onLogout} />}
      </Stack.Screen>
      {/* TRUY VAN THONG TIN */}
      <Stack.Screen
        name="MBHRIN"
        component={MBHRIN_TruyVanThongTin}
        options={{
          presentation: 'card',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MBHRIN001"
        component={MBHRIN001_ThongTinCaNhan}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MBHRIN002"
        component={MBHRIN002_ThongTinNgayCong}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MBHRIN003"
        component={MBHRIN003_ThongTinCongThang}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MBHRRE"
        component={MBHRRE_DangKyXacNhan}
        options={{
          presentation: 'card',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MBHRTI"
        component={MBHRTI_ChamCongKhuonMat}
        options={{
          presentation: 'card',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MBHRAP"
        component={MBHRAP_QuanLyPheDuyet}
        options={{
          presentation: 'card',
          headerShown: false,
        }}
      />

    </Stack.Navigator>
  );
};

export default MainApp;
