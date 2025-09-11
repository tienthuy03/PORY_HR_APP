import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../hooks/useTheme';
import { sysFetch } from '../services/api';
import { STORAGE_KEYS } from '../constants/storageKeys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MenuItem_Children from '../components/MenuItem';
import EmptyState from '../components/EmptyState';

const List_MBHRRE = ({ menuData, onNavigate }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  // Sử dụng selector cụ thể thay vì lấy toàn bộ state
  const menuDataFromState = useSelector((state) => state.menu?.data?.data?.menu);
  const userLanguage = useSelector((state) => state.auth?.user?.user_language);

  let dataMenuMBHRs = menuDataFromState;
  let language = userLanguage || 'vi';

  const [dataMenuMBHRRRE, setDataMenuMBHRRRE] = useState([]);

  useEffect(() => {
    console.log('=== List_MBHRRE Debug ===');

    if (dataMenuMBHRs && dataMenuMBHRs.length > 0) {
      // Log tất cả menu để debug


      // Tìm menu cha MBHRIN
      const mbhrreParent = dataMenuMBHRs.find(i => i.menu_cd === 'MBHRRE');
      console.log('MBHRIN parent menu:', mbhrreParent);

      if (mbhrreParent) {
        // Lọc các menu con có p_pk trùng với pk của MBHRIN
        const childMenus = dataMenuMBHRs.filter(item => {
          const isChild = item.p_pk === mbhrreParent.pk;
          if (isChild) {
            console.log(`Found child menu: ${item.menu_cd} (pk: ${item.pk}, p_pk: ${item.p_pk})`);
          }
          return isChild;
        });

        setDataMenuMBHRRRE(childMenus);
      } else {
        console.warn('MBHRIN parent menu not found in dataMenuMBHRs');
        console.log('Available menu_cd values:', dataMenuMBHRs.map(item => item.menu_cd));
        setDataMenuMBHRRRE([]);
      }
    } else {
      console.warn('No menu data available in Redux state');
      setDataMenuMBHRRRE([]);
    }
  }, [dataMenuMBHRs]);

  const handleMenuPress = (item) => {
    console.log('Menu item pressed:', item);
    console.log('Navigating to menu_cd:', item.menu_cd);

    // Chỉ cần navigate theo menu_cd, không cần gọi API
    // Logic navigation sẽ được xử lý ở component cha
    if (onNavigate) {
      onNavigate(item.menu_cd, item);
    } else {
      console.warn('Navigation callback not provided');
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
          subtitle=""
          iconName="menu-open"
          iconSize={80}
        />
      </View>
    );
  }

  if (dataMenuMBHRRRE.length === 0) {
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
        data={dataMenuMBHRRRE}
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

export default List_MBHRRE;
