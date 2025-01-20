import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Refresh, Add, Delete, Update } from '@mui/icons-material';
import { Area, AreaResponse } from '../model/area';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField } from '@mui/material';
import { STRINGS } from '../constants';

let selectedRows: Area[] = [];

const handleOnGet = async () => {
  const resp = await window.electronAPI.getAreas();
  return resp;
}

export default function AreaView() {
  const [rows, setRows] = React.useState<Area[]>([]);
  const [initialLoad, setInitialLoad] = React.useState<boolean>(true);
  const [addModal, setAddModal] = React.useState<boolean>(false);
  const [updateModal, setUpdateModal] = React.useState<boolean>(false);
  const [messageModal, setMessageModal] = React.useState<boolean>(false);
  const [messageTitle, setMessageTitle] = React.useState<string>("");
  const [messageContent, setMessageContent] = React.useState<string>("");
  const [newArea, setNewArea] = React.useState<Area>({ id: 0, name: '', code: '' });

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'code', headerName: 'Code', width: 110 },
  ];

  const handleRefreshButtonClick = async () => {
    const response = await handleOnGet();
    if (!response.status) {
      setMessageTitle("Error");
      setMessageContent("Error fetching data");
      setMessageModal(true);
    } else {
      setRows(response.areas);
    }
  }

  const handleAddButtonClick = () => {
    setAddModal(true);
  }

  const handleAddArea = async () => {
    try {
      const addedArea = await window.electronAPI.createArea(newArea);
      setAddModal(false);
      setNewArea({ id: 0, name: '', code: '' });
    } catch (error) {
      setMessageTitle("Error");
      setMessageContent("Error adding area");
      setMessageModal(true);
    }
  }

  React.useEffect(() => {
    if (initialLoad) {
      handleRefreshButtonClick();
      setInitialLoad(false);
    }
  }, [initialLoad]);

  return (
    <div>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" startIcon={<Refresh />} onClick={handleRefreshButtonClick}>
          Refresh
        </Button>
        <Button variant="contained" startIcon={<Add />} onClick={handleAddButtonClick}>
          Add
        </Button>
        <Button variant="contained" startIcon={<Update />}>
          Update
        </Button>
        <Button variant="contained" startIcon={<Delete />}>
          Delete
        </Button>
      </Stack>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} checkboxSelection />
      </div>
      <Dialog open={addModal} onClose={() => setAddModal(false)}>
        <DialogTitle>{STRINGS.add}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {STRINGS.ADD_AREA_DESCRIPTION}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={newArea.name}
            onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Code"
            fullWidth
            value={newArea.code}
            onChange={(e) => setNewArea({ ...newArea, code: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddArea} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={messageModal} onClose={() => setMessageModal(false)}>
        <DialogTitle>{messageTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {messageContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMessageModal(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}