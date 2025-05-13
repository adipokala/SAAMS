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
import { Checkbox, FormControlLabel, FormGroup, InputLabel, MenuItem, Select } from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { STRINGS } from '../constants';
import { Area } from '../model/area';
import { Channel } from '../model/channel';

let selectedRows: Reader[] = [];
let channels: Channel[] = [];
let areas: Area[] = [];

const handleOnGet = async () => {
    const resp = await window.electronAPI.getReaders();
    return resp;
};

const getAll = async () => {
    const respCha = await window.electronAPI.getChannels();
    if (respCha.status) {
        channels = respCha.channels;
    }
    const respAre = await window.electronAPI.getAreas();
    if (respAre.status) {
        areas = respAre.areas;
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
    const [installationDate, setInstallationDate] = React.useState<string | null>(null);
    const [isAttendanceReader, setIsAttendanceReader] = React.useState<boolean>(false);
    const [status, setStatus] = React.useState<boolean>(false);
    const [dateValidation, setDateValidation] = React.useState<boolean>(false);
    const [antiPassback, setAntiPassback] = React.useState<boolean>(false);
    const [biometrics, setBiometrics] = React.useState<boolean>(false);
    const [sidControl, setSidControl] = React.useState<boolean>(false);
    const [unlockDuration, setUnlockDuration] = React.useState<Dayjs | null>(dayjs().minute(0).second(0));
    const [doorOpenDuration, setDoorOpenDuration] = React.useState<Dayjs | null>(dayjs().minute(0).second(0));
    const [displayDuration, setDisplayDuration] = React.useState<Dayjs | null>(dayjs().minute(0).second(0));

    const columns: GridColDef<(typeof rows)[number]>[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'code', headerName: 'Code', width: 110 },
        { field: 'serialNumber', headerName: 'Serial Number', width: 150 },
        { field: 'installationDate', headerName: 'Installation Date', width: 150 },
        { field: 'isAttendanceReader', headerName: 'isAttendance Reader', width: 150, type: 'boolean' },
        { field: 'status', headerName: 'Status', width: 100, type: 'boolean' },
        { field: 'adminPIN', headerName: 'Admin PIN', width: 100 },
        { field: 'dateValidation', headerName: 'Date Validation', width: 150, type: 'boolean' },
        { field: 'antiPassback', headerName: 'Anti Passback', width: 150, type: 'boolean' },
        { field: 'biometrics', headerName: 'Biometrics', width: 100, type: 'boolean' },
        { field: 'sidControl', headerName: 'SID Control', width: 100, type: 'boolean' },
        { field: 'doorMode', headerName: 'Door Mode', width: 100 },
        { field: 'type', headerName: 'Reader Type', width: 100 },
        { field: 'accessControl', headerName: 'Access Control', width: 150 },
        { field: 'switch', headerName: 'Reader Switch', width: 150 },
        { field: 'display', headerName: 'Reader Display', width: 150 },
        { field: 'unlockDuration', headerName: 'Unlock Duration', width: 150 },
        { field: 'doorOpenDuration', headerName: 'Door Open Duration', width: 150 },
        { field: 'displayDuration', headerName: 'Display Duration', width: 150 },
        { field: 'transactionLog', headerName: 'Transaction Log', width: 200 },
        { field: 'channelId', headerName: 'Channel ID', width: 100 },
        { field: 'areaId', headerName: 'Area ID', width: 100 },
    ];
    const getDurationDayjs = (minute: string, second: string): Dayjs => {
        return dayjs().minute(Number(minute)).second(Number(second));
    };

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
            getAll();
            handleRefreshButtonClick();
            setInitialLoad(false);
        }
    }, [initialLoad]);


    React.useEffect(() => {
        if (selectedRows.length > 0) {
            const row = selectedRows[0];
            setInstallationDate(row.installationDate ?? dayjs().format('YYYY-MM-DD')); // or convert to dayjs(row.installationDate)
            setIsAttendanceReader(row.isAttendanceReader ?? false);
            setStatus(row.status ?? false);
            setDateValidation(row.dateValidation ?? false);
            setAntiPassback(row.antiPassback ?? false);
            setBiometrics(row.biometrics ?? false);
            setSidControl(row.sidControl ?? false);
        }

    }, [selectedRows]);


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

                {/* Add Dialog */}
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
                                id: 0,
                                name: formJson.name as string,
                                code: formJson.code as string,
                                serialNumber: formJson.serialNumber as string,
                                installationDate: installationDate ? dayjs(installationDate).format('YYYY-MM-DD') : '',
                                isAttendanceReader: isAttendanceReader,
                                status: status,
                                adminPIN: formJson.adminPIN as string,
                                dateValidation: dateValidation,
                                antiPassback: antiPassback,
                                biometrics: biometrics,
                                sidControl: sidControl,
                                doorMode: formJson.doorMode as string,
                                type: formJson.readerType as string,
                                accessControl: formJson.accessControl as string,
                                switch: formJson.readerSwitch as string,
                                display: formJson.readerDisplay as string,
                                unlockDuration: "0." + unlockDuration?.format('mm:ss') + ":00",
                                doorOpenDuration: "0." + doorOpenDuration?.format('mm:ss') + ":00",
                                displayDuration: "0." + displayDuration?.format('mm:ss') + ":00",
                                transactionLog: formJson.transactionLog as string,
                                channelId: parseInt(formJson.channelId as string) || 0,
                                areaId: parseInt(formJson.areaId as string) || 0,
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
                            value={installationDate ? dayjs(installationDate) : null}
                            onChange={(newValue) => {
                                const formattedDate = newValue ? dayjs(newValue).format('YYYY-MM-DD') : null;
                                setInstallationDate(formattedDate);
                            }}
                            format="YYYY-MM-DD"
                            sx={{ margin: 1 }}
                        />
                        <TextField
                            required
                            margin="dense"
                            id="adminPIN"
                            name="adminPIN"
                            label="Admin PIN"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                        <FormGroup row>
                            <FormControlLabel
                                control={<Checkbox checked={isAttendanceReader} onChange={(e) => setIsAttendanceReader(e.target.checked)} />}
                                label="Is Attendance Reader"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={status} onChange={(e) => setStatus(e.target.checked)} />}
                                label="Status"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={dateValidation} onChange={(e) => setDateValidation(e.target.checked)} />}
                                label="Date Validation"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={antiPassback} onChange={(e) => setAntiPassback(e.target.checked)} />}
                                label="Anti Passback"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={biometrics} onChange={(e) => setBiometrics(e.target.checked)} />}
                                label="Biometrics"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={sidControl} onChange={(e) => setSidControl(e.target.checked)} />}
                                label="SID Control"
                            />
                        </FormGroup>
                        <InputLabel id="doorMode">Door Mode</InputLabel>
                        <Select
                            labelId="doorMode"
                            id="doorMode"
                            name="doorMode"
                            fullWidth
                        >
                            <MenuItem value="SINGLE">SINGLE</MenuItem>
                            <MenuItem value="FREE">FREE</MenuItem>
                            <MenuItem value="LOCKED">LOCKED</MenuItem>
                        </Select>
                        <InputLabel id="readerType">Reader Type</InputLabel>
                        <Select
                            labelId="readerType"
                            id="readerType"
                            name="readerType"
                            fullWidth
                        >
                            <MenuItem value="IN">IN</MenuItem>
                            <MenuItem value="OUT">OUT</MenuItem>
                        </Select>
                        <InputLabel id="accessControl">Access Control</InputLabel>
                        <Select
                            labelId="accessControl"
                            id="accessControl"
                            name="accessControl"
                            fullWidth
                        >
                            <MenuItem value="DOOR">DOOR</MenuItem>
                            <MenuItem value="TURNSTILE">TURNSTILE</MenuItem>
                        </Select>
                        <InputLabel id="readerSwitch">Reader Switch</InputLabel>
                        <Select
                            labelId="readerSwitch"
                            id="readerSwitch"
                            name="readerSwitch"
                            fullWidth
                        >
                            <MenuItem value="NONE">NONE</MenuItem>
                            <MenuItem value="BYPASS">BYPASS</MenuItem>
                            <MenuItem value="EMERGENCY">EMERGENCY</MenuItem>
                        </Select>
                        <InputLabel id="readerDisplay">Reader Display</InputLabel>
                        <Select
                            labelId="readerDisplay"
                            id="readerDisplay"
                            name="readerDisplay"
                            fullWidth
                        >
                            <MenuItem value="NAME">NAME</MenuItem>
                            <MenuItem value="CARDNO">CARDNO</MenuItem>
                        </Select>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                                label="Unlock Duration"
                                name="unlockDuration"
                                ampm={false}
                                views={['minutes', 'seconds']}
                                format="mm:ss"
                                sx={{ margin: 1 }}
                            />

                            <TimePicker
                                label="Door Open Duration"
                                name="doorOpenDuration"
                                ampm={false}
                                views={['minutes', 'seconds']}
                                format="mm:ss"
                                sx={{ margin: 1 }}
                            />

                            <TimePicker
                                label="Display Duration"
                                name="displayDuration"
                                ampm={false}
                                views={['minutes', 'seconds']}
                                format="mm:ss"
                                sx={{ margin: 1 }}
                            />
                        </LocalizationProvider>

                        <InputLabel id="transactionLog">Transaction Log</InputLabel>
                        <Select
                            labelId="transactionLog"
                            id="transactionLog"
                            name="transactionLog"
                            fullWidth
                        >
                            <MenuItem value="BLOCK_AND_WARNING">BLOCK AND WARNING</MenuItem>
                            <MenuItem value="CIRCULAR">CIRCULAR</MenuItem>
                        </Select>

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
                        <InputLabel id="channelLabel">Channel ID</InputLabel>
                        <Select
                            labelId="channelLabel"
                            id="channelId"
                            name="channelId"
                            fullWidth
                        >
                            {channels.map((element) => (
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
                                name: formJson.name as string,
                                code: formJson.code as string,
                                serialNumber: formJson.serialNumber as string,
                                installationDate: installationDate ? dayjs(installationDate).format('YYYY-MM-DD') : '',
                                isAttendanceReader: isAttendanceReader,
                                status: status,
                                adminPIN: formJson.adminPIN as string,
                                dateValidation: dateValidation,
                                antiPassback: antiPassback,
                                biometrics: biometrics,
                                sidControl: sidControl,
                                doorMode: formJson.doorMode as string,
                                type: formJson.readerType as string,
                                accessControl: formJson.accessControl as string,
                                switch: formJson.readerSwitch as string,
                                display: formJson.readerDisplay as string,
                                unlockDuration: "0." + unlockDuration?.format('mm:ss') + ":00",
                                doorOpenDuration: "0." + doorOpenDuration?.format('mm:ss') + ":00",
                                displayDuration: "0." + displayDuration?.format('mm:ss') + ":00",
                                transactionLog: formJson.transactionLog as string,
                                channelId: parseInt(formJson.channelId as string) || 0,
                                areaId: parseInt(formJson.areaId as string) || 0,
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
                        <DatePicker
                            label="Installation Date"
                            value={installationDate ? dayjs(installationDate) : null}
                            onChange={(newValue) => {
                                const formattedDate = newValue ? dayjs(newValue).format('YYYY-MM-DD') : null;
                                setInstallationDate(formattedDate);
                            }}
                            format="YYYY-MM-DD"
                            sx={{ margin: 1 }}
                            defaultValue={dayjs(selectedRows[0]?.installationDate)}
                        />
                        <TextField
                            required
                            margin="dense"
                            id="adminPIN"
                            name="adminPIN"
                            label="Admin PIN"
                            type="text"
                            fullWidth
                            variant="standard"
                            defaultValue={selectedRows[0]?.adminPIN || ""}
                        />
                        <FormGroup row>
                            <FormControlLabel
                                control={<Checkbox checked={isAttendanceReader} onChange={(e) => setIsAttendanceReader(e.target.checked)} />}
                                label="Is Attendance Reader"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={status} onChange={(e) => setStatus(e.target.checked)} />}
                                label="Status"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={dateValidation} onChange={(e) => setDateValidation(e.target.checked)} />}
                                label="Date Validation"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={antiPassback} onChange={(e) => setAntiPassback(e.target.checked)} />}
                                label="Anti Passback"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={biometrics} onChange={(e) => setBiometrics(e.target.checked)} />}
                                label="Biometrics"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={sidControl} onChange={(e) => setSidControl(e.target.checked)} />}
                                label="SID Control"
                            />
                        </FormGroup>
                        <InputLabel id="doorMode">Door Mode</InputLabel>
                        <Select
                            labelId="doorMode"
                            id="doorMode"
                            name="doorMode"
                            fullWidth
                            defaultValue={selectedRows[0]?.doorMode || ""}
                        >
                            <MenuItem value="SINGLE">SINGLE</MenuItem>
                            <MenuItem value="FREE">FREE</MenuItem>
                            <MenuItem value="LOCKED">LOCKED</MenuItem>
                        </Select>
                        <InputLabel id="readerType">Reader Type</InputLabel>
                        <Select
                            labelId="readerType"
                            id="readerType"
                            name="readerType"
                            fullWidth
                            defaultValue={selectedRows[0]?.type || ""}
                        >
                            <MenuItem value="IN">IN</MenuItem>
                            <MenuItem value="OUT">OUT</MenuItem>
                        </Select>
                        <InputLabel id="accessControl">Access Control</InputLabel>
                        <Select
                            labelId="accessControl"
                            id="accessControl"
                            name="accessControl"
                            fullWidth
                            defaultValue={selectedRows[0]?.accessControl || ""}
                        >
                            <MenuItem value="DOOR">DOOR</MenuItem>
                            <MenuItem value="TURNSTILE">TURNSTILE</MenuItem>
                        </Select>
                        <InputLabel id="readerSwitch">Reader Switch</InputLabel>
                        <Select
                            labelId="readerSwitch"
                            id="readerSwitch"
                            name="readerSwitch"
                            fullWidth
                            defaultValue={selectedRows[0]?.switch || ""}
                        >
                            <MenuItem value="NONE">NONE</MenuItem>
                            <MenuItem value="BYPASS">BYPASS</MenuItem>
                            <MenuItem value="EMERGENCY">EMERGENCY</MenuItem>
                        </Select>
                        <InputLabel id="readerDisplay">Reader Display</InputLabel>
                        <Select
                            labelId="readerDisplay"
                            id="readerDisplay"
                            name="readerDisplay"
                            fullWidth
                            defaultValue={selectedRows[0]?.display || ""}
                        >
                            <MenuItem value="NAME">NAME</MenuItem>
                            <MenuItem value="CARDNO">CARDNO</MenuItem>
                        </Select>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                                label="Unlock Duration"
                                name="unlockDuration"
                                ampm={false}
                                views={['minutes', 'seconds']}
                                format="mm:ss"
                                defaultValue={
                                    selectedRows[0]
                                        ? getDurationDayjs(selectedRows[0].unlockDuration.substring(0, 2), selectedRows[0].unlockDuration.substring(3, 5))
                                        : dayjs().minute(0).second(0)
                                }
                                sx={{ margin: 1 }}
                            />

                            <TimePicker
                                label="Door Open Duration"
                                name="doorOpenDuration"
                                ampm={false}
                                views={['minutes', 'seconds']}
                                format="mm:ss"
                                defaultValue={
                                    selectedRows[0]
                                        ? getDurationDayjs(selectedRows[0].doorOpenDuration.substring(0, 2), selectedRows[0].doorOpenDuration.substring(3, 5))
                                        : dayjs().minute(0).second(0)
                                }
                                sx={{ margin: 1 }}
                            />

                            <TimePicker
                                label="Display Duration"
                                name="displayDuration"
                                ampm={false}
                                views={['minutes', 'seconds']}
                                format="mm:ss"
                                defaultValue={
                                    selectedRows[0]
                                        ? getDurationDayjs(selectedRows[0].displayDuration.substring(0, 2), selectedRows[0].displayDuration.substring(3, 5))
                                        : dayjs().minute(0).second(0)
                                }
                                sx={{ margin: 1 }}
                            />
                        </LocalizationProvider>


                        <InputLabel id="transactionLog">Transaction Log</InputLabel>
                        <Select
                            labelId="transactionLog"
                            id="transactionLog"
                            name="transactionLog"
                            fullWidth
                            defaultValue={selectedRows[0]?.transactionLog || ""}
                        >
                            <MenuItem value="BLOCK_AND_WARNING">BLOCK AND WARNING</MenuItem>
                            <MenuItem value="CIRCULAR">CIRCULAR</MenuItem>
                        </Select>

                        <InputLabel id="areaLabel">Area ID</InputLabel>
                        <Select
                            labelId="areaLabel"
                            id="areaId"
                            name="areaId"
                            fullWidth
                            defaultValue={selectedRows[0]?.areaId || ""}
                        >
                            {areas.map((element) => (
                                <MenuItem key={element.id} value={element.id}>
                                    {element.name}
                                </MenuItem>
                            ))}
                        </Select>
                        <InputLabel id="channelLabel">Channel ID</InputLabel>
                        <Select
                            labelId="channelLabel"
                            id="channelId"
                            name="channelId"
                            fullWidth
                            defaultValue={selectedRows[0]?.channelId || ""}
                        >
                            {channels.map((element) => (
                                <MenuItem key={element.id} value={element.id}>
                                    {element.name}
                                </MenuItem>
                            ))}
                        </Select>
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
