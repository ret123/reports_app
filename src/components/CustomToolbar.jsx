import React, { useState } from 'react';
import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';

const CustomToolbar = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');

  const handleSearchInputChange = (event) => {
    const newValue = event.target.value;
    setSearchText(newValue);
    if (onSearch) {
      onSearch(newValue);
    }
  };

  return (
    <GridToolbarContainer>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <SearchIcon />
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={handleSearchInputChange}
          style={{ marginLeft: 8 }}
        />
      </div>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
    </GridToolbarContainer>
  );
};

export default CustomToolbar;
