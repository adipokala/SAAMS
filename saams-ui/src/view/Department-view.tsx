import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Refresh, Add, Delete, Update, FilePresent } from '@mui/icons-material';
import { Department, DepartmentResponse } from '../model/department';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField } from '@mui/material';
import { STRINGS } from '../constants';

let selectedRows: Department[] = [];

const handleOnGet = async () => {
  const resp = await window.electronAPI.getDepartments();

  return resp;
}

export default function DepartmentView() {
  const [rows, setRows] = React.useState<Department[]>([]);
  const [initialLoad, setInitialLoad] = React.useState<boolean>(true);
  const [addModal, setAddModal] = React.useState<boolean>(false);
  const [updateModal, setUpdateModal] = React.useState<boolean>(false);
  const [messageModal, setMessageModal] = React.useState<boolean>(false);
  const [messageTitle, setMessageTitle] = React.useState<string>("");
  const [messageContent, setMessageContent] = React.useState<string>("");


  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'code', headerName: 'Code', width: 110},
  ];

  const handleRefreshButtonClick = async () =>  {
    const response = await handleOnGet();
    if (!response.status) {
      setMessageTitle("Error");
      setMessageContent("Error fetching data");
      setMessageModal(true);
    }
    setRows(response.departments);
  }

  const handleAddButtonClick = () => {
    setAddModal(true);
  }

  const handleUpdateButtonClick = () => {
    if (selectedRows.length > 1) {
      setMessageTitle("Update Department");
      setMessageContent("Select only one item to edit.");
      setMessageModal(true);
    } else if (selectedRows.length == 0) {
      setMessageTitle("Update Department");
      setMessageContent("Select an item to edit.");
      setMessageModal(true);
    } else {
      setUpdateModal(true);
    }
  }

  const handleDeleteButtonClick = async () => {
    if (selectedRows.length == 0) {
      setMessageTitle("Delete Department");
      setMessageContent("Select an item to delete.");
      setMessageModal(true);
    } else {
      selectedRows.forEach(async (element) => {
        const resp = await window.electronAPI.deleteDepartment(element.id);
        if (!resp) {
          setMessageTitle("Delete Department");
          setMessageContent(`Failed to delete item with ID ${element.id}`);
          setMessageModal(true);
        }
      });
      handleRefreshButtonClick();
    }    
  }

  const handleClose = () => {
    setAddModal(false);
    setUpdateModal(false);
    setMessageModal(false);
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
        onRowSelectionModelChange={(ids) => {
          const selectedIds = new Set(ids);
          selectedRows = rows.filter((row) => selectedIds.has(row.id));
        }}
      />

      <Dialog 
        open={addModal}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            let department: Department = {
              name: formJson.name,
              code: formJson.code
            };
            const resp = await window.electronAPI.createDepartment(department);
            if (resp) {
              setMessageTitle("Success");
              setMessageContent(resp.message);
              setMessageModal(true);
              handleRefreshButtonClick();
            } else {
              setMessageTitle("Error");
              setMessageContent(resp.message);
              setMessageModal(true);
            }
            handleClose();
          }
        }}
      >
        <DialogTitle> Add Department </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill in Department name and code.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Department Name"
            type="text"
            fullWidth
            variant="standard"
            />
          <TextField
            required
            margin="dense"
            id="code"
            name="code"
            label="Department Code"
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
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            let department: Department = {
              id: selectedRows[0].id,
              name: formJson.name,
              code: formJson.code,
            };            
            const resp = await window.electronAPI.updateDepartment(department);
            if(resp) {
              setMessageTitle("Success");
              setMessageContent(resp.message);
              setMessageModal(true);
              handleRefreshButtonClick();
            } else {
              setMessageTitle("Error");
              setMessageContent("resp.message");
              setMessageModal(true);
            }
            handleClose();
          },
        }}
      >
        <DialogTitle> Update department </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill in department name and code
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Department name"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={selectedRows[0] === undefined ? "" : selectedRows[0].name}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="code"
            name="code"
            label="Department code"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={selectedRows[0] === undefined ? "" : selectedRows[0].code}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{ STRINGS.cancel }</Button>
          <Button type="submit">{ STRINGS.update }</Button>
        </DialogActions>
      </Dialog>

      {/* Message Dialog */}
      <Dialog
        open={messageModal}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          { messageTitle }
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            { messageContent }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{ STRINGS.ok }</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}