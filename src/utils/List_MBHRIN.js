import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../hooks/useTheme';
import { sysFetch } from '../services/api';
import { STORAGE_KEYS } from '../constants/storageKeys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MenuItem_Children from '../components/MenuItem';
import EmptyState from '../components/EmptyState';

const List_MBHRIN = ({ menuData }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  let dataMenuMBHRs;
  let language;

  try {
    dataMenuMBHRs = state.menuReducer.data.data.menu;
    language = state.auth.user?.user_language || 'vi';
  } catch (error) {
    console.warn('Error getting menu data:', error);
  }

  const [dataMenuMBHRIN, setDataMenuMBHRIN] = useState([]);

  useEffect(() => {
    if (dataMenuMBHRs && dataMenuMBHRs.length > 0) {
      console.log('List_MBHRIN - dataMenuMBHRs from state:', dataMenuMBHRs.length);

      // Tìm menu cha MBHRIN
      const mbhrinParent = dataMenuMBHRs.find(i => i.menu_cd === 'MBHRIN');
      console.log('List_MBHRIN - mbhrinParent:', mbhrinParent);

      if (mbhrinParent) {
        // Lọc các menu con có p_pk trùng với pk của MBHRIN
        const childMenus = dataMenuMBHRs.filter(item =>
          item.p_pk === mbhrinParent.pk
        );

        console.log('List_MBHRIN - childMenus found:', childMenus.length);
        setDataMenuMBHRIN(childMenus);
      } else {
        console.warn('MBHRIN parent menu not found');
        setDataMenuMBHRIN([]);
      }
    } else {
      console.warn('No menu data available');
      setDataMenuMBHRIN([]);
    }
  }, [dataMenuMBHRs]);

  const handleMenuPress = async (item) => {
    console.log('Menu item pressed:', item);

    try {
      const tokenLogin = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN_LOGIN);
      const API_URL = await AsyncStorage.getItem(STORAGE_KEYS.API_URL);

      if (!tokenLogin || !API_URL) {
        console.error('Missing token or API URL');
        return;
      }

      // Gọi API để lấy form data
      const response = await sysFetch(
        API_URL,
        {
          pro: "SELHRIN0010100",
          in_par: {
            p1_varchar2: item.menu_cd,
            p2_varchar2: item.pk,
          },
          out_par: {
            p1_sys: "form",
          },
        },
        tokenLogin
      );

      if (response.success && response.data?.form) {
        console.log('Form data received:', response.data.form);
        // Xử lý form data ở đây
      } else {
        console.error('Failed to get form data:', response);
      }
    } catch (error) {
      console.error('Error calling API:', error);
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <MenuItem_Children
        item={item}
        index={index}
        onPress={handleMenuPress}
        showChevron={true}
      />
    );
  };

  if (!dataMenuMBHRs || dataMenuMBHRs.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <EmptyState
          title="Không có dữ liệu menu"
          subtitle="Vui lòng kiểm tra kết nối và thử lại"
          iconName="menu-open"
          iconSize={80}
        />
      </View>
    );
  }

  if (dataMenuMBHRIN.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <EmptyState
          title="Không có menu con"
          subtitle="Chưa có form nào được cấu hình"
          iconName="folder-open"
          iconSize={80}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={dataMenuMBHRIN}
        renderItem={renderItem}
        keyExtractor={(item) => item.pk?.toString() || item.menu_cd}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 12,
  },
});

export default List_MBHRIN;
