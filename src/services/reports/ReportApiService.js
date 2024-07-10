import axios from 'axios';

const instance = axios.create({

  timeout: 10000, // Adjust timeout as needed
  maxContentLength: 100 * 1024 * 1024, // Adjust maxContentLength for large payloads
});




const BASE_URL = 'http://localhost:1338/v1'
export const generatePdf = (tableName, filters, columns,rows) => {
    // const params = {
    //   table: tableName,
    //   filters: JSON.stringify(filters),
    //   columns: columns.join(','),
    //   rows: JSON.stringify(rows),
      
    // };
    return instance.post(`${BASE_URL}/reports/generate-pdf`, {
      table: tableName,
      filters:  JSON.stringify(filters),
      columns: columns,
      rows: JSON.stringify(rows),
    });
  };

  export const generateExcel = async(tableName, filters, columns,rows) => {
    try {
      const response = await axios.post(`${BASE_URL}/reports/generate-excel`, {
        table: tableName,
        filters: JSON.stringify(filters),
        columns: columns.join(','),
        rows: JSON.stringify(rows),
      }, {
        responseType: 'arraybuffer', // Ensure response type is set to arraybuffer for file downloads
        headers: {
          'Content-Type': 'application/json', // Set content type as JSON
        },
      });
  
      // Handle file download here if needed
      return response; // This assumes the server sends back the Excel file as arraybuffer
    } catch (error) {
      console.error('Error generating Excel:', error);
      throw error; // Propagate error to handle it in the calling function
    }
  };

  export const generateCsv = (tableName, filters, columns,rows) => {
    // const params = {
    //   table: tableName,
    //   filters: JSON.stringify(filters),
    //   columns: columns.join(','),
    //   rows: JSON.stringify(rows),
    // };
    return axios.post(`${BASE_URL}/reports/generate-csv`, {
      table: tableName,
      filters: JSON.stringify(filters),
      columns: columns.join(','),
      rows: JSON.stringify(rows),
    });
  };

 export const fetchGroupbyData = async (tableName,groupbyColumn) => {
    try {
      const response = await axios.get(`${BASE_URL}/reports/${tableName}/groupby`, {
        params: {
          groupby: groupbyColumn,
        },
      });
      setRows(response.data.rows);
      setSelectedColumns(response.data.columns);
    } catch (error) {
      console.error('Error fetching groupby data:', error);
    }
  };