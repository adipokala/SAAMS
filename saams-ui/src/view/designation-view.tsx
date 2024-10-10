import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Refresh, Add, Delete, Update } from '@mui/icons-material';
import { Designation, DesignationResponse } from '../model/designation';
import { STRINGS } from '../constants';

const handleOnGet = async () => {
  const id = await window.electronAPI.getDesignations();
  console.log(id);

  return id;
}

export default function DesignationView() {
  const [rows, setRows] = React.useState<Designation[]>([]);
  const [initialLoad, setInitialLoad] = React.useState<boolean>(true);
  const [addModal, setAddModal] = React.useState<boolean>(false);
  const [updateModal, setUpdateModal] = React.useState<boolean>(false);

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

  const handleAddButtonClick = () => {
    setAddModal(true);
  }

  const handleUpdateButtonClick = async () => {
    setUpdateModal(true);
  }

  const handleDeleteButtonClick = async () => {
    
  }

  const handleClose = () => {
    setAddModal(false);
    setUpdateModal(false);
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

      {/* Add Modal */}
      <Dialog
        open={addModal}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            let designation: Designation;
            designation.name = formJson.name;
            designation.code = formJson.code;
            const resp = await window.electronAPI.createDesignation(designation);
            if (resp) {
              handleRefreshButtonClick();
            }
            handleClose();
          },
        }}
      >
        <DialogTitle>Add Designation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill in designation name and code.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Designation Name"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
            id="code"
            name="code"
            label="Designation Code"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{ STRINGS.cancel }</Button>
          <Button type="submit">{ STRINGS.add }</Button>
        </DialogActions>
      </Dialog>

      {/* Update Modal */}
      <Dialog
        open={updateModal}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle>Update Designation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update designation name or code.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Designation Name"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
            id="code"
            name="code"
            label="Designation Code"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{ STRINGS.cancel }</Button>
          <Button type="submit">{ STRINGS.update }</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}