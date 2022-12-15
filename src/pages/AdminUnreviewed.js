import { useState, useEffect } from 'react';
import { sentenceCase } from 'change-case';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
  Box,
  TableHead,
  TableSortLabel,
  CircularProgress
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import { getAllUnreviewedResources } from '../API/studyResources';
import { OptionsMenu } from '../components/_dashboard/admin_unreviewed';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'branch', label: 'Branch', width: '5%' },
  { id: 'courseId', label: 'Course ID', width: '10%' },
  { id: 'courseName', label: 'Course Name', width: '26%' },
  { id: 'semester', label: 'Semester', width: '26%' },
  { id: 'type', label: 'Type', width: '8%' },
  // { id: 'file', label: 'File', width: '7%' },
  { id: 'user', label: 'Uploader', width: '10%' }
  // { id: 'date', label: 'Date Uploaded', width: '15%' },
  // { id: '', width: '3%' }
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
  ['others', 'error'],
  ['tutorial', 'secondary'],
  ['quiz', 'success']
]);

export default function AdminUnreviewed() {
  const navigate = useNavigate();

  const [loadMsg, setLoadMsg] = useState('Loading Unreviewed Resources. Please be patient ...');
  const [resources, setResources] = useState([]);

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

  const USERLIST = resources;

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy));

  const getUnreviewedResources = () => {
    getAllUnreviewedResources()
      .then((res) => {
        console.log(res);
        setResources(res);
        setLoadMsg(null);
      })
      .catch((err) => {
        console.log(err);
        window.alert('Something went wrong');
      });
  };

  useEffect(() => {
    getUnreviewedResources();
  }, []);

  return (
    <Page title="Admin | Unreviewed | ARP">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Unreviewed Resources
          </Typography>
        </Stack>
        {!loadMsg ? (
          <Card sx={{ my: 5 }}>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 600 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {TABLE_HEAD.map((headCell) => (
                        <TableCell
                          key={headCell.id}
                          align="left"
                          sortDirection={orderBy === headCell.id ? order : false}
                          width={headCell.width}
                        >
                          {headCell.id === orderBy ? (
                            <TableSortLabel
                              active
                              direction={order}
                              onClick={(event) => {
                                handleRequestSort(event, headCell.id);
                              }}
                            >
                              {headCell.label}

                              <Box sx={{ ...visuallyHidden }}>
                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                              </Box>
                            </TableSortLabel>
                          ) : (
                            headCell.label
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filteredUsers
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => {
                        const {
                          type,
                          description,
                          semester,
                          year,
                          subjectCode,
                          subjectName,
                          resourceId,
                          emailId: uploader,
                          downloadLink
                        } = row;

                        return (
                          <TableRow
                            hover
                            key={resourceId}
                            tabIndex={-1}
                            sx={{ cursor: 'pointer' }}
                            onClick={() => {
                              navigate(`/admin/review/${resourceId}`, {
                                state: {
                                  resourceId,
                                  type,
                                  sem: semester,
                                  courseName: subjectName,
                                  courseCode: subjectCode,
                                  year,
                                  desc: description,
                                  uploader,
                                  fileURL: downloadLink
                                }
                              });
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
                            {/* <TableCell align="left">
                            <Button variant="outlined" component={RouterLink} to="#" size="small">
                              File
                            </Button>
                          </TableCell> */}
                            <TableCell align="left">{uploader}</TableCell>
                            {/* <TableCell align="center">{date}</TableCell> */}

                            {/* <TableCell align="right">
                              <OptionsMenu />
                            </TableCell> */}
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
