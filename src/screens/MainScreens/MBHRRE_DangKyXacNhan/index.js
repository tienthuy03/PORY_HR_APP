import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, StyleSheet } from "react-native";
import AppHeader from "../../../components/AppHeader";
import { useTheme } from "../../../hooks/useTheme";
import List_MBHRIN from "../../../utils/List_MBHRIN";
import List_MBHRRE from "../../../utils/List_MBHRRE";

const MBHRRE_DangKyXacNhan = ({ navigation, menuData }) => {
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
    if (!dataMenuMBHRs || !language) return "MBHRRE";

    try {
      const mbhrreMenu = dataMenuMBHRs.find(item => item.menu_cd === 'MBHRRE');
      console.log("MBHRRE Menu Data from state: ", mbhrreMenu);
      console.log("Language: ", language);
      if (mbhrreMenu) {
        // Sử dụng ngôn ngữ từ menu data
        if (language === 'en' && mbhrreMenu.eng) {
          return mbhrreMenu.eng;
        } else if (mbhrreMenu.vie) {
          return mbhrreMenu.vie;
        } else if (mbhrreMenu.title) {
          return mbhrreMenu.title;
        } else if (mbhrreMenu.chi) {
          return mbhrreMenu.chi;
        }
      }
    } catch (error) {
      console.warn('Error getting header title:', error);
    }

    return "MBHRRE";
  };

  // Handle navigation for child menu items
  const handleChildMenuNavigation = (menu_cd, item) => {
    console.log('Navigating to child menu:', menu_cd, item);
    // Navigate to the appropriate screen based on menu_cd
    navigation.navigate('FormScreen', {
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
        <List_MBHRRE
          menuData={menuData}
          onNavigate={handleChildMenuNavigation}
        />
      </View>
    </View>
  );
};



export default MBHRRE_DangKyXacNhan;
