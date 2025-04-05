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
import { Designation, DesignationResponse } from '../model/designation';
import { STRINGS } from '../constants';

let selectedRows: Designation[] = [];

const handleOnGet = async () => {
  const resp = await window.electronAPI.getDesignations();

  return resp;
}

export default function DesignationView() {
  const [rows, setRows] = React.useState<Designation[]>([]);
  const [initialLoad, setInitialLoad] = React.useState<boolean>(true);
  const [addModal, setAddModal] = React.useState<boolean>(false);
  const [updateModal, setUpdateModal] = React.useState<boolean>(false);
  const [messageModal, setMessageModal] = React.useState<boolean>(false);
  const [messageTitle, setMessageTitle] = React.useState<string>("");
  const [messageContent, setMessageContent] = React.useState<string>("");

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'code', headerName: 'Code', width: 110 },
  ];

  const showErrorMessage = (title: string, message: string) => {
    setMessageTitle(title);
    setMessageContent(message);
    setMessageModal(true);
  };

const handleRefreshButtonClick = async () => {
    try {
      const response = await window.electronAPI.getDesignations();
      setRows(response.designations);
    } catch (error) {
      showErrorMessage("Error", "Backend is not responding. Please try again later.");
    }
  };

  const handleAddButtonClick = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const formJson = Object.fromEntries((formData as any).entries());

      if (/\s/.test(formJson.code)) {
        showErrorMessage("Error", "Code should not contain spaces.");
        return;
      }

      let designation: Designation = {
        name: formJson.name,
        code: formJson.code,
      };

      const resp = await window.electronAPI.createDesignation(designation);
      if (resp) {
        showErrorMessage("Success", resp.message);
        handleRefreshButtonClick();
      } else {
        showErrorMessage("Error", resp.message);
      }
    } catch (error) {
      showErrorMessage("Error", "Backend is not responding. Please try again later.");
    }
    setAddModal(false);
  };

  const handleUpdateButtonClick = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (selectedRows.length !== 1) {
        showErrorMessage("Update Designation", "Select only one item to edit.");
        return;
      }

      const formData = new FormData(event.currentTarget);
      const formJson = Object.fromEntries((formData as any).entries());

      let designation: Designation = {
        id: selectedRows[0].id,
        name: formJson.name,
        code: formJson.code,
      };

      const resp = await window.electronAPI.updateDesignation(designation);
      if (resp) {
        showErrorMessage("Success", resp.message);
        handleRefreshButtonClick();
      } else {
        showErrorMessage("Error", resp.message);
      }
    } catch (error) {
      showErrorMessage("Error", "Backend is not responding. Please try again later.");
    }
    setUpdateModal(false);
  };


  const handleDeleteButtonClick = async () => {
    if (selectedRows.length == 0) {
      setMessageTitle("Delete Designation");
      setMessageContent("Select an item to delete.");
      setMessageModal(true);
    } else {
      selectedRows.forEach(async (element) => {
        const resp = await window.electronAPI.deleteDesignation(element.id);
        if (!resp) {
          setMessageTitle("Delete Designation");
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
            let designation: Designation = {
              name: formJson.name,
              code: formJson.code,
            };
            const resp = await window.electronAPI.createDesignation(designation);
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
            inputProps={{
              maxLength: 4,
              minLength: 2,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{STRINGS.cancel}</Button>
          <Button type="submit">{STRINGS.add}</Button>
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
            let designation: Designation = {
              id: selectedRows[0].id,
              name: formJson.name,
              code: formJson.code,
            };
            const resp = await window.electronAPI.updateDesignation(designation);
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
            defaultValue={selectedRows[0] === undefined ? "" : selectedRows[0].name}
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
            defaultValue={selectedRows[0] === undefined ? "" : selectedRows[0].code}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{STRINGS.cancel}</Button>
          <Button type="submit">{STRINGS.update}</Button>
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
          {messageTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {messageContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{STRINGS.ok}</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}