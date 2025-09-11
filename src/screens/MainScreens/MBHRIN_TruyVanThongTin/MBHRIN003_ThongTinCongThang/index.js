/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  Text,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../../../hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../hooks/useAuth';
import MonthPicker from '../../../../components/MonthPicker';
import AppHeader from '../../../../components/AppHeader';
import AppIcon from '../../../../components/AppIcon';
import EmptyState from '../../../../components/EmptyState';
import CustomTab from '../../../../components/CustomTab';
import { deviceId } from '../../../../constants/index';
import axios from 'axios';
import RNRestart from 'react-native-restart';
import { sysFetch } from '../../../../services/apiService';

const dataCT =
{
  "ttct": [
    {
      "_giờ công chuẩn": 208,
      "_thêm giờ chủ nhật": 0,
      "_thêm giờ ngày lễ": 0,
      "_thêm giờ thường": 0,
      "_tổng công": 188.25,
      "bucong_yn": "0",
      "emp_id": "HPDQ00093",
      "full_name": "Mai Thị Như Ý",
      "org_nm": "P. Đối ngoại"
    },
    {
      "_giờ công chuẩn": 208,
      "_thêm giờ chủ nhật": 0,
      "_thêm giờ ngày lễ": 0,
      "_thêm giờ thường": 0,
      "_tổng công": 188.25,
      "bucong_yn": "1",
      "emp_id": "HPDQ00093",
      "full_name": "Mai Thị Như Ý",
      "org_nm": "P. Đối ngoại"
    }
  ],
  "ttct_detail": [
    {
      "bucong_yn": "0",
      "car_date": "20250801",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "01/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:29",
      "time_out": "17:10",
      "total": "8",
      "work_dt": "20250801",
      "wt": 8
    },
    {
      "bucong_yn": "0",
      "car_date": "20250802",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "02/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:28",
      "time_out": "11:42",
      "total": "4",
      "work_dt": "20250802",
      "wt": 4
    },
    {
      "bucong_yn": "0",
      "car_date": "20250803",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "03/08 - CN",
      "hol_type": "SUN",
      "ot": 0,
      "time_in": "--:--",
      "time_out": "--:--",
      "total": "0",
      "work_dt": "20250803",
      "wt": 0
    },
    {
      "bucong_yn": "0",
      "car_date": "20250804",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "04/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:29",
      "time_out": "17:07",
      "total": "8",
      "work_dt": "20250804",
      "wt": 8
    },
    {
      "bucong_yn": "0",
      "car_date": "20250805",
      "color_timein": "#2BE0D2",
      "color_timeout": "",
      "date_label": "05/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:29",
      "time_out": "17:06",
      "total": "8",
      "work_dt": "20250805",
      "wt": 8
    },
    {
      "bucong_yn": "0",
      "car_date": "20250806",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "06/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:26",
      "time_out": "17:07",
      "total": "8",
      "work_dt": "20250806",
      "wt": 8
    },
    {
      "bucong_yn": "0",
      "car_date": "20250807",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "07/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:29",
      "time_out": "17:04",
      "total": "8",
      "work_dt": "20250807",
      "wt": 8
    },
    {
      "bucong_yn": "0",
      "car_date": "20250808",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "08/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:30",
      "time_out": "17:04",
      "total": "8",
      "work_dt": "20250808",
      "wt": 8
    },
    {
      "bucong_yn": "0",
      "car_date": "20250809",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "09/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:29",
      "time_out": "11:37",
      "total": "4",
      "work_dt": "20250809",
      "wt": 4
    },
    {
      "bucong_yn": "0",
      "car_date": "20250810",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "10/08 - CN",
      "hol_type": "SUN",
      "ot": 0,
      "time_in": "--:--",
      "time_out": "--:--",
      "total": "0",
      "work_dt": "20250810",
      "wt": 0
    },
    {
      "bucong_yn": "0",
      "car_date": "20250811",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "11/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:27",
      "time_out": "17:03",
      "total": "8",
      "work_dt": "20250811",
      "wt": 8
    },
    {
      "bucong_yn": "0",
      "car_date": "20250812",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "12/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:29",
      "time_out": "17:05",
      "total": "8",
      "work_dt": "20250812",
      "wt": 8
    },
    {
      "bucong_yn": "0",
      "car_date": "20250813",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "13/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:29",
      "time_out": "17:07",
      "total": "8",
      "work_dt": "20250813",
      "wt": 8
    },
    {
      "bucong_yn": "0",
      "car_date": "20250814",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "14/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:29",
      "time_out": "17:11",
      "total": "8",
      "work_dt": "20250814",
      "wt": 8
    },
    {
      "bucong_yn": "0",
      "car_date": "20250815",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "15/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:30",
      "time_out": "17:07",
      "total": "8",
      "work_dt": "20250815",
      "wt": 8
    },
    {
      "bucong_yn": "0",
      "car_date": "20250816",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "16/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:30",
      "time_out": "11:33",
      "total": "4",
      "work_dt": "20250816",
      "wt": 4
    },
    {
      "bucong_yn": "0",
      "car_date": "20250817",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "17/08 - CN",
      "hol_type": "SUN",
      "ot": 0,
      "time_in": "--:--",
      "time_out": "--:--",
      "total": "0",
      "work_dt": "20250817",
      "wt": 0
    },
    {
      "bucong_yn": "0",
      "car_date": "20250818",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "18/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:29",
      "time_out": "17:08",
      "total": "8",
      "work_dt": "20250818",
      "wt": 8
    },
    {
      "bucong_yn": "0",
      "car_date": "20250819",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "19/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:29",
      "time_out": "17:13",
      "total": "8",
      "work_dt": "20250819",
      "wt": 8
    },
    {
      "bucong_yn": "0",
      "car_date": "20250820",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "20/08",
      "hol_type": "",
      "ot": 2,
      "time_in": "07:29",
      "time_out": "19:02",
      "total": "10",
      "work_dt": "20250820",
      "wt": 8
    },
    {
      "bucong_yn": "0",
      "car_date": "20250821",
      "color_timein": "#FFF933",
      "color_timeout": "",
      "date_label": "21/08",
      "hol_type": "",
      "ot": 1.5,
      "time_in": "07:30",
      "time_out": "17:09",
      "total": "9.5",
      "work_dt": "20250821",
      "wt": 8
    },
    {
      "bucong_yn": "0",
      "car_date": "20250822",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "22/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:27",
      "time_out": "17:04",
      "total": "8",
      "work_dt": "20250822",
      "wt": 8
    },
    {
      "bucong_yn": "0",
      "car_date": "20250823",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "23/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:29",
      "time_out": "11:34",
      "total": "4",
      "work_dt": "20250823",
      "wt": 4
    },
    {
      "bucong_yn": "0",
      "car_date": "20250824",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "24/08 - CN",
      "hol_type": "SUN",
      "ot": 0,
      "time_in": "--:--",
      "time_out": "--:--",
      "total": "0",
      "work_dt": "20250824",
      "wt": 0
    },
    {
      "bucong_yn": "0",
      "car_date": "20250825",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "25/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:26",
      "time_out": "17:07",
      "total": "8",
      "work_dt": "20250825",
      "wt": 8
    },
    {
      "bucong_yn": "0",
      "car_date": "20250826",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "26/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:27",
      "time_out": "17:04",
      "total": "8",
      "work_dt": "20250826",
      "wt": 8
    },
    {
      "bucong_yn": "0",
      "car_date": "20250827",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "27/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:27",
      "time_out": "17:04",
      "total": "8",
      "work_dt": "20250827",
      "wt": 8
    },
    {
      "bucong_yn": "0",
      "car_date": "20250828",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "28/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:25",
      "time_out": "13:45",
      "total": "4.75",
      "work_dt": "20250828",
      "wt": 4.75
    },
    {
      "bucong_yn": "0",
      "car_date": "20250829",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "29/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:27",
      "time_out": "17:04",
      "total": "8",
      "work_dt": "20250829",
      "wt": 8
    },
    {
      "bucong_yn": "0",
      "car_date": "20250830",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "30/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:07",
      "time_out": "11:33",
      "total": "4",
      "work_dt": "20250830",
      "wt": 4
    },
    {
      "bucong_yn": "0",
      "car_date": "20250831",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "31/08 - CN",
      "hol_type": "SUN",
      "ot": 0,
      "time_in": "--:--",
      "time_out": "--:--",
      "total": "0",
      "work_dt": "20250831",
      "wt": 0
    },
    {
      "bucong_yn": "1",
      "car_date": "20250801",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "01/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:29",
      "time_out": "17:10",
      "total": "8",
      "work_dt": "20250801",
      "wt": 8
    },
    {
      "bucong_yn": "1",
      "car_date": "20250802",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "02/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:28",
      "time_out": "11:42",
      "total": "4",
      "work_dt": "20250802",
      "wt": 4
    },
    {
      "bucong_yn": "1",
      "car_date": "20250803",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "03/08 - CN",
      "hol_type": "SUN",
      "ot": 0,
      "time_in": "--:--",
      "time_out": "--:--",
      "total": "0",
      "work_dt": "20250803",
      "wt": 0
    },
    {
      "bucong_yn": "1",
      "car_date": "20250804",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "04/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:29",
      "time_out": "17:07",
      "total": "8",
      "work_dt": "20250804",
      "wt": 8
    },
    {
      "bucong_yn": "1",
      "car_date": "20250805",
      "color_timein": "#2BE0D2",
      "color_timeout": "",
      "date_label": "05/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:29",
      "time_out": "17:06",
      "total": "8",
      "work_dt": "20250805",
      "wt": 8
    },
    {
      "bucong_yn": "1",
      "car_date": "20250806",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "06/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:26",
      "time_out": "17:07",
      "total": "8",
      "work_dt": "20250806",
      "wt": 8
    },
    {
      "bucong_yn": "1",
      "car_date": "20250807",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "07/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:29",
      "time_out": "17:04",
      "total": "8",
      "work_dt": "20250807",
      "wt": 8
    },
    {
      "bucong_yn": "1",
      "car_date": "20250808",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "08/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:30",
      "time_out": "17:04",
      "total": "8",
      "work_dt": "20250808",
      "wt": 8
    },
    {
      "bucong_yn": "1",
      "car_date": "20250809",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "09/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:29",
      "time_out": "11:37",
      "total": "4",
      "work_dt": "20250809",
      "wt": 4
    },
    {
      "bucong_yn": "1",
      "car_date": "20250810",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "10/08 - CN",
      "hol_type": "SUN",
      "ot": 0,
      "time_in": "--:--",
      "time_out": "--:--",
      "total": "0",
      "work_dt": "20250810",
      "wt": 0
    },
    {
      "bucong_yn": "1",
      "car_date": "20250811",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "11/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:27",
      "time_out": "17:03",
      "total": "8",
      "work_dt": "20250811",
      "wt": 8
    },
    {
      "bucong_yn": "1",
      "car_date": "20250812",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "12/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:29",
      "time_out": "17:05",
      "total": "8",
      "work_dt": "20250812",
      "wt": 8
    },
    {
      "bucong_yn": "1",
      "car_date": "20250813",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "13/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:29",
      "time_out": "17:07",
      "total": "8",
      "work_dt": "20250813",
      "wt": 8
    },
    {
      "bucong_yn": "1",
      "car_date": "20250814",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "14/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:29",
      "time_out": "17:11",
      "total": "8",
      "work_dt": "20250814",
      "wt": 8
    },
    {
      "bucong_yn": "1",
      "car_date": "20250815",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "15/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:30",
      "time_out": "17:07",
      "total": "8",
      "work_dt": "20250815",
      "wt": 8
    },
    {
      "bucong_yn": "1",
      "car_date": "20250816",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "16/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:30",
      "time_out": "11:33",
      "total": "4",
      "work_dt": "20250816",
      "wt": 4
    },
    {
      "bucong_yn": "1",
      "car_date": "20250817",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "17/08 - CN",
      "hol_type": "SUN",
      "ot": 0,
      "time_in": "--:--",
      "time_out": "--:--",
      "total": "0",
      "work_dt": "20250817",
      "wt": 0
    },
    {
      "bucong_yn": "1",
      "car_date": "20250818",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "18/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:29",
      "time_out": "17:08",
      "total": "8",
      "work_dt": "20250818",
      "wt": 8
    },
    {
      "bucong_yn": "1",
      "car_date": "20250819",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "19/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:29",
      "time_out": "17:13",
      "total": "8",
      "work_dt": "20250819",
      "wt": 8
    },
    {
      "bucong_yn": "1",
      "car_date": "20250820",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "20/08",
      "hol_type": "",
      "ot": 2,
      "time_in": "07:29",
      "time_out": "19:02",
      "total": "10",
      "work_dt": "20250820",
      "wt": 8
    },
    {
      "bucong_yn": "1",
      "car_date": "20250821",
      "color_timein": "#FFF933",
      "color_timeout": "",
      "date_label": "21/08",
      "hol_type": "",
      "ot": 1.5,
      "time_in": "07:30",
      "time_out": "17:09",
      "total": "9.5",
      "work_dt": "20250821",
      "wt": 8
    },
    {
      "bucong_yn": "1",
      "car_date": "20250822",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "22/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:27",
      "time_out": "17:04",
      "total": "8",
      "work_dt": "20250822",
      "wt": 8
    },
    {
      "bucong_yn": "1",
      "car_date": "20250823",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "23/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:29",
      "time_out": "11:34",
      "total": "4",
      "work_dt": "20250823",
      "wt": 4
    },
    {
      "bucong_yn": "1",
      "car_date": "20250824",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "24/08 - CN",
      "hol_type": "SUN",
      "ot": 0,
      "time_in": "--:--",
      "time_out": "--:--",
      "total": "0",
      "work_dt": "20250824",
      "wt": 0
    },
    {
      "bucong_yn": "1",
      "car_date": "20250825",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "25/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:26",
      "time_out": "17:07",
      "total": "8",
      "work_dt": "20250825",
      "wt": 8
    },
    {
      "bucong_yn": "1",
      "car_date": "20250826",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "26/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:27",
      "time_out": "17:04",
      "total": "8",
      "work_dt": "20250826",
      "wt": 8
    },
    {
      "bucong_yn": "1",
      "car_date": "20250827",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "27/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:27",
      "time_out": "17:04",
      "total": "8",
      "work_dt": "20250827",
      "wt": 8
    },
    {
      "bucong_yn": "1",
      "car_date": "20250828",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "28/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:25",
      "time_out": "13:45",
      "total": "4.75",
      "work_dt": "20250828",
      "wt": 4.75
    },
    {
      "bucong_yn": "1",
      "car_date": "20250829",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "29/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:27",
      "time_out": "17:04",
      "total": "8",
      "work_dt": "20250829",
      "wt": 8
    },
    {
      "bucong_yn": "1",
      "car_date": "20250830",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "30/08",
      "hol_type": "",
      "ot": 0,
      "time_in": "07:07",
      "time_out": "11:33",
      "total": "4",
      "work_dt": "20250830",
      "wt": 4
    },
    {
      "bucong_yn": "1",
      "car_date": "20250831",
      "color_timein": "",
      "color_timeout": "",
      "date_label": "31/08 - CN",
      "hol_type": "SUN",
      "ot": 0,
      "time_in": "--:--",
      "time_out": "--:--",
      "total": "0",
      "work_dt": "20250831",
      "wt": 0
    }
  ]
}

