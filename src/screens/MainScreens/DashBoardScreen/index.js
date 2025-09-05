import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../../hooks/useTheme';
import AppHeader from '../../../components/AppHeader';
import TabBar from '../../../components/TabBar';
import moment from "moment";
import ThongKe from './ThongKe';
import CongTyNoti from './CongTyNoti';
const DashboardScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const state = useSelector(state => state);
  const [Dashboard, setDashboard] = useState('Bảng tin');
  let language = '';
  let dataLanguage;
  try {
    dataLanguage = state.languageReducer.data.data.language;
    language =
      state.loginReducers.data.data.user_language == undefined
        ? 'VIE'
        : state.loginReducers.data.data.user_language;
  } catch (error) {
    //
  }

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
                name: 'Cá nhân',
                count: null,
                screen: <ThongKe />
              },
              {
                id: 1,
                name: 'Công ty',
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
