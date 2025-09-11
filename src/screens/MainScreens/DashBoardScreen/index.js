import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../hooks/useTheme';
import AppHeader from '../../../components/AppHeader';
import TabBar from '../../../components/TabBar';
import moment from "moment";
import ThongKe from './ThongKe';
import CongTyNoti from './CongTyNoti';
const DashboardScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  // Sử dụng selector cụ thể thay vì lấy toàn bộ state
  const userLanguage = useSelector((state) => state.auth?.user?.user_language);
  const languageData = useSelector((state) => state.languageReducer?.data?.data?.language);
  const loginData = useSelector((state) => state.loginReducers?.data?.data);

  const [Dashboard, setDashboard] = useState(t('navDashboard'));
  let language = userLanguage || 'VIE';
  let dataLanguage = languageData;

  useEffect(() => {
    if (dataLanguage !== undefined) {
      dataLanguage.filter(item => {
        var lowerLanguage = language.toLowerCase();
        if (item.field_name === 'dashboard') {
          setDashboard(item[lowerLanguage]);
        }
      });
    }
  }, [dataLanguage, language]);

  const [startDate, setStartDate] = useState(
    moment(new Date()).format("YYYY-MM-01")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).endOf("month").format("YYYY-MM-DD")
  );

  const onCallbackSetDate = (sDate, eDate) => {
    setStartDate(sDate);
    setEndDate(eDate);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        translucent={true}
        backgroundColor={'transparent'}
        barStyle="dark-content"
      />

      {/* Header */}
      <AppHeader showBackButton={false}>
        {Dashboard}
      </AppHeader>
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <TabBar
            fullTab
            scrollEnabled={false}
            data={[
              {
                id: 0,
                name: t('personal'),
                count: null,
                screen: <ThongKe />
              },
              {
                id: 1,
                name: t('company'),
                count: null,
                screen: <CongTyNoti
                  onCallbackSetDate={onCallbackSetDate}
                  startDate={startDate}
                  endDate={endDate}
                />
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

export default DashboardScreen;
