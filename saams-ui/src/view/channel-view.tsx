import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Refresh, Add, Delete, Update } from '@mui/icons-material';
import { Channel, ChannelResponse } from '../model/channel';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField } from '@mui/material';
import { STRINGS } from '../constants';

let selectedRows: Channel[] = [];

const handleOnGet = async () => {
    const resp = await window.electronAPI.getChannels();
    console.log('API Response:', resp); // Log the response
    return resp;
};

export default function ChannelView() {
    const [rows, setRows] = React.useState<Channel[]>([]);
    const [initialLoad, setInitialLoad] = React.useState<boolean>(true);
    const [addModal, setAddModal] = React.useState<boolean>(false);
    const [updateModal, setUpdateModal] = React.useState<boolean>(false);
    const [messageModal, setMessageModal] = React.useState<boolean>(false);
    const [messageTitle, setMessageTitle] = React.useState<string>('');
    const [messageContent, setMessageContent] = React.useState<string>('');

    const columns: GridColDef<(typeof rows)[number]>[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'type', headerName: 'Type', width: 110 },
        { field: 'value', headerName: 'Value', width: 150 },
        { field: 'LTS', headerName: 'LTS', width: 100, type: 'boolean' },
        { field: 'created_at', headerName: 'Created At', width: 150 },
        { field: 'updated_at', headerName: 'Updated At', width: 150 },
    ];

    const handleRefreshButtonClick = async () => {
        const response = await handleOnGet();
        if (!response.status) {
            setMessageTitle('Error');
            setMessageContent('Error fetching data');
            setMessageModal(true);
        }
        setRows(response.channels);
    };

    const handleAddButtonClick = () => {
        setAddModal(true);
    };

    const handleUpdateButtonClick = () => {
        if (selectedRows.length > 1) {
            setMessageTitle('Update Channel');
            setMessageContent('Select only one item to edit.');
            setMessageModal(true);
        } else if (selectedRows.length === 0) {
            setMessageTitle('Update Channel');
            setMessageContent('Select an item to edit.');
            setMessageModal(true);
        } else {
            setUpdateModal(true);
        }
    };

    const handleDeleteButtonClick = async () => {
        if (selectedRows.length === 0) {
            setMessageTitle('Delete Channel');
            setMessageContent('Select an item to delete.');
            setMessageModal(true);
        } else {
            selectedRows.forEach(async (element) => {
                const resp = await window.electronAPI.deleteChannel(element.id);
                if (!resp) {
                    setMessageTitle('Delete Channel');
                    setMessageContent(`Failed to delete item with ID ${element.id}`);
                    setMessageModal(true);
                }
            });
            handleRefreshButtonClick();
        }
    };

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
        <Stack spacing={2} direction="column">
            <Stack spacing={2} direction="row">
                <Button variant="contained" onClick={handleRefreshButtonClick}>
                    Refresh <Refresh />
                </Button>
                <Button variant="contained" onClick={handleAddButtonClick}>
                    Add <Add />
                </Button>
                <Button variant="contained" onClick={handleUpdateButtonClick}>
                    Modify <Update />
                </Button>
                <Button variant="contained" onClick={handleDeleteButtonClick}>
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
                        const formJson = Object.fromEntries(formData.entries());
                        const channel: Channel = {
                            name: formJson.name as string,
                            type: formJson.type as string,
                            value: formJson.value as string,
                            LTS: formJson.LTS === 'true',
                            created_at: '',
                            updated_at: ''
                        };
                        const resp = await window.electronAPI.createChannel(channel);
                        if (resp) {
                            setMessageTitle('Success');
                            setMessageContent(resp.message);
                            setMessageModal(true);
                            handleRefreshButtonClick();
                        } else {
                            setMessageTitle('Error');
                            setMessageContent('Failed to create channel');
                            setMessageModal(true);
                        }
                        handleClose();
                    },
                }}
            >
                <DialogTitle>Add Channel</DialogTitle>
                <DialogContent>
                    <DialogContentText>Fill in channel details.</DialogContentText>
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
                        id="type"
                        name="type"
                        label="Channel Type"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        required
                        margin="dense"
                        id="value"
                        name="value"
                        label="Channel Value"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        required
                        margin="dense"
                        id="LTS"
                        name="LTS"
                        label="LTS (true/false)"
                        type="text"
                        fullWidth
                        variant="standard"
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
                        const formJson = Object.fromEntries(formData.entries());
                        const channel: Channel = {
                            id: selectedRows[0].id,
                            name: formJson.name as string,
                            type: formJson.type as string,
                            value: formJson.value as string,
                            LTS: formJson.LTS === 'true',
                            created_at: '',
                            updated_at: ''
                        };
                        const resp = await window.electronAPI.updateChannel(channel);
                        if (resp) {
                            setMessageTitle('Success');
                            setMessageContent(resp.message);
                            setMessageModal(true);
                            handleRefreshButtonClick();
                        } else {
                            setMessageTitle('Error');
                            setMessageContent('Failed to update channel');
                            setMessageModal(true);
                        }
                        handleClose();
                    },
                }}
            >
                <DialogTitle>Update Channel</DialogTitle>
                <DialogContent>
                    <DialogContentText>Fill in channel details.</DialogContentText>
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
                        defaultValue={selectedRows[0]?.name || ''}
                    />
                    <TextField
                        required
                        margin="dense"
                        id="type"
                        name="type"
                        label="Channel Type"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={selectedRows[0]?.type || ''}
                    />
                    <TextField
                        required
                        margin="dense"
                        id="value"
                        name="value"
                        label="Channel Value"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={selectedRows[0]?.value || ''}
                    />
                    <TextField
                        required
                        margin="dense"
                        id="LTS"
                        name="LTS"
                        label="LTS (true/false)"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={selectedRows[0]?.LTS || ''}
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
                <DialogTitle id="alert-dialog-title">{messageTitle}</DialogTitle>
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