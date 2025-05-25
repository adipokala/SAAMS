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

  const handleRefreshButtonClick = React.useCallback(async () => {
    const response = await window.electronAPI.getRoles();
    if (!response.status) {
      showMessage('Error', 'Error fetching data');
    } else {
      setRows(response.roles);
    }
  }, []);

  const fetchPrivileges = React.useCallback(async () => {
    const response = await window.electronAPI.getPrivileges();
    if (response.status) {
      setPrivileges(response.privileges);
      console.log('Privileges fetched and set:', response.privileges);
    } else {
      console.log('Failed to fetch privileges:', response);
    }
  }, []);

  const handleAddButtonClick = async () => {
    setSelectedPrivileges([]);
    await fetchPrivileges();
    setAddModal(true);
  };

  const handleUpdateButtonClick = async () => {
    if (selectedRows.length !== 1) {
      showMessage('Update Role', selectedRows.length === 0 ? 'Select an item to edit.' : 'Select only one item to edit.');
    } else {
      await fetchPrivileges();
      const response = await window.electronAPI.getRolePrivileges();
      if (response.status) {
        const rolePrivileges = response.rolePrivileges.filter(rp => rp.roleId === selectedRows[0].id);
        setSelectedPrivileges(rolePrivileges.map(rp => rp.privilegeId));
      }
      setUpdateModal(true);
    }
  };

  const handleDeleteButtonClick = async () => {
    if (selectedRows.length === 0) {
      showMessage('Delete Role', 'Select an item to delete.');
    } else {
      for (const element of selectedRows) {
        const resp = await window.electronAPI.deleteRole(element.id);
        if (!resp) {
          showMessage('Delete Role', `Failed to delete item with ID ${element.id}`);
        }
      }
      handleRefreshButtonClick();
    }
  };

  const handleUpdateRole = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    const updatedRole: Role = {
      id: selectedRows[0].id,
      name: formJson.name as string,
      code: formJson.code as string,
    };

    const updateResp = await window.electronAPI.updateRole(updatedRole);
    if (!updateResp.status) {
      showMessage('Error', updateResp.message);
      return;
    }

    await updateRolePrivileges(updatedRole.id);
    showMessage('Success', 'Role updated successfully.');
    handleRefreshButtonClick();
    handleClose();
  };

  const updateRolePrivileges = async (roleId: number) => {
    try {
      // Get current role privileges from backend
      const rolePrivilegesResp = await window.electronAPI.getRolePrivileges();
      if (!rolePrivilegesResp.status) {
        showMessage('Error', 'Failed to fetch current role privileges');
        return;
      }
  
      // Get existing privilege mappings with their full RolePrivilege objects
      const existingRolePrivileges = rolePrivilegesResp.rolePrivileges
        .filter(rp => rp.roleId === roleId);
  
      // Extract just the privilege IDs for comparison
      const existingPrivilegeIds = existingRolePrivileges.map(rp => rp.privilegeId);
  
      // Determine privileges to add and remove
      const privilegesToAdd = selectedPrivileges.filter(id => !existingPrivilegeIds.includes(id));
      const privilegesToRemove = existingRolePrivileges.filter(rp => !selectedPrivileges.includes(rp.privilegeId));
  
      // Remove unselected privileges using their unique IDs
      if (privilegesToRemove.length > 0) {
        const deletePromises = privilegesToRemove.map(async (rolePrivilege) => {
          // Use the full RolePrivilege id (assuming it has an 'id' field)
          const response = await window.electronAPI.deleteRolePrivilege(rolePrivilege.id);
          if (!response.status) {
            throw new Error(`Failed to delete privilege ${rolePrivilege.privilegeId} for role ${roleId}`);
          }
        });
  
        await Promise.all(deletePromises);
      }
  
      // Add new privileges
      if (privilegesToAdd.length > 0) {
        const addPromises = privilegesToAdd.map(async (privilegeId) => {
          const rolePrivilege: RolePrivilege = { roleId, privilegeId, userRoleId: 0, userPrivilegeId: 0 };
          const response = await window.electronAPI.createRolePrivilege(rolePrivilege);
          if (!response.status) {
            throw new Error(`Failed to add privilege ${privilegeId} to role ${roleId}`);
          }
        });
  
        await Promise.all(addPromises);
      }
    } catch (error) {
      showMessage('Error', `Failed to update role privileges: ${error.message}`);
      throw error;
    }
  };

  const handleShowPrivileges = async () => {
    if (selectedRows.length === 0) {
      showMessage('Show Privileges', 'Select a role to show privileges.');
      return;
    }
    if (selectedRows.length > 1) {
      showMessage('Show Privileges', 'Select only one role to show privileges.');
      return;
    }
    
    if (privileges.length === 0) {
      showMessage('Loading', 'Please wait while privileges are being loaded...');
      await fetchPrivileges(); // Fetch privileges if not loaded
    }
  
    const roleId = selectedRows[0].id;
    const response = await window.electronAPI.getRolePrivileges();
    if (response.status) {
      const rolePrivileges = response.rolePrivileges.filter(rp => rp.roleId === roleId);
      // console.log('Filtered Role Privileges:', rolePrivileges);
      const privilegesList = privileges.filter(privilege => 
        rolePrivileges.some(rp => rp.privilegeId === privilege.id)
      );
      // console.log('Computed Privileges List:', privilegesList);
      setSelectedRolePrivileges(privilegesList);
      setPrivilegesModal(true);
    } else {
      showMessage('Error', 'Failed to fetch role privileges');
    }
  };

  const showMessage = (title: string, content: string) => {
    setMessageTitle(title);
    setMessageContent(content);
    setMessageModal(true);
  };

  const handleClose = () => {
    setAddModal(false);
    setUpdateModal(false);
    setMessageModal(false);
    setPrivilegesModal(false);
  };

  React.useEffect(() => {
    if (initialLoad) {
      const loadData = async () => {
        await fetchPrivileges(); // Fetch privileges first
        await handleRefreshButtonClick(); // Then fetch roles
        setInitialLoad(false);
      };
      loadData();
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
            const role: Role = {
              name: formJson.name as string,
              code: formJson.code as string,
            };
            const resp = await window.electronAPI.createRole(role);
            if (resp.status) {
              await Promise.all(selectedPrivileges.map(privilegeId => {
                const rolePrivilege: RolePrivilege = { roleId: resp.role.id, privilegeId, userRoleId: 0, userPrivilegeId: 0 };
                return window.electronAPI.createRolePrivilege(rolePrivilege);
              }));
              showMessage("Success", "Role created successfully.");
              handleRefreshButtonClick();
            } else {
              showMessage("Error", resp.message);
            }
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{STRINGS.cancel}</Button>
          <Button type="submit">{STRINGS.add}</Button>
        </DialogActions>
      </Dialog>

      {/* Update Role Modal */}
      <Dialog
        open={updateModal}
        onClose={handleClose}
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
        <DialogContent>
          <DialogContentText>{messageContent}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{STRINGS.ok}</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}