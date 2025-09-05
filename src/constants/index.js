// Device ID - tạo một ID duy nhất cho thiết bị
export const deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// App version
export const APP_VERSION = "1.0.0";

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: "User/Login/",
  EXEC_MOBILE: "Exec/MOBILE_DECRYPT/",
  EXEC_MOBILE_V1: "Exec/MOBILE_V1/",
  FORGOT_PASSWORD: "User/ForgotPassword/",
  HEALTH: "health",
};

// Storage keys
export const STORAGE_KEYS = {
  USER_TOKEN: "userToken",
  USER_DATA: "userData",
  API_URL: "API_URL",
  CLIENT_ID: "CLIENT_ID",
  USERNAME: "username",
  LAST_LOGIN_TIME: "lastLoginTime",
  DEVICE_ID: "deviceId",
};

// Crypto keys (giống project cũ)
export const CRYPTO_KEYS = {
  KEY: "12345678901234567890123456789012", // 32 bytes cho AES-256
  IV: "1234567890123456", // 16 bytes cho AES block size
};

// API procedures
export const API_PROCEDURES = {
  USER_PROFILE: "SELUSERPROFILE0100",
  UPDATE_USER_PROFILE: "UPDUSERPROFILE0100",
  CHANGE_PASSWORD: "UPDUSERPASSWORD0100",
  USER_LOGOUT: "USERLOGOUT0100",
  CHECK_TOKEN: "STV_HR_SEL_MBI_CHKTOKEN_1_100",
  UPDATE_DEVICE: "STV_HR_UPD_MBI_DEVICE_0_100",
};

// Response status
export const RESPONSE_STATUS = {
  SUCCESS: "S",
  FAILED: "F",
  ERROR: "E",
};

// Error messages
export const ERROR_MESSAGES = {
  NO_INTERNET: "Không có kết nối internet",
  API_NOT_CONFIGURED: "API URL chưa được cấu hình",
  TOKEN_EXPIRED: "Token đã hết hạn",
  LOGIN_FAILED: "Đăng nhập thất bại",
  NETWORK_ERROR: "Lỗi kết nối mạng",
  SERVER_ERROR: "Lỗi server",
};
