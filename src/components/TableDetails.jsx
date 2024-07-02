import React, { useEffect, useState } from "react";
import { useGetTableDetailsQuery } from "../services/reports/reportApiSlice";


const TableDetails = ({ tableName }) => {


  const { data: table, error: tableError, isLoading: isTableLoading } = useGetTableDetailsQuery(tableName);
  console.log(table);
  const [tableData, setTableData] = useState(table.rows);
  const [columns, setColumns] = useState(table.columns);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axiosInstance.get(`/tables/${tableName}`);
//         setTableData(response.data.rows);
//         setColumns(response.data.columns);
//       } catch (error) {
//         console.error("Error fetching table data:", error);
//       }
//     };

//     fetchData();
//   }, [tableName]);

  return (
    <div>
      {tableData.length > 0 ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                {columns.map((col) => (
                  <td key={col}>{row[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No data available for the selected table</div>
      )}
    </div>
  );
};

export default TableDetails;
