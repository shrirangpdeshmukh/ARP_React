// react
import { useState, useEffect } from 'react';
//
import { filter } from 'lodash';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// material
import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  Table,
  Stack,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Toolbar,
  OutlinedInput,
  InputAdornment,
  Grid
} from '@mui/material';
// iconify
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import searchFill from '@iconify/icons-eva/search-fill';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';

import { branches } from '../assets/data/branchData';
import useSubjectsContext from '../hooks/useSubjectsContext';
// import courseData from '../assets/data/courseData.json';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3)
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`
  }
}));

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'courseId', label: 'Course ID', width: '40%' },
  { id: 'courseName', label: 'Course Name', width: '60%' }
];

// ----------------------------------------------------------------------

export default function BranchPage() {
  const navigate = useNavigate();
  const { branchSubjectList } = useSubjectsContext();

  const [fetched, setFetched] = useState(false);

  const [page, setPage] = useState(0);
  const [query, setQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [branchCode, setBranchCode] = useState('');
  const [branch, setBranch] = useState('');
  const [courses, setCourses] = useState([]);

  const USERLIST = [...courses];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setQuery(event.target.value);
  };

  function applySearch(query) {
    if (query) {
      return filter(
        USERLIST,
        (course) =>
          course.subjectName.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
          course.subjectCode.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    }
    return USERLIST;
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySearch(query);

  const isUserNotFound = filteredUsers.length === 0;

  useEffect(() => {
    if (courses && courses.length > 0) setFetched(true);
  }, [courses]);

  const handleSBS = (courseData) => {
    const branchesInSBS = ['MA', 'CY', 'PH'];
    const SBSBranches = filter(courseData, (el) => branchesInSBS.includes(el.branchName));
    const SBSCourses = [];
    SBSBranches.forEach((branch) => {
      branch.data.forEach((course) => {
        SBSCourses.push(course);
      });
    });

    return SBSCourses;
  };

  const getCourses = (branch) => {
    const courseData = branchSubjectList;
    if (branch === 'SBS') {
      const SBSCourses = handleSBS(courseData);
      setCourses(SBSCourses);
    } else {
      const index = courseData.findIndex((el) => el.branchName === branch);
      if (index >= 0) setCourses(courseData[index].data);
    }
    setFetched(true);
  };

  useEffect(() => {
    const url = window.location.pathname;
    const courseStr = url.split('/')[2];
    const index = branches.findIndex(
      (el) => el.show && el.title.toUpperCase() === courseStr.toUpperCase()
    );

    if (index < 0) navigate('/404', { replace: true });
    else {
      setBranch(branches[index].subtitle);
      setBranchCode(branches[index].title);
      getCourses(branches[index].code);
    }
  }, []);

  return (
    <Page title={`${branchCode} | ARP`}>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {branch}
            {/* Computer Science and Engineering */}
          </Typography>
          {/* <Button
            variant="contained"
            component={RouterLink}
            to="/upload"
            startIcon={<Icon icon={plusFill} />}
          >
            Add
          </Button> */}
        </Stack>
        <Grid container style={{ marginTop: '-5%' }}>
          <Grid item xl={2} sm={12} md={1} />
          <Grid item xl={8} sm={12} md={10}>
            <Card sx={{ my: 5 }}>
              <RootStyle>
                <SearchStyle
                  value={query}
                  onChange={handleFilterByName}
                  placeholder="Search course ..."
                  startAdornment={
                    <InputAdornment position="start">
                      <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  }
                />
              </RootStyle>

              <Scrollbar>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {TABLE_HEAD.map((headCell) => (
                          <TableCell
                            key={headCell.id}
                            align="left"
                            width={headCell.width}
                            style={{ paddingLeft: '10%', paddingRight: '10%' }}
                            sx={{ padding: 'normal' }}
                          >
                            {headCell.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredUsers
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                          const { subjectName, subjectCode } = row;
                          return (
                            <TableRow
                              hover
                              key={subjectCode}
                              tabIndex={-1}
                              role="checkbox"
                              sx={{ cursor: 'pointer' }}
                              onClick={() => {
                                navigate(`/course/${subjectCode}`);
                              }}
                            >
                              <TableCell
                                component="th"
                                scope="row"
                                padding="normal"
                                style={{ paddingLeft: '10%', paddingRight: '10%' }}
                              >
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <Typography variant="subtitle2" noWrap>
                                    {subjectCode}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell
                                align="left"
                                style={{ paddingLeft: '10%', paddingRight: '10%' }}
                                sx={{ padding: 'normal' }}
                              >
                                {subjectName}
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
                    {isUserNotFound && (
                      <TableBody>
                        <TableRow>
                          <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                            <SearchNotFound searchQuery={query} loading={!fetched} />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
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
            </Card>{' '}
          </Grid>
          <Grid item xl={2} sm={12} md={1} />
        </Grid>
      </Container>
    </Page>
  );
}
