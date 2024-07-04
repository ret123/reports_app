import axios from 'axios';

const BASE_URL = 'http://localhost:1338/v1'
export const generatePdf = (tableName, filters, columns) => {
    const params = {
      table: tableName,
      filters: JSON.stringify(filters),
      columns: columns.join(','),
    };
    return axios.get(`${BASE_URL}/reports/generate-pdf`, { params });
  };

  export const generateExcel = (tableName, filters, columns) => {
    const params = {
      table: tableName,
      filters: JSON.stringify(filters),
      columns: columns.join(','),
    };
    return axios.get(`${BASE_URL}/reports/generate-excel`, { params });
  };