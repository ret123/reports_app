import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {  logOut } from './authSlice';


const baseQuery = fetchBaseQuery({
  baseUrl:  'http://localhost:1338/v1',
  credentials: 'include',
  mode: 'cors',
 
});

export const authApiSlice = createApi({
  reducerPath: 'authApi',
  baseQuery:baseQuery,
  endpoints: builder => ({
    login: builder.mutation({
      query: credentials => ({
        url: '/auth/login',
        method: 'POST',
        body: { ...credentials }
      })
    }),
    sendLogout: builder.mutation({
      query: refreshToken => ({
        url: '/auth/logout',
        method: 'POST',
        body: {refreshToken}
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logOut());
          setTimeout(() => {
            dispatch(authApiSlice.util.resetApiState());
          }, 1000);
        } catch (err) {
          console.log(err);
        }
      }
    }),
  
  })
});

export const {
  useLoginMutation,
  useSendLogoutMutation,
 
} = authApiSlice;
