import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Refresh, Add, Delete, Update } from '@mui/icons-material';
import { Designation, DesignationResponse } from '../model/designation';

const handleOnGet = async () => {
  const id = await window.electronAPI.getDesignations();
  console.log(id);

  return id;
}

export default function DesignationView() {
  const [rows, setRows] = React.useState<Designation[]>([]);
  const [initialLoad, setInitialLoad] = React.useState<boolean>(true);

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'code', headerName: 'Code', width: 110},
  ];

  const handleRefreshButtonClick = async () =>  {
    const response = await handleOnGet();
    console.log(response);
    const input = response.designations;
    const updatedRows = [
      ...rows,
      ...input.filter(
        (newEntry) => !rows.some((existingEntry) => existingEntry.id === newEntry.id)
      ),
    ];

    setRows(updatedRows);
  }

  const handleAddButtonClick = async () => {

  }

  const handleUpdateButtonClick = async () => {
    
  }

  const handleDeleteButtonClick = async () => {
    
  }

  React.useEffect(() => {
    if (initialLoad) {
      handleRefreshButtonClick();
      setInitialLoad(false);
    }
  });

  return (
    <Stack spacing={2} direction="column">
      <Stack spacing={2} direction="row">
        <Button variant="contained" onClick={handleRefreshButtonClick}>Refresh <Refresh /></Button>
        <Button variant="contained" onClick={handleAddButtonClick}>Add <Add /></Button>
        <Button variant="contained" onClick={handleUpdateButtonClick}>Modify <Update /></Button>
        <Button variant="contained" onClick={handleDeleteButtonClick}>Delete <Delete /></Button>
      </Stack>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Stack>
  );
}