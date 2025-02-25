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
import { STRINGS } from '../constants';
import { Channel } from '../model/channel';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';

let selectedRows: Channel[] = [];

const handleOnGet = async () => {
    const resp = await window.electronAPI.getChannels();
    return resp;
}

export default function ChannelView() {
    const [rows, setRows] = React.useState<Channel[]>([]);
    const [initialLoad, setInitialLoad] = React.useState<boolean>(true);
    const [addModal, setAddModal] = React.useState<boolean>(false);
    const [updateModal, setUpdateModal] = React.useState<boolean>(false);
    const [messageModal, setMessageModal] = React.useState<boolean>(false);
    const [messageTitle, setMessageTitle] = React.useState<string>("");
    const [messageContent, setMessageContent] = React.useState<string>("");
    const [channelType, setChannelType] = React.useState<'TCPIP' | 'SERIAL'>('TCPIP');
    const [LTS, setLTS] = React.useState<boolean>(false);
    const [ipError, setIpError] = React.useState<string>("");
    const [portError, setPortError] = React.useState<string>("");

    const columns: GridColDef<(typeof rows)[number]>[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'code', headerName: 'Code', width: 110 },
        { field: 'type', headerName: 'Type', width: 110 },
        { field: 'value', headerName: 'Value', width: 150 },
        { field: 'LTS', headerName: 'LTS', width: 110 },
    ];

    const handleRefreshButtonClick = async () => {
        const response = await handleOnGet();
        if (!response.status) {
            setMessageTitle("Error");
            setMessageContent("Error fetching data");
            setMessageModal(true);
        }
        setRows(response.channels);
    }

    const handleAddButtonClick = () => {
        setAddModal(true);
        setChannelType('TCPIP');
        setLTS(false);
        setIpError("");
        setPortError("");
    }

    const handleUpdateButtonClick = () => {
        if (selectedRows.length > 1) {
            setMessageTitle("Update Channel");
            setMessageContent("Select only one item to edit.");
            setMessageModal(true);
        } else if (selectedRows.length === 0) {
            setMessageTitle("Update Channel");
            setMessageContent("Select an item to edit.");
            setMessageModal(true);
        } else {
            setUpdateModal(true);
            setChannelType(selectedRows[0].type);
            setLTS(selectedRows[0].LTS);
            setIpError("");
            setPortError("");
        }
    }

    const handleDeleteButtonClick = async () => {
        if (selectedRows.length === 0) {
            setMessageTitle("Delete Channel");
            setMessageContent("Select an item to delete.");
            setMessageModal(true);
        } else {
            for (const element of selectedRows) {
                const resp = await window.electronAPI.deleteChannel(element.id);
                if (!resp.status) {
                    setMessageTitle("Delete Channel");
                    setMessageContent(`Failed to delete item with ID ${element.id}`);
                    setMessageModal(true);
                }
            }
            handleRefreshButtonClick();
        }
    }

    const handleClose = () => {
        setAddModal(false);
        setUpdateModal(false);
        setMessageModal(false);
    }

    const validateIpAddress = (ip: string) => {
        const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return ipRegex.test(ip);
    }

    const validatePort = (port: string) => {
        const portRegex = /^[0-9]+$/;
        return portRegex.test(port);
    }

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>, isUpdate: boolean) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((formData as any).entries());

        if (channelType === 'TCPIP') {
            if (!validateIpAddress(formJson.ipAddress)) {
                setIpError("Invalid IP address format");
                return;
            } else {
                setIpError("");
            }

            if (!validatePort(formJson.port)) {
                setPortError("Port must be a number");
                return;
            } else {
                setPortError("");
            }
        }

        if (channelType === 'SERIAL') {
            if (!validatePort(formJson.baudRate)) {
                setPortError("Baud rate must be a number");
                return;
            } else {
                setPortError("");
            }
        }

        let channel: Channel = {
            name: formJson.name,
            code: formJson.code,
            type: channelType,
            value: channelType === 'TCPIP' ? `${formJson.port}:${formJson.ipAddress}` : `${formJson.comPort}:${formJson.baudRate}`,
            LTS: LTS,
            id: isUpdate ? selectedRows[0].id : 0
        };

        const resp = isUpdate ? await window.electronAPI.updateChannel(channel) : await window.electronAPI.createChannel(channel);
        if (resp.status) {
            setMessageTitle("Success");
            setMessageContent(resp.message);
            setMessageModal(true);
            handleRefreshButtonClick();
            handleClose();
        } else {
            setMessageTitle("Error");
            setMessageContent(resp.message);
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
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => handleFormSubmit(event, false),
                }}
            >
                <DialogTitle>Add Channel</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Fill in Channel details.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="name"
                        label="Channel Name"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        required
                        margin="dense"
                        id="code"
                        name="code"
                        label="Channel Code"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        select
                        required
                        margin="dense"
                        id="type"
                        name="type"
                        label="Channel Type"
                        value={channelType}
                        onChange={(e) => setChannelType(e.target.value as 'TCPIP' | 'SERIAL')}
                        fullWidth
                        variant="standard"
                        SelectProps={{ native: true }}
                    >
                        <option value="TCPIP">TCP/IP</option>
                        <option value="SERIAL">Serial</option>
                    </TextField>
                    {channelType === 'TCPIP' && (
                        <>
                            <TextField
                                required
                                margin="dense"
                                id="port"
                                name="port"
                                label="Port"
                                type="text"
                                fullWidth
                                variant="standard"
                                error={!!portError}
                                helperText={portError}
                            />
                            <TextField
                                required
                                margin="dense"
                                id="ipAddress"
                                name="ipAddress"
                                label="IP Address"
                                type="text"
                                fullWidth
                                variant="standard"
                                error={!!ipError}
                                helperText={ipError}
                            />
                        </>
                    )}
                    {channelType === 'SERIAL' && (
                        <>
                            <TextField
                                required
                                margin="dense"
                                id="comPort"
                                name="comPort"
                                label="COM Port"
                                type="text"
                                fullWidth
                                variant="standard"
                            />
                            <TextField
                                required
                                margin="dense"
                                id="baudRate"
                                name="baudRate"
                                label="Baud Rate"
                                type="text"
                                fullWidth
                                variant="standard"
                                error={!!portError}
                                helperText={portError}
                            />
                        </>
                    )}
                    <FormGroup row>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={LTS}
                                    onChange={(e) => setLTS(e.target.checked)}
                                    name="LTS"
                                    color="primary"
                                />
                            }
                            label="LTS"
                        />
                    </FormGroup>
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
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => handleFormSubmit(event, true),
                }}
            >
                <DialogTitle>Update Channel</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Update Channel details.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="name"
                        label="Channel Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={selectedRows[0]?.name}
                    />
                    <TextField
                        required
                        margin="dense"
                        id="code"
                        name="code"
                        label="Channel Code"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={selectedRows[0]?.code}
                    />
                    <TextField
                        select
                        required
                        margin="dense"
                        id="type"
                        name="type"
                        label="Channel Type"
                        value={channelType}
                        onChange={(e) => setChannelType(e.target.value as 'TCPIP' | 'SERIAL')}
                        fullWidth
                        variant="standard"
                        SelectProps={{ native: true }}
                    >
                        <option value="TCPIP">TCP/IP</option>
                        <option value="SERIAL">Serial</option>
                    </TextField>
                    {channelType === 'TCPIP' && (
                        <>
                            <TextField
                                required
                                margin="dense"
                                id="port"
                                name="port"
                                label="Port"
                                type="text"
                                fullWidth
                                variant="standard"
                                defaultValue={selectedRows[0]?.value.split(":")[0]}
                                error={!!portError}
                                helperText={portError}
                            />
                            <TextField
                                required
                                margin="dense"
                                id="ipAddress"
                                name="ipAddress"
                                label="IP Address"
                                type="text"
                                fullWidth
                                variant="standard"
                                defaultValue={selectedRows[0]?.value.split(":")[1]}
                                error={!!ipError}
                                helperText={ipError}
                            />
                        </>
                    )}
                    {channelType === 'SERIAL' && (
                        <>
                            <TextField
                                required
                                margin="dense"
                                id="comPort"
                                name="comPort"
                                label="COM Port"
                                type="text"
                                fullWidth
                                variant="standard"
                                defaultValue={selectedRows[0]?.value.split(":")[0]}
                            />
                            <TextField
                                required
                                margin="dense"
                                id="baudRate"
                                name="baudRate"
                                label="Baud Rate"
                                type="text"
                                fullWidth
                                variant="standard"
                                defaultValue={selectedRows[0]?.value.split(":")[1]}
                                error={!!portError}
                                helperText={portError}
                            />
                        </>
                    )}
                    <FormGroup row>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={LTS}
                                    onChange={(e) => setLTS(e.target.checked)}
                                    name="LTS"
                                    color="primary"
                                />
                            }
                            label="LTS"
                        />
                    </FormGroup>
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