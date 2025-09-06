import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Alert,
  RefreshControl
} from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import { useTranslation } from 'react-i18next';
import AppHeader from '../../../../components/AppHeader';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../../../hooks/useAuth';
import { sysFetch } from '../../../../services/apiService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNRestart from 'react-native-restart';
import EmptyState from '../../../../components/EmptyState';

const MBHRIN001_ThongTinCaNhan = ({ navigation, route }) => {
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
  const [dataTTCN, setDataTTCN] = useState([]);
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

    sysFetch(
      API_URL,
      {
        pro: "SELHRIN0010100",
        in_par: {
          p1_varchar2: userInfo.empPk,
        },
        out_par: {
          p1_sys: "o1",
          p2_sys: "o2",
          p3_sys: "o3",
          p4_sys: "o4",
          p5_sys: "o5",
          p6_sys: "o6",
          p7_sys: "o7",
          p8_sys: "o8",
          p9_sys: "o9",
          p10_sys: "o10",
          p11_sys: "o11",
          p12_sys: "o12",
          p13_sys: "o13",
          p14_sys: "o14",
          p15_sys: "o15",
          p16_sys: "o16",
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
          setDataTTCN(rs.data || []);
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
      getData();
    }
  }, [API_URL, tokenLogin, userInfo?.empPk]);

  const renderInfoText = (text, size = 14) => {
    return (
      <Text style={[styles.infoText, {
        color: colors.textPrimary,
        fontSize: size
      }]}>
        {text}
      </Text>
    );
  };
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader goBack={navigation.goBack}>
        {title || t('personalInfo')}
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
        {/* User Info Card */}
        <View style={[styles.userCard, {
          backgroundColor: colors.card,
          shadowColor: colors.shadow,
        }]}>
          <View style={styles.userInfoRow}>
            {userInfo?.avatar ? (
              <View style={[styles.avatarContainer, { backgroundColor: colors.surface }]}>
                <Image
                  style={styles.avatarImage}
                  source={{ uri: userInfo.avatar }}
                />
              </View>
            ) : (
              <View style={[styles.defaultAvatar, {
                borderColor: colors.primary,
                backgroundColor: colors.surface
              }]}>
                <Icon name="account" size={24} color={colors.primary} />
              </View>
            )}

            <View style={styles.userDetails}>
              {renderInfoText(userInfo?.fullName || 'N/A', 18)}
              {renderInfoText(userInfo?.empId || 'N/A', 14)}
              <View style={styles.statusContainer}>
                <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
                <Text style={[styles.statusText, { color: colors.success }]}>
                  {t('statusWorking')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Data List */}
        {loading ? (
          <View style={[styles.loadingContainer, { backgroundColor: colors.surface }]}>
            <Icon name="loading" size={32} color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              {t('loading')}...
            </Text>
          </View>
        ) : dataTTCN.length > 0 ? (
          <View style={styles.dataContainer}>
            {dataTTCN.map((item, index) => (
              <View key={index} style={[styles.dataItem, {
                backgroundColor: colors.card,
                borderColor: colors.border,
                shadowColor: colors.shadow,
              }]}>
                <View style={styles.dataItemHeader}>
                  <Icon name="account-details" size={20} color={colors.primary} />
                  <Text style={[styles.dataItemTitle, { color: colors.textPrimary }]}>
                    {t('dataItem')} {index + 1}
                  </Text>
                </View>
                <Text style={[styles.dataText, { color: colors.textSecondary }]}>
                  {JSON.stringify(item, null, 2)}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <EmptyState
            title={t('noDataAvailable')}
            subtitle={t('pullToRefresh')}
            iconName="account-search"
            iconSize={64}
          />
        )}
      </ScrollView>
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
  userCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 60,
    height: 80,
  },
  defaultAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDetails: {
    flex: 1,
    marginLeft: 15,
  },
  infoText: {
    fontFamily: 'Roboto-Regular',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
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

export default MBHRIN001_ThongTinCaNhan;

