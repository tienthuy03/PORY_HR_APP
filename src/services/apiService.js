import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from "crypto-js";
import { Platform } from 'react-native';
import md5 from 'md5';
import {
  deviceId,
  API_ENDPOINTS,
  STORAGE_KEYS,
  CRYPTO_KEYS,
  API_PROCEDURES,
  ERROR_MESSAGES,
  APP_VERSION
} from '../constants';

// Tạo axios instance với cấu hình mặc định
const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào header
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error adding token to request:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn, logout user
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      // Có thể dispatch logout action ở đây
    }
    return Promise.reject(error);
  }
);

// sysFetch function giống như project cũ
export const sysFetch = (api, data, token) => {
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Mã hóa AES cho data.pro nếu có
  if (data.pro) {
    const key = CryptoJS.enc.Utf8.parse(CRYPTO_KEYS.KEY);
    const iv = CryptoJS.enc.Utf8.parse(CRYPTO_KEYS.IV);

    const encrypted = CryptoJS.AES.encrypt(data.pro, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    const cryptoString = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    data.pro = cryptoString;
  }

  return axios
    .post(
      api + API_ENDPOINTS.EXEC_MOBILE,
      {
        ...data,
        machine_id: deviceId,
        token: 'tvs',
      },
      axiosConfig
    )
    .then(response => {
      return response.data;
    })
    .catch(err => {
      console.log('err sysFetch', err);
      if (err.message && err.message.includes('401')) {
        return { error: ERROR_MESSAGES.TOKEN_EXPIRED };
      } else {
        console.log('err sysFetch');
        console.log(err);
        return { error: ERROR_MESSAGES.NETWORK_ERROR };
      }
    });
};


export const sysFetch1 = (api, data, token) => {
  let axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios
    .post(
      api + API_ENDPOINTS.EXEC_MOBILE,
      {
        ...data,
        machine_id: deviceId,
        token: 'tvs',
      },
      axiosConfig,
    )
    .then(response => {
      // console.log('response ', response);
      return response.data;
    })
    .catch(err => {
      console.log('err sysFetch', err);
      if (err == 'AxiosError: Request failed with status code 401') {
        return 'Token Expired';
      } else {
        console.log('err sysFetch');
        console.log(err);
      }
    });
};


// API service functions
export const authAPI = {
  // Đăng nhập - sử dụng endpoint giống project cũ
  login: async (credentials) => {
    const apiUrl = await AsyncStorage.getItem(STORAGE_KEYS.API_URL);

    if (!apiUrl) {
      throw new Error(ERROR_MESSAGES.API_NOT_CONFIGURED);
    }

    // Mã hóa password bằng MD5 như project cũ
    const passwordMd5 = md5(credentials.password);

    // Thử phương thức 1: User/Login/ endpoint (đơn giản như project cũ)
    try {
      // Sử dụng endpoint User/Login/ giống project cũ
      // Đảm bảo API URL có dấu / ở cuối
      const baseUrl = apiUrl.endsWith('/') ? apiUrl : apiUrl + '/';

      // Thử không format username trước
      const requestData = {
        username: credentials.username, // Không format
        password: passwordMd5, // Sử dụng password đã mã hóa MD5
        machine_id: credentials.machine_id,
      };

      console.log('Login API URL (Method 1):', `${baseUrl}${API_ENDPOINTS.LOGIN}`);
      console.log('Login request data (no format):', requestData);

      const response = await apiClient.post(`${baseUrl}${API_ENDPOINTS.LOGIN}`, requestData);
      console.log('Login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login API error (Method 1):', error.response?.data || error.message);

      // Thử phương thức 2: Với format username
      try {
        console.log('Trying Method 2: With formatted username');

        const baseUrl = apiUrl.endsWith('/') ? apiUrl : apiUrl + '/';
        const formattedUsername = credentials.username + "|" + APP_VERSION;

        const requestData = {
          username: formattedUsername,
          password: passwordMd5, // Sử dụng password đã mã hóa MD5
          machine_id: credentials.machine_id,
        };

        console.log('Login request data (with format):', requestData);

        const response = await apiClient.post(`${baseUrl}${API_ENDPOINTS.LOGIN}`, requestData);
        console.log('Login response (Method 2):', response.data);
        return response.data;
      } catch (error2) {
        console.error('Login API error (Method 2):', error2.response?.data || error2.message);

        // Thử phương thức 3: Exec/MOBILE/ với procedure
        try {
          console.log('Trying Method 3: Exec/MOBILE/ with procedure');

          const data = {
            pro: "USERLOGIN0100",
            in_par: {
              p1_varchar2: credentials.username,
              p2_varchar2: passwordMd5, // Sử dụng password đã mã hóa MD5
              p3_varchar2: credentials.machine_id,
              p4_varchar2: APP_VERSION,
            },
            out_par: {
              p1_sys: "user_data",
              p2_sys: "token",
            },
          };

          const response = await sysFetch(apiUrl, data, null); // Không cần token cho login

          if (response.error) {
            throw new Error(response.error);
          }

          console.log('Login response (Method 3):', response);
          return response;
        } catch (error3) {
          console.error('Login API error (Method 3):', error3);
          throw error; // Throw original error
        }
      }
    }
  },

  // Lấy thông tin user profile
  getUserProfile: async () => {
    const apiUrl = await AsyncStorage.getItem(STORAGE_KEYS.API_URL);
    const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);

    if (!token) {
      throw new Error(ERROR_MESSAGES.TOKEN_EXPIRED);
    }

    const data = {
      pro: API_PROCEDURES.USER_PROFILE,
      in_par: {
        p1_varchar2: "profile",
      },
      out_par: {
        p1_sys: "user_info",
      },
    };

    const response = await sysFetch(apiUrl, data, token);

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  },

  // Cập nhật thông tin user
  updateUserProfile: async (userData) => {
    const apiUrl = await AsyncStorage.getItem(STORAGE_KEYS.API_URL);
    const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);

    if (!token) {
      throw new Error(ERROR_MESSAGES.TOKEN_EXPIRED);
    }

    const data = {
      pro: API_PROCEDURES.UPDATE_USER_PROFILE,
      in_par: {
        ...userData,
      },
      out_par: {
        p1_sys: "result",
      },
    };

    const response = await sysFetch(apiUrl, data, token);

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  },

  // Đổi mật khẩu
  changePassword: async (passwordData) => {
    const apiUrl = await AsyncStorage.getItem(STORAGE_KEYS.API_URL);
    const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);

    if (!token) {
      throw new Error(ERROR_MESSAGES.TOKEN_EXPIRED);
    }

    const data = {
      pro: API_PROCEDURES.CHANGE_PASSWORD,
      in_par: {
        old_password: passwordData.oldPassword,
        new_password: passwordData.newPassword,
      },
      out_par: {
        p1_sys: "result",
      },
    };

    const response = await sysFetch(apiUrl, data, token);

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  },

  // Quên mật khẩu
  forgotPassword: async (email) => {
    const apiUrl = await AsyncStorage.getItem(STORAGE_KEYS.API_URL);

    const response = await apiClient.post(`${apiUrl}${API_ENDPOINTS.FORGOT_PASSWORD}`, {
      email: email
    });

    return response.data;
  },

  // Đăng xuất
  logout: async () => {
    try {
      const apiUrl = await AsyncStorage.getItem(STORAGE_KEYS.API_URL);
      const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);

      if (token) {
        const data = {
          pro: API_PROCEDURES.USER_LOGOUT,
          in_par: {
            p1_varchar2: "logout",
          },
          out_par: {
            p1_sys: "result",
          },
        };

        await sysFetch(apiUrl, data, token);
      }
    } catch (error) {
      console.error('Logout API error:', error);
    }

    // Luôn xóa local data
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }
};

// Kiểm tra kết nối API
export const checkAPIConnection = async () => {
  try {
    const apiUrl = await AsyncStorage.getItem(STORAGE_KEYS.API_URL);
    if (!apiUrl) {
      return { connected: false, message: ERROR_MESSAGES.API_NOT_CONFIGURED };
    }

    const response = await axios.get(`${apiUrl}${API_ENDPOINTS.HEALTH}`, { timeout: 5000 });
    return { connected: true, data: response.data };
  } catch (error) {
    return {
      connected: false,
      message: error.response?.data?.message || ERROR_MESSAGES.NETWORK_ERROR
    };
  }
};

export default apiClient;
