import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import MenuItemWithCounts from '../components/MenuItem/MenuItemWithCounts';
import EmptyState from '../components/EmptyState';

const List_MBHRAP = ({ menuData, onNavigate }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  let dataMenuMBHRs;
  let language;

  try {
    dataMenuMBHRs = state.menu.data.data.menu;
    language = state.auth.user?.user_language || 'vi';
  } catch (error) {
    console.warn('Error getting menu data:', error);
  }

  const [dataMenuMBHRAP, setDataMenuMBHRAP] = useState([]);

  useEffect(() => {
    console.log('=== List_MBHRAP Debug ===');
    console.log('dataMenuMBHRs:', dataMenuMBHRs);
    console.log('dataMenuMBHRs length:', dataMenuMBHRs?.length);

    if (dataMenuMBHRs && dataMenuMBHRs.length > 0) {
      // Log tất cả menu để debug
      console.log('All menu items:');
      dataMenuMBHRs.forEach((item, index) => {
        console.log(`[${index}] menu_cd: ${item.menu_cd}, pk: ${item.pk}, p_pk: ${item.p_pk}, title: ${item.vie || item.title || item.eng}`);
        console.log(`  - count_approve_1: ${item.count_approve_1}, count_approve_2: ${item.count_approve_2}, count_approve_3: ${item.count_approve_3}`);
      });

      // Tìm menu cha MBHRAP
      const mbhrapParent = dataMenuMBHRs.find(i => i.menu_cd === 'MBHRAP');
      console.log('MBHRAP parent menu:', mbhrapParent);

      if (mbhrapParent) {
        // Lọc các menu con có p_pk trùng với pk của MBHRAP
        const childMenus = dataMenuMBHRs.filter(item => {
          const isChild = item.p_pk === mbhrapParent.pk;
          if (isChild) {
            console.log(`Found child menu: ${item.menu_cd} (pk: ${item.pk}, p_pk: ${item.p_pk})`);
            console.log(`  - Counts: ${item.count_approve_1}, ${item.count_approve_2}, ${item.count_approve_3}`);
          }
          return isChild;
        });

        console.log('Total child menus found:', childMenus.length);
        console.log('Child menus:', childMenus);
        setDataMenuMBHRAP(childMenus);
      } else {
        console.warn('MBHRAP parent menu not found in dataMenuMBHRs');
        console.log('Available menu_cd values:', dataMenuMBHRs.map(item => item.menu_cd));
        setDataMenuMBHRAP([]);
      }
    } else {
      console.warn('No menu data available in Redux state');
      setDataMenuMBHRAP([]);
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
      <MenuItemWithCounts
        item={item}
        index={index}
        onPress={handleMenuPress}
        language={language}
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

  if (dataMenuMBHRAP.length === 0) {
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
        data={dataMenuMBHRAP}
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
  },
});

export default List_MBHRAP;