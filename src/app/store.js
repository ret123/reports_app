import { configureStore } from '@reduxjs/toolkit';
import authReducer, { setCredentials } from '../services/auth/authSlice'; // Assuming you have an authSlice defined
import { authApiSlice } from '../services/auth/authApiSlice'; // Import authApiSlice
import { reportApiSlice } from '../services/reports/reportApiSlice'; // Import protectedApiSlice
import Cookies from 'js-cookie';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [reportApiSlice.reducerPath]: reportApiSlice.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(authApiSlice.middleware, reportApiSlice.middleware),
});
const accessToken = Cookies.get('accessToken');
const refreshToken = Cookies.get('refreshToken');
const tokenExpires = Cookies.get('tokenExpires');
const refreshTokenExpires = Cookies.get('refreshTokenExpires');

if (accessToken && refreshToken && tokenExpires && refreshTokenExpires) {
  store.dispatch(setCredentials({
    accessToken,
    refreshToken,
    tokenExpires,
    refreshTokenExpires,
  }));
}
