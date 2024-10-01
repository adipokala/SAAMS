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

interface ButtonProps {
  onGet: () => Promise<dataResponse[]>;
}
export default function DepartmentView({onGet}: ButtonProps) {
  const [rows, setRows] = React.useState<dataResponse[]>([]);
  let inputJson : dataResponse[];
  const handleButtonClick = async (event: React.MouseEvent) =>  {
    console.log('button clicked !');
    inputJson = await onGet();
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