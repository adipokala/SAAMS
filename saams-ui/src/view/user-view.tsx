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
import { Refresh, Add, Delete, Update, Error, Warning } from '@mui/icons-material';
import { User, UserResponse } from '../model/user';
import { STRINGS } from '../constants';
import { RadioGroup, Radio, FormControlLabel, Select, MenuItem, InputLabel, FormLabel } from '@mui/material';
import { Designation } from '../model/designation';
import { Company } from '../model/company';
import { Role } from '../model/role';
import { Department } from '../model/department';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Shift } from '../model/shift';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

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
  const respCmp = await window.electronAPI.getCompanies();
  if (respCmp.status) {
    companies = respCmp.companies;
  }
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
  const [currentUserId] = React.useState<number>(0); // Replace with actual current user ID updated
  const [updateModal, setUpdateModal] = React.useState<boolean>(false);
  const [messageModal, setMessageModal] = React.useState<boolean>(false);
  const [messageTitle, setMessageTitle] = React.useState<string>("");
  const [messageContent, setMessageContent] = React.useState<string>("");
  const [users, setUsers] = React.useState<User[]>([]);
  const [dob, setDob] = useState<Dayjs | null>(null);
  const [doj, setDoj] = useState<Dayjs | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'userNumber', headerName: 'User Number', width: 130 },
    { field: 'firstName', headerName: 'First Name', width: 110 },
    { field: 'lastName', headerName: 'Last Name', width: 110 },
    { field: 'userName', headerName: 'User Name', width: 110 },
    { field: 'reportsTo', headerName: 'Reports To', width: 110 },
    { field: 'email', headerName: 'Email', width: 150 },
    { field: 'phone', headerName: 'Phone', width: 110 },
  ];

  const handleRefreshButtonClick = async () => {
    const response = await handleOnGet();
    if (response.status) {
      setRows(response.users); // Always update the rows
    } else {
      setMessageTitle("Error");
      setMessageContent("Error fetching data");
      setMessageModal(true);
    }
  };
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
  //to fetch all users
  const handleOnGet = async () => {
    const resp = await window.electronAPI.getUsers();
    if (resp.status) {
      setUsers(resp.users); // Store the users list
    }
    return resp;
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
              id: selectedRows[0]?.id || 0, // Ensure id is set
              userNumber: formJson.userNumber,
              userName: formJson.userName,
              firstName: formJson.firstName,
              lastName: formJson.lastName,
              password: formJson.password,
              sex: formJson.sex,
              email: formJson.email,
              phone: formJson.phone,
              reportsTo: formJson.reportsTo,
              roleId: formJson.roleId,
              companyId: formJson.companyId,
              designationId: formJson.designationId,
              departmentId: formJson.departmentId,
              shiftId: formJson.shiftId,
              dateOfBirth: dob ? dob.format('YYYY-MM-DD') : undefined, // Format dob
              dateOfJoining: doj ? doj.format('YYYY-MM-DD') : undefined // Format doj
            };
            console.log(user);
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
            id="userNumber"
            name="userNumber"
            label="User-Number"
            type="alphanumeric"
            fullWidth
            variant="standard"
            inputProps={{
              pattern: "^[a-zA-Z0-9]+$", // Alphanumeric characters only
              title: "User Number must not contain spaces or special characters.",
              minLength: 6,
            }}
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              target.value = target.value.replace(/[^a-zA-Z0-9]/g, ""); // Remove invalid characters
            }}
          />
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
            type="password"
            fullWidth
            variant="standard"
            inputProps={{
              minLength: 8,
            }}
          />
          <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date of Birth"
              value={dob}
              onChange={(newValue) => setDob(newValue)}
              format="YYYY-MM-DD"
              sx={{ margin: 1 }}
            />
            <DatePicker
              label="Date of Joining"
              value={doj}
              onChange={(newValue) => {
                if (dob && newValue && newValue.isBefore(dob)) {
                  setErrorMessage("Date of Joining cannot be earlier than Date of Birth.");
                } else {
                  setErrorMessage("");
                  setDoj(newValue);
                }
              }}
              format="YYYY-MM-DD"
              minDate={dob}
              sx={{ margin: 1 }}
            />
            {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
          </LocalizationProvider>
          <InputLabel id="reportsToLabel">Reports To</InputLabel>
          <Select
            labelId="reportsToLabel"
            id="reportsTo"
            name="reportsTo"
            fullWidth
          >
            <MenuItem value={0}>None</MenuItem>
            {users
              .filter((user) => user.id !== currentUserId) // Exclude current user
              .map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} ({user.userName})
                </MenuItem>
              ))}
          </Select>

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
            {
              companies.map((element) => (
                <MenuItem value={element.id}>{element.name}</MenuItem>
              ))
            }
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
          <Button onClick={handleClose}>{STRINGS.cancel}</Button>
          <Button type="submit">{STRINGS.add}</Button>
        </DialogActions>
      </Dialog>

      {/* Update Modal */}
      {/* <Dialog
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
              shiftId: formJson.shiftId,
              dateOfBirth: '',
              dateOfJoining: '',
              userNumber: '',
              reportsTo: 0
            };
            const resp = await window.electronAPI.updateUser(user);
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
            defaultValue={selectedRows[0] === undefined ? "" : selectedRows[0].firstName}
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
            defaultValue={selectedRows[0] === undefined ? "" : selectedRows[0].lastName}
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
            defaultValue={selectedRows[0] === undefined ? "" : selectedRows[0].userName}
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
            defaultValue={selectedRows[0] === undefined ? "" : selectedRows[0].sex}
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
            defaultValue={selectedRows[0] === undefined ? "" : selectedRows[0].email}
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
            defaultValue={selectedRows[0] === undefined ? "" : selectedRows[0].phone}
          />
          <InputLabel id="roleLabel">Role</InputLabel>
          <Select
            labelId="roleLabel"
            id="roleId"
            name="roleId"
            fullWidth
            defaultValue={selectedRows[0] === undefined ? "" : selectedRows[0].roleId}
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
            defaultValue={selectedRows[0] === undefined ? "" : selectedRows[0].designationId}
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
            defaultValue={selectedRows[0] === undefined ? "" : selectedRows[0].departmentId}
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
            defaultValue={selectedRows[0] === undefined ? "" : selectedRows[0].shiftId}
          >
            {
              shifts.map((element) => (
                <MenuItem value={element.id}>{element.name}</MenuItem>
              ))
            }
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{STRINGS.cancel}</Button>
          <Button type="submit">{STRINGS.update}</Button>
        </DialogActions>
      </Dialog> */}

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