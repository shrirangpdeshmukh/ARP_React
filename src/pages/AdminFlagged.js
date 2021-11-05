import { sentenceCase } from 'change-case';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  TableHead
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import { OptionsMenu } from '../components/_dashboard/admin_flagged';
//
import USERLIST from '../_mocks_/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'branch', label: 'Branch', width: '5%' },
  { id: 'courseId', label: 'Course ID', width: '10%' },
  { id: 'courseName', label: 'Course Name', width: '25%' },
  { id: 'semester', label: 'Semester', width: '20%' },
  { id: 'flags', label: 'Flags', width: '30%' },
  { id: 'file', label: 'File', width: '7%' },
  { id: '', width: '3%' }
];
// ----------------------------------------------------------------------

const colorMap = new Map([
  ['explicit', 'error'],
  ['duplicate', 'warning'],
  ['unclear', 'info'],
  ['irrelevant', 'success']
]);

export default function AdminFlagged() {
  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = USERLIST;

  return (
    <Page title="Admin | Flagged | ARP">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Flagged Resources
          </Typography>
        </Stack>

        <Card sx={{ my: 5 }}>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 600 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    {TABLE_HEAD.map((headCell) => (
                      <TableCell key={headCell.id} align="left" width={headCell.width}>
                        {headCell.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { id, description, sem, courseId, courseName, branch, flagReasons } =
                        row;

                      // console.log(flagReasons);

                      return (
                        <TableRow hover key={id} tabIndex={-1}>
                          <TableCell component="th" scope="row" align="center">
                            <Typography variant="subtitle2">{branch}</Typography>
                          </TableCell>
                          <TableCell align="left">{courseId}</TableCell>
                          <TableCell align="left">{courseName}</TableCell>
                          <TableCell align="left">
                            <Stack direction="column" spacing={1}>
                              <Typography variant="subtitle3">{sem}</Typography>
                              <Typography variant="subtitle4">
                                {description.length > 0 ? description : null}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">
                            <Stack direction="row" spacing={1}>
                              {Object.entries(flagReasons).map((reason) => {
                                console.log(colorMap.get(reason[0]));
                                if (reason[1] > 0)
                                  return (
                                    <Label variant="ghost" color={colorMap.get(reason[0])}>
                                      {`${sentenceCase(reason[0])} x${reason[1]}`}
                                    </Label>
                                  );
                                return null;
                              })}
                            </Stack>
                          </TableCell>
                          <TableCell align="left">
                            <Button variant="outlined" component={RouterLink} to="#" size="small">
                              File
                            </Button>
                          </TableCell>

                          <TableCell align="right">
                            <OptionsMenu />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
