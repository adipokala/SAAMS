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
import { Shift, ShiftResponse, ShiftType } from '../model/shift';
import { STRINGS } from '../constants';
import { InputLabel, MenuItem, Select } from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs, { Dayjs } from 'dayjs';

let selectedRows: Shift[] = [];

const handleOnGet = async () => {
  const resp = await window.electronAPI.getShifts();

  return resp;
}

export default function ShiftView() {
  const [rows, setRows] = React.useState<Shift[]>([]);
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
    { field: 'type', headerName: 'Type', width: 110 },
    { field: 'entryTime', headerName: 'Entry Time', width: 110 },
    { field: 'graceEntryTime', headerName: 'Entry Grace Time', width: 110 },
    { field: 'exitLunch', headerName: 'Exit Lunch', width: 110 },
    { field: 'entryLunch', headerName: 'Entry Lunch', width: 110 },
    { field: 'exitTime', headerName: 'Exit Time', width: 110 },
    { field: 'graceExitTime', headerName: 'Exit Grace Time', width: 110 },
    { field: 'overTimeAllowance', headerName: 'Overtime Allowance', width: 110 },
  ];

  const getDateDayjs = (hour: string, minute: string): Dayjs => {
    const value = dayjs().hour(Number(hour)).minute(Number(minute));

    return value;
  }

  const handleRefreshButtonClick = async () => {
    const response = await handleOnGet();
    if (!response.status) {
      setMessageTitle("Error");
      setMessageContent("Error fetching data");
      setMessageModal(true);
    }
    setRows(response.shifts);
  }

  const handleAddButtonClick = () => {
    setAddModal(true);
  }

  const handleUpdateButtonClick = () => {
    if (selectedRows.length > 1) {
      setMessageTitle("Update Shift");
      setMessageContent("Select only one item to edit.");
      setMessageModal(true);
    } else if (selectedRows.length == 0) {
      setMessageTitle("Update Shift");
      setMessageContent("Select an item to edit.");
      setMessageModal(true);
    } else {
      setUpdateModal(true);
    }
  }

  const handleDeleteButtonClick = async () => {
    if (selectedRows.length == 0) {
      setMessageTitle("Delete Shift");
      setMessageContent("Select an item to delete.");
      setMessageModal(true);
    } else {
      selectedRows.forEach(async (element) => {
        const resp = await window.electronAPI.deleteShift(element.id);
        if (!resp) {
          setMessageTitle("Delete Shift");
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
        <Button variant="contained" onClick={handleRefreshButtonClick}>{STRINGS.refresh} <Refresh /></Button>
        <Button variant="contained" onClick={handleAddButtonClick}>{STRINGS.add} <Add /></Button>
        <Button variant="contained" onClick={handleUpdateButtonClick}>{STRINGS.modify} <Update /></Button>
        <Button variant="contained" onClick={handleDeleteButtonClick}>{STRINGS.delete} <Delete /></Button>
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
              return;
            }
            let shift: Shift = {
              name: formJson.name,
              code: formJson.code,
              type: formJson.type,
              entryTime: "0." + formJson.entryTime + ":00",
              graceEntryTime: "0." + formJson.entryGrace + ":00",
              exitLunch: "0." + formJson.exitLunch + ":00",
              entryLunch: "0." + formJson.entryLunch + ":00",
              exitTime: "0." + formJson.exitTime + ":00",
              graceExitTime: "0." + formJson.exitGrace + ":00",
              overTimeAllowance: "0." + formJson.overTimeAllowance + ":00"
            };

            const resp = await window.electronAPI.createShift(shift);
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
          },
        }}
      >
        <DialogTitle>Add Shift</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill in shift name and code.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Shift Name"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
            id="code"
            name="code"
            label="Shift Code"
            type="text"
            fullWidth
            variant="standard"
            inputProps={{
              maxLength: 4,
              minLength: 2,
            }}
          />
          <InputLabel id="shiftTypeLabel">Shift Type</InputLabel>
          <Select
            labelId="shiftTypeLabel"
            id="type"
            name="type"
            fullWidth
          >
            <MenuItem value={ShiftType.rotational}>{ShiftType.rotational}</MenuItem>
            <MenuItem value={ShiftType.nonrotational}>{ShiftType.nonrotational.replace("_", " ")}</MenuItem>
          </Select>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Entry Time"
              name="entryTime"
              ampm={false}
              sx={{
                margin: 1
              }}
            />
            <TimePicker
              label="Entry Grace Time"
              name="entryGrace"
              ampm={false}
              sx={{
                margin: 1
              }}
            />
            <TimePicker
              label="Exit Lunch"
              name="exitLunch"
              ampm={false}
              sx={{
                margin: 1
              }}
            />
            <TimePicker
              label="Entry Lunch"
              name="entryLunch"
              ampm={false}
              sx={{
                margin: 1
              }}
            />
            <TimePicker
              label="Exit Time"
              name="exitTime"
              ampm={false}
              sx={{
                margin: 1
              }}
            />
            <TimePicker
              label="Exit Grace Time"
              name="exitGrace"
              ampm={false}
              sx={{
                margin: 1
              }}
            />
            <TimePicker
              label="Overtime Allowance"
              name="overTimeAllowance"
              ampm={false}
              sx={{
                margin: 1
              }}
            />
          </LocalizationProvider>
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
            if (/\s/.test(formJson.code)) {
              setMessageTitle("Error");
              setMessageContent("Code should not contain spaces");
              setMessageModal(true);
              return;
            }
            let shift: Shift = {
              id: selectedRows[0].id,
              name: formJson.name,
              code: formJson.code,
              type: formJson.type,
              entryTime: "0." + formJson.entryTime + ":00",
              graceEntryTime: "0." + formJson.entryGrace + ":00",
              exitLunch: "0." + formJson.exitLunch + ":00",
              entryLunch: "0." + formJson.entryLunch + ":00",
              exitTime: "0." + formJson.exitTime + ":00",
              graceExitTime: "0." + formJson.exitGrace + ":00",
              overTimeAllowance: "0." + formJson.overTimeAllowance + ":00"
            };
            const resp = await window.electronAPI.updateShift(shift);
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
          },
        }}
      >
        <DialogTitle>Update Shift</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update shift name or code.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Shift Name"
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
            label="Shift Code"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={selectedRows[0] === undefined ? "" : selectedRows[0].code}
            inputProps={{
              maxLength: 4,
              minLength: 2,
            }}
          />
          <InputLabel id="shiftTypeLabel">Shift Type</InputLabel>
          <Select
            labelId="shiftTypeLabel"
            id="type"
            name="type"
            defaultValue={selectedRows[0] === undefined ? "" : selectedRows[0].type}
            fullWidth
          >
            <MenuItem value={ShiftType.rotational}>{ShiftType.rotational}</MenuItem>
            <MenuItem value={ShiftType.nonrotational}>{ShiftType.nonrotational.replace("_", " ")}</MenuItem>
          </Select>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Entry Time"
              name="entryTime"
              ampm={false}
              defaultValue={selectedRows[0] === undefined ? dayjs().hour(0).minute(0) : getDateDayjs(selectedRows[0].entryTime.substring(0, 2), selectedRows[0].entryTime.substring(3, 5))}
              sx={{
                margin: 1
              }}
            />
            <TimePicker
              label="Entry Grace Time"
              name="entryGrace"
              ampm={false}
              defaultValue={selectedRows[0] === undefined ? dayjs().hour(0).minute(0) : getDateDayjs(selectedRows[0].graceEntryTime.substring(0, 2), selectedRows[0].graceEntryTime.substring(3, 5))}
              sx={{
                margin: 1
              }}
            />
            <TimePicker
              label="Exit Lunch"
              name="exitLunch"
              ampm={false}
              defaultValue={selectedRows[0] === undefined ? dayjs().hour(0).minute(0) : getDateDayjs(selectedRows[0].exitLunch.substring(0, 2), selectedRows[0].exitLunch.substring(3, 5))}
              sx={{
                margin: 1
              }}
            />
            <TimePicker
              label="Entry Lunch"
              name="entryLunch"
              ampm={false}
              defaultValue={selectedRows[0] === undefined ? dayjs().hour(0).minute(0) : getDateDayjs(selectedRows[0].entryLunch.substring(0, 2), selectedRows[0].entryLunch.substring(3, 5))}
              sx={{
                margin: 1
              }}
            />
            <TimePicker
              label="Exit Time"
              name="exitTime"
              ampm={false}
              defaultValue={selectedRows[0] === undefined ? dayjs().hour(0).minute(0) : getDateDayjs(selectedRows[0].exitTime.substring(0, 2), selectedRows[0].exitTime.substring(3, 5))}
              sx={{
                margin: 1
              }}
            />
            <TimePicker
              label="Exit Grace Time"
              name="exitGrace"
              ampm={false}
              defaultValue={selectedRows[0] === undefined ? dayjs().hour(0).minute(0) : getDateDayjs(selectedRows[0].graceExitTime.substring(0, 2), selectedRows[0].graceExitTime.substring(3, 5))}
              sx={{
                margin: 1
              }}
            />
            <TimePicker
              label="Overtime Allowance"
              name="overTimeAllowance"
              ampm={false}
              defaultValue={selectedRows[0] === undefined ? dayjs().hour(0).minute(0) : getDateDayjs(selectedRows[0].overTimeAllowance.substring(0, 2), selectedRows[0].overTimeAllowance.substring(3, 5))}
              sx={{
                margin: 1
              }}
            />
          </LocalizationProvider>
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