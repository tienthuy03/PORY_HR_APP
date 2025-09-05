import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/useTheme';

const { width, height } = Dimensions.get('window');

const NotificationDetailModal = ({
  visible = false,
  notification = null,
  onClose,
  onMarkAsRead,
  onRequestClose,
  transparent = true,
  animationType = 'slide',
  ...props
}) => {
  const { colors } = useTheme();

  if (!notification) return null;

  const handleMarkAsRead = () => {
    if (onMarkAsRead && !notification.isRead) {
      onMarkAsRead(notification.id);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const styles = createStyles(colors, notification);

  // Get detailed message based on notification type
  const getDetailedMessage = () => {
    switch (notification.type) {
      case 'salary':
        return `Bảng lương tháng 8/2024 của bạn đã được cập nhật và sẵn sàng để xem. 

Tổng thu nhập: 15,000,000 VNĐ
Lương cơ bản: 12,000,000 VNĐ  
Phụ cấp: 2,000,000 VNĐ
Thưởng: 1,000,000 VNĐ

Vui lòng truy cập mục "Bảng lương" để xem chi tiết đầy đủ.`;

      case 'attendance':
        return `Bạn đã check-in thành công hôm nay lúc 08:30 AM.

Địa điểm: Tòa nhà ABC, Tầng 5
Thời gian làm việc: 08:30 - 17:30
Trạng thái: Đúng giờ

Chúc bạn có một ngày làm việc hiệu quả!`;

      case 'leave':
        return `Đơn nghỉ phép của bạn đã được phê duyệt.

Thời gian nghỉ: 15/09/2024 - 17/09/2024
Loại nghỉ: Nghỉ phép năm
Số ngày nghỉ: 3 ngày
Người phê duyệt: Nguyễn Văn Manager

Vui lòng chuẩn bị công việc trước khi nghỉ.`;

      case 'success':
        return `Thông tin cá nhân của bạn đã được cập nhật thành công.

Các thông tin đã thay đổi:
- Số điện thoại
- Địa chỉ email  
- Địa chỉ thường trú

Thời gian cập nhật: ${new Date().toLocaleString('vi-VN')}`;

      case 'error':
        return `Đã xảy ra lỗi khi thực hiện chấm công.

Lỗi: Không thể kết nối với máy chủ
Mã lỗi: ERR_001
Thời gian: ${new Date().toLocaleString('vi-VN')}

Vui lòng thử lại sau hoặc liên hệ IT để được hỗ trợ.`;

      case 'update':
        return `Hệ thống sẽ được bảo trì để cải thiện hiệu suất.

Thời gian bảo trì: 22:00 - 24:00 hôm nay
Ảnh hưởng: Không thể truy cập hệ thống
Dự kiến hoàn thành: 24:00

Vui lòng hoàn thành công việc trước 22:00. Xin lỗi vì sự bất tiện này.`;

      case 'exchange':
        return `Yêu cầu đổi ca làm việc của bạn đã được chấp nhận.

Ca cũ: 08:00 - 17:00 (Thứ 2)
Ca mới: 14:00 - 23:00 (Thứ 2)
Đổi với: Nguyễn Văn A
Lý do: Có việc cá nhân

Hiệu lực từ tuần tới. Vui lòng chuẩn bị cho ca làm việc mới.`;

      default:
        return notification.message;
    }
  };

  const getActionButtons = () => {
    switch (notification.type) {
      case 'salary':
        return [
          { text: 'Xem bảng lương', action: () => console.log('View salary'), primary: true },
          { text: 'Đóng', action: handleClose, primary: false }
        ];
      case 'leave':
        return [
          { text: 'Xem chi tiết', action: () => console.log('View leave details'), primary: true },
          { text: 'Đóng', action: handleClose, primary: false }
        ];
      case 'error':
        return [
          { text: 'Thử lại', action: () => console.log('Retry'), primary: true },
          { text: 'Liên hệ IT', action: () => console.log('Contact IT'), primary: false },
          { text: 'Đóng', action: handleClose, primary: false }
        ];
      default:
        return [
          { text: 'Đóng', action: handleClose, primary: true }
        ];
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={transparent}
      animationType={animationType}
      onRequestClose={onRequestClose}
      {...props}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconContainer, { backgroundColor: notification.backgroundColor }]}>
                <Icon name={notification.icon} size={24} color={notification.color} />
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={styles.title}>{notification.title}</Text>
                <Text style={styles.timeText}>{notification.time}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Icon name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
            <Text style={styles.message}>{getDetailedMessage()}</Text>

            {!notification.isRead && (
              <TouchableOpacity
                style={styles.markAsReadButton}
                onPress={handleMarkAsRead}
              >
                <Icon name="check" size={16} color={colors.success} />
                <Text style={[styles.markAsReadText, { color: colors.success }]}>
                  Đánh dấu đã đọc
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            {getActionButtons().map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.actionButton,
                  button.primary ? styles.primaryButton : styles.secondaryButton,
                  getActionButtons().length === 1 && styles.fullWidthButton
                ]}
                onPress={button.action}
              >
                <Text style={[
                  styles.buttonText,
                  button.primary ? styles.primaryButtonText : styles.secondaryButtonText
                ]}>
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors, notification) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    margin: 20,
    maxHeight: height * 0.8,
    minWidth: width * 0.85,
    maxWidth: width * 0.9,
    shadowColor: colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
    fontFamily: 'Roboto-Medium',
  },
  timeText: {
    fontSize: 14,
    color: colors.textTertiary,
    fontFamily: 'Roboto-Regular',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    maxHeight: height * 0.4,
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    fontFamily: 'Roboto-Regular',
  },
  markAsReadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.successLight,
  },
  markAsReadText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
    fontFamily: 'Roboto-Medium',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  fullWidthButton: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: colors.mainColor,
  },
  secondaryButton: {
    backgroundColor: colors.border,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
  },
  primaryButtonText: {
    color: colors.surface,
  },
  secondaryButtonText: {
    color: colors.textPrimary,
  },
});

export default NotificationDetailModal;
