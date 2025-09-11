import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import EmptyState from '../components/EmptyState';
import MenuItem_Children from '../components/MenuItem';
import { useTheme } from '../hooks/useTheme';

const List_MBHRIN = ({ menuData, onNavigate }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  // Sử dụng selector cụ thể thay vì lấy toàn bộ state
  const menuDataFromState = useSelector((state) => state.menu?.data?.data?.menu);
  const userLanguage = useSelector((state) => state.auth?.user?.user_language);

  let dataMenuMBHRs = menuDataFromState;
  let language = userLanguage || 'vi';

  const [dataMenuMBHRIN, setDataMenuMBHRIN] = useState([]);

  useEffect(() => {
    if (dataMenuMBHRs && dataMenuMBHRs.length > 0) {

      // Tìm menu cha MBHRIN
      const mbhrinParent = dataMenuMBHRs.find(i => i.menu_cd === 'MBHRIN');
      if (mbhrinParent) {
        // Lọc các menu con có p_pk trùng với pk của MBHRIN
        const childMenus = dataMenuMBHRs.filter(item => {
          const isChild = item.p_pk === mbhrinParent.pk;
          if (isChild) {
          }
          return isChild;
        });

        setDataMenuMBHRIN(childMenus);
      } else {
        setDataMenuMBHRIN([]);
      }
    } else {
      console.warn('No menu data available in Redux state');
      setDataMenuMBHRIN([]);
    }
  }, [dataMenuMBHRs]);

  const handleMenuPress = (item) => {
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

  if (dataMenuMBHRIN.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <EmptyState
          title={t('noChildMenus')}
          subtitle={t('noFormsConfigured')}
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
