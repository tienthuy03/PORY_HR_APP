import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
  FlatList
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from '../../../../../hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../../hooks/useAuth';
import AppHeader from '../../../../../components/AppHeader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { sysFetch } from '../../../../../services/apiService';
import moment from "moment";
import NetInfo from "@react-native-community/netinfo";
import EmptyState from '../../../../../components/EmptyState';
import MonthPicker from '../../../../../components/MonthPicker';

const MBHRIN005_Month = ({ navigation, route }) => {
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

  // State for data
  const [dataNgayNghi, setDataNgayNghi] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Month picker states
  const [selectedMonth, setSelectedMonth] = useState(
    moment().subtract(1, 'month').format("YYYY-MM")
  );
  const [modalVisible, setModalVisible] = useState(false);

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

  const refreshNewToken = (callback) => {
    console.log('Token expired, need to refresh');
    if (callback === "getData") {
      getData();
    }
  };

  const getData = () => {
    console.log("=== getData called (Month) ===");
    console.log("API_URL:", API_URL);
    console.log("tokenLogin:", tokenLogin);
    console.log("userInfo?.empPk:", userInfo?.empPk);
    console.log("selectedMonth:", selectedMonth);

    if (!API_URL || !tokenLogin || !userInfo?.empPk) {
      console.log('Missing required parameters for getData');
      console.log('API_URL missing:', !API_URL);
      console.log('tokenLogin missing:', !tokenLogin);
      console.log('userInfo?.empPk missing:', !userInfo?.empPk);
      return;
    }

    setLoading(true);
    console.log("API URL:", API_URL);
    console.log("User empPk:", userInfo.empPk);
    console.log("Selected month:", selectedMonth);

    const in_par = {
      p1_varchar2: userInfo.empPk,
      p2_varchar2: userInfo.crt_by,
      p3_varchar2: moment(selectedMonth).format("YYYYMM"),
    }
    console.log("in_par", in_par);

    sysFetch(
      API_URL,
      {
        pro: "STV_HR_SEL_MBI_HRIN005_1_100", // Theo tháng
        in_par: in_par,
        out_par: {
          p1_sys: "ngaynghi",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        setLoading(false);
        setRefreshing(false);

        console.log("=== API Response (Month) ===");
        console.log("Full response:", JSON.stringify(rs, null, 2));

        if (rs === "Token Expired") {
          console.log("Token expired, refreshing...");
          refreshNewToken("getData");
        } else if (rs && rs.results === "S") {
          console.log("API success, data:", rs.data);
          setDataNgayNghi(rs.data.ngaynghi || []);
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
    console.log("=== useEffect triggered (Month) ===");
    console.log("API_URL:", API_URL);
    console.log("tokenLogin:", tokenLogin);
    console.log("userInfo?.empPk:", userInfo?.empPk);
    console.log("selectedMonth:", selectedMonth);

    if (API_URL && tokenLogin && userInfo?.empPk) {
      console.log("All conditions met, checking network...");
      NetInfo.fetch().then((state) => {
        if (state.isConnected) {
          console.log("Network connected, calling getData...");
          getData();
        } else {
          console.log("No network connection");
          Alert.alert(t('error'), t('noInternetConnection'));
        }
      });
    } else {
      console.log("Missing required values, not calling getData");
    }
  }, [selectedMonth, API_URL, tokenLogin, userInfo?.empPk]);

  const showMonthPicker = () => {
    setModalVisible(true);
  };

  const onMonthSelect = (month) => {
    setSelectedMonth(month.format("YYYY-MM"));
    setModalVisible(false);
  };

  const renderHolidayItem = (item, index) => (
    <View key={index} style={[styles.holidayItem, {
      backgroundColor: colors.card,
      borderColor: colors.border,
      shadowColor: colors.shadow,
    }]}>
      <View style={styles.holidayItemHeader}>
        <Icon name="calendar-month" size={20} color={colors.primary} />
        <Text style={[styles.holidayItemTitle, { color: colors.textPrimary }]}>
          {item.title || `Ngày nghỉ ${index + 1}`}
        </Text>
        <Text style={[styles.holidayType, {
          color: item.type === 'Lễ' ? colors.warning : colors.info
        }]}>
          {item.type || 'Nghỉ phép'}
        </Text>
      </View>

      <View style={styles.holidayDetails}>
        <View style={styles.holidayDetailRow}>
          <Text style={[styles.holidayDetailLabel, { color: colors.textSecondary }]}>
            Ngày:
          </Text>
          <Text style={[styles.holidayDetailValue, { color: colors.textPrimary }]}>
            {item.date || 'N/A'}
          </Text>
        </View>

        <View style={styles.holidayDetailRow}>
          <Text style={[styles.holidayDetailLabel, { color: colors.textSecondary }]}>
            Thứ:
          </Text>
          <Text style={[styles.holidayDetailValue, { color: colors.textPrimary }]}>
            {item.dayOfWeek || 'N/A'}
          </Text>
        </View>

        <View style={styles.holidayDetailRow}>
          <Text style={[styles.holidayDetailLabel, { color: colors.textSecondary }]}>
            Trạng thái:
          </Text>
          <Text style={[styles.holidayDetailValue, {
            color: item.status === 'Đã nghỉ' ? colors.success : colors.warning
          }]}>
            {item.status || 'Chưa nghỉ'}
          </Text>
        </View>
      </View>

      {item.description && (
        <Text style={[styles.holidayDescription, { color: colors.textSecondary }]}>
          {item.description}
        </Text>
      )}
    </View>
  );

  const renderMonthPickerModal = () => (
    <MonthPicker
      visible={modalVisible}
      selectedMonth={selectedMonth}
      onSelect={onMonthSelect}
      onClose={() => setModalVisible(false)}
      title={t('selectMonth')}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader goBack={navigation.goBack}>
        {title || t('holidayByMonth')}
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
        {/* Month Picker Card */}
        <View style={[styles.monthPickerCard, {
          backgroundColor: colors.card,
          shadowColor: colors.shadow,
        }]}>
          <TouchableOpacity
            style={styles.monthPickerButton}
            onPress={showMonthPicker}
          >
            <Icon name="calendar-month" size={24} color={colors.primary} />
            <View style={styles.monthPickerTextContainer}>
              <Text style={[styles.monthPickerText, { color: colors.textPrimary }]}>
                {moment(selectedMonth).format("MM/YYYY")}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Holiday Data List */}
        {loading ? (
          <View style={[styles.loadingContainer, { backgroundColor: colors.surface }]}>
            <Icon name="loading" size={32} color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              {t('loading')}...
            </Text>
          </View>
        ) : dataNgayNghi.length > 0 ? (
          <View style={styles.holidayContainer}>
            {dataNgayNghi.map((item, index) => renderHolidayItem(item, index))}
          </View>
        ) : (
          <EmptyState
            title={t('noHolidayData')}
            subtitle={t('selectDifferentMonth')}
            iconName="calendar-month"
            iconSize={64}
          />
        )}
      </ScrollView>

      {renderMonthPickerModal()}
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
  monthPickerCard: {
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
  monthPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  monthPickerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  monthPickerText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    marginBottom: 2,
    textAlign: 'center',
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
  holidayContainer: {
    marginTop: 8,
  },
  holidayItem: {
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
  holidayItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  holidayItemTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    marginLeft: 8,
    flex: 1,
  },
  holidayType: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    textAlign: 'right',
  },
  holidayDetails: {
    marginBottom: 8,
  },
  holidayDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  holidayDetailLabel: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    flex: 1,
  },
  holidayDetailValue: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    textAlign: 'right',
    flex: 1,
  },
  holidayDescription: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    lineHeight: 20,
    fontStyle: 'italic',
  },
});

export default MBHRIN005_Month;
