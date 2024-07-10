import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from 'axios';
import { useGetTableDetailsQuery } from "../services/reports/reportApiSlice";
import { Box, Button,FormControl,InputLabel,Select,MenuItem } from "@mui/material";
import CustomToolbar from "./CustomToolbar";
import { DataGrid, GridRowModes, GridActionsCellItem } from "@mui/x-data-grid";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import FileSaver from "file-saver";
import {
  generatePdf,
  generateExcel,
  generateCsv,
} from "../services/reports/ReportApiService";
import ColumnSelector from "./ColumnSelector";

const ReportTable = ({ tableName,showDataGrid }) => {
  const { data, error, isLoading } = useGetTableDetailsQuery(tableName);
  const [rows, setRows] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});
  const [filters, setFilters] = useState([]);
  const [deletedRowIds, setDeletedRowIds] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [xAxisKey, setXAxisKey] = useState("");
  const [yAxisKey, setYAxisKey] = useState("");
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [showGrid, setShowGrid] = useState(showDataGrid);
  const [groupbyColumn, setGroupbyColumn] = useState("");
  const [aggregateFunction, setAggregateFunction] = useState("");
 
  useEffect(() => {
    
    if (data && data.columns) {
      const initialVisibility = data.columns.reduce((model, col) => {
        model[col] = true;
        return model;
      }, {});
      setColumnVisibilityModel(initialVisibility);
      setShowGrid(showDataGrid)
      // setSelectedColumns(data.columns); 
      const mappedRows = data.rows.map((row, index) => ({ id: index, ...row }));
      setRows(mappedRows);
      setAllRows(mappedRows);
    }
  }, [data,groupbyColumn, aggregateFunction]);

  const handleSearch = useCallback(
    (searchText) => {
      const filteredRows = allRows.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setRows(filteredRows);
    },
    [allRows]
  );

  const downloadFile = useCallback((blob, type) => {
    let fileName = `report.${type}`;
    if (type === "excel") {
      fileName = "report.xlsx";
    }
    FileSaver.saveAs(blob, fileName);
  }, []);

  const fetchGroupbyData = async () => {
    try {
      const response = await axios.get(`http://localhost:1338/v1/reports/tables/${tableName}/group-by`, {
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

  const fetchAggregateData = async () => {
    try {
      const response = await axios.get(`http://localhost:1338/v1/reports/tables/${tableName}/aggregate`, {
        params: {
          aggregate: aggregateFunction,
        },
      });
      setRows(response.data.rows);
      setSelectedColumns(response.data.columns);
    } catch (error) {
      console.error('Error fetching aggregate data:', error);
    }
  };

  const handleGroupbyChange = (event) => {
   
    setGroupbyColumn(event.target.value);
    fetchGroupbyData();
   
  };

  const handleAggregateChange = (event) => {
    setAggregateFunction(event.target.value);
    fetchAggregateData();
  };


  const handleExport = useCallback(
    async (format) => {
      const visibleColumns = selectedColumns.filter(
        (col) => columnVisibilityModel[col]
      );
      const filteredRows = rows
        .filter((row) => !deletedRowIds.includes(row.id))
        .map((row) => {
          const filteredRow = {};
          visibleColumns.forEach((col) => {
            filteredRow[col] = row[col];
          });
          return filteredRow;
        });

      try {
        let response, blob;
        switch (format) {
          case "pdf":
            response = await generatePdf(
              tableName,
              filters,
              visibleColumns,
              filteredRows
            );
            blob = new Blob([response.data], { type: "application/pdf" });
            break;
          case "excel":
            response = await generateExcel(
              tableName,
              filters,
              visibleColumns,
              filteredRows
            );
            blob = new Blob([response.data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            break;
          case "csv":
            response = await generateCsv(
              tableName,
              filters,
              visibleColumns,
              filteredRows
            );
            blob = new Blob([response.data], { type: "text/csv" });
            break;
          default:
            return;
        }
        downloadFile(blob, format);
      } catch (error) {
        console.error(`Error exporting to ${format}:`, error);
      }
    },
    [
      columnVisibilityModel,
      rows,
      deletedRowIds,
      filters,
      tableName,
      downloadFile,
    ]
  );

  const handleEditClick = useCallback(
    (id) => () => {
      setRowModesModel((prevModel) => ({
        ...prevModel,
        [id]: { mode: GridRowModes.Edit },
      }));
    },
    []
  );

  const handleSaveClick = useCallback(
    (id) => () => {
      setRowModesModel((prevModel) => ({
        ...prevModel,
        [id]: { mode: GridRowModes.View },
      }));
    },
    []
  );

  const handleDeleteClick = useCallback(
    (id) => () => {
      setDeletedRowIds((prev) => [...prev, id]);
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    },
    []
  );

  const handleCancelClick = useCallback(
    (id) => () => {
      setRowModesModel((prevModel) => ({
        ...prevModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      }));
      const editedRow = rows.find((row) => row.id === id);
      if (editedRow.isNew) {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      }
    },
    [rows]
  );

  const processRowUpdate = useCallback((newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === newRow.id ? updatedRow : row))
    );
    return updatedRow;
  }, []);

  const handleRowModesModelChange = useCallback((newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  }, []);

  const handleColumnSelectionChange = (selectedColumns) => {
    const newColumnVisibilityModel = data.columns.reduce((model, col) => {
      model[col] = selectedColumns.includes(col);
      return model;
    }, {});
    setColumnVisibilityModel(newColumnVisibilityModel);
    setSelectedColumns(selectedColumns);
    setShowGrid(true);
  };

  const columns = useMemo(() => {
    const cols = selectedColumns.map((col) => ({
      field: col,
      headerName: col,
      flex: 1,
      editable: true,
    }));

    cols.push({
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{ color: "primary.main" }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    });

    return cols;
  }, [
    selectedColumns,
    rowModesModel,
    handleSaveClick,
    handleCancelClick,
    handleEditClick,
    handleDeleteClick,
  ]);

  const handleXAxisChange = (event) => {
    setXAxisKey(event.target.value);
  };

  const handleYAxisChange = (event) => {
    setYAxisKey(event.target.value);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
  if (!data) return <div>No data available</div>;
  console.log(data);

  return (
    <Box>
      <ColumnSelector
        columns={data.columns}
        onColumnSelectionChange={handleColumnSelectionChange}
      />
    {/* {showGrid && (<Box>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Group By</InputLabel>
        <Select value={groupbyColumn} onChange={handleGroupbyChange}>
          {data.columns.map((col) => (
            <MenuItem key={col} value={col}>
              {col}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Aggregate</InputLabel>
        <Select value={aggregateFunction} onChange={handleAggregateChange}>
          {data.columns.map((col) => (
            <MenuItem key={col} value={col}>
              {col}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
     </Box>) } */}
    

      <Box style={{ height: 600, width: "100%" }}>
        {showGrid && (
          <div>
            {data.settings.export.enabled && (
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
                {data.settings.export.formats.map((type) => (
                  <Button key={type} onClick={() => handleExport(type)}>
                    Export {type}
                  </Button>
                ))}
              </Box>
            )}

            <DataGrid
              rows={rows}
              columns={columns}
              editMode="row"
              pageSize={data.settings.pageSize}
              rowModesModel={rowModesModel}
              columnVisibilityModel={columnVisibilityModel}
              onColumnVisibilityModelChange={setColumnVisibilityModel}
              onRowModesModelChange={handleRowModesModelChange}
              processRowUpdate={processRowUpdate}
              slots={{
                toolbar: CustomToolbar,
              }}
              slotProps={{
                toolbar: { onSearch: handleSearch },
              }}
            />
          </div>
        )}
      </Box>
    </Box>
  );
};

export default ReportTable;
