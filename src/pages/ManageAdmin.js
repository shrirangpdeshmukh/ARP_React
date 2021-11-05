import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import personRemoveFill from '@iconify/icons-eva/person-remove-fill';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  TableHead,
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
  FormControl,
  InputLabel,
  DialogContent,
  Box,
  TextField
} from '@mui/material';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import { AdditionDialog } from '../components/_dashboard/admin_administrator';
// import { UserMoreMenu } from '../components/_dashboard/user';
//
import USERLIST from '../_mocks_/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', width: '45%' },
  { id: 'email', label: 'Email', width: '45%' },
  { id: '', width: '10%' }
];

// ----------------------------------------------------------------------

export default function Administrators() {
  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openDialog = () => {
    setDialogOpen(true);
  };
  const closeDialog = () => {
    setDialogOpen(false);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = USERLIST;

  return (
    <Page title="Administrators | ARP">
      <Container alignItems="center">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Administrators
          </Typography>
          <Button variant="contained" startIcon={<Icon icon={plusFill} />} onClick={openDialog}>
            New Admin
          </Button>
        </Stack>

        <AdditionDialog open={dialogOpen} handleClose={closeDialog} />
        <Grid container>
          <Grid item xl={2} sm={12} md={1} />
          <Grid item xl={8} sm={12} md={10}>
            <Card sx={{ md: 5 }}>
              <Scrollbar>
                <TableContainer>
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
                          const { id, name, email, avatarUrl } = row;

                          return (
                            <TableRow hover key={id} tabIndex={-1}>
                              <TableCell component="th" scope="row">
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <Avatar alt={name} src={avatarUrl} />
                                  <Typography variant="subtitle2" noWrap>
                                    {name}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell align="left">{email}</TableCell>

                              <TableCell align="right">
                                <Button
                                  variant="outlined"
                                  component={RouterLink}
                                  to="#"
                                  startIcon={<Icon icon={personRemoveFill} />}
                                  color="error"
                                >
                                  Remove
                                </Button>
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
          </Grid>
          <Grid item xl={2} sm={12} md={1} />
        </Grid>
      </Container>
    </Page>
  );
}
