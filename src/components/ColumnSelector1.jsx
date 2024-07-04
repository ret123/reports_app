import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from '@mui/material';

const ColumnSelector = ({ columns, selectedColumns, setSelectedColumns }) => {
  const handleChange = (event) => {
    setSelectedColumns(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel>Select Columns</InputLabel>
      <Select
        multiple
        value={selectedColumns}
        onChange={handleChange}
        renderValue={(selected) => selected.join(', ')}
      >
        {columns.map((col) => (
          <MenuItem key={col} value={col}>
            <Checkbox checked={selectedColumns.indexOf(col) > -1} />
            <ListItemText primary={col} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ColumnSelector;
