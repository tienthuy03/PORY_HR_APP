import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from 'react-i18next';

// Cấu hình locale cho tiếng Việt
const LocaleConfig = {
  locales: {
    vn: {
      monthNames: [
        'Tháng 1',
        'Tháng 2',
        'Tháng 3',
        'Tháng 4',
        'Tháng 5',
        'Tháng 6',
        'Tháng 7',
        'Tháng 8',
        'Tháng 9',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12',
      ],
      monthNamesShort: [
        'Th.1',
        'Th.2',
        'Th.3',
        'Th.4',
        'Th.5',
        'Th.6',
        'Th.7',
        'Th.8',
        'Th.9',
        'Th.10',
        'Th.11',
        'Th.12',
      ],
      dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
      dayNamesShort: ['CN', 'T.2', 'T.3', 'T.4', 'T.5', 'T.6', 'T.7'],
      today: "Hôm nay",
    }
  },
  defaultLocale: 'vn'
};

const CalendarComponent = ({ getState, startDayss, endDayss, onClose }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [startDay, setStartDay] = useState(
    moment(startDayss).format('YYYY-MM-DD'),
  );
  const [endDay, setEndDay] = useState(moment(endDayss).format('YYYY-MM-DD'));
  const [daySelect, setDateSelect] = useState(
    moment(startDayss).format('YYYY-MM-DD'),
  );
  const [marked, setMarked] = useState({});
  const [currentMonth, setCurrentMonth] = useState(
    moment(startDayss).format('YYYY-MM'),
  );

  const styles = createStyles(colors);

  useEffect(() => {
    renderDataForMarker(startDay, endDay);
  }, []);

  const onDayPress = (day) => {
    if (startDay === '') {
      setStartDay(moment(day.dateString).format('YYYY-MM-DD'));
      setMarked({
        [moment(day.dateString).format('YYYY-MM-DD')]: {
          startDay: true,
          selected: true,
          color: colors.primary,
        },
      });
      setEndDay('');
    }
    if (startDay !== '') {
      if (endDay !== '') {
        setStartDay(moment(day.dateString).format('YYYY-MM-DD'));
        setMarked({
          [moment(day.dateString).format('YYYY-MM-DD')]: {
            startingDay: true,
            selected: true,
            color: colors.primary,
          },
        });
        setEndDay('');
      } else {
        setEndDay(moment(day.dateString).format('YYYY-MM-DD'));

        if (startDay > day.dateString) {
          setStartDay(moment(day.dateString).format('YYYY-MM-DD'));
          setMarked({
            [moment(day.dateString).format('YYYY-MM-DD')]: {
              startingDay: true,
              selected: true,
              color: colors.primary,
            },
          });
          setEndDay('');
        } else {
          selectedDay(startDay, moment(day.dateString).format('YYYY-MM-DD'));
        }
      }
    }
  };

  const renderDataForMarker = (startingDays, endingDays) => {
    let nextDay = [];
    let startingDate;
    let stopDate;
    let obj;
    startingDate = moment(startingDays);
    stopDate = moment(endingDays);

    if (startingDate > stopDate) {
      while (stopDate <= startingDate) {
        nextDay.push(moment(stopDate).format('YYYY-MM-DD'));
        stopDate = moment(stopDate).add(1, 'days');
      }
      obj = nextDay.reduce(
        (c, v) =>
          Object.assign(c, {
            [v]:
              v === moment(startingDays).format('YYYY-MM-DD')
                ? { endingDay: true, selected: true, color: colors.primary }
                : v === moment(endingDays).format('YYYY-MM-DD')
                  ? { startingDay: true, selected: true, color: colors.primary }
                  : {
                    selected: true,
                    marked: true,
                    color: colors.primary,
                  },
          }),
        {},
      );
    } else {
      while (startingDate <= stopDate) {
        nextDay.push(moment(startingDate).format('YYYY-MM-DD'));
        startingDate = moment(startingDate).add(1, 'days');
      }
      obj = nextDay.reduce(
        (c, v) =>
          Object.assign(c, {
            [v]:
              nextDay.length === 1
                ? {
                  selected: true,
                  marked: true,
                  color: colors.primary,
                }
                : v === moment(startingDays).format('YYYY-MM-DD')
                  ? {
                    startingDay: true,
                    selected: true,
                    color: colors.primary,
                  }
                  : v === moment(endingDays).format('YYYY-MM-DD')
                    ? {
                      endingDay: true,
                      selected: true,
                      color: colors.primary,
                    }
                    : {
                      selected: true,
                      marked: true,
                      color: colors.primary,
                    },
          }),
        {},
      );
    }
    setMarked(obj);
  };

  const selectedDay = (startingDay, endingDay, thisIsOnChangMonth) => {
    renderDataForMarker(startingDay, endingDay);
    if (thisIsOnChangMonth == null) {
      startingDay > endingDay
        ? response(
          moment(endingDay).format('YYYYMMDD'),
          moment(startingDay).format('YYYYMMDD'),
        )
        : response(
          moment(startingDay).format('YYYYMMDD'),
          moment(endingDay).format('YYYYMMDD'),
        );
    }
  };

  const followDay = () => {
    const startOfDay = moment(new Date()).format('YYYY-MM-DD');
    const endOfDay = moment(new Date()).format('YYYY-MM-DD');
    setCurrentMonth(moment().format('YYYY-MM'));
    setStartDay(startOfDay);
    setEndDay(endOfDay);
    selectedDay(startOfDay, endOfDay);
  };

  const thisMonth = () => {
    let currentMonths = currentMonth;
    let startOfMonths = currentMonth + '-01';
    let endOfMonths =
      currentMonth + '-' + moment(currentMonths, 'YYYY-MM').daysInMonth();
    setStartDay(startOfMonths);
    setEndDay(endOfMonths);
    selectedDay(startOfMonths, endOfMonths);
  };

  const thisWeek = () => {
    let monday =
      currentMonth !==
        moment(moment(startDay, 'YYYY-MM-DD').clone().weekday(0)).format(
          'YYYY-MM',
        )
        ? moment(moment(startDay, 'YYYY-MM-DD').clone().weekday(0)).format(
          'YYYY-MM',
        ) +
        moment(moment(startDay, 'YYYY-MM-DD').clone().weekday(0)).format(
          '-DD',
        )
        : currentMonth +
        moment(moment(startDay, 'YYYY-MM-DD').clone().weekday(0)).format(
          '-DD',
        );

    let betweenday =
      currentMonth !==
        moment(moment(startDay, 'YYYY-MM-DD').clone().weekday(4)).format(
          'YYYY-MM',
        )
        ? moment(moment(startDay, 'YYYY-MM-DD').clone().weekday(4)).format(
          'YYYY-MM',
        ) +
        moment(moment(startDay, 'YYYY-MM-DD').clone().weekday(4)).format(
          '-DD',
        )
        : currentMonth +
        moment(moment(startDay, 'YYYY-MM-DD').clone().weekday(4)).format(
          '-DD',
        );

    let sunday =
      currentMonth !==
        moment(moment(startDay, 'YYYY-MM-DD').clone().weekday(6)).format(
          'YYYY-MM',
        )
        ? moment(moment(startDay, 'YYYY-MM-DD').clone().weekday(6)).format(
          'YYYY-MM',
        ) +
        moment(moment(startDay, 'YYYY-MM-DD').clone().weekday(6)).format(
          '-DD',
        )
        : currentMonth +
        moment(moment(startDay, 'YYYY-MM-DD').clone().weekday(6)).format(
          '-DD',
        );
    setCurrentMonth(moment(betweenday).format('YYYY-MM'));
    setStartDay(monday);
    setEndDay(sunday);
    selectedDay(monday, sunday);
  };

  const onMonthChange = (month) => {
    let currentMonths = currentMonth;
    currentMonths = moment(month.timestamp).format('YYYY-MM');

    setCurrentMonth(currentMonths);
    if (currentMonth !== moment(month.timestamp).format('YYYY-MM')) {
      setStartDay(currentMonths + moment(startDay).format('-DD'));
      setEndDay(currentMonths + moment(startDay).format('-DD'));

      selectedDay(
        currentMonths + moment(startDay).format('-DD'),
        currentMonths + moment(startDay).format('-DD'),
        'thisIsOnChangMonth',
      );
    } else {
      setStartDay(currentMonths + moment(startDay).format('-DD'));
      setEndDay(currentMonths + moment(endDay).format('-DD'));

      selectedDay(
        currentMonths + moment(startDay).format('-DD'),
        currentMonths + moment(endDay).format('-DD'),
        'thisIsOnChangMonth',
      );
    }
  };

  const response = (startingDay, endingDay) => {
    const daySelected =
      startingDay > endingDay
        ? moment(endingDay).format('DD/MM/YYYY') +
        ' - ' +
        moment(startingDay).format('DD/MM/YYYY')
        : startingDay === endingDay
          ? moment(startingDay).format('DD/MM/YYYY')
          : moment(startingDay).format('DD/MM/YYYY') +
          ' - ' +
          moment(endingDay).format('DD/MM/YYYY');

    setStartDay(startingDay);
    setEndDay(endingDay);

    getState({
      startingDays: startingDay,
      endingDays: endingDay,
      daySelecteds: daySelected,
    });
  };

  // Custom Calendar Component thay thế react-native-calendars
  const renderCustomCalendar = () => {
    const startOfMonth = moment(currentMonth).startOf('month');
    const endOfMonth = moment(currentMonth).endOf('month');
    const startOfCalendar = startOfMonth.clone().startOf('week');
    const endOfCalendar = endOfMonth.clone().endOf('week');

    const days = [];
    const current = startOfCalendar.clone();

    // Render day names
    const dayNames = ['CN', 'T.2', 'T.3', 'T.4', 'T.5', 'T.6', 'T.7'];
    const dayNameElements = dayNames.map((dayName, index) => (
      <View key={index} style={styles.dayNameContainer}>
        <Text style={styles.dayNameText}>{dayName}</Text>
      </View>
    ));

    // Render calendar days
    while (current.isSameOrBefore(endOfCalendar)) {
      const dayDate = current.format('YYYY-MM-DD');
      const isCurrentMonth = current.isSame(startOfMonth, 'month');
      const isToday = current.isSame(moment(), 'day');
      const isSelected = marked[dayDate];

      days.push(
        <TouchableOpacity
          key={dayDate}
          style={[
            styles.dayContainer,
            isSelected && styles.selectedDay,
            isToday && styles.todayDay,
          ]}
          onPress={() => onDayPress({ dateString: dayDate })}
        >
          <Text
            style={[
              styles.dayText,
              {
                color: isCurrentMonth
                  ? (isSelected ? '#ffffff' : colors.textPrimary)
                  : colors.textTertiary,
                fontWeight: isToday ? 'bold' : 'normal',
              }
            ]}
          >
            {current.format('D')}
          </Text>
          {isSelected && (
            <View style={styles.selectedDot} />
          )}
        </TouchableOpacity>
      );

      current.add(1, 'day');
    }

    return (
      <>
        {/* Month/Year Header */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={() => onMonthChange({ timestamp: moment(currentMonth).subtract(1, 'month').valueOf() })} style={styles.arrowButton}>
            <Text style={styles.arrowText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.monthYearText}>
            {t(`month_${moment(currentMonth).format('M')}`)} - {moment(currentMonth).format('yyyy')}
          </Text>
          <TouchableOpacity onPress={() => onMonthChange({ timestamp: moment(currentMonth).add(1, 'month').valueOf() })} style={styles.arrowButton}>
            <Text style={styles.arrowText}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Day Names */}
        <View style={styles.dayNamesRow}>
          {dayNameElements}
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {days}
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.box_button}>
        <TouchableOpacity
          style={styles.button}
          onPress={followDay}
        >
          <Text style={styles.buttonText}>{t('today')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={thisWeek}
        >
          <Text style={styles.buttonText}>{t('week')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={thisMonth}
        >
          <Text style={styles.buttonText}>{t('month')}</Text>
        </TouchableOpacity>
      </View>

      {renderCustomCalendar()}

      {/* Close button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>× Đóng lại</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: {
    borderRadius: 10,
    paddingHorizontal: 4,
  },
  box_button: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -20,
    marginTop: -20,
    paddingVertical: 8,
    marginBottom: 12
  },
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  buttonText: {
    color: colors.surface,
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  arrowButton: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  monthYearText: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: colors.textPrimary,
  },
  dayNamesRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  dayNameContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayNameText: {
    fontSize: 13,
    fontFamily: 'Roboto-Medium',
    color: colors.textSecondary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayContainer: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginVertical: 2,
  },
  selectedDay: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  todayDay: {
    borderWidth: 2,
    borderColor: colors.warning,
  },
  dayText: {
    fontSize: 13,
    fontFamily: 'Roboto-Medium',
    color: colors.textPrimary,
  },
  selectedDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'white',
  },
  bottomContainer: {
    padding: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginHorizontal: -20,
    marginBottom: -20,
    paddingHorizontal: 20,
  },
  closeButton: {
    backgroundColor: colors.textSecondary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    fontWeight: 'bold',
  },
});

export default CalendarComponent;