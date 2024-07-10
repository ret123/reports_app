// components/DynamicChart.js
import React, { useState, useRef } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Box, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const DynamicChart = ({ data, xAxisKey, yAxisKey }) => {
  const [chartType, setChartType] = useState('Bar');
  const chartRef = useRef(null);

  const exportAsImage = async () => {
    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'chart.png';
    link.click();
  };

  const exportAsPDF = async () => {
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 0, 0);
    pdf.save('chart.pdf');
  };

  const renderChart = () => {
    switch (chartType) {
      case 'Bar':
        return (
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yAxisKey} fill="#8884d8" />
          </BarChart>
        );
      case 'Line':
        return (
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={yAxisKey} stroke="#8884d8" />
          </LineChart>
        );
      case 'Pie':
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey={yAxisKey}
              nameKey={xAxisKey}
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label
            >
              {
                data.map((entry, index) => <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#8884d8" : "#82ca9d"} />)
              }
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Grid container spacing={2} marginBottom={2}>
        <Grid item>
          <FormControl variant="outlined">
            <InputLabel>Chart Type</InputLabel>
            <Select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              label="Chart Type"
            >
              <MenuItem value="Bar">Bar Chart</MenuItem>
              <MenuItem value="Line">Line Chart</MenuItem>
              <MenuItem value="Pie">Pie Chart</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={exportAsImage}>Export as Image</Button>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={exportAsPDF}>Export as PDF</Button>
        </Grid>
      </Grid>
      <Box ref={chartRef} sx={{ height: 400, width: '100%' }}>
        <ResponsiveContainer>
          {renderChart()}
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default DynamicChart;
