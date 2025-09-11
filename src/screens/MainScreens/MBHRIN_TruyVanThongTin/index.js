import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, StyleSheet } from "react-native";
import AppHeader from "../../../components/AppHeader";
import { useTheme } from "../../../hooks/useTheme";
import List_MBHRIN from "../../../utils/List_MBHRIN";

const MBHRIN_TruyVanThongTin = ({ navigation, menuData }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  // Sử dụng selector cụ thể thay vì lấy toàn bộ state
  const menuDataFromState = useSelector((state) => state.menu?.data?.data?.menu);
  const userLanguage = useSelector((state) => state.auth?.user?.user_language);

  let dataMenuMBHRs = menuDataFromState;
  let language = userLanguage || 'vi';

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      paddingTop: 8,
    },
  });

  const getHeaderTitle = () => {
    // Ưu tiên sử dụng data được truyền từ props
    if (menuData) {
      console.log("Using menuData from props:", menuData);
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
    if (!dataMenuMBHRs || !language) return "MBHRIN";

    try {
      const mbhrinMenu = dataMenuMBHRs.find(item => item.menu_cd === 'MBHRIN');
      console.log("MBHRIN Menu Data from state: ", mbhrinMenu);
      console.log("Language: ", language);
      if (mbhrinMenu) {
        // Sử dụng ngôn ngữ từ menu data
        if (language === 'en' && mbhrinMenu.eng) {
          return mbhrinMenu.eng;
        } else if (mbhrinMenu.vie) {
          return mbhrinMenu.vie;
        } else if (mbhrinMenu.title) {
          return mbhrinMenu.title;
        } else if (mbhrinMenu.chi) {
          return mbhrinMenu.chi;
        }
      }
    } catch (error) {
      console.warn('Error getting header title:', error);
    }

    return "MBHRIN";
  };

  // Handle navigation for child menu items
  const handleChildMenuNavigation = (menu_cd, item) => {

    // Navigate to the appropriate screen based on menu_cd
    // Map menu_cd to actual screen names
    const screenMap = {
      'MBHRIN001': 'MBHRIN001',
      // Add more mappings as needed
    };

    const screenName = screenMap[menu_cd] || menu_cd;

    navigation.navigate(screenName, {
      menu_cd: menu_cd,
      menuData: item,
      title: item.vie || item.title || item.eng || menu_cd
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader goBack={navigation.goBack}>
        {getHeaderTitle()}
      </AppHeader>
      <View style={[styles.content, { backgroundColor: colors.background }]}>
        <List_MBHRIN
          menuData={menuData}
          onNavigate={handleChildMenuNavigation}
        />
      </View>
    </View>
  );
};



export default MBHRIN_TruyVanThongTin;
