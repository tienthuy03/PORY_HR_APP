import React, { useState, useEffect, useRef } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Keyboard,
  Animated,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Color } from '../../../assets/colors/colortv';
import { useDispatch } from 'react-redux';
import { SetApiURL, sysLoadTheme } from '../../../redux/slices/systemSlice';
import { ServerIP, configAPI } from '../../../config/clientConfig';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { useTheme } from '../../../hooks/useTheme';
import { useTranslation } from 'react-i18next';
import CommonButton from '../../../components/CommonButton';
import LoadingPopup from '../../../components/LoadingPopup';
import AlertPopup from '../../../components/AlertPopup';
const ConfigScreen = ({ onConfigurationSuccess }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [clientId, setClientId] = useState('');
  const [captchaText, setCaptchaText] = useState('');
  const [currentNumber, setCurrentNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [showLoadingPopup, setShowLoadingPopup] = useState(false);
  const [showAlertPopup, setShowAlertPopup] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: 'info',
    title: '',
    message: '',
    onConfirm: null,
  });




  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 50,
    },
    title: {
      fontSize: 18,
      fontFamily: 'Roboto-Bold',
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: 12,
    },
    formContainer: {
      width: '100%',
    },
    inputGroup: {
      marginBottom: 12,
    },
    label: {
      fontSize: 14,
      marginBottom: 6,
      color: colors.textSecondary,
      fontFamily: 'Roboto-Medium',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      backgroundColor: colors.surface,
    },
    inputIcon: {
      paddingHorizontal: 10,
    },
    input: {
      flex: 1,
      height: 42,
      color: colors.textPrimary,
      fontFamily: 'Roboto-Regular',
    },
    captchaContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    captchaInputContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      backgroundColor: colors.surface,
      marginRight: 10,
    },
    captchaBox: {
      width: 80,
      height: 42,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      backgroundColor: colors.borderLight,
      borderWidth: 1,
      borderColor: colors.border,
    },
    captchaText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.primary,
      fontFamily: 'Roboto-Bold',
    },

    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 12,
      gap: 12,
    },
    cancelButton: {
      flex: 1,
    },
    cancelButtonText: {
      fontSize: 16,
      fontFamily: 'Roboto-Medium',
    },
    confirmButton: {
      flex: 1,
    },
    confirmButtonText: {
      fontSize: 16,
      fontFamily: 'Roboto-Medium',
    },

    bgImage: {
      width: '100%',
      height: 300,
      marginTop: '4%',
    },
  });
  // Tạo số ngẫu nhiên khi component mount
  useEffect(() => {
    generateRandomNumber();
  }, []);

  const generateRandomNumber = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000); // Số 4 chữ số
    setCurrentNumber(randomNum.toString());
  };

  // Helper function để hiển thị alert popup
  const showAlert = (type, title, message, onConfirm = null) => {
    setAlertConfig({
      type,
      title,
      message,
      onConfirm,
    });
    setShowAlertPopup(true);
  };


  const onCancel = () => {
    // Handle cancel action
    showAlert(
      'warning',
      t('info'),
      t('cancelConfirm'),
      () => {
        // Handle cancel logic here
        setShowAlertPopup(false);
      }
    );
  };

  const onSave = () => {
    if (clientId.length === 0) {
      showAlert('error', t('info'), t('clientIdRequired'), () => {
        setShowAlertPopup(false);
      });
      return;
    }
    if (captchaText.length === 0) {
      showAlert('error', t('info'), t('captchaRequired'), () => {
        setShowAlertPopup(false);
      });
      return;
    }
    let originNumber = currentNumber;
    let inputNumber = captchaText;
    console.log(captchaText);
    console.log(currentNumber);
    if (originNumber === inputNumber) {
      console.log("check");
      setLoad(true);
      setShowLoadingPopup(true); // Hiển thị loading popup
      checkAPI(clientId);
    } else {
      showAlert(
        'error',
        t('info'),
        t('captchaMismatch'),
        () => {
          // setIsShow(false);
          // RNRestart.Restart();
          setShowAlertPopup(false);
        }
      );
    }
  };
  const checkQR = async (qrdata) => {
    console.log("qrdata ", qrdata);
    let clientId = qrdata.split("+|+")[0];
    let cryptoString = qrdata.split("+|+")[1];
    let secretKey = "tinvietsoft@1911";
    console.log("decode ", cryptoString);
    let bytes = CryptoJS.AES.decrypt(cryptoString, secretKey);
    let originalText = bytes.toString(CryptoJS.enc.Utf8);

    await AsyncStorage.setItem("API_URL", originalText);
    await AsyncStorage.setItem("themeName", "1");
    await AsyncStorage.setItem("CLIENT_ID", clientId.toUpperCase());
    dispatch(SetApiURL(originalText));
    showAlert(
      'success',
      t('info'),
      t('configSuccess'),
      () => {
        setIsShow(false);
        if (onConfigurationSuccess) {
          onConfigurationSuccess();
        }
        setShowAlertPopup(false);
      }
    );
  };
  const checkAPI = async (clientId) => {
    let rsCheck = await checkConfigAPI(clientId);
    if (rsCheck) {
      showAlert(
        'success',
        t('info'),
        t('configSuccess'),
        () => {
          setIsShow(false);
          if (onConfigurationSuccess) {
            onConfigurationSuccess();
          }
          setShowAlertPopup(false);
        }
      );
    } else {
      //checkoffline
      let rsCheckOffline = await checkConfigAPIOffline(clientId);
      console.log("check config ", rsCheckOffline);
      if (rsCheckOffline) {
        setLoad(false);
        setShowLoadingPopup(false); // Ẩn loading popup
        showAlert(
          'success',
          t('info'),
          t('configSuccess'),
          () => {
            setIsShow(false);
            if (onConfigurationSuccess) {
              onConfigurationSuccess();
            }
            setShowAlertPopup(false);
          }
        );
      } else {
        setLoad(false);
        setShowLoadingPopup(false); // Ẩn loading popup
        showAlert(
          'error',
          t('info'),
          t('configFailed'),
          () => {
            setShowAlertPopup(false);
          }
        );
      }
    }
    setLoad(false);
    setShowLoadingPopup(false); // Ẩn loading popup
  };
  const checkConfigAPIOffline = (clientId) => {
    return new Promise(async (resolve) => {
      let flag = false;
      configAPI.forEach(async function (item) {
        if (item.CLIENT_ID.toLowerCase() == clientId.toLowerCase()) {
          flag = true;
          console.log("item ", item);
          await AsyncStorage.setItem("API_URL", item.API_NAME);
          await AsyncStorage.setItem("themeName", "1");
          await AsyncStorage.setItem("CLIENT_ID", clientId.toUpperCase());
          dispatch(SetApiURL(item.API_NAME));
          resolve(true);
        }
      });
      if (flag) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  };
  const checkConfigAPI = (clientId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(false);
      }, 10000);
      const URL =
        ServerIP.tvs + "User/CheckClient?clientId=" + clientId + "&clientKey=";
      console.log(URL);
      axios
        .post(URL, null)
        .then(async (response) => {
          console.log(response.data);
          if (response.data.data.length > 0) {
            await AsyncStorage.setItem(
              "API_URL",
              response.data.data[0].api_name
            );
            await AsyncStorage.setItem(
              "themeName",
              response.data.data[0].theme_type
            );
            await AsyncStorage.setItem("CLIENT_ID", clientId.toUpperCase());
            dispatch(SetApiURL(response.data.data[0].api_name));
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(async (error) => {
          console.log(error);
          resolve(false);
        });
    });
  };
  // Theme array - you'll need to define this based on your theme structure
  const arr = [
    { id: "1", color: { primary: "#007AFF", secondary: "#5856D6" } }
  ];

  useEffect(() => {
    const CLIENT_ID = "";
    const API_URL = "";
    fetchData();
    async function fetchData() {
      CLIENT_ID = await AsyncStorage.getItem("CLIENT_ID");
      API_URL = await AsyncStorage.getItem("API_URL");
    }
    if (API_URL == "http://14.241.235.252:8081/api/" && CLIENT_ID == null) {
      setClientId("");
    } else if (API_URL == null && CLIENT_ID == null) {
      setClientId("");
    } else {
      setClientId(CLIENT_ID);
    }

    if (API_URL != "http://14.241.235.252:8081/api/" && CLIENT_ID == null) {
      if (configAPI != null && configAPI != []) {
        configAPI.forEach(async function (item) {
          if (item.API_NAME.toLowerCase() == API_URL.toLowerCase()) {
            console.log("item ", item);
            setClientId(item.CLIENT_ID.toUpperCase());
          }
        });
      }
    }

    AsyncStorage.getItem("firstLoadApp").then(async (rs) => {
      if (rs) {
        getTheme();
      } else {
        AsyncStorage.setItem("themeName", "1");
        AsyncStorage.setItem("API_URL", ServerIP.tvs);
        dispatch(SetApiURL(ServerIP.tvs));
        dispatch(sysLoadTheme(arr[0].color));
        AsyncStorage.setItem("firstLoadApp", "yes");
        setIsShow(true);
      }
    });
    const getTheme = async () => {
      try {
        const themeName = await AsyncStorage.getItem("themeName");
        if (!themeName) {
          setIsShow(true);
        } else {
          const tempTheme = arr.filter((i) => i.id === themeName)[0].color;
          dispatch(sysLoadTheme(tempTheme));
          navigation.replace("LoginScreen"); // Commented out since navigation is not set up
        }
      } catch (error) { }
    };
    return () => { };
  }, []);


  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const translation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(translation, {
      toValue: isKeyboardVisible ? -40 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [isKeyboardVisible]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        console.log("show");
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        console.log("hide");
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);


  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Image
            source={require('../../../assets/images/setting-account.png')}
            style={styles.bgImage}
          />
          <Text style={styles.title}>{t('configTitle')}</Text>
          <View style={styles.formContainer}>
            {/* Mã khách hàng */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('clientId')}</Text>
              <View style={styles.inputContainer}>
                <Icon name="card-account-details" size={20} color={Color.textPrimary3} style={styles.inputIcon} />
                <TextInput
                  value={clientId}
                  onChangeText={setClientId}
                  style={styles.input}
                  placeholder={t('enterClientId')}
                  placeholderTextColor="#999"
                  autoCapitalize="characters"
                />
              </View>
            </View>

            {/* Số xác nhận */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('captcha')}</Text>
              <View style={styles.captchaContainer}>
                <View style={styles.captchaInputContainer}>
                  <Icon name="shield-check" size={20} color={Color.textPrimary3} style={styles.inputIcon} />
                  <TextInput
                    value={captchaText}
                    onChangeText={setCaptchaText}
                    style={styles.input}
                    placeholder={t('enterCaptcha')}
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.captchaBox}>
                  <Text style={styles.captchaText}>{currentNumber}</Text>
                </View>
              </View>
            </View>



            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <CommonButton
                title={t('cancel')}
                onPress={onCancel}
                backgroundColor={colors.border}
                titleColor={colors.textPrimary}
                style={styles.cancelButton}
                textStyle={styles.cancelButtonText}
              />
              <CommonButton
                title={loading ? t('processing') : t('confirm')}
                onPress={onSave}
                backgroundColor={colors.primary}
                titleColor={colors.surface}
                loading={loading}
                disabled={loading}
                style={styles.confirmButton}
                textStyle={styles.confirmButtonText}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* Loading Popup */}
      <LoadingPopup
        visible={showLoadingPopup}
        titleKey="processing"
        messageKey="pleaseWait"
        loadingColor={colors.primary}
      />

      {/* Alert Popup */}
      <AlertPopup
        visible={showAlertPopup}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onConfirm={alertConfig.onConfirm}
        onCancel={() => setShowAlertPopup(false)}
        onRequestClose={() => setShowAlertPopup(false)}
      />
    </>
  );
};


export default ConfigScreen;


