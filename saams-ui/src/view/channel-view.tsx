import * as React from "react";
import { Stack, Button, TextField, MenuItem, Select, FormControl, InputLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Add } from "@mui/icons-material";
import { createChannel, getChannels } from "../api-request/channel";
import { Channel } from "../model/channel";

export default function ChannelView() {
    const [rows, setRows] = React.useState<Channel[]>([]);
    const [addModal, setAddModal] = React.useState<boolean>(false);

    const [channelType, setChannelType] = React.useState<string>("TCPIP");
    const [channel, setChannel] = React.useState<Channel>({
        id: 0,
        name: "",
        code: "",
        type: "TCPIP",
        value: "",
        LTS: false,
        description: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    });

    React.useEffect(() => {
        fetchChannels();
    }, []);

    const fetchChannels = async () => {
        const response = await getChannels();
        setRows(response.channels);
    };

    const handleSubmit = async () => {
        const resp = await createChannel(channel);
        if (resp) fetchChannels();
        setAddModal(false);
    };

    return (
        <Stack spacing={2}>
            <Button variant="contained" onClick={() => setAddModal(true)}>Add <Add /></Button>
            <DataGrid rows={rows} columns={[
                { field: "id", headerName: "ID", width: 90 },
                { field: "name", headerName: "Name", width: 150 },
                { field: "code", headerName: "Code", width: 110 },
                { field: "type", headerName: "Type", width: 110 },
                { field: "value", headerName: "Value", width: 150 },
                { field: "LTS", headerName: "LTS", width: 100, type: "boolean" },
                { field: "created_at", headerName: "Created At", width: 150 },
                { field: "updated_at", headerName: "Updated At", width: 150 },
            ]} pageSizeOptions={[5]} checkboxSelection />

            <Dialog open={addModal} onClose={() => setAddModal(false)}>
                <DialogTitle>Add Channel</DialogTitle>
                <DialogContent>
                    <TextField label="ID" type="number" fullWidth onChange={(e) => setChannel({ ...channel, id: Number(e.target.value) })} />
                    <TextField label="Name" fullWidth onChange={(e) => setChannel({ ...channel, name: e.target.value })} />
                    <TextField label="Code" fullWidth onChange={(e) => setChannel({ ...channel, code: e.target.value })} />
                    <FormControl fullWidth>
                        <InputLabel>Type</InputLabel>
                        <Select value={channelType} onChange={(e) => setChannelType(e.target.value)}>
                            <MenuItem value="TCPIP">TCPIP</MenuItem>
                            <MenuItem value="Serial">Serial</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddModal(false)}>Cancel</Button>
                    <Button onClick={handleSubmit}>Add</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
