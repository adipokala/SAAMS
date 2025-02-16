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
import { Channel } from '../model/channel';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

let selectedRows: Channel[] = [];

export default function ChannelView() {
    const [rows, setRows] = React.useState<Channel[]>([]);
    const [initialLoad, setInitialLoad] = React.useState<boolean>(true);
    const [addModal, setAddModal] = React.useState<boolean>(false);
    const [updateModal, setUpdateModal] = React.useState<boolean>(false);
    const [messageModal, setMessageModal] = React.useState<boolean>(false);
    const [messageTitle, setMessageTitle] = React.useState<string>("");
    const [messageContent, setMessageContent] = React.useState<string>("");
    const [channelType, setChannelType] = React.useState<'tcpip' | 'serial'>('tcpip');

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'code', headerName: 'Code', width: 100 },
        { field: 'type', headerName: 'Type', width: 110 },
        { field: 'value', headerName: 'Value', width: 150 },
        { field: 'LTS', headerName: 'LTS', width: 90, type: 'boolean' },
        { field: 'created_at', headerName: 'Created At', width: 150 },
        { field: 'updated_at', headerName: 'Updated At', width: 150 },
    ];

    const handleRefresh = async () => {
        const response = await window.electronAPI.getChannels();
        if (!response.status) {
            setMessageTitle("Error");
            setMessageContent("Error fetching data");
            setMessageModal(true);
        } else {
            setRows(response.channels);
        }
    };

    const handleAdd = () => {
        setAddModal(true);
    };

    const handleUpdate = () => {
        if (selectedRows.length !== 1) {
            setMessageTitle("Update Channel");
            setMessageContent("Select exactly one channel to update.");
            setMessageModal(true);
        } else {
            setUpdateModal(true);
        }
    };

    const handleDelete = async () => {
        if (selectedRows.length === 0) {
            setMessageTitle("Delete Channel");
            setMessageContent("Select a channel to delete.");
            setMessageModal(true);
        } else {
            for (const channel of selectedRows) {
                await window.electronAPI.deleteChannel(channel.id);
            }
            handleRefresh();
        }
    };

    const handleClose = () => {
        setAddModal(false);
        setUpdateModal(false);
        setMessageModal(false);
    };

    React.useEffect(() => {
        if (initialLoad) {
            handleRefresh();
            setInitialLoad(false);
        }
    }, [initialLoad]);

    return (
        <Stack spacing={2} direction="column">
            <Stack spacing={2} direction="row">
                <Button variant="contained" onClick={handleRefresh}>Refresh <Refresh /></Button>
                <Button variant="contained" onClick={handleAdd}>Add <Add /></Button>
                <Button variant="contained" onClick={handleUpdate}>Modify <Update /></Button>
                <Button variant="contained" onClick={handleDelete}>Delete <Delete /></Button>
            </Stack>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={(ids) => {
                    const selectedIds = new Set(ids);
                    selectedRows = rows.filter((row) => selectedIds.has(row.id));
                }}
            />

            {/* Add Modal */}
            <Dialog open={addModal} onClose={handleClose}>
                <DialogTitle>Add Channel</DialogTitle>
                <DialogContent>
                    <DialogContentText>Enter the channel details:</DialogContentText>
                    <TextField autoFocus required margin="dense" id="name" name="name" label="Channel Name" fullWidth />
                    <TextField required margin="dense" id="code" name="code" label="Channel Code" fullWidth />
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="type-label">Type</InputLabel>
                        <Select
                            labelId="type-label"
                            id="type"
                            name="type"
                            value={channelType}
                            onChange={(e) => setChannelType(e.target.value as 'tcpip' | 'serial')}
                            label="Type"
                        >
                            <MenuItem value="tcpip">TCP/IP</MenuItem>
                            <MenuItem value="serial">Serial</MenuItem>
                        </Select>
                    </FormControl>
                    {channelType === 'tcpip' && (
                        <>
                            <TextField required margin="dense" id="ipAddress" name="ipAddress" label="IP Address" fullWidth />
                            <TextField required margin="dense" id="port" name="port" label="Port" type="number" fullWidth />
                        </>
                    )}
                    {channelType === 'serial' && (
                        <>
                            <TextField required margin="dense" id="comPort" name="comPort" label="COM Port" fullWidth />
                            <TextField required margin="dense" id="baudRate" name="baudRate" label="Baud Rate" type="number" fullWidth />
                        </>
                    )}
                    <TextField required margin="dense" id="value" name="value" label="Value" type="number" fullWidth />
                    <TextField required margin="dense" id="LTS" name="LTS" label="LTS" type="text" fullWidth />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={async () => {
                        const newChannel: Channel = {
                            id: 0, // Auto-generated
                            name: (document.getElementById('name') as HTMLInputElement).value,
                            code: (document.getElementById('code') as HTMLInputElement).value,
                            type: channelType,
                            ipAddress: channelType === 'tcpip' ? (document.getElementById('ipAddress') as HTMLInputElement).value : undefined,
                            port: channelType === 'tcpip' ? parseInt((document.getElementById('port') as HTMLInputElement).value) : undefined,
                            comPort: channelType === 'serial' ? (document.getElementById('comPort') as HTMLInputElement).value : undefined,
                            baudRate: channelType === 'serial' ? parseInt((document.getElementById('baudRate') as HTMLInputElement).value) : undefined,
                            value: parseFloat((document.getElementById('value') as HTMLInputElement).value),
                            LTS: (document.getElementById('LTS') as HTMLInputElement).value === 'true',
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                        };
                        await window.electronAPI.addChannel(newChannel);
                        handleClose();
                        handleRefresh();
                    }}>Add</Button>
                </DialogActions>
            </Dialog>

            {/* Update Modal */}
            <Dialog open={updateModal} onClose={handleClose}>
                <DialogTitle>Update Channel</DialogTitle>
                <DialogContent>
                    <DialogContentText>Modify the channel details:</DialogContentText>
                    <TextField autoFocus required margin="dense" id="name" name="name" label="Channel Name" fullWidth defaultValue={selectedRows[0]?.name || ""} />
                    <TextField required margin="dense" id="code" name="code" label="Channel Code" fullWidth defaultValue={selectedRows[0]?.code || ""} />
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="type-label">Type</InputLabel>
                        <Select
                            labelId="type-label"
                            id="type"
                            name="type"
                            value={channelType}
                            onChange={(e) => setChannelType(e.target.value as 'tcpip' | 'serial')}
                            label="Type"
                            defaultValue={selectedRows[0]?.type || 'tcpip'}
                        >
                            <MenuItem value="tcpip">TCP/IP</MenuItem>
                            <MenuItem value="serial">Serial</MenuItem>
                        </Select>
                    </FormControl>
                    {channelType === 'tcpip' && (
                        <>
                            <TextField required margin="dense" id="ipAddress" name="ipAddress" label="IP Address" fullWidth defaultValue={selectedRows[0]?.ipAddress || ""} />
                            <TextField required margin="dense" id="port" name="port" label="Port" type="number" fullWidth defaultValue={selectedRows[0]?.port || ""} />
                        </>
                    )}
                    {channelType === 'serial' && (
                        <>
                            <TextField required margin="dense" id="comPort" name="comPort" label="COM Port" fullWidth defaultValue={selectedRows[0]?.comPort || ""} />
                            <TextField required margin="dense" id="baudRate" name="baudRate" label="Baud Rate" type="number" fullWidth defaultValue={selectedRows[0]?.baudRate || ""} />
                        </>
                    )}
                    <TextField required margin="dense" id="value" name="value" label="Value" type="number" fullWidth defaultValue={selectedRows[0]?.value || ""} />
                    <TextField required margin="dense" id="LTS" name="LTS" label="LTS" type="text" fullWidth defaultValue={selectedRows[0]?.LTS || ""} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={async () => {
                        const updatedChannel = {
                            ...selectedRows[0],
                            name: (document.getElementById('name') as HTMLInputElement).value,
                            code: (document.getElementById('code') as HTMLInputElement).value,
                            type: channelType,
                            ipAddress: channelType === 'tcpip' ? (document.getElementById('ipAddress') as HTMLInputElement).value : undefined,
                            port: channelType === 'tcpip' ? parseInt((document.getElementById('port') as HTMLInputElement).value) : undefined,
                            comPort: channelType === 'serial' ? (document.getElementById('comPort') as HTMLInputElement).value : undefined,
                            baudRate: channelType === 'serial' ? parseInt((document.getElementById('baudRate') as HTMLInputElement).value) : undefined,
                            value: parseFloat((document.getElementById('value') as HTMLInputElement).value),
                            LTS: (document.getElementById('LTS') as HTMLInputElement).value === 'true',
                            updated_at: new Date().toISOString(),
                        };
                        await window.electronAPI.updateChannel(updatedChannel);
                        handleClose();
                        handleRefresh();
                    }}>Update</Button>
                </DialogActions>
            </Dialog>

            {/* Message Dialog */}
            <Dialog open={messageModal} onClose={handleClose}>
                <DialogTitle>{messageTitle}</DialogTitle>
                <DialogContent><DialogContentText>{messageContent}</DialogContentText></DialogContent>
                <DialogActions><Button onClick={handleClose}>OK</Button></DialogActions>
            </Dialog>
        </Stack>
    );
}