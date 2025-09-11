import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Alert,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import { useTranslation } from 'react-i18next';
import AppHeader from '../../../../components/AppHeader';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../../../hooks/useAuth';
import { sysFetch } from '../../../../services/apiService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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

  // Get API URL from storage or config
  const [API_URL, setAPI_URL] = useState('');
  // Sử dụng tokenLogin từ userInfo thay vì AsyncStorage
  const tokenLogin = userInfo?.tokenLogin;

  // State for data
  const [dataTTCN, setDataTTCN] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // State for expand/collapse
  const [expandedSections, setExpandedSections] = useState({});

  // Get API config from AsyncStorage
  useEffect(() => {
    const getAPIConfig = async () => {
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        const apiUrl = await AsyncStorage.getItem('API_URL');

        setAPI_URL(apiUrl);
        console.log("API_URL set successfully");
      } catch (error) {
        console.log('Error getting API config:', error);
      }
    };
    getAPIConfig();
  }, []);
  const refreshNewToken = (callback) => {
    // Implement token refresh logic here if needed
    // For now, just call the callback
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
    sysFetch(
      API_URL,
      {
        pro: "STV_HR_SEL_MBI_HRIN001_0_100",
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
          console.log("Token expired, refreshing...");
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
      });
  };


  useEffect(() => {

    if (API_URL && tokenLogin && userInfo?.empPk) {
      console.log("Calling getData from useEffect");
      getData();
    } else {
      console.log("Not calling getData - missing required values");
    }
  }, [API_URL, tokenLogin, userInfo?.empPk]);

  const onRefresh = () => {
    setRefreshing(true);
    getData();
  };

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

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
                backgroundColor: colors.surface,
                borderWidth: 2,
              }]}>
                <Icon name="account" size={28} color={colors.primary} />
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
        ) : dataTTCN && Object.keys(dataTTCN).length > 0 ? (
          <View style={styles.dataContainer}>
            {/* Hiển thị tất cả các section có data từ API */}
            {Object.entries(dataTTCN).map(([key, value]) => {
              // Bỏ qua o1 vì nó là danh sách tab
              if (key === 'o1') return null;

              // Lấy tên section từ o1 (danh sách tab)
              const sectionName = dataTTCN.o1 && dataTTCN.o1[parseInt(key.replace('o', '')) - 1]
                ? dataTTCN.o1[parseInt(key.replace('o', '')) - 1].tab_name
                : `Thông tin ${key}`;

              // Bỏ qua nếu tên section rỗng
              if (!sectionName || sectionName.trim() === '') return null;

              // Kiểm tra xem có nội dung thực sự không (không phải N/A)
              const hasRealContent = value && value.length > 0 && value.some(item => {
                if (!item.txtvalue || item.txtvalue.trim() === '') return false;

                // Kiểm tra xem có ít nhất 1 field có giá trị thực sự không
                return item.txtvalue.split('|').some(field => {
                  if (!field.trim()) return false;
                  const [label, value] = field.split(':');
                  const trimmedValue = value?.trim();
                  return trimmedValue && trimmedValue !== 'N/A' && trimmedValue !== '-' && trimmedValue !== 'null';
                });
              });

              // Đếm số items có nội dung thực sự
              const contentCount = value && value.length > 0
                ? value.filter(item => {
                  if (!item.txtvalue || item.txtvalue.trim() === '') return false;

                  // Đếm số fields có giá trị thực sự trong item này
                  const validFields = item.txtvalue.split('|').filter(field => {
                    if (!field.trim()) return false;
                    const [label, value] = field.split(':');
                    const trimmedValue = value?.trim();
                    return trimmedValue && trimmedValue !== 'N/A' && trimmedValue !== '-' && trimmedValue !== 'null';
                  });

                  return validFields.length > 0;
                }).length
                : 0;

              // Icon mapping
              const getIcon = (key) => {
                const iconMap = {
                  'o2': 'account',
                  'o3': 'school',
                  'o4': 'home-heart',
                  'o5': 'briefcase',
                  'o6': 'file-document',
                  'o7': 'alert-circle',
                  'o8': 'trending-up',
                  'o9': 'currency-usd',
                  'o10': 'information',
                  'o11': 'information',
                  'o12': 'information',
                  'o13': 'information',
                  'o14': 'information',
                  'o15': 'information',
                  'o16': 'information',
                };
                return iconMap[key] || 'information';
              };

              return (
                <View key={key} style={[styles.dataItem, {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  shadowColor: colors.shadow,
                }]}>
                  <TouchableOpacity
                    style={styles.dataItemHeader}
                    onPress={() => toggleSection(key)}
                  >
                    <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                      <Icon name={getIcon(key)} size={20} color={colors.primary} />
                    </View>

                    <Text style={[styles.dataItemTitle, { color: colors.textPrimary }]}>
                      {sectionName} {contentCount > 0 ? `(${contentCount})` : '(Trống)'}
                    </Text>
                    <Icon
                      name={expandedSections[key] ? "chevron-up" : "chevron-down"}
                      size={20}
                      color={colors.textSecondary}
                      style={styles.expandIcon}
                    />
                  </TouchableOpacity>

                  {expandedSections[key] && (
                    <View style={styles.expandedContent}>
                      {hasRealContent ? (
                        value.map((item, index) => {
                          // Kiểm tra xem item có nội dung thực sự không
                          const hasContent = item.txtvalue && item.txtvalue.trim() !== '';

                          if (!hasContent) return null;

                          return (
                            <View key={index} style={styles.sectionItem}>
                              {item.txtvalue.split('|').map((field, fieldIndex) => {
                                if (field.trim()) {
                                  const [label, value] = field.split(':');
                                  const trimmedValue = value?.trim();

                                  // Bỏ qua nếu giá trị là N/A, rỗng, hoặc không có ý nghĩa
                                  if (!trimmedValue || trimmedValue === 'N/A' || trimmedValue === '-' || trimmedValue === 'null') {
                                    return null;
                                  }

                                  return (
                                    <View key={fieldIndex} style={styles.infoRow}>
                                      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                                        {label?.trim()}:
                                      </Text>
                                      <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                                        {trimmedValue}
                                      </Text>
                                    </View>
                                  );
                                }
                                return null;
                              })}
                            </View>
                          );
                        })
                      ) : (
                        <EmptyState
                          title="Không có dữ liệu"
                          subtitle="Thông tin này chưa được cập nhật"
                          iconName="information-outline"
                          iconSize={48}
                          customStyles={{
                            container: {
                              paddingVertical: 20,
                              paddingHorizontal: 16,
                              alignItems: 'center',
                              justifyContent: 'center',
                            },
                            iconContainer: {
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginBottom: 16,
                            }
                          }}
                        />
                      )}
                    </View>
                  )}
                </View>
              );
            })}
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  userCard: {
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 3,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  defaultAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  userDetails: {
    flex: 1,
    marginLeft: 12,
  },
  infoText: {
    fontFamily: 'Roboto-Regular',
    marginBottom: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
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
    borderRadius: 6,
    padding: 6,
    marginBottom: 6,
    borderWidth: 0.5,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.03,
    shadowRadius: 1,
    elevation: 1,
  },
  dataItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6
  },
  expandIcon: {
    marginLeft: 'auto',
  },
  expandedContent: {
    marginTop: 8,
  },
  dataItemTitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    marginLeft: 6,
  },
  dataText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 0.3,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    flex: 2,
    textAlign: 'right',
  },
  sectionItem: {
    marginBottom: 10,
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
});

export default MBHRIN001_ThongTinCaNhan;

