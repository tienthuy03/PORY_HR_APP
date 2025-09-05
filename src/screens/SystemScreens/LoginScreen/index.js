import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  SafeAreaView,
  Image,
} from "react-native";
import { Text, TextInput } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../hooks/useTheme';
import { loginUser } from '../../../redux/slices/authSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { deviceId, STORAGE_KEYS, ERROR_MESSAGES } from '../../../constants';
import LoadingPopup from '../../../components/LoadingPopup';

const LoginScreen = ({ navigation, onLoginSuccess }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [eye, setEye] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showLoadingPopup, setShowLoadingPopup] = useState(false);

  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  // Kiểm tra thông tin user đã đăng nhập
  useEffect(() => {
    const checkExistingUser = async () => {
      try {
        const userToken = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
        const userDataString = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

        if (userToken && userDataString) {
          const userData = JSON.parse(userDataString);
          // console.log("Tìm thấy thông tin user đã đăng nhập:", userData);

          // Tự động điền username nếu có
          if (userData.username) {
            setUsername(userData.username);
          }
        } else {
          // Set default test credentials
          setUsername("adminsyshr");
          setPassword("1911");
        }
      } catch (error) {
        console.log("Lỗi kiểm tra user:", error);
        // Set default test credentials
        setUsername("adminsyshr");
        setPassword("1911");
      }
    };

    checkExistingUser();
  }, []);

  const validateLogin = async () => {
    if (!username.trim()) {
      Alert.alert(t('notification'), t('pleaseEnterUsername'));
      return;
    }
    if (!password.trim()) {
      Alert.alert(t('notification'), t('pleaseEnterPassword'));
      return;
    }

    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        setLoading(true);
        setShowLoadingPopup(true); // Hiển thị LoadingPopup

        dispatch(loginUser({
          username: username.trim(),
          password: password,
          machine_id: deviceId
        }))
          .unwrap()
          .then((result) => {
            setLoading(false);
            setShowLoadingPopup(false); // Ẩn LoadingPopup

            // Hiển thị thông tin user từ API thực tế
            console.log("Đăng nhập thành công:", result);
            console.log("Thông tin user từ API:", result.user);
            console.log("Token từ API:", result.token);

            // Lưu thêm thông tin vào AsyncStorage
            const saveAdditionalInfo = async () => {
              try {
                await AsyncStorage.setItem(STORAGE_KEYS.USERNAME, username.trim());
                await AsyncStorage.setItem(STORAGE_KEYS.LAST_LOGIN_TIME, new Date().toISOString());
                await AsyncStorage.setItem(STORAGE_KEYS.DEVICE_ID, deviceId);
                console.log("Đã lưu thông tin bổ sung");
              } catch (error) {
                console.log("Lỗi lưu thông tin bổ sung:", error);
              }
            };
            saveAdditionalInfo();

            // Hiển thị thông báo thành công với thông tin user từ API
            const userInfo = result.user;
            const displayName = userInfo.full_name || userInfo.fullName || userInfo.name || userInfo.username;
            const department = userInfo.org_nm || userInfo.department || userInfo.dept_name || '';
            const isAdmin = userInfo.sysadmin_yn === 'Y';

            Alert.alert(
              t('loginSuccess'),
              `${t('welcome')} ${displayName}!\n${t('department')}: ${department}\n${t('permission')}: ${isAdmin ? t('admin') : t('user')}`,
              [
                {
                  text: t('viewDetails'),
                  onPress: () => {
                    // Navigate đến màn hình hiển thị thông tin user
                    navigation.navigate('UserInfo');
                  }
                },
                {
                  text: t('continue'),
                  onPress: () => {
                    if (onLoginSuccess) {
                      onLoginSuccess();
                    }
                  },
                },
              ]
            );
          })
          .catch((error) => {
            setLoading(false);
            setShowLoadingPopup(false); // Ẩn LoadingPopup
            console.error("Lỗi đăng nhập:", error);
            Alert.alert(t('loginFailed'), error || t('errorOccurred'));
          });
      } else {
        Alert.alert(t('error'), ERROR_MESSAGES.NO_INTERNET);
      }
    });
  };

  const handleConfigPress = () => {
    navigation.navigate('Config');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        translucent={true}
        backgroundColor={"transparent"}
        barStyle="light-content"
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../../../assets/images/login.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Header */}
            <View style={styles.headerContainer}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                {t('loginWithYourAccount')}
              </Text>
            </View>

            {/* Form Container */}
            <View style={styles.formContainer}>
              {/* Username Input */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>{t('account')}</Text>
                <View style={[styles.inputContainer, {
                  borderColor: colors.border,
                  backgroundColor: colors.surface
                }]}>
                  <Icon
                    name="account"
                    size={20}
                    color={colors.textTertiary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.textPrimary }]}
                    placeholder={t('enterAccount')}
                    placeholderTextColor={colors.textTertiary}
                    value={username}
                    onChangeText={setUsername}
                    returnKeyType="next"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>{t('password')}</Text>
                <View style={[styles.inputContainer, {
                  borderColor: colors.border,
                  backgroundColor: colors.surface
                }]}>
                  <Icon
                    name="key-outline"
                    size={20}
                    color={colors.textTertiary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.textPrimary }]}
                    placeholder={t('enterPassword')}
                    placeholderTextColor={colors.textTertiary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={eye}
                    returnKeyType="done"
                    onSubmitEditing={validateLogin}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setEye(!eye)}
                  >
                    <Icon
                      size={20}
                      color={colors.textTertiary}
                      name={eye ? "eye-outline" : "eye-off-outline"}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password & Config */}
              <View style={styles.bottomContainer}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("ForgotPass", { users: username })}
                >
                  <Text style={[styles.bottomText, { color: colors.primary }]}>
                    {t('forgotPassword')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleConfigPress}>
                  <Text style={[styles.bottomText, { color: colors.primary }]}>
                    {t('configuration')}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  { backgroundColor: colors.primary },
                  loading && { backgroundColor: colors.textTertiary }
                ]}
                onPress={validateLogin}
                disabled={loading}
              >
                <Text style={styles.loginButtonText}>
                  {loading ? t('loggingIn') : t('login')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Loading Popup */}
      <LoadingPopup
        visible={showLoadingPopup}
        title={t('loggingIn')}
        message={t('pleaseWait')}
        loadingColor={colors.primary}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  logo: {
    width: 300,
    height: 300,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontFamily: 'Roboto-Medium',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    height: 42,
  },
  inputIcon: {
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 42,
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    paddingHorizontal: 10,
  },
  eyeButton: {
    paddingHorizontal: 10,
  },
  loginButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bottomText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
  },
});

export default LoginScreen;