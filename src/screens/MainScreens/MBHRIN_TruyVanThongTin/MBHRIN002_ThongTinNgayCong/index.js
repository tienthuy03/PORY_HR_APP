import NetInfo from "@react-native-community/netinfo";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppHeader from '../../../../components/AppHeader';
import CalendarComponent from '../../../../components/Calendar';
import EmptyState from '../../../../components/EmptyState';
import { useAuth } from '../../../../hooks/useAuth';
import { useTheme } from '../../../../hooks/useTheme';
import { sysFetch } from '../../../../services/apiService';
const MBHRIN002_ThongTinNgayCong = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { getUserInfo } = useAuth();

  // Get data from navigation params
  const { title } = route?.params || {};

  // Get user info from new auth system
  const userInfo = getUserInfo();

  // Get API URL from storage or config
  const [API_URL, setAPI_URL] = useState('');

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
        setAPI_URL(apiUrl);
      } catch (error) {
        console.log('Error getting API config:', error);
      }
    };
    getAPIConfig();
  }, []);

  // Get token from userInfo
  const tokenLogin = userInfo?.tokenLogin;

  // Date states - sử dụng ngày hiện tại
  const [startDay, setStartDay] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [endDay, setEndDay] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [daySelect, setDateSelect] = useState(
    moment().format("DD/MM/YYYY")
  );
  const [modalVisible, setModalVisible] = useState(false);


  const onValueChange = () => {
    setModalVisible(true);
  };

  const getState = (result) => {
    setModalVisible(false);
    setStartDay(result.startingDays);
    setEndDay(result.endingDays);
    setDateSelect(result.daySelecteds);
  };
  const refreshNewToken = (callback) => {
    if (callback === "getData") {
      getData();
    }
  };

  const getData = () => {
    // Kiểm tra các giá trị cần thiết
    if (!API_URL || !tokenLogin || !userInfo?.empPk) {
      return;
    }

    setLoading(true);

    const in_par = {
      p1_varchar2: userInfo.empPk,
      p2_varchar2: userInfo.crt_by,
      p3_varchar2: moment(startDay).format("YYYYMMDD"),
      p4_varchar2: moment(endDay).format("YYYYMMDD"),
    }
    console.log("API params:", in_par);

    sysFetch(
      API_URL,
      {
        pro: "stv_hr_sel_mbi_hrin002_0_101",
        in_par: in_par,
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
          if (rs && rs.errorData && rs.errorData.includes("ORA-01403")) {
            Alert.alert(
              'Không có dữ liệu',
              'Không có dữ liệu ngày công cho khoảng thời gian đã chọn'
            );
          } else {
            Alert.alert(
              'Lỗi',
              rs?.errorData || 'Lỗi API'
            );
          }
          setDataTtnc([]);
        }
      })
      .catch((error) => {
        setLoading(false);
        setRefreshing(false);
        console.log("API error:", error);
      });
  };

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        getData();
      } else {
        ShowError("No internet");
      }
    });
  }, [startDay, endDay]);

  const onRefresh = () => {
    setRefreshing(true);
    getData();
  };


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

  const renderDataItem = (item, index) => {
    return (
      <View key={index} style={[styles.dataItem, {
        backgroundColor: colors.card,
        borderColor: colors.border,
        shadowColor: colors.shadow,
      }]}>
        {/* Header với work_date_lb */}
        <View style={[styles.dataItemHeader, { backgroundColor: colors.primary }]}>
          <Icon name="calendar-clock" size={20} color="white" />
          <Text style={[styles.dataItemTitle, { color: 'white' }]}>
            {item.work_date_lb || `${t('workDay')} ${index + 1}`}
          </Text>
        </View>

        {/* Content với các field có '_' */}
        <View style={styles.dataItemContent}>
          {Object.entries(item)
            .filter((i) => i[0].substr(0, 1) === '_') // Lọc trước để đếm được số lượng
            .map((i, cIndex, array) => {
              const keyName = i[0].charAt(1).toUpperCase() + i[0].slice(2);
              const value = i[1] || '';
              const isLastItem = cIndex === array.length - 1; // Kiểm tra dòng cuối

              return (
                <View key={cIndex} style={[
                  styles.dataField,
                  isLastItem && styles.dataFieldLast // Bỏ border bottom cho dòng cuối
                ]}>
                  <Text style={[styles.dataFieldLabel, { color: colors.textPrimary }]}>
                    {keyName}
                  </Text>
                  <Text style={[styles.dataFieldValue, { color: colors.textSecondary }]}>
                    {value}
                  </Text>
                </View>
              );
            })}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader goBack={navigation.goBack}>
        {title || t('workDayInfo')}
      </AppHeader>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
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
            subtitle=""
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
    padding: 12,
  },
  datePickerCard: {
    borderRadius: 8,
    marginBottom: 8,
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
    padding: 8,
  },
  datePickerTextContainer: {
    flex: 1,
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
    // marginTop: 8,
  },
  dataItem: {
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  dataItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  dataItemTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    marginLeft: 8,
    fontWeight: '600',
  },
  dataItemContent: {
    padding: 12,
    backgroundColor: 'white',
  },
  dataField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dataFieldLast: {
    borderBottomWidth: 0, // Bỏ border bottom cho dòng cuối
  },
  dataFieldLabel: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    flex: 1,
  },
  dataFieldValue: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
  },
});

export default MBHRIN002_ThongTinNgayCong;
