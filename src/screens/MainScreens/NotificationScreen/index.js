/* eslint-disable react-hooks/exhaustive-deps */
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../../hooks/useTheme';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NotificationDetailModal from '../../../components/NotificationDetailModal';
import AppHeader from '../../../components/AppHeader';
import AppIcon from '../../../components/AppIcon';

const NotificationScreen = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [valueNoti, setValueNoti] = useState(t('navNotification'));
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [notificationList, setNotificationList] = useState([]);

  // HR related notification data
  const notifications = useMemo(() => [
    {
      id: 1,
      type: 'salary',
      title: 'Bảng lương tháng 8',
      message: 'Bảng lương tháng 8/2024 đã được cập nhật và sẵn sàng xem.',
      time: '2 phút trước',
      icon: 'cash',
      color: '#4CAF50',
      backgroundColor: '#E8F5E8',
      isRead: false
    },
    {
      id: 2,
      type: 'attendance',
      title: 'Chấm công',
      message: 'Bạn đã check-in thành công lúc 08:30 AM hôm nay.',
      time: '10 phút trước',
      icon: 'clock-check-outline',
      color: '#2196F3',
      backgroundColor: '#E3F2FD',
      isRead: true
    },
    {
      id: 3,
      type: 'leave',
      title: 'Đơn nghỉ phép',
      message: 'Đơn nghỉ phép từ 15/09 đến 17/09 đã được phê duyệt.',
      time: '1 giờ trước',
      icon: 'calendar-check',
      color: '#FF9800',
      backgroundColor: '#FFF3E0',
      isRead: false
    },
    {
      id: 4,
      type: 'success',
      title: 'Cập nhật thành công',
      message: 'Thông tin cá nhân đã được cập nhật thành công.',
      time: '1 giờ trước',
      icon: 'check-circle',
      color: '#4CAF50',
      backgroundColor: '#E8F5E8',
      isRead: true
    },
    {
      id: 5,
      type: 'error',
      title: t('attendanceError'),
      message: t('attendanceErrorMessage'),
      time: '1 giờ trước',
      icon: 'alert-circle',
      color: '#F44336',
      backgroundColor: '#FFEBEE',
      isRead: false
    },
    {
      id: 6,
      type: 'update',
      title: 'Cập nhật hệ thống',
      message: 'Hệ thống sẽ được bảo trì từ 22:00 - 24:00 hôm nay.',
      time: '2 giờ trước',
      icon: 'update',
      color: '#2196F3',
      backgroundColor: '#E3F2FD',
      isRead: true
    },
    {
      id: 7,
      type: 'exchange',
      title: 'Đổi ca làm việc',
      message: 'Yêu cầu đổi ca với Nguyễn Văn A đã được chấp nhận.',
      time: '3 giờ trước',
      icon: 'swap-horizontal',
      color: '#FF9800',
      backgroundColor: '#FFF3E0',
      isRead: true
    }
  ], [t]);

  // Initialize notification list
  React.useEffect(() => {
    setNotificationList(notifications);
  }, []);

  const handleNotificationPress = (notification) => {
    setSelectedNotification(notification);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedNotification(null);
  };


  const handleSettingsPress = () => {
    // Handle settings press
    console.log('Settings pressed');
  };

  const handleMarkAsRead = (notificationId) => {
    setNotificationList(prevList =>
      prevList.map(item =>
        item.id === notificationId
          ? { ...item, isRead: true }
          : item
      )
    );

    // Also update selected notification if it's the same
    if (selectedNotification?.id === notificationId) {
      setSelectedNotification(prev => ({ ...prev, isRead: true }));
    }
  };

  const renderNotificationItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.notificationItem,
        {
          backgroundColor: colors.card,
          borderLeftColor: item.color,
          opacity: item.isRead ? 0.7 : 1
        }
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.backgroundColor }]}>
        <Icon name={item.icon} size={20} color={item.color} />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {item.title}
          </Text>
          <View style={styles.timeContainer}>
            <Text style={[styles.time, { color: colors.textTertiary }]}>
              {item.time}
            </Text>
            {!item.isRead && <View style={[styles.unreadDot, { backgroundColor: colors.mainColor }]} />}
          </View>
        </View>

        <Text style={[styles.message, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.message}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        translucent={true}
        backgroundColor={'transparent'}
        barStyle="dark-content"
      />

      {/* Header */}
      <AppHeader
        showBackButton={false}
        rightComponent={
          <TouchableOpacity onPress={handleSettingsPress}>
            <AppIcon
              name="cog"
              library="MaterialCommunityIcons"
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>
        }
      >
        {valueNoti}
      </AppHeader>

      {/* Notifications List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {notificationList.map(renderNotificationItem)}
      </ScrollView>

      {/* Notification Detail Modal */}
      <NotificationDetailModal
        visible={showDetailModal}
        notification={selectedNotification}
        onClose={handleCloseModal}
        onMarkAsRead={handleMarkAsRead}
        onRequestClose={handleCloseModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    marginTop: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  timeContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  time: {
    fontSize: 12,
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default NotificationScreen;
