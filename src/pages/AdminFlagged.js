import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material
import {
  Card,
  Box,
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
  TableHead,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import { OptionsMenu } from '../components/_dashboard/admin_flagged';
import {
  getAllFlaggedResources,
  clearFlagsOfResource,
  deleteResourcePaper
} from '../API/studyResources';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'branch', label: 'Branch', width: '5%' },
  { id: 'courseId', label: 'Course ID', width: '10%' },
  { id: 'courseName', label: 'Course Name', width: '26%' },
  { id: 'semester', label: 'Semester', width: '26%' },
  { id: 'flags', label: 'Flags', width: '30%' },
  // { id: 'file', label: 'File', width: '7%' },
  { id: '', width: '3%' }
];
// ----------------------------------------------------------------------

const colorMap = new Map([
  ['explicit', 'error'],
  ['duplicate', 'warning'],
  ['unclear', 'info'],
  ['irrelevant', 'success']
]);

const seperateFlagReasons = (flagReason) => {
  const flagReasons = {
    unclear: 0,
    irrelevant: 0,
    explicit: 0,
    duplicate: 0
  };

  flagReason.forEach((reason) => {
    flagReasons[reason.toLowerCase()] = flagReasons[reason.toLowerCase()] + 1;
  });

  return flagReasons;
};

export default function AdminFlagged() {
  const [loadMsg, setLoadMsg] = useState('Loading Flagged Resources. Please be patient ...');
  const [resources, setResources] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [serverResponse, setServerResponse] = useState({ message: '', severity: 'info' });

  const handleClose = () => {
    setSnackbarOpen(false);
  };

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - resources.length) : 0;

  const filteredUsers = resources;

  const getFlaggedResources = () => {
    getAllFlaggedResources()
      .then((response) => {
        console.log(response);
        setResources(response);
        setLoadMsg(null);
      })
      .catch((err) => {
        console.log(err);
        window.alert(err.message);
      });
  };

  const clearFlagsOfAResource = (subjectCode, resourceId) => {
    const branch = subjectCode.substring(0, 2);

    console.log('Called Clear Flags');
    clearFlagsOfResource(branch, subjectCode, resourceId)
      .then((response) => {
        console.log(response);
        if (response) {
          setServerResponse({ message: 'Flag Cleared Successfully', severity: 'success' });
          setSnackbarOpen(true);
          const newResoures = [...resources];
          const index = newResoures.findIndex((resource) => resource.resourceId === resourceId);
          newResoures.splice(index, 1);
          setResources(newResoures);
        }
      })
      .catch((err) => {
        console.log(err);
        setServerResponse({ message: err.message, severity: 'error' });
        setSnackbarOpen(true);
      });
  };

  const deleteResource = (subjectCode, resourceId) => {
    const branch = subjectCode.substring(0, 2);

    console.log('Called Delete File');

    deleteResourcePaper(branch, subjectCode, resourceId)
      .then((response) => {
        console.log(response);
        if (response) {
          setServerResponse({ message: 'File Deleted Successfully', severity: 'success' });
          setSnackbarOpen(true);
          const newResoures = [...resources];
          const index = newResoures.findIndex((resource) => resource.resourceId === resourceId);
          newResoures.splice(index, 1);
          setResources(newResoures);
        }
      })
      .catch((err) => {
        console.log(err);
        setServerResponse({ message: err.message, severity: 'error' });
        setSnackbarOpen(true);
      });
  };

  useEffect(() => {
    getFlaggedResources();
  }, []);

  return (
    <Page title="Admin | Flagged | ARP">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Flagged Resources
          </Typography>
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

        {!loadMsg ? (
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
                        const {
                          resourceId,
                          description,
                          semester,
                          year,
                          subjectCode,
                          subjectName,
                          flagReason,
                          downloadLink
                        } = row;

                        const flagReasons = seperateFlagReasons(flagReason);

                        // console.log(flagReasons);

                        return (
                          <TableRow
                            hover
                            key={resourceId}
                            tabIndex={-1}
                            sx={{ cursor: 'pointer' }}
                            onClick={() => {
                              // open file
                              window.open(downloadLink);
                            }}
                          >
                            <TableCell component="th" scope="row" align="center">
                              <Typography variant="subtitle2">
                                {subjectCode.substring(0, 2)}
                              </Typography>
                            </TableCell>
                            <TableCell align="left">{subjectCode}</TableCell>
                            <TableCell align="left">{subjectName}</TableCell>
                            <TableCell align="left">
                              <Stack direction="column" spacing={1}>
                                <Typography variant="subtitle3">{`${semester} ${year}`}</Typography>
                                <Typography variant="subtitle4">
                                  {description.length > 0 ? description : null}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell align="left">
                              <Box direction="row" spacing={1}>
                                {Object.entries(flagReasons).map((reason) => {
                                  // console.log(colorMap.get(reason[0]));
                                  if (reason[1] > 0)
                                    return (
                                      <Label
                                        variant="ghost"
                                        key={reason[0]}
                                        color={colorMap.get(reason[0])}
                                      >
                                        {`${sentenceCase(reason[0])} x${reason[1]}`}
                                      </Label>
                                    );
                                  return null;
                                })}
                              </Box>
                            </TableCell>
                            {/* <TableCell align="left">
                            <Button variant="outlined" component={RouterLink} to="#" size="small">
                              File
                            </Button>
                          </TableCell> */}

                            <TableCell align="right">
                              <OptionsMenu
                                clearFlags={clearFlagsOfAResource}
                                deleteFile={deleteResource}
                                details={{ subjectCode, resourceId }}
                              />
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
              count={resources.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              textAlign: 'center',
              mt: 10
            }}
          >
            <CircularProgress sx={{ margin: 'auto' }} />
            <Typography variant="h5" sx={{ fontWeight: 600, my: 3 }}>
              {loadMsg}
            </Typography>
          </Box>
        )}
      </Container>
    </Page>
  );
}
