import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
  Modal
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from '../../../../hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../hooks/useAuth';
import AppHeader from '../../../../components/AppHeader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { sysFetch } from '../../../../services/apiService';
import moment from "moment";
import NetInfo from "@react-native-community/netinfo";
import RNRestart from "react-native-restart";
import EmptyState from '../../../../components/EmptyState';
import CalendarComponent from '../../../../components/Calendar';
const MBHRIN002_ThongTinNgayCong = ({ navigation, route }) => {
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

  // State for data
  const [dataTtnc, setDataTtnc] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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

  // Date states
  const [startDay, setStartDay] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [endDay, setEndDay] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [daySelect, setDateSelect] = useState(
    moment(new Date()).format("DD/MM/YYYY")
  );
  const [modalVisible, setModalVisible] = useState(false);

  const showPicker = useCallback((value) => setModalVisible(value), []);

  const onValueChange = useCallback(() => {
    showPicker(true);
  }, [showPicker]);

  const getState = (result) => {
    setModalVisible(false);
    setStartDay(result.startingDays);
    setEndDay(result.endingDays);
    setDateSelect(result.daySelecteds);
  };
  const refreshNewToken = (callback) => {
    // Implement token refresh logic here if needed
    console.log('Token expired, need to refresh');
    // For now, just call the callback
    if (callback === "getData") {
      getData();
    }
  };
  const getData = () => {
    if (!API_URL || !tokenLogin || !userInfo?.empPk) {
      console.log('Missing required parameters for getData');
      return;
    }

    setLoading(true);
    console.log("API URL:", API_URL);
    console.log("User empPk:", userInfo.empPk);
    console.log("Date range:", startDay, "to", endDay);

    sysFetch(
      API_URL,
      {
        pro: "SELHRIN0020101",
        in_par: {
          p1_varchar2: userInfo.empPk,
          p2_varchar2: userInfo.fullName,
          p3_varchar2: moment(startDay).format("YYYYMMDD"),
          p4_varchar2: moment(endDay).format("YYYYMMDD"),
        },
        out_par: {
          p1_sys: "ttnc",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        setLoading(false);
        setRefreshing(false);

        if (rs === "Token Expired") {
          refreshNewToken("getData");
        } else if (rs && rs.results === "S") {
          setDataTtnc(rs.data.ttnc || []);
        } else {
          console.log('API response error:', rs);
        }
      })
      .catch((error) => {
        setLoading(false);
        setRefreshing(false);
        console.log("API error:", error);
      });
  };
  const onRefresh = () => {
    setRefreshing(true);
    getData();
  };

  useEffect(() => {
    if (API_URL && tokenLogin && userInfo?.empPk) {
      NetInfo.fetch().then((state) => {
        if (state.isConnected) {
          getData();
        } else {
          Alert.alert(t('error'), t('noInternetConnection'));
        }
      });
    }
  }, [startDay, endDay, API_URL, tokenLogin, userInfo?.empPk]);

  const renderDatePickerModal = () => (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              {t('selectDate')}
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Icon name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.calendarContainer}>
            <CalendarComponent
              getState={getState}
              startDayss={startDay}
              endDayss={endDay}
              onDateSelect={(dateData) => {
                // Handle date selection if needed
                console.log('Date selected:', dateData);
              }}
              onClose={() => setModalVisible(false)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderDataItem = (item, index) => (
    <View key={index} style={[styles.dataItem, {
      backgroundColor: colors.card,
      borderColor: colors.border,
      shadowColor: colors.shadow,
    }]}>
      <View style={styles.dataItemHeader}>
        <Icon name="calendar-clock" size={20} color={colors.primary} />
        <Text style={[styles.dataItemTitle, { color: colors.textPrimary }]}>
          {t('workDay')} {index + 1}
        </Text>
      </View>
      <Text style={[styles.dataText, { color: colors.textSecondary }]}>
        {JSON.stringify(item, null, 2)}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader goBack={navigation.goBack}>
        {title || t('workDayInfo')}
      </AppHeader>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Date Picker Card */}
        <View style={[styles.datePickerCard, {
          backgroundColor: colors.card,
          shadowColor: colors.shadow,
        }]}>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={onValueChange}
          >
            <Icon name="calendar" size={24} color={colors.primary} />
            <View style={styles.datePickerTextContainer}>
              <Text style={[styles.datePickerText, { color: colors.textPrimary }]}>
                {daySelect}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Data List */}
        {loading ? (
          <View style={[styles.loadingContainer, { backgroundColor: colors.surface }]}>
            <Icon name="loading" size={32} color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              {t('loading')}...
            </Text>
          </View>
        ) : dataTtnc.length > 0 ? (
          <View style={styles.dataContainer}>
            {dataTtnc.map((item, index) => renderDataItem(item, index))}
          </View>
        ) : (
          <EmptyState
            title={t('noWorkDayData')}
            subtitle={t('selectDifferentDate')}
            iconName="calendar-blank"
            iconSize={64}
          />
        )}
      </ScrollView>

      {renderDatePickerModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  datePickerCard: {
    borderRadius: 8,
    marginBottom: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '95%',
    maxHeight: '80%',
    borderRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
  },
  closeButton: {
    padding: 4,
  },
  datePickerContainer: {
    padding: 16,
  },
  calendarContainer: {
    padding: 16,
    maxHeight: 500,
  },
  dateLabel: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    marginBottom: 8,
  },
  dateInfo: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    marginBottom: 16,
  },
  confirmButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    marginTop: 8,
  },
  dataContainer: {
    marginTop: 8,
  },
  dataItem: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  dataItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dataItemTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    marginLeft: 8,
  },
  dataText: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    lineHeight: 16,
  },
});

export default MBHRIN002_ThongTinNgayCong;
