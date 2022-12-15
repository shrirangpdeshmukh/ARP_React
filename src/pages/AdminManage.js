import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
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
  Snackbar,
  Alert
} from '@mui/material';

// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import { AdditionDialog } from '../components/_dashboard/admin_administrator';
import { getAdmins, checkOrg, addAdminToDB, removeAdminFromDB } from '../API/admins';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', width: '45%' },
  { id: 'email', label: 'Email', width: '45%' },
  { id: '', width: '10%' }
];

// ----------------------------------------------------------------------

export default function Administrators() {
  const [adminsList, setAdminsList] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [serverResponse, setServerResponse] = useState({ message: '', severity: 'info' });

  const handleClose = () => {
    setSnackbarOpen(false);
  };

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

  const filteredUsers = adminsList;

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - adminsList.length) : 0;

  const getAllAdmins = () => {
    getAdmins()
      .then((response) => {
        setAdminsList(response);
      })
      .catch((error) => {
        console.error(error);
        window.alert(error.message);
      });
  };

  const removeAdmin = (email) => {
    removeAdminFromDB(email)
      .then((response) => {
        console.log(response);
        if (response) {
          setServerResponse({ message: 'Admin Removed Successfully', severity: 'success' });
          setSnackbarOpen(true);
          const newAdmins = [...adminsList];
          const index = adminsList.findIndex((admin) => admin.email === email);
          newAdmins.splice(index, 1);
          setAdminsList(newAdmins);
        }
      })
      .catch((err) => {
        console.log(err);
        setServerResponse({ message: err.message, severity: 'error' });
        setSnackbarOpen(true);
      });
  };

  const addAdmin = (name, email) => {
    if (!checkOrg(email)) {
      setServerResponse({ message: 'Use institute Email-ID', severity: 'error' });
      setSnackbarOpen(true);
      return;
    }
    addAdminToDB(name, email)
      .then((response) => {
        console.log(response);
        if (response) {
          setServerResponse({ message: 'Admin Added Successfully', severity: 'success' });
          setSnackbarOpen(true);
          const newAdmins = [...adminsList];
          newAdmins.push({ name, email });
          setAdminsList(newAdmins);
        }
      })
      .catch((err) => {
        console.log(err);
        setServerResponse({ message: err.message, severity: 'error' });
        setSnackbarOpen(true);
      });
  };

  useEffect(() => {
    getAllAdmins();
  }, []);

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
        <Snackbar
          open={snackbarOpen}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity={serverResponse.severity} sx={{ width: '100%' }}>
            {serverResponse.message}
          </Alert>
        </Snackbar>
        <AdditionDialog open={dialogOpen} handleClose={closeDialog} onSubmit={addAdmin} />
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
                          const { name, email } = row;

                          return (
                            <TableRow hover key={email} tabIndex={-1}>
                              <TableCell component="th" scope="row">
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  {/* <Avatar alt={name} src={avatarUrl} /> */}
                                  <Typography variant="subtitle2" noWrap>
                                    {name}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell align="left">{email}</TableCell>

                              <TableCell align="right">
                                <Button
                                  variant="outlined"
                                  onClick={() => {
                                    removeAdmin(email);
                                  }}
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
                count={filteredUsers.length}
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
