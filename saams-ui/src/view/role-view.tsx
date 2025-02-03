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
import { Refresh, Add, Delete, Update, Visibility } from '@mui/icons-material';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Role, RoleResponse } from '../model/role';
import { Privilege } from '../model/privilege';
import { Privilege } from '../model/privilege';
import { STRINGS } from '../constants';
import { RolePrivilege } from '../model/role-privilege';

let selectedRows: Role[] = [];



export default function RoleView() {
  const [rows, setRows] = React.useState<Role[]>([]);
  const [privileges, setPrivileges] = React.useState<Privilege[]>([]);
  const [selectedPrivileges, setSelectedPrivileges] = React.useState<number[]>([]);
  const [initialLoad, setInitialLoad] = React.useState<boolean>(true);
  const [addModal, setAddModal] = React.useState<boolean>(false);
  const [updateModal, setUpdateModal] = React.useState<boolean>(false);
  const [messageModal, setMessageModal] = React.useState<boolean>(false);
  const [privilegesModal, setPrivilegesModal] = React.useState<boolean>(false);
  const [messageTitle, setMessageTitle] = React.useState<string>('');
  const [messageContent, setMessageContent] = React.useState<string>('');
  const [selectedRolePrivileges, setSelectedRolePrivileges] = React.useState<Privilege[]>([]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'code', headerName: 'Code', width: 110 },
  ];

  const handleRefreshButtonClick = async () => {
    const response = await window.electronAPI.getRoles();
    if (!response.status) {
      setMessageTitle("Error");
      setMessageContent("Error fetching data");
      setMessageModal(true);
    }
    setRows(response.roles);
  };

  const fetchPrivileges = async () => {
    const response = await window.electronAPI.getPrivileges();
    if (response.status) {
      setPrivileges(response.privileges);
    }
  };

  const handleAddButtonClick = async () => {
    setSelectedPrivileges([]);
    await fetchPrivileges();
  const handleAddButtonClick = async () => {
    setSelectedPrivileges([]);
    await fetchPrivileges();
    setAddModal(true);
  };
  };

  const handleUpdateButtonClick = async () => {
    if (selectedRows.length !== 1) {
      setMessageTitle("Update Role");
      setMessageContent(selectedRows.length === 0 ? "Select an item to edit." : "Select only one item to edit.");
      setMessageModal(true);
    } else {
      await fetchPrivileges();
      const response = await window.electronAPI.getRolePrivileges();
      if (response.status) {
        const rolePrivileges = response.rolePrivileges.filter(rp => rp.userRoleId === selectedRows[0].id);
        setSelectedPrivileges(rolePrivileges.map(rp => rp.userPrivilegeId));
      }
      setUpdateModal(true);
    }
  };
  };

  const handleDeleteButtonClick = async () => {
    if (selectedRows.length === 0) {
      setMessageTitle("Delete Role");
      setMessageContent("Select an item to delete.");
      setMessageModal(true);
    } else {
      for (const element of selectedRows) {
      for (const element of selectedRows) {
        const resp = await window.electronAPI.deleteRole(element.id);
        if (!resp) {
          showMessage('Delete Role', `Failed to delete item with ID ${element.id}`);
        }
      }
      }
      handleRefreshButtonClick();
    }
  };

  const handleUpdateRole = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    let updatedRole: Role = {
      id: selectedRows[0].id,
      name: formJson.name as string,
      code: formJson.code as string,
    };

    const updateResp = await window.electronAPI.updateRole(updatedRole);


    if (!updateResp.status) {
      setMessageTitle("Error");
      setMessageContent(updateResp.message);
      setMessageModal(true);
      return;
    }

    // Fetch existing role-privilege associations
    const rolePrivilegesResp = await window.electronAPI.getRolePrivileges();
    if (!rolePrivilegesResp.status) return;

    const existingRolePrivileges = rolePrivilegesResp.rolePrivileges
      .filter(rp => rp.userRoleId === updatedRole.id)
      .map(rp => rp.userPrivilegeId);

    // Determine which privileges to add or remove
    const privilegesToAdd = selectedPrivileges.filter(id => !existingRolePrivileges.includes(id));
    const privilegesToRemove = existingRolePrivileges.filter(id => !selectedPrivileges.includes(id));

    // Remove unselected privileges
    for (const privilegeId of privilegesToRemove) {
      await window.electronAPI.deleteRolePrivilege(privilegeId);
    }

     // Add new privileges
    for (const privilegeId of privilegesToAdd) {
      await window.electronAPI.createRolePrivilege({
        userRoleId: updatedRole.id,
        userPrivilegeId: privilegeId,
      });
    }
    setMessageTitle("Success");
    setMessageContent("Role updated successfully.");
    setMessageModal(true);
    handleRefreshButtonClick();
    handleClose();
  };

  const handleDeleteRole = async () => {
    if (selectedRows.length === 0) {
      setMessageTitle("Delete Role");
      setMessageContent("Select a role to delete.");
      setMessageModal(true);
      return;
    }

    for (const role of selectedRows) {
      // Fetch role privileges and delete associations
      const rolePrivilegesResp = await window.electronAPI.getRolePrivileges();
      if (rolePrivilegesResp.status) {
        const rolePrivileges = rolePrivilegesResp.rolePrivileges.filter(rp => rp.userRoleId === role.id);
        for (const rp of rolePrivileges) {
          await window.electronAPI.deleteRolePrivilege(rp.id);
        }
      }

      // Delete the role
      const roleResp = await window.electronAPI.deleteRole(role.id);
      if (!roleResp.status) {
        setMessageTitle("Error");
        setMessageContent(`Failed to delete role ID ${role.id}`);
        setMessageModal(true);
      }
    }

    setMessageTitle("Success");
    setMessageContent("Role(s) deleted successfully.");
    setMessageModal(true);
    handleRefreshButtonClick();
  };

  const handleClose = () => {
    setAddModal(false);
    setUpdateModal(false);
    setMessageModal(false);
    setPrivilegesModal(false);
  };

  React.useEffect(() => {
    if (initialLoad) {
      handleRefreshButtonClick();
      setInitialLoad(false);
    }
  }, [initialLoad, handleRefreshButtonClick]);

  return (
    <Stack spacing={2} direction="column">
      <Stack spacing={2} direction="row">
        <Button variant="contained" onClick={handleRefreshButtonClick}>Refresh <Refresh /></Button>
        <Button variant="contained" onClick={handleAddButtonClick}>Add <Add /></Button>
        <Button variant="contained" onClick={handleUpdateButtonClick}>Modify <Update /></Button>
        <Button variant="contained" onClick={handleDeleteButtonClick}>Delete <Delete /></Button>
        <Button variant="contained" onClick={handleShowPrivileges}>Show Privileges <Visibility /></Button>
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

      {/* Add Role Modal */}
      <Dialog
        open={addModal}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            let role: Role = {
              name: formJson.name as string,
              code: formJson.code as string,
            };
            const resp = await window.electronAPI.createRole(role);
            if (resp.status) {
              selectedPrivileges.forEach(async (privilegeId) => {
                console.log(privilegeId +" "+ resp.role.id);
                let rolePrivilege : RolePrivilege = {
                  userRoleId: resp.role.id,
                  userPrivilegeId: privilegeId,
                };
                await window.electronAPI.createRolePrivilege(rolePrivilege);
              });
              setMessageTitle("Success");
              setMessageContent("Role created successfully.");
              handleRefreshButtonClick();
            } else {
              setMessageTitle("Error");
              setMessageContent(resp.message);
            }
            setMessageModal(true);
            handleClose();
          },
        }}
      >

        <DialogTitle>Add Role</DialogTitle>
        <DialogContent>
          <TextField autoFocus required margin="dense" name="name" label="Role Name" fullWidth variant="standard" />
          <TextField required margin="dense" name="code" label="Role Code" fullWidth variant="standard" />
          <FormGroup>
            {privileges.map((privilege) => (
              <FormControlLabel
                key={privilege.id}
                control={<Checkbox checked={selectedPrivileges.includes(privilege.id)} onChange={(e) => {
                  setSelectedPrivileges(e.target.checked
                    ? [...selectedPrivileges, privilege.id]
                    : selectedPrivileges.filter(id => id !== privilege.id));
                }} />}
                label={privilege.name}
              />
            ))}
          </FormGroup>
          <TextField autoFocus required margin="dense" name="name" label="Role Name" fullWidth variant="standard" />
          <TextField required margin="dense" name="code" label="Role Code" fullWidth variant="standard" />
          <FormGroup>
            {privileges.map((privilege) => (
              <FormControlLabel
                key={privilege.id}
                control={<Checkbox checked={selectedPrivileges.includes(privilege.id)} onChange={(e) => {
                  setSelectedPrivileges(e.target.checked
                    ? [...selectedPrivileges, privilege.id]
                    : selectedPrivileges.filter(id => id !== privilege.id));
                }} />}
                label={privilege.name}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{STRINGS.cancel}</Button>
          <Button type="submit">{STRINGS.add}</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={updateModal}
        onClose={handleClose}
        PaperProps={{ component: 'form', onSubmit: handleUpdateRole }}
        PaperProps={{ component: 'form', onSubmit: handleUpdateRole }}
      >
        <DialogTitle>Update Role</DialogTitle>
        <DialogContent>
          <TextField autoFocus required margin="dense" name="name" label="Role Name" fullWidth variant="standard" defaultValue={selectedRows[0]?.name} />
          <TextField required margin="dense" name="code" label="Role Code" fullWidth variant="standard" defaultValue={selectedRows[0]?.code} />

          <FormGroup>
            {privileges.map((privilege) => (
              <FormControlLabel
                key={privilege.id}
                control={<Checkbox checked={selectedPrivileges.includes(privilege.id)} onChange={(e) => {
                  setSelectedPrivileges(e.target.checked
                    ? [...selectedPrivileges, privilege.id]
                    : selectedPrivileges.filter(id => id !== privilege.id));
                }} />}
                label={privilege.name}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{STRINGS.cancel}</Button>
          <Button type="submit">{STRINGS.update}</Button>
        </DialogActions>
      </Dialog>

      {/* Show Privileges Modal */}
      <Dialog open={privilegesModal} onClose={handleClose}>
        <DialogTitle>Role Privileges</DialogTitle>
        <DialogContent>
          <FormGroup>
            {selectedRolePrivileges.map((privilege) => (
              <FormControlLabel
                key={privilege.id}
                control={<Checkbox checked={true} disabled />}
                label={`${privilege.name} (ID: ${privilege.id})`}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{STRINGS.ok}</Button>
        </DialogActions>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={messageModal} onClose={handleClose}>
        <DialogTitle>{messageTitle}</DialogTitle>
      <Dialog open={messageModal} onClose={handleClose}>
        <DialogTitle>{messageTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{messageContent}</DialogContentText>
          <DialogContentText>{messageContent}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{STRINGS.ok}</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
