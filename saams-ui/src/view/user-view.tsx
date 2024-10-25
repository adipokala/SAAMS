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
import { Refresh, Add, Delete, Update, Error, Warning, Radio } from '@mui/icons-material';
import { User, UserResponse } from '../model/user';
import { STRINGS } from '../constants';
import { RadioGroup, FormControlLabel, Select, MenuItem, InputLabel } from '@mui/material';
import { Designation } from '../model/designation';
import { Company } from '../model/company';
import { Role } from '../model/role';
import { Department } from '../model/department';
import { Shift } from '../model/shift';

let selectedRows: User[] = [];
let roles: Role[] = [];
let companies: Company[] = [];
let designations: Designation[] = [];
let departments: Department[] = [];
let shifts: Shift[] = [];

const handleOnGet = async () => {
  const resp = await window.electronAPI.getUsers();

  return resp;
}

const getAll = async () => {
  const respRol = await window.electronAPI.getRoles();
  if (respRol.status) {
    roles = respRol.roles;
  }
  // const resp = await window.electronAPI.getCompanies();
  const respDes = await window.electronAPI.getDesignations();
  if (respDes.status) {
    designations = respDes.designations;
  }
  const respDep = await window.electronAPI.getDepartments();
  if (respDep.status) {
    departments = respDep.departments;
  }
  const respShft = await window.electronAPI.getShifts();
  if (respShft.status) {
    shifts = respShft.shifts;
  }
}

