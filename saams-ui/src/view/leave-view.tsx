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
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import { STRINGS } from '../constants';
import { Leave, LeaveResponse } from '../model/leave';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

let selectedRows: Leave[] = [];

const handleOnGet = async () => {
    const resp = await window.electronAPI.getLeaves();
    return resp;
}
export default function LeaveView() {
    const [rows, setRows] = React.useState([]);
    const [initialLoad, setInitialLoad] = React.useState(true);
    const [addModal, setAddModal] = React.useState(false);
    const [updateModal, setUpdateModal] = React.useState(false);
    const [messageModal, setMessageModal] = React.useState(false);
    const [messageTitle, setMessageTitle] = React.useState("");
    const [messageContent, setMessageContent] = React.useState("");
    const [renewalDate, setRenewalDate] = React.useState<Dayjs | null>(dayjs());
    const [autoRenew, setAutoRenew] = React.useState(false);
    const [updateAutoRenew, setUpdateAutoRenew] = React.useState(false);


    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'code', headerName: 'Code', width: 110 },
        { field: 'description', headerName: 'Description', width: 200 },
        { field: 'count', headerName: 'Count', width: 100 },
        { field: 'autoRenew', headerName: 'Auto Renew', width: 120, type: 'boolean' },
        { field: 'validity', headerName: 'Validity', width: 150 },
        { field: 'renewalDate', headerName: 'Renewal Date', width: 150 },
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
        setRows(response.leaves);
    }

    const handleAddButtonClick = () => {
        setAddModal(true);
    }

    const handleUpdateButtonClick = () => {
        if (selectedRows.length > 1) {
            setMessageTitle("Update Leave");
            setMessageContent("Select only one item to edit.");
            setMessageModal(true);
        } else if (selectedRows.length === 0) {
            setMessageTitle("Update Leave");
            setMessageContent("Select an item to edit.");
            setMessageModal(true);
        } else {
            setUpdateAutoRenew(selectedRows[0].autoRenew); // <-- set state here
            setUpdateModal(true);
        }
    }

    const handleDeleteButtonClick = () => {
        if (selectedRows.length === 0) {
            setMessageTitle("Delete Leave");
            setMessageContent("Select an item to delete.");
            setMessageModal(true);
        } else {
            selectedRows.forEach(async (element) => {
                const resp = await window.electronAPI.deleteLeave(element.id);
                if (!resp) {
                    setMessageTitle("Delete Leave");
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
        setAutoRenew(false); // Reset checkbox
        setRenewalDate(dayjs()); // Reset date picker
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
                        let leave: Leave = {
                            name: formJson.name,
                            code: formJson.code,
                            description: formJson.description,
                            count: parseInt(formJson.count, 10),
                            autoRenew: autoRenew, // use the state value
                            validity: "0." + formJson.validity + ":00",
                            renewalDate: renewalDate ? renewalDate.format('YYYY-MM-DD') : '',
                        };

                        const resp = await window.electronAPI.createLeave(leave);
                        console.log(resp);
                        if (resp) {
                            setMessageTitle("Success");
                            setMessageContent(resp.message);
                            setMessageModal(true);
                            handleRefreshButtonClick();
                            setAutoRenew(false); // Reset after add
                            setRenewalDate(dayjs()); // Reset after add
                        } else {
                            setMessageTitle("Error");
                            setMessageContent(resp.message);
                            setMessageModal(true);
                        }
                        handleClose();
                    }
                }}
            >
                <DialogTitle>Add Leave</DialogTitle>
                <DialogContent>
                    <DialogContentText>Fill in leave details.</DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="name"
                        label="Leave Name"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField

                        required
                        margin="dense"
                        id="code"
                        name="code"
                        label="Leave Code"
                        type="text"
                        fullWidth
                        variant="standard"
                        inputProps={{
                            maxLength: 4,
                            minLength: 2,
                        }}
                    />
                    <TextField
                        required
                        margin="dense"
                        id="description"
                        name="description"
                        label="Description"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        required
                        margin="dense"
                        id="count"
                        label="Count"
                        type="number"
                        fullWidth
                        variant="standard"
                        name="count"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="autoRenew"
                                checked={autoRenew}
                                onChange={(e) => setAutoRenew(e.target.checked)}
                            />
                        }
                        label="Auto Renew"
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                            label="Validity"
                            name="validity"
                            ampm={false}
                            sx={{
                                margin: 1
                            }}
                        />
                        <DatePicker
                            label="Renewal Date"
                            value={renewalDate}
                            onChange={(newValue) => setRenewalDate(newValue)}
                            format="YYYY-MM-DD"
                            sx={{ margin: 1 }}
                        />
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type='submit'>Add</Button>
                </DialogActions>
            </Dialog>

            {/* Update Model */}
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
                        if (selectedRows.length !== 1) {
                            setMessageTitle("Error");
                            setMessageContent("Select only one item to edit.");
                            setMessageModal(true);
                            return;
                        }
                        let leave: Leave = {
                            id: selectedRows[0].id,
                            name: formJson.name,
                            code: formJson.code,
                            description: formJson.description,
                            count: parseInt(formJson.count, 10),
                            autoRenew: updateAutoRenew, // <-- use state here
                            validity: "0." + formJson.validity + ":00",
                            renewalDate: renewalDate ? renewalDate.format('YYYY-MM-DD') : '',
                        };
                        const resp = await window.electronAPI.updateLeave(leave);
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
                <DialogTitle>Update Leave</DialogTitle>
                <DialogContent>
                    <DialogContentText> Update Leave  </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="name"
                        label="Leave Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={selectedRows.length === 1 ? selectedRows[0].name : ''}
                    />
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="code"
                        name="code"
                        label="Code"
                        type="text"
                        fullWidth
                        variant="standard"
                        inputProps={{
                            maxLength: 4,
                            minLength: 2,
                        }}
                        defaultValue={selectedRows.length === 1 ? selectedRows[0].code : ''}
                    />
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="description"
                        name="description"
                        label="Description"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={selectedRows.length === 1 ? selectedRows[0].description : ''}
                    />
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="count"
                        label="Count"
                        type="number"
                        fullWidth
                        variant="standard"
                        name="count"
                        defaultValue={selectedRows.length === 1 ? selectedRows[0].count : ''}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="autoRenew"
                                checked={updateAutoRenew}
                                onChange={(e) => setUpdateAutoRenew(e.target.checked)}
                            />
                        }
                        label="Auto Renew"
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                            label="Validity"
                            name="validity"
                            ampm={false}
                            defaultValue={selectedRows[0] === undefined ? dayjs().hour(0).minute(0) : getDateDayjs(selectedRows[0].validity.substring(0, 2), selectedRows[0].validity.substring(3, 5))}
                            sx={{
                                margin: 1
                            }}
                        />
                        <DatePicker
                            label="Renewal Date"
                            value={renewalDate}
                            onChange={(newValue) => setRenewalDate(newValue)}
                            format="YYYY-MM-DD"
                            sx={{ margin: 1 }}
                        />
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{STRINGS.cancel}</Button>
                    <Button type="submit">{STRINGS.update}</Button>
                </DialogActions>
            </Dialog>

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
