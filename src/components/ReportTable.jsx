import React, { useState, useEffect } from 'react';
import { useGetTableDetailsQuery } from '../services/reports/reportApiSlice';
import { Box, Button, Grid,FormControl,InputLabel,Select ,MenuItem  } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { generateExcel, generatePdf } from '../services/reports/ReportApiService';
import ChartComponent from './Chartcomponent';

const ReportTable = ({ tableName }) => {
  const { data, error, isLoading } = useGetTableDetailsQuery(tableName);
  const [filters, setFilters] = useState([]);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});

  const [selectedColumns, setSelectedColumns] = useState(null);
  const [chartType, setChartType] = useState('line');
  const [chartData, setChartData] = useState(null);


  useEffect(() => {
    if (data && data.columns) {
      const initialVisibility = data.columns.reduce((model, col) => {
        model[col] = true; // Initially, all columns are visible
        return model;
      }, {});
      setColumnVisibilityModel(initialVisibility);
    }
  }, [data]);

  const handleExport = async (format) => {
    const visibleColumns = Object.keys(columnVisibilityModel).filter(col => columnVisibilityModel[col]);
    const filteredRows = data.rows.map(row => {
      const filteredRow = {};
      visibleColumns.forEach(col => {
        filteredRow[col] = row[col];
      });
      return filteredRow;
    });

    if (format === 'pdf') {
      console.log(visibleColumns)
      try {
        const pdfResponse = await generatePdf(tableName, filters, visibleColumns, filteredRows);
        const blob = new Blob([pdfResponse.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'report.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    } else if (format === 'excel') {
      try {
        const response = await generateExcel(tableName, filters, visibleColumns, filteredRows);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'report.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error exporting to Excel:', error);
      }
    } else if (format === 'csv') {
      const csvContent = [
        visibleColumns.join(','), // Add header row
        ...filteredRows.map(row => visibleColumns.map(col => row[col]).join(',')), // Add data rows
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'report.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const handleChartGeneration = () => {
    const labels = data.rows.map((row, index) => `Row ${index + 1}`);
    const datasets = selectedColumns.map((col) => ({
      label: col,
      data: data.rows.map((row) => row[col]),
    }));

    setChartData({
      labels,
      datasets,
    });
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Chart',
      },
    },
  };
  const chartComponents = {
    line: (data) => <Line data={data} options={chartOptions} />,
    bar: (data) => <Bar data={data} options={chartOptions} />,
    pie: (data) => <Pie data={data} options={chartOptions} />,
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
  if (!data) return <div>No data available</div>;

  const columns = data.columns.map(col => ({
    field: col,
    headerName: col,
    flex: 1,
  }));

  return (
    <Box>
      <Grid container spacing={2} justifyContent="space-between" marginBottom={3}>
        <Grid item>
          <Button variant="contained" color="secondary" onClick={() => handleExport('pdf')}>
            Export to PDF
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="success" onClick={() => handleExport('excel')}>
            Export to Excel
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="warning" onClick={() => handleExport('csv')}>
            Export to CSV
          </Button>
        </Grid>
        <Grid item>
          <FormControl fullWidth>
            <InputLabel>Select Chart Type</InputLabel>
            <Select value={chartType} onChange={(e) => setChartType(e.target.value)}>
              <MenuItem value="line">Line</MenuItem>
              <MenuItem value="bar">Bar</MenuItem>
              <MenuItem value="pie">Pie</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleChartGeneration}>
            Generate Chart
          </Button>
        </Grid>
      </Grid>
      
      <Box style={{ height: 600, width: '100%' }}>
        <DataGrid
          columns={columns}
          rows={data.rows}
          components={{ Toolbar: GridToolbar }}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
          filterModel={{
            items: filters,
          }}
          onFilterModelChange={(model) => setFilters(model.items)}
        />
      </Box>
    </Box>
  );
};

export default ReportTable;
