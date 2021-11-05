import PropTypes from 'prop-types';
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import searchFill from '@iconify/icons-eva/search-fill';
// material
import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  Table,
  Stack,
  Button,
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
  InputAdornment
} from '@mui/material';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
//
import USERLIST_ from '../_mocks_/user';

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

BranchPage.propTypes = {
  branch: PropTypes.string.isRequired,
  branchCode: PropTypes.string.isRequired,
  courses: PropTypes.array
};

export default function BranchPage({
  branchCode = 'CSE',
  branch = 'Computer Science and Engineering',
  courses = USERLIST_
}) {
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const USERLIST = courses;

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
          course.courseName.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
          course.courseId.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    }
    return USERLIST;
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySearch(query);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title={`${branchCode} | ARP`}>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {branch}
            {/* Computer Science and Engineering */}
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/upload"
            startIcon={<Icon icon={plusFill} />}
          >
            Add
          </Button>
        </Stack>

        <Card>
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
                      const { id, courseName, courseId } = row;
                      return (
                        <TableRow hover key={id} tabIndex={-1} role="checkbox">
                          <TableCell
                            component="th"
                            scope="row"
                            style={{ paddingLeft: '10%', paddingRight: '10%' }}
                            sx={{ padding: 'normal' }}
                          >
                            <Typography variant="subtitle2" noWrap>
                              {courseId}
                            </Typography>
                          </TableCell>
                          <TableCell
                            align="left"
                            style={{ paddingLeft: '10%', paddingRight: '10%' }}
                            sx={{ padding: 'normal' }}
                          >
                            {courseName}
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
                        <SearchNotFound searchQuery={query} />
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
        </Card>
      </Container>
    </Page>
  );
}
