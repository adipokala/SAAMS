import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Department } from '../model/department';

function createData(
  id: number,
  code: string,
  name: string,
) {
  return { id, code, name };
}

const handleOnGet = async () => {
  const id = await window.electronAPI.getDepartments();
  console.log(id);

  return id;
}

export default function DepartmentView() {
  const [rows, setRows] = React.useState<Department[]>([]);

  let inputJson : Department[];

  const handleButtonClick = async (event: React.MouseEvent) =>  {
    inputJson = await handleOnGet();
    console.log(inputJson);
    const updatedRows = [
      ...rows,
      ...inputJson.filter(
        (newEntry) => !rows.some((existingEntry) => existingEntry.id === newEntry.id)
      ),
    ];

    setRows(updatedRows);
  }

  return (
    <Stack spacing={2} direction="column">
      <Button variant="contained" onClick={handleButtonClick} style={{maxWidth: '60px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}>get</Button>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="right">Code</TableCell>
            <TableCell align="right">Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="right">{row.code}</TableCell>
              <TableCell align="right">{row.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    </Stack>
  );
}