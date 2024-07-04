import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import ColumnSelector from "./ColumnSelector";
import { generateExcel, generatePdf } from '../services/reports/ReportApiService';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const ReportTable = ({ tableName, tableData }) => {
  const { columns, rows } = tableData;

  const [selectedColumns, setSelectedColumns] = useState(columns);
  const [chartType, setChartType] = useState('line');
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    setSelectedColumns(columns); // Initially show all columns
  }, [columns]);

  const handleExport = async (format) => {
    // Implementation for exporting to PDF and Excel
  };

  const handleChartGeneration = () => {
    const labels = rows.map((row, index) => `Row ${index + 1}`);
    const datasets = selectedColumns.map((col) => ({
      label: col,
      data: rows.map((row) => row[col]),
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

  const dataGridColumns = columns.map((col) => ({
    field: col,
    headerName: col,
    flex: 1,
    hide: !selectedColumns.includes(col),
  }));

  return (
    <Box>
      <Grid container spacing={2} justifyContent="space-between" marginBottom={3}>
        <Grid item>
          <ColumnSelector
            columns={columns}
            selectedColumns={selectedColumns}
            setSelectedColumns={setSelectedColumns}
          />
        </Grid>
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
          columns={dataGridColumns}
          rows={rows}
          checkboxSelection
        />
      </Box>
      {chartData && chartComponents[chartType](chartData)}
    </Box>
  );
};

export default ReportTable;
