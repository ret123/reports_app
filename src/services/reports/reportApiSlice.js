import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../auth/reAuthApiSlice";

export const reportApiSlice = createApi({
  reducerPath: "reportApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getConfig: builder.query({
      query: () => "/reports/config",
    }),
    getTables: builder.query({
      query: () => "/reports/getTables",
    }),
    getTableDetails: builder.query({
      query: (tableName) => `/reports/tables/${tableName}`,
    }),
  }),
});

export const { useGetConfigQuery, useGetTableDetailsQuery, useGetTablesQuery } =
  reportApiSlice;
// export const { useGetTablesQuery } = reportApiSlice;

export default reportApiSlice.reducer;
