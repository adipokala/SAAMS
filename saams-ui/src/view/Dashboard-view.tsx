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

function createData(
  id: number,
  code: string,
  name: string,
) {
  return { id, code, name };
}

const rows = [
  createData(0, "dummy code", "dummy name")
];

interface ButtonProps {
  onGet: () => Promise<dataResponse>;
}
export default function DashboardView({onGet}: ButtonProps) {
  const [rows, setRows] = React.useState<dataResponse[]>([
    createData(0, "dummy code", "dummy name")
  ]);
  let inputJson : dataResponse;
  const handleButtonClick = async (event: React.MouseEvent) =>  {
    console.log('button clicked !');
    inputJson = await onGet();
    console.log(inputJson.id);
    console.log(inputJson.code);
    console.log(inputJson.name);
    setRows((prevRows) => [...prevRows, createData(inputJson.id, inputJson.code, inputJson.name)]);
  }
  return (
    <Stack spacing={2} direction="row">
      <Button variant="contained" onClick={handleButtonClick}>get</Button>
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
                {row.name}
              </TableCell>
              <TableCell align="right">{row.id}</TableCell>
              <TableCell align="right">{row.code}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    </Stack>
  );
}