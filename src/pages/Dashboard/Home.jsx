import React, { useState } from "react";
import { useSendLogoutMutation } from "../../services/auth/authApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentRefreshToken } from "../../services/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useGetTablesQuery } from "../../services/reports/reportApiSlice";
import ReportTable from "../../components/ReportTable";
import {
  Container,
  Button,
  Typography,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

const Home = () => {
  const [selectedTable, setSelectedTable] = useState("");

  const [
    sendLogout,
    { isLoading: isLogoutLoading, isError: isLogoutError, error: logoutError },
  ] = useSendLogoutMutation();
  const refreshToken = useSelector(selectCurrentRefreshToken);
  const navigate = useNavigate();

  const { data: tables, error: tablesError, isLoading: isTablesLoading } = useGetTablesQuery();

  const handleLogout = async () => {
    try {
      await sendLogout(refreshToken);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  if (isTablesLoading) {
    return <div>Loading...</div>;
  }

  if (tablesError) {
    return <div>Error loading data</div>;
  }

  if (!tables) {
    return <div>No data available</div>;
  }

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Typography variant="h4">Report Generator</Typography>
        <Button
          onClick={handleLogout}
          variant="contained"
          color="primary"
          disabled={isLogoutLoading}
        >
          {isLogoutLoading ? "Logging out..." : "Logout"}
        </Button>
      </Box>
      <Box mt={4}>
        <Typography variant="h5">Available Tables</Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel id="table-select-label">Select a Table</InputLabel>
          <Select
            labelId="table-select-label"
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
          >
            {tables.map((table) => (
              <MenuItem key={table} value={table}>
                {table}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {selectedTable && (
          <Box mt={5}>
            <Typography variant="h6">{selectedTable} Details</Typography>
            <ReportTable tableName={selectedTable} />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Home;
