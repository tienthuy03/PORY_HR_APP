import { configureStore } from '@reduxjs/toolkit';
import systemReducer from './slices/systemSlice';
import authReducer from './slices/authSlice';
import settingsReducer from './slices/settingsSlice';
import menuReducer from './slices/menuSlice';

export const store = configureStore({
  reducer: {
    system: systemReducer,
    auth: authReducer,
    settings: settingsReducer,
    menu: menuReducer,
  },
});


// The following type aliases are only valid in TypeScript files.
// Since this is a JavaScript file, we remove them to fix the lint errors.
