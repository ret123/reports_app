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
    generatePdf: builder.query({
      query: ({ tableName, filters, columns }) =>
        `/reports/generate-pdf?table=${tableName}&filters=${encodeURIComponent(
          JSON.stringify(filters)
        )}&columns=${columns.join(",")}`,
      transformResponse: (response) => response.blob(), // Ensure response is treated as a blob
    }),
  }),
});

export const { useGetConfigQuery, useGetTableDetailsQuery, useGetTablesQuery, useGeneratePdfQuery } =
  reportApiSlice;
// export const { useGetTablesQuery } = reportApiSlice;

export default reportApiSlice.reducer;
