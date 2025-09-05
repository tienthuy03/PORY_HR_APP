import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../../config/i18n';

// Async thunk to load settings from storage
export const loadSettingsFromStorage = createAsyncThunk(
  'settings/loadSettingsFromStorage',
  async (_, { rejectWithValue }) => {
    try {
      const theme = await AsyncStorage.getItem('user-theme') || 'light';
      const language = await AsyncStorage.getItem('user-language') || 'vi';

      return { theme, language };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Async thunk to save theme
export const saveTheme = createAsyncThunk(
  'settings/saveTheme',
  async (theme, { rejectWithValue }) => {
    try {
      await AsyncStorage.setItem('user-theme', theme);
      return theme;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Async thunk to save language
export const saveLanguage = createAsyncThunk(
  'settings/saveLanguage',
  async (language, { rejectWithValue }) => {
    try {
      await AsyncStorage.setItem('user-language', language);
      await i18n.changeLanguage(language);
      return language;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  theme: 'light', // 'light', 'dark', 'system'
  language: 'vi', // 'vi', 'en'
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load settings cases
      .addCase(loadSettingsFromStorage.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadSettingsFromStorage.fulfilled, (state, action) => {
        state.loading = false;
        state.theme = action.payload.theme;
        state.language = action.payload.language;
        state.error = null;
      })
      .addCase(loadSettingsFromStorage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Save theme cases
      .addCase(saveTheme.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveTheme.fulfilled, (state, action) => {
        state.loading = false;
        state.theme = action.payload;
        state.error = null;
      })
      .addCase(saveTheme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Save language cases
      .addCase(saveLanguage.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveLanguage.fulfilled, (state, action) => {
        state.loading = false;
        state.language = action.payload;
        state.error = null;
      })
      .addCase(saveLanguage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = settingsSlice.actions;
export default settingsSlice.reducer;
