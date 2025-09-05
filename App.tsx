import React, { useState, useEffect } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LoginScreen from './src/screens/SystemScreens/LoginScreen';
import ConfigScreen from './src/screens/SystemScreens/ConfigScreen';
import MainApp from './src/screens/MainScreens/MainApp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import './src/config/i18n';
import { store } from './src/redux/store';
import { loadUserFromStorage, logoutUser } from './src/redux/slices/authSlice';
import { loadSettingsFromStorage } from './src/redux/slices/settingsSlice';
// Import vector icons fonts
import 'react-native-vector-icons/MaterialCommunityIcons';
import 'react-native-vector-icons/MaterialIcons';
import 'react-native-vector-icons/Ionicons';
import 'react-native-vector-icons/FontAwesome';
import 'react-native-vector-icons/FontAwesome5';
import 'react-native-vector-icons/AntDesign';
import 'react-native-vector-icons/Entypo';
import 'react-native-vector-icons/EvilIcons';
import 'react-native-vector-icons/Feather';
import 'react-native-vector-icons/Foundation';
import 'react-native-vector-icons/Octicons';
import 'react-native-vector-icons/SimpleLineIcons';
import 'react-native-vector-icons/Zocial';

const AppContent = () => {
  const dispatch = useDispatch<any>();
  const { isAuthenticated, loading } = useSelector((state: any) => state.auth);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAppStatus();
  }, []);

  const checkAppStatus = async () => {
    try {
      const clientId = await AsyncStorage.getItem('CLIENT_ID');
      const apiUrl = await AsyncStorage.getItem('API_URL');

      if (clientId && apiUrl) {
        setIsConfigured(true);
        // Load user data and settings from storage if configuration exists
        await Promise.all([
          dispatch(loadUserFromStorage()),
          dispatch(loadSettingsFromStorage()),
        ]);
      } else {
        setIsConfigured(false);
      }
    } catch (error) {
      console.error('Error checking app status:', error);
      setIsConfigured(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigurationSuccess = () => {
    setIsConfigured(true);
  };

  const handleLoginSuccess = () => {
    // Login success is handled by Redux, no need to set state here
  };

  const handleNavigateToConfig = () => {
    setIsConfigured(false);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
  };

  if (isLoading || loading) {
    return null; // Hoặc có thể hiển thị loading screen
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {!isConfigured ? (
        <ConfigScreen onConfigurationSuccess={handleConfigurationSuccess} />
      ) : !isAuthenticated ? (
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onNavigateToConfig={handleNavigateToConfig}
        />
      ) : (
        <SafeAreaProvider>
          <NavigationContainer>
            <MainApp onLogout={handleLogout} />
          </NavigationContainer>
        </SafeAreaProvider>
      )}
    </GestureHandlerRootView>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;