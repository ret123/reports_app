import {fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logOut } from './authSlice';


const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:1338/v1',
  credentials: 'include',
  mode: 'cors',
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
  // fetchOptions: {
  //   credentials: 'include',
  // },
});

// const tokenBaseQuery = fetchBaseQuery({
//   baseUrl: 'http://localhost:1338/v1',
//   credentials: 'include',
//   mode: 'cors',
// });

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
 
  if (result.error && result.error.originalStatus === 401) {
    try {
            
      // if (!refreshToken) {
      //   throw new Error('No refresh token available');
      // }
     

      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh-tokens',
          method: 'POST',
          body: { },
        },
        api,
        extraOptions
      );
      // console.log('result',refreshResult.data)

      if (refreshResult.data) {
        const { access, refresh } = refreshResult.data;
        api.dispatch(
          setCredentials({
            accessToken: access.token,
            refreshToken: refresh.token,
            tokenExpires: access.expires,
            refreshTokenExpires: refresh.expires,
          })
        );
        result = await baseQuery(args, api, extraOptions);
      } else {
       
        api.dispatch(logOut());
        setTimeout(() => {
          api.dispatch(apiSlice.util.resetApiState());
        }, 1000);
        window.location.href = '/'; 
      }
    } catch (error) {
      console.error('Failed to refresh access token. Logging out.', error);
      api.dispatch(logOut());
      setTimeout(() => {
        api.dispatch(apiSlice.util.resetApiState());
      }, 1000);
      window.location.href = '/'; 
      return Promise.reject(error);
    }
  }

  return result;
};



export default  baseQueryWithReauth;

