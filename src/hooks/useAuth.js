import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logoutUser, loadUserFromStorage, updateUserProfile } from '../redux/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const login = (credentials) => {
    return dispatch(loginUser(credentials));
  };

  const logout = () => {
    return dispatch(logoutUser());
  };

  const loadUser = () => {
    return dispatch(loadUserFromStorage());
  };

  const updateProfile = (userData) => {
    return dispatch(updateUserProfile(userData));
  };

  // Helper functions để lấy thông tin user
  const getUserInfo = () => {
    if (!user) return null;

    return {
      // Thông tin cơ bản
      fullName: user.full_name,
      username: user.crt_by,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      avatar: user.avatar,
      crt_by: user.crt_by,

      // Thông tin công ty
      companyPk: user.company_pk,
      clientNm: user.client_nm,
      clientPk: user.client_pk,

      // Thông tin nhân viên
      empId: user.emp_id,
      empPk: user.thr_emp_pk,
      userPk: user.tes_user_pk,

      // Thông tin tổ chức
      orgId: user.org_id,
      orgNm: user.org_nm,
      orgPk: user.org_pk,

      // Quyền hạn
      sysadminYn: user.sysadmin_yn === 'Y',
      acLevel: user.ac_level,
      hrLevel: user.hr_level,
      prLevel: user.pr_level,
      saLevel: user.sa_level,
      eiLevel: user.ei_level,
      fuLevel: user.fu_level,
      inLevel: user.in_level,

      // Cài đặt
      userLanguage: user.user_language,
      layoutStyle: user.layout_style,
      homeStyle: user.home_style,
      menuType: user.menu_type,
      notiMobileYn: user.noti_mobile_yn === 'Y',
      announceYn: user.announce_yn === 'Y',

      // Token
      tokenLogin: user.tokenLogin,
      refreshToken: user.refreshToken,

      // Thông tin khác
      deviceId: user.device_id,
      recognizeFaceId: user.recognize_face_id,
      homeTown: user.home_town,
      loginStatus: user.login_status,
    };
  };

  const hasPermission = (permission) => {
    if (!user) return false;

    // Kiểm tra quyền admin
    if (user.sysadmin_yn === 'Y') return true;

    // Kiểm tra các level quyền
    const levels = {
      'ac': user.ac_level,
      'hr': user.hr_level,
      'pr': user.pr_level,
      'sa': user.sa_level,
      'ei': user.ei_level,
      'fu': user.fu_level,
      'in': user.in_level,
    };

    return levels[permission] >= 6; // Level 6 trở lên có quyền
  };

  return {
    // State
    user,
    token,
    loading,
    error,
    isAuthenticated,

    // Actions
    login,
    logout,
    loadUser,
    updateProfile,

    // Helper functions
    getUserInfo,
    hasPermission,
  };
};
