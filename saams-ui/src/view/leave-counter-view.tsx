import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Refresh, Add, Delete, Update } from '@mui/icons-material';
import { Checkbox, FormControlLabel, InputLabel, Menu, MenuItem, Select, TextField } from '@mui/material';
import { STRINGS } from '../constants';
import { User, UserResponse } from '../model/user';
import { Leave, LeaveResponse } from '../model/leave';
import { LeaveCounter, LeaveCounterResponse } from '../model/leave-counter';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

let selectedRows: LeaveCounter[] = [];
let users: User[] = [];
let leaves: Leave[] = [];

const handleOnGet = async () => {
    const resp = await window.electronAPI.getLeaveCounters();
    return resp;
}

const getAll = async () => {
    const respUser = await window.electronAPI.getUsers();
    if (respUser.status) {
        users = respUser.users;
    }
    const respLeave = await window.electronAPI.getLeaves();
    if (respLeave.status) {
        leaves = respLeave.leaves;
    }
}

export default function LeaveCounterView() {
    const [rows, setRows] = React.useState([]);
    const [initialLoad, setInitialLoad] = React.useState(true);
    const [addModal, setAddModal] = React.useState(false);
    const [updateModal, setUpdateModal] = React.useState(false);
    const [messageModal, setMessageModal] = React.useState(false);
    const [messageTitle, setMessageTitle] = React.useState("");
    const [messageContent, setMessageContent] = React.useState("");
    const [expiry, setExpiry] = React.useState<dayjs.Dayjs | null>(dayjs());

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'counter', headerName: 'Counter', width: 150 },
        { field: 'expiry', headerName: 'Expiry', width: 180 },
        { field: 'userId', headerName: 'User ID', width: 150 },
        { field: 'leaveId', headerName: 'Leave ID', width: 150 },

    ];

    const handleRefreshButtonClick = async () => {
        const response = await handleOnGet();
        if (!response.status) {
            setMessageTitle("Error");
            setMessageContent("Error fetching data");
            setMessageModal(true);
        }
        setRows(response.leaveCounters);
    }

    const handleAddButtonClick = () => {
        setAddModal(true);
    }

    const handleUpdateButtonClick = () => {
        if (selectedRows.length > 1) {
            setMessageTitle("Update Leave Counter");
            setMessageContent("Select only one item to edit.");
            setMessageModal(true);
        } else if (selectedRows.length == 0) {
            setMessageTitle("Update Leave Counter");
            setMessageContent("Select an item to edit.");
            setMessageModal(true);
        } else {
            setUpdateModal(true);
        }
    }

    const handleDeleteButtonClick = async () => {
        if (selectedRows.length == 0) {
            setMessageTitle("Delete Leave Counter");
            setMessageContent("Select an item to delete.");
            setMessageModal(true);
        } else {
            selectedRows.forEach(async (element) => {
                const resp = await window.electronAPI.deleteLeaveCounter(element.id);
                if (!resp) {
                    setMessageTitle('Delete Leave Counter');
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
            getAll();
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
                        const leaveCounter: LeaveCounter = {
                            counter: formJson.counter,
                            expiry: expiry ? expiry.format('YYYY-MM-DD') : '',
                            userId: formJson.userId,
                            leaveId: formJson.leaveId,
                        };
                        const resp = await window.electronAPI.createLeaveCounter(leaveCounter);
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
                <DialogTitle>Add Leave Counter</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Fill in the details to add a new leave counter.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="counter"
                        label="Counter"
                        type="number"
                        fullWidth
                        variant="standard"
                        name="counter"
                        required
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Expiry Date"
                            value={expiry}
                            onChange={(newValue) => setExpiry(newValue)}
                            format="YYYY-MM-DD"
                            sx={{ margin: 1 }}
                        />
                    </LocalizationProvider>
                    <InputLabel id="userLabel">User Id</InputLabel>
                    <Select
                        labelId="userLabel"
                        id="userId"
                        name="userId"
                        fullWidth
                    >
                        {users.map((element) => (
                            <MenuItem value={element.id}>{element.userName}</MenuItem>
                        ))
                        }
                    </Select>
                    <InputLabel id="leaveLabel">Leave Id</InputLabel>
                    <Select
                        labelId="leaveLabel"
                        id="leaveId"
                        name="leaveId"
                        fullWidth
                    >
                        {leaves.map((element) => (
                            <MenuItem value={element.id}>{element.name}</MenuItem>
                        ))
                        }
                    </Select>
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
                        const leaveCounter: LeaveCounter = {
                            id: selectedRows[0].id,
                            counter: formJson.counter,
                            expiry: expiry ? expiry.format('YYYY-MM-DD') : '',
                            userId: formJson.userId,
                            leaveId: formJson.leaveId,
                        };
                        const resp = await window.electronAPI.updateLeaveCounter(leaveCounter);
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
                <DialogTitle>Update Leave Counter</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Update Leave Counter details.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="counter"
                        label="Counter"
                        type="number"
                        fullWidth
                        variant="standard"
                        name="counter"
                        defaultValue={selectedRows[0]?.counter || ''}
                        required
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Expiry Date"
                            value={expiry || dayjs(selectedRows[0]?.expiry)}
                            onChange={(newValue) => setExpiry(newValue)}
                            format="YYYY-MM-DD"
                            sx={{ margin: 1 }}
                        />
                    </LocalizationProvider>
                    <InputLabel id="userLabel">User Id</InputLabel>
                    <Select
                        labelId="userLabel"
                        id="userId"
                        name="userId"
                        fullWidth
                    >
                        {users.map((element) => (
                            <MenuItem value={element.id} key={element.id}>{element.userName}</MenuItem>
                        ))
                        }
                    </Select>
                    <InputLabel id="leaveLabel">Leave Id</InputLabel>
                    <Select
                        labelId="leaveLabel"
                        id="leaveId"
                        name="leaveId"
                        fullWidth
                    >
                        {leaves.map((element) => (
                            <MenuItem value={element.id} key={element.id}>{element.name}</MenuItem>
                        ))
                        }
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{STRINGS.cancel}</Button>
                    <Button type="submit">{STRINGS.update}</Button>
                </DialogActions>
            </Dialog>
            {/* Message Modal */}
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
