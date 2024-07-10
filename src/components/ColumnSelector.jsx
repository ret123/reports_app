import React, { useState, useEffect } from 'react';
import { ListGroup, ListGroupItem, Row, Col } from 'react-bootstrap';
import IconButton from '@mui/material/IconButton';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardDoubleArrowRightRounded from '@mui/icons-material/KeyboardDoubleArrowRightRounded';
import KeyboardDoubleArrowLeftRounded from '@mui/icons-material/KeyboardDoubleArrowLeftRounded';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const ColumnSelector = ({ columns, onColumnSelectionChange }) => {
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Reset selected columns when columns prop changes
    setSelectedColumns([]);
  }, [columns]);

  const handleShow = () => setShow(true);
  const handleClose = () => {
    onColumnSelectionChange(selectedColumns);
    setShow(false);
  };

  const handleSelectColumn = (column) => {
    setSelectedColumns([...selectedColumns, column]);
  };

  const handleDeselectColumn = (column) => {
    setSelectedColumns(selectedColumns.filter((c) => c !== column));
  };

  const handleSelectAll = () => {
    setSelectedColumns(columns);
  };

  const handleDeselectAll = () => {
    setSelectedColumns([]);
  };

  const handleMoveColumnUp = (index) => {
    if (index === 0) return;
    const newSelectedColumns = [...selectedColumns];
    [newSelectedColumns[index - 1], newSelectedColumns[index]] = [
      newSelectedColumns[index],
      newSelectedColumns[index - 1],
    ];
    setSelectedColumns(newSelectedColumns);
  };

  const handleMoveColumnDown = (index) => {
    if (index === selectedColumns.length - 1) return;
    const newSelectedColumns = [...selectedColumns];
    [newSelectedColumns[index + 1], newSelectedColumns[index]] = [
      newSelectedColumns[index],
      newSelectedColumns[index + 1],
    ];
    setSelectedColumns(newSelectedColumns);
  };

  const availableColumns = columns.filter((col) => !selectedColumns.includes(col));
  console.log(selectedColumns);
  return (
    <>
      <Button variant="contained" color="primary" onClick={handleShow}>
        Select Columns
      </Button>

      <Dialog open={show} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Select Columns</DialogTitle>
        <DialogContent>
          <Row>
            <Col>
              <h5>Available Columns</h5>
              <ListGroup>
                {availableColumns.map((col) => (
                  <ListGroupItem key={col} onClick={() => handleSelectColumn(col)}>
                    {col}
                  </ListGroupItem>
                ))}
              </ListGroup>
            </Col>
            <Col className="d-flex flex-column justify-content-center align-items-center">
              <ButtonGroup orientation="vertical">
                <IconButton onClick={handleSelectAll} disabled={!availableColumns.length}>
                  <KeyboardDoubleArrowRightRounded fontSize="large" />
                </IconButton>
                <IconButton
                  onClick={() => availableColumns.length && handleSelectColumn(availableColumns[0])}
                  disabled={!availableColumns.length}
                >
                  <ArrowForwardIcon fontSize="large" />
                </IconButton>
                <IconButton
                  onClick={() => selectedColumns.length && handleDeselectColumn(selectedColumns[0])}
                  disabled={!selectedColumns.length}
                >
                  <ArrowBackIcon fontSize="large" />
                </IconButton>
                <IconButton onClick={handleDeselectAll} disabled={!selectedColumns.length}>
                  <KeyboardDoubleArrowLeftRounded fontSize="large" />
                </IconButton>
              </ButtonGroup>
            </Col>
            <Col>
              <h5>Selected Columns</h5>
              <ListGroup>
                {selectedColumns.map((col, index) => (
                  <ListGroupItem key={col} onClick={() => handleDeselectColumn(col)}>
                    <div className="d-flex justify-content-between align-items-center">
                      {col}
                      <div>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveColumnUp(index);
                          }}
                          disabled={index === 0}
                        >
                          <ArrowUpwardIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveColumnDown(index);
                          }}
                          disabled={index === selectedColumns.length - 1}
                        >
                          <ArrowDownwardIcon fontSize="small" />
                        </IconButton>
                      </div>
                    </div>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </Col>
          </Row>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ColumnSelector;
