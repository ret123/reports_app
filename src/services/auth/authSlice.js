// services/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const initialState = {
  user:null,
  accessToken:   null,
  refreshToken: null,
  tokenExpires:  null,
  refreshTokenExpires:  null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const {user, accessToken, refreshToken, tokenExpires, refreshTokenExpires } = action.payload;
      state.user = user
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.tokenExpires = tokenExpires;
      state.refreshTokenExpires = refreshTokenExpires;
    
      localStorage.setItem('user',JSON.stringify(user))
      localStorage.setItem('token',accessToken)
           
    },
    logOut: (state) => {
      state.user = null
      state.accessToken = null;
      state.refreshToken = null;
      state.tokenExpires = null;
      state.refreshTokenExpires = null;
          
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      Cookies.remove('refreshToken');
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.accessToken;
export const selectCurrentRefreshToken = (state) => state.auth.refreshToken;
// export const selectTokenExpires = (state) => state.auth.tokenExpires;
// export const selectRefreshTokenExpires = (state) => state.auth.refreshTokenExpires;

export default authSlice.reducer;
