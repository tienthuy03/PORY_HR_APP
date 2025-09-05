import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {
    data: {
      menu: []
    }
  },
  loading: false,
  error: null
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenuData: (state, action) => {
      state.data.data.menu = action.payload;
      state.loading = false;
      state.error = null;
    },
    setMenuLoading: (state, action) => {
      state.loading = action.payload;
    },
    setMenuError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearMenuData: (state) => {
      state.data.data.menu = [];
      state.loading = false;
      state.error = null;
    }
  }
});

export const { setMenuData, setMenuLoading, setMenuError, clearMenuData } = menuSlice.actions;
export default menuSlice.reducer;
