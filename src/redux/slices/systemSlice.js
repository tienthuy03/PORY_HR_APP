import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  apiURL: '',
  theme: null,
  isLoading: false,
};

const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    SetApiURL: (state, action) => {
      state.apiURL = action.payload;
    },
    sysLoadTheme: (state, action) => {
      state.theme = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { SetApiURL, sysLoadTheme, setLoading } = systemSlice.actions;
export default systemSlice.reducer;
