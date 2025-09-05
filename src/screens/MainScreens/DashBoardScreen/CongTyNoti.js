import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';

const CongTyNoti = ({ onCallbackSetDate, startDate, endDate }) => {
  const { colors } = useTheme();

  const notifications = [
    {
      id: 1,
      title: 'Thông báo nghỉ lễ',
      content: 'Công ty nghỉ lễ Quốc khánh từ ngày 02/09 đến 04/09',
      date: '2024-08-30',
      type: 'holiday'
    },
    {
      id: 2,
      title: 'Thông báo họp',
      content: 'Cuộc họp team sẽ diễn ra vào thứ 2 tuần tới',
      date: '2024-08-28',
      type: 'meeting'
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.dateFilterContainer}>
          <Text style={[styles.dateLabel, { color: colors.mainColor }]}>
            Kỳ: {startDate} - {endDate}
          </Text>
          <TouchableOpacity
            style={[styles.dateButton, { borderColor: colors.mainColor }]}
            onPress={() => {
              // Có thể thêm date picker ở đây
            }}
          >
            <Text style={[styles.dateButtonText, { color: colors.mainColor }]}>
              Chọn kỳ
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.title, { color: colors.mainColor }]}>
            Thông báo công ty
          </Text>

          {notifications.length > 0 ? (
            notifications.map((item) => (
              <View key={item.id} style={styles.notificationItem}>
                <View style={styles.notificationHeader}>
                  <Text style={[styles.notificationTitle, { color: colors.textPrimary }]}>{item.title}</Text>
                  <Text style={[styles.notificationDate, { color: colors.textTertiary }]}>{item.date}</Text>
                </View>
                <Text style={[styles.notificationContent, { color: colors.textSecondary }]}>{item.content}</Text>
                <View style={[
                  styles.typeBadge,
                  { backgroundColor: item.type === 'holiday' ? '#ff6b6b' : '#4ecdc4' }
                ]}>
                  <Text style={styles.typeText}>
                    {item.type === 'holiday' ? 'Nghỉ lễ' : 'Họp'}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: colors.textTertiary }]}>Không có thông báo nào</Text>
            </View>
          )}
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.title, { color: colors.mainColor }]}>
            Biểu đồ lương
          </Text>
          <View style={[styles.chartPlaceholder, { backgroundColor: colors.background }]}>
            <Text style={[styles.chartText, { color: colors.textTertiary }]}>Biểu đồ lương sẽ hiển thị ở đây</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  dateFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  dateButtonText: {
    fontSize: 14,
  },
  card: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  notificationItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
    marginBottom: 12,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  notificationDate: {
    fontSize: 12,
  },
  notificationContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
  },
  chartPlaceholder: {
    height: 200,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartText: {
    fontSize: 16,
  },
});

export default CongTyNoti;
