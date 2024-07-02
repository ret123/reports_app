import React from "react";
import { useSendLogoutMutation } from "../../services/auth/authApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentRefreshToken } from "../../services/auth/authSlice";
import { useNavigate } from "react-router-dom";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { useGetConfigQuery, useGetTablesQuery } from "../../services/reports/reportApiSlice";
import TableDetails from "../../components/TableDetails";

const Home = () => {
  const [
    sendLogout,
    { isLoading: isLogoutLoading, isError: isLogoutError, error: logoutError },
  ] = useSendLogoutMutation();
  const refreshToken = useSelector(selectCurrentRefreshToken);
  const navigate = useNavigate();

  const [selectedTable, setSelectedTable] = useState(null);

  const { data: config, error: configError, isLoading: isConfigLoading } = useGetConfigQuery();
  const { data: tables, error: tablesError, isLoading: isTablesLoading } = useGetTablesQuery();

  const handleLogout = async () => {
    try {
      await sendLogout(refreshToken);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  if (isConfigLoading || isTablesLoading) {
    return <div>Loading...</div>;
  }

  if (configError || tablesError) {
    return <div>Error loading data</div>;
  }

  if (!config || !tables) {
    return <div>No data available</div>;
  }

  const { columns, filters, actions } = config;

  return (
    <>
      <div className="container">
        <div className="d-flex justify-content-between mt-2">
          <h1>Report Generator</h1>
          <DropdownButton id="dropdown-basic-button" title="Actions">
            {actions.map((action) => (
              <Dropdown.Item key={action.name}>{action.name}</Dropdown.Item>
            ))}
          </DropdownButton>
          <div>
            <button
              onClick={handleLogout}
              className="btn btn-sm btn-dark"
              disabled={isLogoutLoading}
            >
              {isLogoutLoading ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
        <div className="mt-4">
          <h2>Available Tables</h2>
          <DropdownButton
            id="table-dropdown"
            title={selectedTable || "Select a Table"}
            onSelect={(e) => setSelectedTable(e)}
          >
            {tables.map((table) => (
              <Dropdown.Item key={table} eventKey={table}>
                {table}
              </Dropdown.Item>
            ))}
          </DropdownButton>
          {selectedTable && (
            <div>
              <h3>{selectedTable} Details</h3>
              {/* Render table details component */}
              <TableDetails tableName={selectedTable} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
