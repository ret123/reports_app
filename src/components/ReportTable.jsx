import React, { useState } from 'react';
import { useGeneratePdfQuery, useGetConfigQuery, useGetTableDetailsQuery } from '../services/reports/reportApiSlice';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Menu, MenuItem, Typography, Box, Grid } from '@mui/material';
import ColumnSelector from "./ColumnSelector";
import { generatePdf } from '../services/reports/ReportApiService';

const ReportTable = ({ tableName }) => {

  const { data, error, isLoading } = useGetTableDetailsQuery(tableName);
  const { data: config, error: configError, isLoading: isConfigLoading } = useGetConfigQuery();

  const { isLoading: isGeneratingPdf, isError: generatePdfError, isSuccess: generatePdfSuccess, data: pdfBlob, refetch: refetchGeneratePdf } = useGeneratePdfQuery();

  const [anchorEl, setAnchorEl] = useState(null);
  const [filters, setFilters] = useState({}); // State to store filter values

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (column, value) => {
    setFilters({ ...filters, [column]: value });
  };

  const handleExport = async (format) => {
    
    
    console.log(`Exporting data in ${format} format`);

    if(format === 'pdf') {
      
      // refetchGeneratePdf({
      //   tableName: tableName, 
      //   filters,
      //   columns: data.columns, 
      // });
      try {
        const pdfResponse = await generatePdf(tableName, filters, data.columns);
        const blob = new Blob([pdfResponse.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'report.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        // Optionally trigger download or further handling of pdfBlob
      } catch (error) {
        console.error('Error generating PDF:', error);
        // Handle error state or display error message
      }
    }
    
  };

  if (isConfigLoading || isLoading) {
    return <div>Loading...</div>;
  }

  if (configError || error) {
    return <div>Error loading data</div>;
  }

  if (!config || !data) {
    return <div>No data available</div>;
  }

  const { columns, rows } = data;
  const { actions } = config;

  return (
    <Box>
      <Grid container spacing={2} justifyContent="space-between" marginBottom={3}>
        <Grid item>
          <ColumnSelector columns={columns} />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={handleMenuOpen}
            aria-controls="actions-menu"
            aria-haspopup="true"
          >
            Actions
          </Button>
          <Menu
            id="actions-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {actions.map((action) => (
              <MenuItem key={action.name}>{action.name}</MenuItem>
            ))}
          </Menu>
          <Button variant="contained" onClick={() => handleExport('pdf')}>
            Export to PDF
          </Button>
          <Button variant="contained" onClick={() => handleExport('excel')}>
            Export to Excel
          </Button>
          <Button variant="contained" onClick={() => handleExport('csv')}>
            Export to CSV
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col}>
                  <input
                    type="text"
                    placeholder={`Filter ${col}`}
                    value={filters[col] || ''}
                    onChange={(e) => handleFilterChange(col, e.target.value)}
                  />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody sx={{
            '& .MuiTableRow-root:nth-of-type(even)': {
              backgroundColor: '#f0f0f0', // Light gray background for even rows
            },
            '& .MuiTableRow-root:nth-of-type(odd)': {
              backgroundColor: '#ffffff', // White background for odd rows
            },
          }}>
            {rows.filter((row) =>
              columns.every((col) =>
                !filters[col] || row[col].toLowerCase().includes(filters[col].toLowerCase())
              )
            ).map((row, index) => (
              <TableRow key={index}>
                {columns.map((col) => (
                  <TableCell key={col}>{row[col]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ReportTable;