const MBHRIN003_ThongTinCongThang = ({ navigation: { goBack }, route }) => {
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

  // Get token from userInfo
  const tokenLogin = userInfo?.tokenLogin;

  // Get API URL from storage or config
  const [API_URL, setAPI_URL] = useState('');

  // Get menu data from Redux state
  const dataMenuMBHRs = useSelector(state => state.menu?.data || []);

  // Get language from Redux state
  let language = '';
  try {
    const loginState = useSelector(state => state.loginReducers);
    language = loginState?.data?.data?.user_language || 'VIE';
  } catch (error) {
    language = 'VIE';
  }

  // Function to get header title
  const getHeaderTitle = () => {
    // Ưu tiên sử dụng data được truyền từ props
    if (menuData) {
      if (language === 'en' && menuData.eng) {
        return menuData.eng;
      } else if (menuData.vie) {
        return menuData.vie;
      } else if (menuData.title) {
        return menuData.title;
      } else if (menuData.chi) {
        return menuData.chi;
      }
    }

    // Fallback: tìm trong state menu
    if (!dataMenuMBHRs || !language) return "MBHRIN003";

    try {
      const mbhrin003Menu = dataMenuMBHRs.find(item => item.menu_cd === 'MBHRIN003');
      if (mbhrin003Menu) {
        // Sử dụng ngôn ngữ từ menu data
        if (language === 'en' && mbhrin003Menu.eng) {
          return mbhrin003Menu.eng;
        } else if (mbhrin003Menu.vie) {
          return mbhrin003Menu.vie;
        } else if (mbhrin003Menu.title) {
          return mbhrin003Menu.title;
        } else if (mbhrin003Menu.chi) {
          return mbhrin003Menu.chi;
        }
      }
    } catch (error) {
      console.warn('Error getting header title:', error);
    }

    return "MBHRIN003";
  };

  // Get API config from AsyncStorage
  useEffect(() => {
    const getAPIConfig = async () => {
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        const apiUrl = await AsyncStorage.getItem('API_URL');
        setAPI_URL(apiUrl);
      } catch (error) {
        console.log('Error getting API config:', error);
      }
    };
    getAPIConfig();
  }, [tokenLogin, userInfo]);

  const styles = StyleSheet.create({
    modalContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      margin: 8,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalOneRecord1: {
      flexDirection: 'row',
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
      backgroundColor: 'white',
    },
    modalOneRecord2: {
      flexDirection: 'row',
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
      backgroundColor: '#f8f9fa',
    },
    modalOneRecord3: {
      flexDirection: 'row',
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
      backgroundColor: '#fff3cd',
    },
    modalOneRecord4: {
      flexDirection: 'row',
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
      backgroundColor: '#d4edda',
    },
    modalOneRecordHeader: {
      flexDirection: 'row',
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
      backgroundColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    modalOneCol1: {
      width: '25%',
      fontSize: 14,
      fontFamily: 'Roboto-Regular',
      color: '#333',
    },
    modalOneCol2: {
      textAlign: 'center',
      width: '30%',
      fontSize: 14,
      fontFamily: 'Roboto-Regular',
      color: '#333',
    },
    modalOneCol3: {
      textAlign: 'center',
      width: '15%',
      fontSize: 14,
      fontFamily: 'Roboto-Regular',
      color: '#333',
    },
    modalOneCol4: {
      textAlign: 'center',
      width: '15%',
      fontSize: 14,
      fontFamily: 'Roboto-Regular',
      color: '#333',
    },
    modalOneCol5: {
      textAlign: 'center',
      width: '15%',
      fontSize: 14,
      fontFamily: 'Roboto-Regular',
      color: '#333',
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 10,
      width: '100%',
      height: 600,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 50,
    },
    modalTabTitle: {
      flexDirection: 'row',
    },
    modalHeaderView: {
      borderBottomColor: colors.primary,
      borderBottomWidth: 1,
      width: '100%',
      paddingBottom: 10,
      marginBottom: 10,
    },
    modalHeaderText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.primary,
    },
    modalBodyView: {
      padding: 16,
      flex: 1,
      backgroundColor: 'white',
    },
    modalFooterView: {
      borderTopColor: colors.primary,
      borderTopWidth: 1,
      width: '100%',
      alignItems: 'center',
      paddingTop: 10,
      marginTop: 10,
    },
    modalbtnClose: {
      borderRadius: 10,
      backgroundColor: colors.primary,
      paddingBottom: 10,
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 10,
    },
    modalbtnText: {
      color: 'white',
    },
    datePickerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      justifyContent: 'space-between',
    },
    mainContainer: {
      flex: 1,
    },
    container: {
      flex: 1,
      padding: 16,
    },
    datePickerCard: {
      borderRadius: 8,
      marginBottom: 12,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    datePickerTextContainer: {
      flex: 1,
      // marginLeft: 12,
    },
    datePickerText: {
      fontSize: 16,
      fontFamily: 'Roboto-Medium',
      marginBottom: 2,
      textAlign: 'center',
    },
    datePickerSubtext: {
      fontSize: 12,
      fontFamily: 'Roboto-Regular',
    },
    tabContainer: {
      flex: 1,
      paddingTop: 8,
    },
    dataContainer: {
      borderRadius: 8,
      marginBottom: 16,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    detailContainer: {
      borderRadius: 8,
      marginBottom: 16,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
      overflow: 'hidden',
    },
    detailHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 8,
      backgroundColor: colors.primary,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    },
    detailTitle: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Roboto-Bold',
      textTransform: 'uppercase',
      color: 'white',
      fontWeight: '600',
    },
    customTabBar: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
    },
    tabItem: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTabItem: {
      borderBottomColor: colors.primary,
    },
    tabText: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    activeTabText: {
      color: colors.primary,
      fontWeight: '600',
    },
    tabContent: {
      flex: 1,
    },
    summaryItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
      borderRadius: 8,
    },
    summaryLabel: {
      fontSize: 16,
      fontFamily: 'Roboto-Regular',
      flex: 1,
    },
    summaryValue: {
      fontSize: 16,
      fontFamily: 'Roboto-Bold',
      fontWeight: '600',
    },
  });

  // State variables
  const [IsShow, setIsShow] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [dataDB, setDataDB] = useState([]);

  // Tab configuration
  const tabs = ['Chưa bù công', 'Đã bù công'];
  const [dataDB1, setDataDB1] = useState([]);
  const [sts, setSts] = useState(false);
  // const [date, setDate] = useState(moment(new Date()));
  const [date, setDate] = useState(
    moment(new Date().setMonth(new Date().getMonth() - 1)),
  );
  const [show, setShow] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const showPicker = useCallback(value => setShow(value), []);

  const onValueChange = useCallback(
    (event, newDate) => {
      const selectedDate = newDate || date;
      showPicker(false);
      setDate(selectedDate);
    },
    [date, showPicker],
  );

  const handleMonthSelect = (selectedDate) => {
    setDate(selectedDate);
  };
  const refreshNewToken = (obj, param1) => {
    // Implement token refresh logic here if needed
    console.log('Token expired, need to refresh');
    // For now, just call the callback
    if (obj === "getData") {
      getData(param1);
    }
  };

  const oldRefreshNewToken = (obj, param1) => {
    axios
      .post(API_URL + 'User/RefreshToken/', {
        token: tokenLogin,
        userPk: userInfo?.userPk,
        refreshToken: userInfo?.refreshToken,
      })
      .then(response => {
        tokenLogin = response.data.token;
        refreshToken = response.data.refreshToken;
        if (obj == 'getData') {
          getData(param1);
        }
      })
      .catch(error => {
        if (error == 'AxiosError: Request failed with status code 400') {
          Alert.alert(
            'Thông báo',
            'Phiên bản làm việc đã hết hạn. Vui lòng đăng nhập lại hệ thống',
            [
              {
                text: 'Đóng',
                onPress: () => {
                  RNRestart.Restart();
                },
              },
            ],
            { cancelable: true },
          );
        }
        console.log(error);
      });
  };

  const getData = async p_work_mon => {
    if (!API_URL || !tokenLogin || !userInfo?.empPk) {
      return;
    }
    setData([]);
    sysFetch(
      API_URL,
      {
        pro: 'STV_HR_SEL_MBI_HRIN003_0_102',
        in_par: {
          p1_varchar2: userInfo.empPk,
          p2_varchar2: p_work_mon,
        },
        out_par: {
          p1_sys: 'ttct',
          p2_sys: 'ttct_detail',
        },
      },
      tokenLogin,
    )
      .then(res => {
        if (res == 'Token Expired') {
          refreshNewToken('getData', p_work_mon);
        }
        if (res != 'Token Expired') {
          let datass = [];
          let datassDB = [];
          if (res.totalRow > 0) {
            if (res.data?.ttct && res.data.ttct.length > 0) {
              let map = new Map(Object.entries(res.data.ttct[0]));
              let mapDB = new Map(Object.entries(res.data.ttct[1]));
              map.forEach((value, key) => {
                if (key.charAt(0) === '_') {
                  datass.push({ key, value });
                }
              });
              mapDB.forEach((value, key) => {
                if (key.charAt(0) === '_') {
                  datassDB.push({ key, value });
                }
              });
              setData(datass);
              setDataDB(datassDB);
            } else {
              setData([]);
              setDataDB([]);
            }

            if (res.data?.ttct_detail) {
              // Filter data dựa trên bucong_yn nếu có, nếu không thì hiển thị tất cả ở tab "Chưa bù công"
              const data1Filtered = res.data.ttct_detail.filter(x => x.bucong_yn === '0' || x.bucong_yn === undefined);
              const dataDB1Filtered = res.data.ttct_detail.filter(x => x.bucong_yn === '1');

              setData1(data1Filtered);
              setDataDB1(dataDB1Filtered);
            }
          }
        }
      })
      .catch(error => {
        console.log('MBHRIN003 - sysFetch error:', error);
      });
  };

  useEffect(() => {
    if (API_URL && tokenLogin && userInfo?.empPk) {
      getData(moment(date).format('YYYYMM'));
    }
  }, [date, API_URL, tokenLogin, userInfo?.empPk]);

  const fetchItems = () => {
    // const arrT = date.split('-');
    getData(moment(date).format('YYYYMM'));
  };

  //set language
  const renderItemss = ({ item, index }) => {
    let tempStyle = null;
    switch (item.hol_type) {
      case 'SUN':
        tempStyle = styles.modalOneRecord4;
        break;
      case 'HOL':
        tempStyle = styles.modalOneRecord3;
        break;
      default:
        tempStyle = index % 2 ? styles.modalOneRecord1 : styles.modalOneRecord2;
    }
    return (
      <View style={tempStyle}>
        <Text style={styles.modalOneCol1}>{item.date_label}</Text>
        <Text style={[styles.modalOneCol2, { color: colors.textPrimary }]}>
          {item.time_in === '0' ? '--:--' : item.time_in} - {item.time_out === '0' ? '--:--' : item.time_out}
        </Text>
        <Text style={styles.modalOneCol3}>{item.wt}</Text>
        <Text style={styles.modalOneCol4}>{item.ot}</Text>
        <Text style={styles.modalOneCol4}>{item.total}</Text>
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={[styles.summaryItem, { backgroundColor: colors.card }]}>
        <Text style={[styles.summaryLabel, { color: colors.textPrimary }]}>
          {item.key.charAt(1).toUpperCase() + item.key.slice(2)}
        </Text>
        <Text style={[styles.summaryValue, { color: colors.primary }]}>
          {item.value}
        </Text>
      </View>
    );
  };

  const ChuaBu = () => {
    return (
      <View style={styles.tabContainer}>
        <View style={[
          styles.dataContainer,
          {
            backgroundColor: data.length > 0 ? colors.card : 'transparent',
            shadowOpacity: 0, // Bỏ shadow
            elevation: 0, // Bỏ shadow trên Android
          }
        ]}>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            onRefresh={fetchItems}
            refreshing={false}
            extraData={data}
            scrollEnabled={true}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
            ListEmptyComponent={() => (
              <EmptyState
                title={t('noData') || 'Không có dữ liệu'}
                subtitle={t('noWorkDayData') || 'Không có dữ liệu công tháng'}
                iconName="calendar-blank"
                iconSize={64}
              />
            )}
          />
        </View>
        {data1.length > 0 ? (
          <>
            <View style={[styles.detailContainer, { backgroundColor: colors.card }]}>
              <TouchableOpacity
                style={styles.detailHeader}
                onPress={() => {
                  setIsShow(!IsShow);
                }}>
                <Text style={styles.detailTitle}>
                  {t('monthlyWorkDetail')}
                </Text>
                <AppIcon
                  name={IsShow ? "chevron-up" : "chevron-down"}
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
              {IsShow ? (
                <View style={styles.modalBodyView}>
                  <View style={styles.modalOneRecordHeader}>
                    <Text style={[styles.modalOneCol1, { color: 'white', fontWeight: 'bold' }]}>Ngày</Text>
                    <Text style={[styles.modalOneCol2, { color: 'white', fontWeight: 'bold' }]}>Vào - ra</Text>
                    <Text style={[styles.modalOneCol3, { color: 'white', fontWeight: 'bold' }]}>Giờ làm</Text>
                    <Text style={[styles.modalOneCol4, { color: 'white', fontWeight: 'bold' }]}>Tăng ca</Text>
                    <Text style={[styles.modalOneCol5, { color: 'white', fontWeight: 'bold' }]}>Tổng</Text>
                  </View>
                  <FlatList
                    data={data1}
                    renderItem={renderItemss}
                    keyExtractor={item => item.car_date}
                    ListEmptyComponent={() => (
                      <EmptyState
                        title={t('noData') || 'Không có dữ liệu'}
                        subtitle={t('noWorkDayData') || 'Không có dữ liệu chi tiết'}
                        iconName="calendar-blank"
                        iconSize={64}
                      />
                    )}
                  />
                </View>
              ) : null}
            </View>
          </>
        ) : null}
      </View>
    );
  };

  const DaBu = () => {
    return (
      <View style={styles.tabContainer}>
        <View style={[
          styles.dataContainer,
          {
            backgroundColor: dataDB.length > 0 ? colors.card : 'transparent',
            shadowOpacity: 0, // Bỏ shadow
            elevation: 0, // Bỏ shadow trên Android
          }
        ]}>
          <FlatList
            data={dataDB}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            onRefresh={fetchItems}
            refreshing={false}
            extraData={dataDB}
            scrollEnabled={true}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
            ListEmptyComponent={() => (
              <EmptyState
                title={t('noData') || 'Không có dữ liệu'}
                subtitle={t('noWorkDayData') || 'Không có dữ liệu công đã bù'}
                iconName="calendar-blank"
                iconSize={64}
              />
            )}
          />
        </View>
        {data1.length > 0 ? (
          <>
            <View style={[styles.detailContainer, { backgroundColor: colors.card }]}>
              <TouchableOpacity
                style={styles.detailHeader}
                onPress={() => {
                  setIsShow(!IsShow);
                }}>
                <Text style={styles.detailTitle}>
                  {t('monthlyWorkDetail')}
                </Text>
                <AppIcon
                  name={IsShow ? "chevron-up" : "chevron-down"}
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
              {IsShow ? (
                <View style={styles.modalBodyView}>
                  <View style={styles.modalOneRecordHeader}>
                    <Text style={[styles.modalOneCol1, { color: 'white', fontWeight: 'bold' }]}>Ngày</Text>
                    <Text style={[styles.modalOneCol2, { color: 'white', fontWeight: 'bold' }]}>Vào - ra</Text>
                    <Text style={[styles.modalOneCol3, { color: 'white', fontWeight: 'bold' }]}>Giờ làm</Text>
                    <Text style={[styles.modalOneCol4, { color: 'white', fontWeight: 'bold' }]}>Tăng ca</Text>
                    <Text style={[styles.modalOneCol5, { color: 'white', fontWeight: 'bold' }]}>Tổng</Text>
                  </View>
                  <FlatList
                    data={dataDB1}
                    renderItem={renderItemss}
                    keyExtractor={item => item.car_date}
                    ListEmptyComponent={() => (
                      <EmptyState
                        title={t('noData') || 'Không có dữ liệu'}
                        subtitle={t('noWorkDayData') || 'Không có dữ liệu chi tiết đã bù'}
                        iconName="calendar-blank"
                        iconSize={64}
                      />
                    )}
                  />
                </View>
              ) : null}
            </View>
          </>
        ) : null}
      </View>
    );
  };
  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
      <Modal visible={sts} style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.modalHeaderView}
            activeOpacity={0.7}
            onPress={() => {
              setIsShow(!IsShow);
            }}>
            <Text style={styles.modalHeaderText}>CHI TIẾT CÔNG THÁNG</Text>
          </TouchableOpacity>
          <View style={styles.modalBodyView}>
            <View style={styles.modalOneRecordHeader}>
              <Text style={styles.modalOneCol1}>Ngày</Text>
              <Text style={styles.modalOneCol2}>Vào - ra</Text>
              <Text style={styles.modalOneCol3}>Giờ làm</Text>
              <Text style={styles.modalOneCol4}>Tăng ca</Text>
              <Text style={styles.modalOneCol5}>Tổng</Text>
            </View>
            <FlatList
              data={data1}
              renderItem={renderItemss}
              keyExtractor={item => item.car_date}
            />
          </View>
          <View style={styles.modalFooterView}>
            <TouchableOpacity
              style={styles.modalbtnClose}
              onPress={() => {
                setSts(!sts);
              }}>
              <Text style={styles.modalbtnText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <AppHeader goBack={goBack}>
        {getHeaderTitle()}
      </AppHeader>

      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.datePickerCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setModalVisible(true)}
          >
            <AppIcon name="calendar" size={24} color={colors.primary} style={{ marginLeft: 20 }} />
            <View style={styles.datePickerTextContainer}>
              <Text style={[styles.datePickerText, { color: colors.textPrimary }]}>
                {t(`month_${moment(date).format('M')}`)}/{moment(date).format('YYYY')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Month Picker Modal */}
        <MonthPicker
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSelect={handleMonthSelect}
          selectedMonth={date}
          title={t('selectMonth')}
        />
        {/* Custom TabBar */}
        <CustomTab
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          style={styles.customTabBar}
        />

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 0 ? <ChuaBu /> : <DaBu />}
        </View>
      </View>
    </View>
  );
};

export default MBHRIN003_ThongTinCongThang;
