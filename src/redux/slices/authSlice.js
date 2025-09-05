import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../../services/apiService';
import { STORAGE_KEYS } from '../../constants';

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password, machine_id }, { rejectWithValue }) => {
    try {
      console.log('AuthSlice - Login attempt with:', { username, password: '***', machine_id });

      // Gọi API đăng nhập thông qua service
      const response = await authAPI.login({
        username,
        password,
        machine_id
      });

      console.log('AuthSlice - Full response:', response);

      // Kiểm tra response từ server theo cấu trúc project cũ
      if (response && (response.results === "S" || response.success === true)) {
        const userData = response.data || response.user;
        const token = response.data?.tokenLogin || response.data?.token || response.token;

        console.log('AuthSlice - User data:', userData);
        console.log('AuthSlice - Token:', token);

        if (!userData || !token) {
          throw new Error('Thông tin user hoặc token không hợp lệ');
        }

        // Lưu token và user data vào AsyncStorage với STORAGE_KEYS
        await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

        return {
          user: userData,
          token: token
        };
      } else {
        // Xử lý lỗi từ server
        const errorMessage = response.errorData || response.message || response.error || 'Đăng nhập thất bại';
        console.log('AuthSlice - Login failed with error:', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('AuthSlice - Login error:', error);
      return rejectWithValue(error.message || 'Có lỗi xảy ra');
    }
  }
);

// Async thunk to load user data from storage
export const loadUserFromStorage = createAsyncThunk(
  'auth/loadUserFromStorage',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
      const userDataString = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

      if (token && userDataString) {
        const userData = JSON.parse(userDataString);
        // console.log('AuthSlice - Loaded user data from storage:', userData);
        return { user: userData, token };
      }

      return rejectWithValue('No stored user data');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      // Gọi API logout thông qua service
      await authAPI.logout();
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return rejectWithValue(error.message || 'Có lỗi xảy ra khi đăng xuất');
    }
  }
);

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // Update in AsyncStorage
        AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Load user from storage cases
      .addCase(loadUserFromStorage.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loadUserFromStorage.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        // Clear AsyncStorage
        AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
        AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;
