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
import { Refresh, Add, Delete, Update, Error, Warning } from '@mui/icons-material';
import { Role, RoleResponse } from '../model/role';
import { STRINGS } from '../constants';

let selectedRows: Role[] = [];

const handleOnGet = async () => {
  const resp = await window.electronAPI.getRoles();

  return resp;
}

export default function RoleView() {
  const [rows, setRows] = React.useState<Role[]>([]);
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
    setRows(response.roles);
  }

  const handleAddButtonClick = () => {
    setAddModal(true);
  }

  const handleUpdateButtonClick = () => {
    if (selectedRows.length > 1) {
      setMessageTitle("Update Role");
      setMessageContent("Select only one item to edit.");
      setMessageModal(true);
    } else if (selectedRows.length == 0) {
      setMessageTitle("Update Role");
      setMessageContent("Select an item to edit.");
      setMessageModal(true);
    } else {
      setUpdateModal(true);
    }
  }

  const handleDeleteButtonClick = async () => {
    if (selectedRows.length == 0) {
      setMessageTitle("Delete Role");
      setMessageContent("Select an item to delete.");
      setMessageModal(true);
    } else {
      selectedRows.forEach(async (element) => {
        const resp = await window.electronAPI.deleteRole(element.id);
        if (!resp) {
          setMessageTitle("Delete Role");
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
          console.log(selectedRows);
        }}
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
            if (/\s/.test(formJson.code)) {
              setMessageTitle("Error");
              setMessageContent("Code should not contain spaces");
              setMessageModal(true);
              return;//added
            }
            let role: Role = {
              name: formJson.name,
              code: formJson.code,
            };
            const resp = await window.electronAPI.createRole(role);
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
          },
        }}
      >
        <DialogTitle>Add Role</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill in role name and code.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Role Name"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
            id="code"
            inputProps={{
              maxLength: 4,
              minLength: 2,
            }}
            name="code"
            label="Role Code"
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
            if (/\s/.test(formJson.code)) {
              setMessageTitle("Error");
              setMessageContent("Code should not contain spaces");
              setMessageModal(true);
              return;//added
            }
            let role: Role = {
              id: selectedRows[0].id,
              name: formJson.name,
              code: formJson.code,
            };
            const resp = await window.electronAPI.updateRole(role);
            if(resp) {
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
          },
        }}
      >
        <DialogTitle>Update Role</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update role name or code.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Role Name"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={selectedRows[0] === undefined ? "" : selectedRows[0].name}
          />
          <TextField
            required
            margin="dense"
            id="code"
            inputProps={{
              maxLength: 4,
              minLength: 2,
            }}
            name="code"
            label="Role Code"
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