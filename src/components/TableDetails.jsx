import React, { useEffect, useState } from "react";
import { useGetConfigQuery, useGetTableDetailsQuery } from "../services/reports/reportApiSlice";
import { useTable, useFilters } from 'react-table';
import ColumnSelector from "./ColumnSelector"
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

const TableDetails = ({ tableName }) => {

  const { data: config, error: configError, isLoading: isConfigLoading } = useGetConfigQuery();
  const { data: table, error: tableError, isLoading: isTableLoading } = useGetTableDetailsQuery(tableName);
  //  const tableInstance = useTable({ columns: table.columns, data: table.rows }, useFilters);
  
  if (isConfigLoading) {
    return <div>Loading...</div>;
  }

  if (configError) {
    return <div>Error loading data</div>;
  }

  if (!config) {
    return <div>No data available</div>;
  }
  
  if (isTableLoading) {
    return <div>Loading...</div>;
  }

  if (tableError) {
    return <div>Error: {tableError.message}</div>;
  }
  // const [tableData, setTableData] = useState(table.rows);
  // const [columns, setColumns] = useState(table.columns);

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

const { columns, filters, actions } = config;

  return (
    <div>
      {tableData.length > 0 ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              {table.columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, index) => (
              <tr key={index}>
                {table.columns.map((col) => (
                  <td key={col}>{row[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No data available for the selected table</div>
      )}
       <ColumnSelector columns={table.columns} />
       <DropdownButton id="dropdown-basic-button" title="Actions">
            {actions.map((action) => (
              <Dropdown.Item key={action.name}>{action.name}</Dropdown.Item>
            ))}
          </DropdownButton>
    </div>
  );
};

export default TableDetails;