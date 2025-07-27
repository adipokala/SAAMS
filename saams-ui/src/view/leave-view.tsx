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

export default function LeaveView() {
    const [rows, setRows] = React.useState([]);
    const [messageModal, setMessageModal] = React.useState(false);
    const [messageTitle, setMessageTitle] = React.useState("");
    const [messageContent, setMessageContent] = React.useState("");

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'code', headerName: 'Code', width: 110 },
        { field: 'description', headerName: 'Description', width: 200 },
        { field: 'count', headerName: 'Count', width: 100 }
    ];

    const handleClose = () => {
        setMessageModal(false);
    }

    return (
        <Stack spacing={2} direction="column">
            <Stack spacing={2} direction="row">
                <Button variant="contained">Refresh <Refresh /></Button>
                <Button variant="contained">Add <Add /></Button>
                <Button variant="contained">Modify <Update /></Button>
                <Button variant="contained">Delete <Delete /></Button>
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
            />

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
                    <Button onClick={handleClose}>OK</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
