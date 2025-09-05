import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, StyleSheet } from "react-native";
import AppHeader from "../../../components/AppHeader";
import { useTheme } from "../../../hooks/useTheme";
import List_MBHRIN from "../../../utils/List_MBHRIN";

const MBHRIN_TruyVanThongTin = ({ navigation: { goBack }, menuData }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  let dataMenuMBHRs;
  let language;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      paddingTop: 8,
    },
  });
  try {
    dataMenuMBHRs = state.menu.data.data.menu;
    language = state.auth.user?.user_language || 'vi';
  } catch (error) {
    console.warn('Error getting menu data:', error);
  }

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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader goBack={goBack}>
        {getHeaderTitle()}
      </AppHeader>
      <View style={[styles.content, { backgroundColor: colors.background }]}>
        <List_MBHRIN menuData={menuData} />
      </View>
    </View>
  );
};



export default MBHRIN_TruyVanThongTin;
