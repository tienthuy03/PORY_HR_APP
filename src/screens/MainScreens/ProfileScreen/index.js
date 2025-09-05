import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../hooks/useTheme';
import AppHeader from '../../../components/AppHeader';
import AppIcon from '../../../components/AppIcon';
import Avatar from '../../../components/Avatar';
import { useAuth } from '../../../hooks/useAuth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileScreen = ({ onLogout }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useSelector((state) => state.auth);
  const { getUserInfo } = useAuth();
  const userInfo = getUserInfo();

  const menuItems = [
    { icon: 'bell', title: t('notifications'), subtitle: t('notificationsSubtitle') },
    { icon: 'shield-check', title: t('security'), subtitle: t('securitySubtitle') },
    { icon: 'help-circle', title: t('help'), subtitle: t('helpSubtitle') },
    { icon: 'information', title: t('about'), subtitle: t('aboutSubtitle') },
  ];


  const handleMenuItemPress = (item) => {
    console.log('Menu item pressed:', item.title);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <AppHeader showBackButton={false}>
        {t('personalProfile')}
      </AppHeader>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          {/* Main Profile Section */}
          <View style={styles.mainSection}>
            <Avatar
              size={80}
              name={userInfo?.fullName}
              source={userInfo?.avatar ? { uri: userInfo.avatar } : null}
              style={styles.avatarContainer}
              backgroundColor={colors.mainColor}
              defaultAvatarSource={{
                uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
              }}
            />

            <View style={styles.profileDetails}>
              <View style={styles.nameSection}>
                <Text style={[styles.profileName, { color: colors.textPrimary }]}>
                  {userInfo?.fullName || 'Nguyễn Văn A'}
                </Text>
              </View>

              <View style={styles.positionSection}>
                <Text style={[styles.position, { color: colors.textSecondary }]}>
                  {t('department')}: {userInfo?.orgNm}
                </Text>
              </View>
              <View style={styles.positionSection}>
                <Text style={[styles.position, { color: colors.textSecondary }]}>
                  {t('employeeCode')}: {userInfo?.empId}
                </Text>
              </View>
              <View style={styles.positionSection}>
                <Text style={[styles.position, { color: colors.textSecondary }]}>
                  {t('workingStatus')}: {userInfo?.workingStatus || t('workingStatusDefault')}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#10B981' }]}
            onPress={() => handleMenuItemPress({ title: 'Chỉnh sửa hồ sơ' })}
          >
            <Text style={styles.actionButtonText}>
              {t('editProfile')} {'>'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('options')}</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { backgroundColor: colors.card }]}
              onPress={() => handleMenuItemPress(item)}
            >
              <AppIcon
                name={item.icon}
                library="MaterialCommunityIcons"
                size={24}
                color={colors.mainColor}
              />
              <View style={styles.menuItemContent}>
                <Text style={[styles.menuItemTitle, { color: colors.textPrimary }]}>{item.title}</Text>
                <Text style={[styles.menuItemSubtitle, { color: colors.textSecondary }]}>{item.subtitle}</Text>
              </View>
              <AppIcon
                name="chevron-right"
                library="MaterialCommunityIcons"
                size={20}
                color={colors.textTertiary}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.error }]} onPress={onLogout}>
          <AppIcon
            name="logout"
            library="MaterialCommunityIcons"
            size={20}
            color="white"
          />
          <Text style={styles.logoutText}>{t('logout')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
  },
  profileCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  timeSection: {
    marginBottom: 20,
  },
  timeText: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  mainSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileDetails: {
    flex: 1,
    gap: 4,
  },
  nameSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    flex: 1,
  },
  duration: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  positionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  position: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    flex: 1,
  },
  salary: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
  actionButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    marginBottom: 16,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  menuSection: {
    marginBottom: 24,
  },
  menuItem: {
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  menuItemContent: {
    flex: 1,
    marginLeft: 16,
  },
  menuItemTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    marginBottom: 4,
    lineHeight: 20,
  },
  menuItemSubtitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    lineHeight: 18,
    opacity: 0.8,
  },
  logoutButton: {
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    marginBottom: 24,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    marginLeft: 12,
    lineHeight: 20,
  },
});

export default ProfileScreen;
