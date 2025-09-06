/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  Text,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../../../hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../hooks/useAuth';
import MonthPicker from '../../../../components/MonthPicker';
import AppHeader from '../../../../components/AppHeader';
import AppIcon from '../../../../components/AppIcon';
import EmptyState from '../../../../components/EmptyState';
import { deviceId } from '../../../../constants/index';
import axios from 'axios';
import RNRestart from 'react-native-restart';
import { sysFetch } from '../../../../services/apiService';
const MBHRIN003_ThongTinCongThang = ({ navigation: { goBack }, route }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { getUserInfo } = useAuth();

  // Get data from navigation params
  const { menuData, title, menu_cd } = route?.params || {};

  // Get user info from new auth system
  const userInfo = getUserInfo();
  const authState = useSelector((state) => state.auth);
  const menuState = useSelector((state) => state.menu);

  // Get API URL from storage or config
  const [API_URL, setAPI_URL] = useState('');
  const [tokenLogin, setTokenLogin] = useState('');

  // Get menu data from Redux state
  const dataMenuMBHRs = useSelector(state => state.menu?.data || []);

  // Get language from Redux state
  let language = '';
  try {
    const loginState = useSelector(state => state.loginReducers);
    language = loginState?.data?.data?.user_language || 'VIE';
  } catch (error) {
    language = 'VIE';
  }

  // Function to get header title
  const getHeaderTitle = () => {
    // Ưu tiên sử dụng data được truyền từ props
    if (menuData) {
      if (language === 'en' && menuData.eng) {
        return menuData.eng;
      } else if (menuData.vie) {
        return menuData.vie;
      } else if (menuData.title) {
        return menuData.title;
      } else if (menuData.chi) {
        return menuData.chi;
      }
    }

    // Fallback: tìm trong state menu
    if (!dataMenuMBHRs || !language) return "MBHRIN003";

    try {
      const mbhrin003Menu = dataMenuMBHRs.find(item => item.menu_cd === 'MBHRIN003');
      if (mbhrin003Menu) {
        // Sử dụng ngôn ngữ từ menu data
        if (language === 'en' && mbhrin003Menu.eng) {
          return mbhrin003Menu.eng;
        } else if (mbhrin003Menu.vie) {
          return mbhrin003Menu.vie;
        } else if (mbhrin003Menu.title) {
          return mbhrin003Menu.title;
        } else if (mbhrin003Menu.chi) {
          return mbhrin003Menu.chi;
        }
      }
    } catch (error) {
      console.warn('Error getting header title:', error);
    }

    return "MBHRIN003";
  };

  // Get API config from AsyncStorage
  useEffect(() => {
    const getAPIConfig = async () => {
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        const apiUrl = await AsyncStorage.getItem('API_URL');
        const token = await AsyncStorage.getItem('USER_TOKEN');
        setAPI_URL(apiUrl);
        setTokenLogin(token);
      } catch (error) {
        console.log('Error getting API config:', error);
      }
    };
    getAPIConfig();
  }, []);

  const styles = StyleSheet.create({
    modalContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      margin: 10,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalOneRecord1: {
      flexDirection: 'row',
      padding: 5,
      borderColor: '#ccc',
      backgroundColor: colors.card,
    },
    modalOneRecord2: {
      flexDirection: 'row',
      padding: 5,
      borderColor: '#ccc',
      backgroundColor: colors.primary,
    },
    modalOneRecord3: {
      flexDirection: 'row',
      padding: 5,
      borderColor: '#ccc',
      backgroundColor: colors.warning,
    },
    modalOneRecord4: {
      flexDirection: 'row',
      padding: 5,
      borderColor: '#ccc',
      backgroundColor: colors.success,
    },
    modalOneRecordHeader: {
      flexDirection: 'row',
      padding: 5,
      borderRadius: 5,
      borderColor: '#ccc',
      marginBottom: 5,
      backgroundColor: colors.primary,
    },
    modalOneCol1: {
      width: '25%',
    },
    modalOneCol2: {
      textAlign: 'center',
      width: '30%',
    },
    modalOneCol3: {
      textAlign: 'center',
      width: '15%',
    },
    modalOneCol4: {
      textAlign: 'center',
      width: '15%',
    },
    modalOneCol5: {
      textAlign: 'center',
      width: '15%',
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 10,
      width: '100%',
      height: 600,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 50,
    },
    modalTabTitle: {
      flexDirection: 'row',
    },
    modalHeaderView: {
      borderBottomColor: colors.primary,
      borderBottomWidth: 1,
      width: '100%',
      paddingBottom: 10,
      marginBottom: 10,
    },
    modalHeaderText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.primary,
    },
    modalBodyView: {
      padding: 5,
      flex: 1,
    },
    modalFooterView: {
      borderTopColor: colors.primary,
      borderTopWidth: 1,
      width: '100%',
      alignItems: 'center',
      paddingTop: 10,
      marginTop: 10,
    },
    modalbtnClose: {
      borderRadius: 10,
      backgroundColor: colors.primary,
      paddingBottom: 10,
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 10,
    },
    modalbtnText: {
      color: 'white',
    },
    datePickerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      justifyContent: 'space-between',
    },
    mainContainer: {
      flex: 1,
    },
    container: {
      flex: 1,
      padding: 16,
    },
    datePickerCard: {
      borderRadius: 8,
      marginBottom: 12,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    datePickerTextContainer: {
      flex: 1,
      marginLeft: 12,
    },
    datePickerText: {
      fontSize: 16,
      fontFamily: 'Roboto-Medium',
      marginBottom: 2,
      textAlign: 'center',
    },
    datePickerSubtext: {
      fontSize: 12,
      fontFamily: 'Roboto-Regular',
    },
    tabContainer: {
      flex: 1,
      padding: 16,
    },
    dataContainer: {
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    detailContainer: {
      borderRadius: 8,
      marginBottom: 16,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    detailHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    detailTitle: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Roboto-Bold',
      textTransform: 'uppercase',
    },
    customTabBar: {
      flexDirection: 'row',
      backgroundColor: colors.card,
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
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTabItem: {
      borderBottomColor: colors.primary,
    },
    tabText: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    activeTabText: {
      color: colors.primary,
      fontWeight: '600',
    },
    tabContent: {
      flex: 1,
    },
  });

  // State variables
  const [IsShow, setIsShow] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [dataDB, setDataDB] = useState([]);
  const [dataDB1, setDataDB1] = useState([]);
  const [sts, setSts] = useState(false);
  // const [date, setDate] = useState(moment(new Date()));
  const [date, setDate] = useState(
    moment(new Date().setMonth(new Date().getMonth() - 1)),
  );
  const [show, setShow] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const showPicker = useCallback(value => setShow(value), []);

  const onValueChange = useCallback(
    (event, newDate) => {
      const selectedDate = newDate || date;
      showPicker(false);
      setDate(selectedDate);
    },
    [date, showPicker],
  );

  const handleMonthSelect = (selectedDate) => {
    setDate(selectedDate);
  };
  const refreshNewToken = (obj, param1) => {
    // Implement token refresh logic here if needed
    console.log('Token expired, need to refresh');
    // For now, just call the callback
    if (obj === "getData") {
      getData(param1);
    }
  };

  const oldRefreshNewToken = (obj, param1) => {
    axios
      .post(API_URL + 'User/RefreshToken/', {
        token: tokenLogin,
        userPk: userInfo?.userPk,
        refreshToken: userInfo?.refreshToken,
      })
      .then(response => {
        tokenLogin = response.data.token;
        refreshToken = response.data.refreshToken;
        if (obj == 'getData') {
          getData(param1);
        }
      })
      .catch(error => {
        if (error == 'AxiosError: Request failed with status code 400') {
          Alert.alert(
            'Thông báo',
            'Phiên bản làm việc đã hết hạn. Vui lòng đăng nhập lại hệ thống',
            [
              {
                text: 'Đóng',
                onPress: () => {
                  RNRestart.Restart();
                },
              },
            ],
            { cancelable: true },
          );
        }
        console.log(error);
      });
  };

  const getData = async p_work_mon => {
    if (!API_URL || !tokenLogin || !userInfo?.empPk) {
      console.log('Missing required parameters for getData');
      return;
    }

    setData([]);
    sysFetch(
      API_URL,
      {
        pro: 'SELHRIN0030102',
        in_par: {
          p1_varchar2: userInfo.empPk,
          p2_varchar2: p_work_mon,
        },
        out_par: {
          p1_sys: 'ttct',
          p2_sys: 'ttct_detail',
        },
      },
      tokenLogin,
    )
      .then(res => {
        if (res == 'Token Expired') {
          refreshNewToken('getData', p_work_mon);
        }
        if (res != 'Token Expired') {
          let datass = [];
          let datassDB = [];
          if (res.totalRow > 0) {
            let map = new Map(Object.entries(res.data.ttct[0]));
            let mapDB = new Map(Object.entries(res.data.ttct[1]));
            map.forEach((value, key) => {
              if (key.charAt(0) === '_') {
                datass.push({ key, value });
              }
            });
            mapDB.forEach((value, key) => {
              if (key.charAt(0) === '_') {
                datassDB.push({ key, value });
              }
            });
            setData(datass);
            setDataDB(datassDB);
            setData1(res.data.ttct_detail.filter(x => x.bucong_yn === '0'));
            setDataDB1(res.data.ttct_detail.filter(x => x.bucong_yn === '1'));
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (API_URL && tokenLogin && userInfo?.empPk) {
      getData(moment(date).format('YYYYMM'));
    }
  }, [date, API_URL, tokenLogin, userInfo?.empPk]);

  const fetchItems = () => {
    // const arrT = date.split('-');
    getData(moment(date).format('YYYYMM'));
  };

  //set language
  const renderItemss = ({ item, index }) => {
    let tempStyle = null;
    switch (item.hol_type) {
      case 'SUN':
        tempStyle = styles.modalOneRecord4;
        break;
      case 'HOL':
        tempStyle = styles.modalOneRecord3;
        break;
      default:
        tempStyle = index % 2 ? styles.modalOneRecord1 : styles.modalOneRecord2;
    }
    return (
      <View style={tempStyle}>
        <Text style={styles.modalOneCol1}>{item.date_label}</Text>
        <Text style={styles.modalOneCol2}>
          {item.time_in === '0' ? (
            '--:--'
          ) : (
            <RenderHightLineHPDQ
              stringText={item.time_in}
              color={item.color_timein}
            />
          )}{' '}
          -{' '}
          {item.time_out === '0' ? (
            '--:--'
          ) : (
            <RenderHightLineHPDQ
              stringText={item.time_out}
              color={item.color_timeout}
            />
          )}
        </Text>
        <Text style={styles.modalOneCol3}>{item.wt}</Text>
        <Text style={styles.modalOneCol4}>{item.ot}</Text>
        <Text style={styles.modalOneCol4}>{item.total}</Text>
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    return (
      <OneFieldKeyValue
        keyName={item.key.charAt(1).toUpperCase() + item.key.slice(2)}
        value={item.value}
        key={index}
      />
    );
  };

  const ChuaBu = () => {
    return (
      <View style={styles.tabContainer}>
        <View style={[styles.dataContainer, { backgroundColor: data.length > 0 ? colors.card : 'transparent' }]}>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            onRefresh={fetchItems}
            refreshing={false}
            extraData={data}
            ListEmptyComponent={() => (
              <EmptyState
                title={t('noData')}
                subtitle={t('noWorkDayData')}
                iconName="calendar-blank"
                iconSize={64}
              />
            )}
          />
        </View>
        {data1.length > 0 ? (
          <>
            <View style={[styles.detailContainer, { backgroundColor: colors.card }]}>
              <TouchableOpacity
                style={styles.detailHeader}
                onPress={() => {
                  setIsShow(!IsShow);
                }}>
                <Text style={[styles.detailTitle, { color: colors.primary }]}>
                  {t('monthlyWorkDetail')}
                </Text>
                <AppIcon name="chevron-down" size={24} color={colors.textSecondary} style={{ marginRight: 10 }} />
              </TouchableOpacity>
              {IsShow ? (
                <View style={styles.modalBodyView}>
                  <View style={styles.modalOneRecordHeader}>
                    <Text style={styles.modalOneCol1}>Ngày</Text>
                    <Text style={styles.modalOneCol2}>Vào - ra</Text>
                    <Text style={styles.modalOneCol3}>Giờ làm</Text>
                    <Text style={styles.modalOneCol4}>Tăng ca</Text>
                    <Text style={styles.modalOneCol5}>Tổng</Text>
                  </View>
                  <FlatList
                    data={data1}
                    renderItem={renderItemss}
                    keyExtractor={item => item.car_date}
                    ListEmptyComponent={() => (
                      <EmptyState
                        title={t('noData')}
                        subtitle={t('noWorkDayData')}
                        iconName="calendar-blank"
                        iconSize={64}
                      />
                    )}
                  />
                </View>
              ) : null}
            </View>
          </>
        ) : null}
      </View>
    );
  };

  const DaBu = () => {
    return (
      <View style={styles.tabContainer}>
        <View style={[styles.dataContainer, { backgroundColor: dataDB.length > 0 ? colors.card : 'transparent' }]}>
          <FlatList
            data={dataDB}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            onRefresh={fetchItems}
            refreshing={false}
            extraData={dataDB}
            ListEmptyComponent={() => (
              <EmptyState
                title={t('noData')}
                subtitle={t('noWorkDayData')}
                iconName="calendar-blank"
                iconSize={64}
              />
            )}
          />
        </View>
        {data1.length > 0 ? (
          <>
            <View style={[styles.detailContainer, { backgroundColor: colors.card }]}>
              <TouchableOpacity
                style={styles.detailHeader}
                onPress={() => {
                  setIsShow(!IsShow);
                }}>
                <Text style={[styles.detailTitle, { color: colors.primary }]}>
                  {t('monthlyWorkDetail')}
                </Text>
                <AppIcon name="chevron-down" size={24} color={colors.textSecondary} style={{ marginRight: 10 }} />
              </TouchableOpacity>
              {IsShow ? (
                <View style={styles.modalBodyView}>
                  <View style={styles.modalOneRecordHeader}>
                    <Text style={styles.modalOneCol1}>Ngày</Text>
                    <Text style={styles.modalOneCol2}>Vào - ra</Text>
                    <Text style={styles.modalOneCol3}>Giờ làm</Text>
                    <Text style={styles.modalOneCol4}>Tăng ca</Text>
                    <Text style={styles.modalOneCol5}>Tổng</Text>
                  </View>
                  <FlatList
                    data={dataDB1}
                    renderItem={renderItemss}
                    keyExtractor={item => item.car_date}
                    ListEmptyComponent={() => (
                      <EmptyState
                        title={t('noData')}
                        subtitle={t('noWorkDayData')}
                        iconName="calendar-blank"
                        iconSize={64}
                      />
                    )}
                  />
                </View>
              ) : null}
            </View>
          </>
        ) : null}
      </View>
    );
  };
  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
      <Modal visible={sts} style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.modalHeaderView}
            activeOpacity={0.7}
            onPress={() => {
              setIsShow(!IsShow);
            }}>
            <Text style={styles.modalHeaderText}>CHI TIẾT CÔNG THÁNG</Text>
          </TouchableOpacity>
          <View style={styles.modalBodyView}>
            <View style={styles.modalOneRecordHeader}>
              <Text style={styles.modalOneCol1}>Ngày</Text>
              <Text style={styles.modalOneCol2}>Vào - ra</Text>
              <Text style={styles.modalOneCol3}>Giờ làm</Text>
              <Text style={styles.modalOneCol4}>Tăng ca</Text>
              <Text style={styles.modalOneCol5}>Tổng</Text>
            </View>
            <FlatList
              data={data1}
              renderItem={renderItemss}
              keyExtractor={item => item.car_date}
            />
          </View>
          <View style={styles.modalFooterView}>
            <TouchableOpacity
              style={styles.modalbtnClose}
              onPress={() => {
                setSts(!sts);
              }}>
              <Text style={styles.modalbtnText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <AppHeader goBack={goBack}>
        {getHeaderTitle()}
      </AppHeader>

      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.datePickerCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setModalVisible(true)}
          >
            <AppIcon name="calendar" size={24} color={colors.primary} style={{ marginLeft: 20 }} />
            <View style={styles.datePickerTextContainer}>
              <Text style={[styles.datePickerText, { color: colors.textPrimary }]}>
                {t(`month_${moment(date).format('M')}`)} {moment(date).format('YYYY')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Month Picker Modal */}
        <MonthPicker
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSelect={handleMonthSelect}
          selectedMonth={date}
          title={t('selectMonth')}
        />
        {/* Custom TabBar */}
        <View style={styles.customTabBar}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 0 && styles.activeTabItem]}
            onPress={() => setActiveTab(0)}
          >
            <Text style={[styles.tabText, activeTab === 0 && styles.activeTabText]}>
              Chưa bù công
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 1 && styles.activeTabItem]}
            onPress={() => setActiveTab(1)}
          >
            <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>
              Đã bù công
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 0 ? <ChuaBu /> : <DaBu />}
        </View>
      </View>
    </View>
  );
};

export default MBHRIN003_ThongTinCongThang;
