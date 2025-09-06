import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';
import moment from 'moment';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from 'react-i18next';
import AppIcon from '../AppIcon';

const MonthPicker = ({
  visible,
  onClose,
  onSelect,
  selectedMonth,
  title = 'Chọn tháng'
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [currentYear, setCurrentYear] = useState(moment().year());
  const [selectedMonthState, setSelectedMonthState] = useState(
    selectedMonth ? moment(selectedMonth).month() : moment().month()
  );

  useEffect(() => {
    if (selectedMonth) {
      setSelectedMonthState(moment(selectedMonth).month());
      setCurrentYear(moment(selectedMonth).year());
    }
  }, [selectedMonth]);

  const months = [
    { key: 0, name: t('month_1') },
    { key: 1, name: t('month_2') },
    { key: 2, name: t('month_3') },
    { key: 3, name: t('month_4') },
    { key: 4, name: t('month_5') },
    { key: 5, name: t('month_6') },
    { key: 6, name: t('month_7') },
    { key: 7, name: t('month_8') },
    { key: 8, name: t('month_9') },
    { key: 9, name: t('month_10') },
    { key: 10, name: t('month_11') },
    { key: 11, name: t('month_12') },
  ];

  const handleMonthSelect = (monthKey) => {
    setSelectedMonthState(monthKey);
    const selectedDate = moment().year(currentYear).month(monthKey);
    onSelect(selectedDate);
  };

  const handleYearChange = (increment) => {
    setCurrentYear(currentYear + increment);
  };

  const handleConfirm = () => {
    const selectedDate = moment().year(currentYear).month(selectedMonthState);
    onSelect(selectedDate);
    onClose();
  };

  const renderMonthGrid = () => {
    return months.map((month) => (
      <TouchableOpacity
        key={month.key}
        style={[
          styles.monthItem,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
          selectedMonthState === month.key && [
            styles.selectedMonthItem,
            { backgroundColor: colors.primary }
          ]
        ]}
        onPress={() => handleMonthSelect(month.key)}
      >
        <Text
          style={[
            styles.monthText,
            { color: colors.textPrimary },
            selectedMonthState === month.key && [
              styles.selectedMonthText,
              { color: colors.surface }
            ]
          ]}
        >
          {month.name}
        </Text>
      </TouchableOpacity>
    ));
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {title}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
            >
              <AppIcon name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Year Selector */}
          <View style={[styles.yearSelector, { borderBottomColor: colors.border }]}>
            <TouchableOpacity
              onPress={() => handleYearChange(-1)}
              style={styles.yearButton}
            >
              <AppIcon name="chevron-left" size={24} color={colors.primary} />
            </TouchableOpacity>

            <Text style={[styles.yearText, { color: colors.textPrimary }]}>
              {currentYear}
            </Text>

            <TouchableOpacity
              onPress={() => handleYearChange(1)}
              style={styles.yearButton}
            >
              <AppIcon name="chevron-right" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Month Grid */}
          <View style={styles.monthGrid}>
            {renderMonthGrid()}
          </View>

          {/* Buttons */}
          <View style={[styles.buttonContainer, {
            borderTopColor: colors.border,
            backgroundColor: colors.card,
            borderTopWidth: 1,
          }]}>
            <TouchableOpacity
              style={[styles.cancelButton, {
                borderColor: colors.border,
                backgroundColor: colors.surface
              }]}
              onPress={onClose}
            >
              <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>
                {t('cancel')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: colors.primary }]}
              onPress={handleConfirm}
            >
              <Text style={[styles.confirmButtonText, { color: colors.surface }]}>
                {t('confirm')}
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 12,
    overflow: 'visible',
    flexShrink: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  yearSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  yearButton: {
    padding: 8,
  },
  yearText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    paddingBottom: 4,
    justifyContent: 'space-between',
    flexShrink: 0,
  },
  monthItem: {
    width: '30%',
    aspectRatio: 1.2,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedMonthItem: {
    borderColor: 'transparent',
  },
  monthText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedMonthText: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    paddingTop: 4,
    borderTopWidth: 1,
    flexShrink: 0,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MonthPicker;