export default function UserView() {
  const [rows, setRows] = React.useState<User[]>([]);
  const [initialLoad, setInitialLoad] = React.useState<boolean>(true);
  const [addModal, setAddModal] = React.useState<boolean>(false);
  const [updateModal, setUpdateModal] = React.useState<boolean>(false);
  const [messageModal, setMessageModal] = React.useState<boolean>(false);
  const [messageTitle, setMessageTitle] = React.useState<string>("");
  const [messageContent, setMessageContent] = React.useState<string>("");

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'firstName', headerName: 'First Name', width: 110 },
    { field: 'lastName', headerName: 'Last Name', width: 110},
    { field: 'userName', headerName: 'User Name', width: 110},
    { field: 'email', headerName: 'Email', width: 150},
    { field: 'phone', headerName: 'Phone', width: 110},
  ];

  const handleRefreshButtonClick = async () =>  {
    const response = await handleOnGet();
    if (!response.status) {
      setMessageTitle("Error");
      setMessageContent("Error fetching data");
      setMessageModal(true);
    }
    setRows(response.users);
  }

  const handleAddButtonClick = () => {
    setAddModal(true);
  }

  const handleUpdateButtonClick = () => {
    if (selectedRows.length > 1) {
      setMessageTitle("Update User");
      setMessageContent("Select only one item to edit.");
      setMessageModal(true);
    } else if (selectedRows.length == 0) {
      setMessageTitle("Update User");
      setMessageContent("Select an item to edit.");
      setMessageModal(true);
    } else {
      setUpdateModal(true);
    }
  }

  const handleDeleteButtonClick = async () => {
    if (selectedRows.length == 0) {
      setMessageTitle("Delete User");
      setMessageContent("Select an item to delete.");
      setMessageModal(true);
    } else {
      selectedRows.forEach(async (element) => {
        const resp = await window.electronAPI.deleteUser(element.id);
        if (!resp) {
          setMessageTitle("Delete User");
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
        {/*<Button variant="contained" onClick={handleUpdateButtonClick}>Modify <Update /></Button>*/}
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
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            let user: User = {
              userName: formJson.userName,
              firstName: formJson.firstName,
              lastName: formJson.lastName,
              password: formJson.password,
              sex: formJson.sex,
              email: formJson.email,
              phone: formJson.phone,
              roleId: formJson.roleId,
              companyId: formJson.companyId,
              designationId: formJson.designationId,
              departmentId: formJson.departmentId,
              shiftId: formJson.shiftId
            };
            const resp = await window.electronAPI.createUser(user);
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
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill in user name and code.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="firstName"
            name="firstName"
            label="First Name"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
            id="lastName"
            name="lastName"
            label="Last Name"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
            id="userName"
            name="userName"
            label="User Name"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
            id="password"
            name="password"
            label="Password"
            type="text"
            fullWidth
            variant="standard"
          />
          <RadioGroup
            id="sex"
            defaultValue="MALE"
            name="sex"
          >
            <FormControlLabel value="MALE" control={<Radio />} label="Male" />
            <FormControlLabel value="FEMALE" control={<Radio />} label="Female" />
          </RadioGroup>
          <TextField
            required
            margin="dense"
            id="email"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
            id="phone"
            name="phone"
            label="Phone"
            type="number"
            fullWidth
            variant="standard"
          />
          <InputLabel id="roleLabel">Role</InputLabel>
          <Select
            labelId="roleLabel"
            id="roleId"
            name="roleId"
            fullWidth
          >
            {
              roles.map((element) => (
                <MenuItem value={element.id}>{element.name}</MenuItem>
              ))
            }
          </Select>
          <InputLabel id="companyLabel">Company</InputLabel>
          <Select
            labelId="companyLabel"
            id="companyId"
            name="companyId"
            fullWidth
          >
            <MenuItem value="Company">Company</MenuItem>
          </Select>
          <InputLabel id="designationLabel">Designation</InputLabel>
          <Select
            labelId="designationLabel"
            id="designationId"
            name="designationId"
            fullWidth
          >
            {
              designations.map((element) => (
                <MenuItem value={element.id}>{element.name}</MenuItem>
              ))
            }
          </Select>
          <InputLabel id="departmentLabel">Department</InputLabel>
          <Select
            labelId="departmentLabel"
            id="departmentId"
            name="departmentId"
            fullWidth
          >
            {
              departments.map((element) => (
                <MenuItem value={element.id}>{element.name}</MenuItem>
              ))
            }
          </Select>
          <InputLabel id="shiftLabel">Shift</InputLabel>
          <Select
            labelId="shiftLabel"
            id="shiftId"
            name="shiftId"
            fullWidth
          >
            {
              shifts.map((element) => (
                <MenuItem value={element.id}>{element.name}</MenuItem>
              ))
            }
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{ STRINGS.cancel }</Button>
          <Button type="submit">{ STRINGS.add }</Button>
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
            let user: User = {
              id: selectedRows[0].id,
              userName: formJson.userName,
              firstName: formJson.firstName,
              lastName: formJson.lastName,
              password: formJson.password,
              sex: formJson.sex,
              email: formJson.email,
              phone: formJson.phone,
              roleId: formJson.roleId,
              companyId: formJson.companyId,
              designationId: formJson.designationId,
              departmentId: formJson.departmentId,
              shiftId: formJson.shiftId
            };
            const resp = await window.electronAPI.updateUser(user);
            if(resp) {
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
        <DialogTitle>Update User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update user name or code.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="firstName"
            name="firstName"
            label="First Name"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={ selectedRows[0] === undefined ? "" : selectedRows[0].firstName }
          />
          <TextField
            required
            margin="dense"
            id="lastName"
            name="lastName"
            label="Last Name"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={ selectedRows[0] === undefined ? "" : selectedRows[0].lastName }
          />
          <TextField
            required
            margin="dense"
            id="userName"
            name="userName"
            label="User Name"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={ selectedRows[0] === undefined ? "" : selectedRows[0].userName }
          />
          <TextField
            required
            margin="dense"
            id="password"
            name="password"
            label="Password"
            type="text"
            fullWidth
            variant="standard"
          />
          <RadioGroup
            id="sex"
            defaultValue={ selectedRows[0] === undefined ? "" : selectedRows[0].sex }
            name="sex"
          >
            <FormControlLabel value="MALE" control={<Radio />} label="Male" />
            <FormControlLabel value="FEMALE" control={<Radio />} label="Female" />
          </RadioGroup>
          <TextField
            required
            margin="dense"
            id="email"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            defaultValue={ selectedRows[0] === undefined ? "" : selectedRows[0].email }
          />
          <TextField
            required
            margin="dense"
            id="phone"
            name="phone"
            label="Phone"
            type="number"
            fullWidth
            variant="standard"
            defaultValue={ selectedRows[0] === undefined ? "" : selectedRows[0].phone }
          />
          <InputLabel id="roleLabel">Role</InputLabel>
          <Select
            labelId="roleLabel"
            id="roleId"
            name="roleId"
            fullWidth
            defaultValue={ selectedRows[0] === undefined ? "" : selectedRows[0].roleId }
          >
            {
              roles.map((element) => (
                <MenuItem value={element.id}>{element.name}</MenuItem>
              ))
            }
          </Select>
          <InputLabel id="companyLabel">Company</InputLabel>
          <Select
            labelId="companyLabel"
            id="companyId"
            name="companyId"
            fullWidth
          >
            <MenuItem value="Company">Company</MenuItem>
          </Select>
          <InputLabel id="designationLabel">Designation</InputLabel>
          <Select
            labelId="designationLabel"
            id="designationId"
            name="designationId"
            fullWidth
            defaultValue={ selectedRows[0] === undefined ? "" : selectedRows[0].designationId }
          >
            {
              designations.map((element) => (
                <MenuItem value={element.id}>{element.name}</MenuItem>
              ))
            }
          </Select>
          <InputLabel id="departmentLabel">Department</InputLabel>
          <Select
            labelId="departmentLabel"
            id="departmentId"
            name="departmentId"
            fullWidth
            defaultValue={ selectedRows[0] === undefined ? "" : selectedRows[0].departmentId }
          >
            {
              departments.map((element) => (
                <MenuItem value={element.id}>{element.name}</MenuItem>
              ))
            }
          </Select>
          <InputLabel id="shiftLabel">Shift</InputLabel>
          <Select
            labelId="shiftLabel"
            id="shiftId"
            name="shiftId"
            fullWidth
            defaultValue={ selectedRows[0] === undefined ? "" : selectedRows[0].shiftId }
          >
            {
              shifts.map((element) => (
                <MenuItem value={element.id}>{element.name}</MenuItem>
              ))
            }
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{ STRINGS.cancel }</Button>
          <Button type="submit">{ STRINGS.update }</Button>
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
          { messageTitle }
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            { messageContent }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{ STRINGS.ok }</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}