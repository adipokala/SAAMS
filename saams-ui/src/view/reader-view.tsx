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
import { Reader } from '../model/reader';
import { Checkbox, FormControlLabel, InputLabel, MenuItem, Select } from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { STRINGS } from '../constants';
import { Area } from '../model/area';
//import { Channel } from '../model/channel';

let selectedRows: Reader[] = [];
//let channels: Channel[] = [];
let areas: Area[] = [];

const handleOnGet = async () => {
    const resp = await window.electronAPI.getReaders();
    return resp;
};

const getAll = async () => {
    // const resp = await window.electronAPI.getChannels();
    //if (resp.status) {
    //  channels = resp.channels;
    //}
    const resp2 = await window.electronAPI.getAreas();
    if (resp2.status) {
        areas = resp2.areas;
    }
}

export default function ReaderView() {
    const [rows, setRows] = React.useState<Reader[]>([]);
    const [initialLoad, setInitialLoad] = React.useState<boolean>(true);
    const [addModal, setAddModal] = React.useState<boolean>(false);
    const [updateModal, setUpdateModal] = React.useState<boolean>(false);
    const [messageModal, setMessageModal] = React.useState<boolean>(false);
    const [messageTitle, setMessageTitle] = React.useState<string>('');
    const [messageContent, setMessageContent] = React.useState<string>('');
    const [installationDate, setInstallationDate] = React.useState<Dayjs | null>(null);

    const columns: GridColDef<(typeof rows)[number]>[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'code', headerName: 'Code', width: 110 },
        { field: 'serialNumber', headerName: 'Serial Number', width: 150 },
        { field: 'installationDate', headerName: 'Installation Date', width: 150 },
        { field: 'isAttendanceReader', headerName: 'Attendance Reader', width: 150, type: 'boolean' },
        { field: 'status', headerName: 'Status', width: 100, type: 'boolean' },
        { field: 'adminPIN', headerName: 'Admin PIN', width: 100 },
        { field: 'dateValidation', headerName: 'Date Validation', width: 150, type: 'boolean' },
        { field: 'antiPassback', headerName: 'Anti Passback', width: 150, type: 'boolean' },
        { field: 'biometrics', headerName: 'Biometrics', width: 100, type: 'boolean' },
        { field: 'sidControl', headerName: 'SID Control', width: 100, type: 'boolean' },
        { field: 'display', headerName: 'Display', width: 100 },
        { field: 'unlockDuration', headerName: 'Unlock Duration', width: 150 },
        { field: 'doorOpenDuration', headerName: 'Door Open Duration', width: 150 },
        { field: 'displayDuration', headerName: 'Display Duration', width: 150 },
        { field: 'transactionLog', headerName: 'Transaction Log', width: 200 },
        { field: 'channelId', headerName: 'Channel ID', width: 100 },
        { field: 'areaId', headerName: 'Area ID', width: 100 },
    ];

    const handleRefreshButtonClick = async () => {
        const response = await handleOnGet();
        if (!response.status) {
            setMessageTitle('Error');
            setMessageContent('Error fetching data');
            setMessageModal(true);
        } else {
            setRows(response.readers);
        }
    }
    const handleClose = () => {
        setAddModal(false);
        setUpdateModal(false);
        setMessageModal(false);
    };

    React.useEffect(() => {
        if (initialLoad) {
            handleRefreshButtonClick();
            setInitialLoad(false);
        }
    });

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack spacing={2} direction="column">
                <Stack spacing={2} direction="row">
                    <Button variant="contained" onClick={handleRefreshButtonClick}>
                        Refresh <Refresh />
                    </Button>
                    <Button variant="contained" onClick={() => setAddModal(true)}>
                        Add <Add />
                    </Button>
                    <Button variant="contained" onClick={() => {
                        if (selectedRows.length === 1) {
                            setUpdateModal(true);
                        } else {
                            setMessageTitle('Update Reader');
                            setMessageContent('Select only one item to edit.');
                            setMessageModal(true);
                        }
                    }}>
                        Modify <Update />
                    </Button>
                    <Button variant="contained" onClick={async () => {
                        if (selectedRows.length === 0) {
                            setMessageTitle('Delete Reader');
                            setMessageContent('Select an item to delete.');
                            setMessageModal(true);
                        } else {
                            for (const element of selectedRows) {
                                const resp = await window.electronAPI.deleteReader(element.id);
                                if (!resp) {
                                    setMessageTitle('Delete Reader');
                                    setMessageContent(`Failed to delete item with ID ${element.id}`);
                                    setMessageModal(true);
                                }
                            }
                            handleRefreshButtonClick();
                        }
                    }}>
                        Delete <Delete />
                    </Button>
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
                            let reader: Reader = {
                                name: formJson.name,
                                code: formJson.code,
                                serialNumber: formJson.serialNumber,
                                installationDate: installationDate ? installationDate.format('YYYY-MM-DD') : '',
                                isAttendanceReader: formJson.isAttendanceReader,
                                status: formJson.status,
                                adminPIN: formJson.adminPIN,
                                dateValidation: formJson.dateValidation,
                                antiPassback: formJson.antiPassback,
                                biometrics: formJson.biometrics,
                                sidControl: formJson.sidControl,
                                doorMode: formJson.doorMode,
                                type: formJson.type,
                                accessControl: formJson.accessControl,
                                switch: formJson.switch,
                                display: formJson.display,
                                unlockDuration: "0." + formJson.unlockDuration + ":00",
                                doorOpenDuration: "0." + formJson.doorOpenDuration + ":00",
                                displayDuration: "0." + formJson.displayDuration + ":00",
                                transactionLog: formJson.transactionLog,
                                channelId: formJson.channelId,
                                areaId: formJson.areaId,
                            };
                            const resp = await window.electronAPI.createReader(reader);
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
                    <DialogTitle>Add Reader</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Fill in the reader details.</DialogContentText>

                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="name"
                            name="name"
                            label="Reader Name"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                        <TextField
                            required
                            margin="dense"
                            id="code"
                            name="code"
                            label="Reader Code"
                            type="text"
                            fullWidth
                            variant="standard"
                            inputProps={{ maxLength: 4, minLength: 2 }}
                        />
                        <TextField
                            required
                            margin="dense"
                            id="serialNumber"
                            name="serialNumber"
                            label="Serial Number"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                        <DatePicker
                            label="Installation Date"
                            value={installationDate}
                            onChange={(newValue) => setInstallationDate(newValue)}
                            format="YYYY-MM-DD"
                            sx={{ margin: 1 }}
                        />
                        <FormControlLabel
                            control={<Checkbox name="isAttendanceReader" />}
                            label="Is Attendance Reader"
                        />
                        <FormControlLabel
                            control={<Checkbox name="status" />}
                            label="Status"
                        />
                        <TextField
                            margin="dense"
                            id="adminPIN"
                            name="adminPIN"
                            label="Admin PIN"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                        <FormControlLabel
                            control={<Checkbox name="dateValidation" />}
                            label="Date Validation"
                        />
                        <FormControlLabel
                            control={<Checkbox name="antiPassback" />}
                            label="Anti Passback"
                        />
                        <FormControlLabel
                            control={<Checkbox name="biometrics" />}
                            label="Biometrics"
                        />
                        <FormControlLabel
                            control={<Checkbox name="sidControl" />}
                            label="SID Control"
                        />
                        <TextField
                            margin="dense"
                            id="doorMode"
                            name="doorMode"
                            label="Door Mode"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                        <TextField
                            margin="dense"
                            id="type"
                            name="type"
                            label="Type"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                        <TextField
                            margin="dense"
                            id="accessControl"
                            name="accessControl"
                            label="Access Control"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                        <TextField
                            margin="dense"
                            id="switch"
                            name="switch"
                            label="Switch"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                        <TextField
                            margin="dense"
                            id="display"
                            name="display"
                            label="Display"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                        <TimePicker
                            label="Unlock Duration"
                            name="unlockDuration"
                            ampm={false}
                            sx={{ margin: 1 }}
                        />
                        <TimePicker
                            label="Door Open Duration"
                            name="doorOpenDuration"
                            ampm={false}
                            sx={{ margin: 1 }}
                        />
                        <TimePicker
                            label="Display Duration"
                            name="displayDuration"
                            ampm={false}
                            sx={{ margin: 1 }}
                        />
                        <TextField
                            margin="dense"
                            id="transactionLog"
                            name="transactionLog"
                            label="Transaction Log"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                        <InputLabel id="areaLabel">Area ID</InputLabel>
                        <Select
                            labelId="areaLabel"
                            id="areaId"
                            name="areaId"
                            fullWidth
                        >
                            {areas.map((element) => (
                                <MenuItem key={element.id} value={element.id}>
                                    {element.name}
                                </MenuItem>
                            ))}
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
                            let reader: Reader = {
                                id: selectedRows[0].id, // Assuming you have an ID to update
                                name: formJson.name,
                                code: formJson.code,
                                serialNumber: formJson.serialNumber,
                                installationDate: '',
                                isAttendanceReader: formJson.isAttendanceReader,
                                status: formJson.status,
                                adminPIN: formJson.adminPIN,
                                dateValidation: formJson.dateValidation,
                                antiPassback: formJson.antiPassback,
                                biometrics: formJson.biometrics,
                                sidControl: formJson.sidControl,
                                doorMode: formJson.doorMode,
                                type: formJson.type,
                                accessControl: formJson.accessControl,
                                switch: formJson.switch,
                                display: formJson.display,
                                unlockDuration: "0." + formJson.unlockDuration + ":00",
                                doorOpenDuration: "0." + formJson.doorOpenDuration + ":00",
                                displayDuration: "0." + formJson.displayDuration + ":00",
                                transactionLog: formJson.transactionLog,
                                channelId: formJson.channelId,
                                areaId: formJson.areaId,
                            };
                            const resp = await window.electronAPI.updateReader(reader);
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
                    <DialogTitle>Update Reader</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Update Reader.</DialogContentText>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="name"
                            name="name"
                            label="Reader Name"
                            type="text"
                            fullWidth
                            variant="standard"
                            defaultValue={selectedRows[0]?.name || ""}
                        />
                        <TextField
                            required
                            margin="dense"
                            id="code"
                            name="code"
                            label="Reader Code"
                            type="text"
                            fullWidth
                            variant="standard"
                            defaultValue={selectedRows[0]?.code || ""}
                            inputProps={{ maxLength: 4, minLength: 2 }}
                        />
                        <TextField
                            required
                            margin="dense"
                            id="serialNumber"
                            name="serialNumber"
                            label="Serial Number"
                            type="text"
                            fullWidth
                            variant="standard"
                            defaultValue={selectedRows[0]?.serialNumber || ""}
                        />
                        <FormControlLabel
                            control={<Checkbox name="isAttendanceReader" />}
                            label="Is Attendance Reader"
                            defaultChecked={selectedRows[0]?.isAttendanceReader || false}
                        />
                        <FormControlLabel
                            control={<Checkbox name="status" />}
                            label="Status"
                            defaultChecked={selectedRows[0]?.status || false}
                        />
                        <TextField
                            margin="dense"
                            id="adminPIN"
                            name="adminPIN"
                            label="Admin PIN"
                            type="text"
                            fullWidth
                            variant="standard"
                            defaultValue={selectedRows[0]?.adminPIN || ""}
                        />
                        <FormControlLabel
                            control={<Checkbox name="dateValidation" />}
                            label="Date Validation"
                            defaultChecked={selectedRows[0]?.dateValidation || false}
                        />
                        <FormControlLabel
                            control={<Checkbox name="antiPassback" />}
                            label="Anti Passback"
                            defaultChecked={selectedRows[0]?.antiPassback || false}
                        />
                        <FormControlLabel
                            control={<Checkbox name="biometrics" />}
                            label="Biometrics"
                            defaultChecked={selectedRows[0]?.biometrics || false}
                        />
                        <FormControlLabel
                            control={<Checkbox name="sidControl" />}
                            label="SID Control"
                            defaultChecked={selectedRows[0]?.sidControl || false}
                        />
                        <TextField
                            margin="dense"
                            id="doorMode"
                            name="doorMode"
                            label="Door Mode"
                            type="text"
                            fullWidth
                            variant="standard"
                            defaultValue={selectedRows[0]?.doorMode || ""}
                        />
                        <TextField
                            margin="dense"
                            id="type"
                            name="type"
                            label="Type"
                            type="text"
                            fullWidth
                            variant="standard"
                            defaultValue={selectedRows[0]?.type || ""}
                        />
                        <TextField
                            margin="dense"
                            id="accessControl"
                            name="accessControl"
                            label="Access Control"
                            type="text"
                            fullWidth
                            variant="standard"
                            defaultValue={selectedRows[0]?.accessControl || ""}
                        />
                        <TextField
                            margin="dense"
                            id="switch"
                            name="switch"
                            label="Switch"
                            type="text"
                            fullWidth
                            variant="standard"
                            defaultValue={selectedRows[0]?.switch || ""}
                        />
                        <TextField
                            margin="dense"
                            id="display"
                            name="display"
                            label="Display"
                            type="text"
                            fullWidth
                            variant="standard"
                            defaultValue={selectedRows[0]?.display || ""}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                                label="Unlock Duration"
                                name="unlockDuration"
                                ampm={false}
                                sx={{ margin: 1 }}
                            />
                            <TimePicker
                                label="Door Open Duration"
                                name="doorOpenDuration"
                                ampm={false}
                                sx={{ margin: 1 }}
                            />
                            <TimePicker
                                label="Display Duration"
                                name="displayDuration"
                                ampm={false}
                                sx={{ margin: 1 }}
                            />
                        </LocalizationProvider>

                        <TextField
                            margin="dense"
                            id="transactionLog"
                            name="transactionLog"
                            label="Transaction Log"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                        <TextField
                            margin="dense"
                            id="channelId"
                            name="channelId"
                            label="Channel ID"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                        <TextField
                            margin="dense"
                            id="areaId"
                            name="areaId"
                            label="Area ID"
                            type="text"
                            fullWidth
                            variant="standard"
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
        </LocalizationProvider>
    );
}
