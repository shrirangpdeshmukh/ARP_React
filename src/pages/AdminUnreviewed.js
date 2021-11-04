import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
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
  TablePagination
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import { UserListHead, UserMoreMenu } from '../components/_dashboard/user';
//
import USERLIST from '../_mocks_/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'branch', label: 'Branch', alignRight: false },
  { id: 'courseId', label: 'Course ID', alignRight: false },
  { id: 'courseName', label: 'Course Name', alignRight: false },
  { id: 'semester', label: 'Semester', alignRight: false },
  { id: 'type', label: 'Type', alignRight: false },
  { id: 'file', label: 'File', alignRight: false },
  { id: 'date', label: 'Date Uploaded', alignRight: false },
  { id: '' }
];
// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}

const colorMap = new Map([
  ['endsem', 'info'],
  ['midsem', 'warning'],
  ['other', 'error'],
  ['tutorial', 'secondary'],
  ['quiz', 'success']
]);

export default function User() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('date');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy));

  return (
    <Page title="User | Minimal-UI">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Unreviewed Resources
          </Typography>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 600 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  // numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  // onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { id, date, type, description, sem, courseId, courseName, branch } =
                        row;

                      return (
                        <TableRow hover key={id} tabIndex={-1}>
                          <TableCell component="th" scope="row">
                            <Typography variant="subtitle2">{branch}</Typography>
                          </TableCell>
                          <TableCell align="left">{courseId}</TableCell>
                          <TableCell align="left">{courseName}</TableCell>
                          <TableCell align="left">
                            <Stack direction="column" spacing={1}>
                              <Typography variant="subtitle3">{sem}</Typography>
                              <Typography variant="subtitle4">
                                {type !== 'midsem' && type !== 'endsem' && description.length > 0
                                  ? description
                                  : null}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">
                            <Label variant="ghost" color={colorMap.get(type)}>
                              {sentenceCase(type)}
                            </Label>
                          </TableCell>
                          <TableCell align="left">
                            <Button variant="outlined" component={RouterLink} to="#" size="small">
                              File
                            </Button>
                          </TableCell>

                          <TableCell align="left">{date}</TableCell>

                          <TableCell align="right">
                            <UserMoreMenu />
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
