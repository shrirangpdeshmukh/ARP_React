import PropTypes from 'prop-types';
// react
import { useState, useEffect } from 'react';
//
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// axios
import axios from 'axios';
// material
import {
  Card,
  Table,
  Stack,
  Button,
  Box,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  CardHeader,
  Grid,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
// iconify
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import flag from '@iconify/icons-bi/flag';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
//
import USERLIST from '../_mocks_/user';

import { branches } from '../assets/data/branchData';
import courseData from '../assets/data/courseData.json';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', width: 'calc(100% - 200px)' },
  { id: 'company', label: 'Uploaded On', width: '120px' },
  { id: '', width: '80px' }
];

const ColorButton = styled(IconButton)(({ theme, color = 'primary' }) => ({
  backgroundColor: theme.palette[color].lighter,
  '&:hover': {
    backgroundColor: theme.palette[color].light
  }
}));

const TypeCard = ({ details }) => {
  if (details.array.length > 0) {
    return (
      <Grid item xs={12} sm={6} md={6} padding={1} mb={5}>
        <Card>
          <CardHeader title={details.title} />
          <Box style={{ maxHeight: '200px', overflow: 'auto' }}>
            <Scrollbar style={{ maxHeight: '200px' }}>
              <Table stickyHeader style={{ width: '100%', tableLayout: 'fixed' }}>
                {/* <TableHead>
                  <TableRow>
                    {TABLE_HEAD.map((headCell) => (
                      <TableCell key={headCell.id} align="left" style={{ width: headCell.width }}>
                        {headCell.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead> */}
                <TableBody>
                  {details.array.map((row, index) => {
                    const { semester, year, description, downloadLink } = row;

                    return (
                      <TableRow
                        hover
                        key={`${details.title}-${index + 1}`}
                        tabIndex={-1}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          window.open(downloadLink);
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          style={{
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            width: 'calc(100% - 200px)'
                          }}
                        >
                          <Typography variant="subtitle2" noWrap>
                            {`${semester}-${year}`}
                          </Typography>
                          <Typography variant="subtitle3" noWrap>
                            {description}
                          </Typography>
                        </TableCell>
                        <TableCell align="left" style={{ width: '120px' }}>
                          {year}
                        </TableCell>

                        <TableCell align="left" style={{ width: '80px' }}>
                          <Tooltip title="Report resource" placement="right">
                            <ColorButton
                              onClick={(event) => {
                                event.stopPropagation();
                                event.preventDefault();
                              }}
                            >
                              <Icon icon={flag} width={18} height={18} />
                            </ColorButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>
        </Card>
      </Grid>
    );
  }
  return null;
};

// ----------------------------------------------------------------------

export default function CoursePage() {
  const navigate = useNavigate();

  const [courseCode, setCourseCode] = useState('Course');
  const [courseName, setCourseName] = useState('');
  const [resources, setResources] = useState([]);

  const [loadMsg, setLoadMsg] = useState('Loading Course ...');

  const [cards, setCards] = useState({
    endsem: { array: [], title: 'End Semester' },
    midsem: { array: [], title: 'Mid Semester' },
    quiz: { array: [], title: 'Quiz' },
    tutorial: { array: [], title: 'Tutorials' },
    other: { array: [], title: 'Others' }
  });

  const seperatePapers = () => {
    const newCards = { ...cards };
    resources.forEach((paper) => newCards[paper.type].array.push(paper));
    setCards(newCards);

    setLoadMsg(null);
  };

  const checkCourse = (branch, id) => {
    // axios
    //   .get(`https://arpbackend-df561.firebaseapp.com/studyResources/branches/${branch}`)
    //   .then((res) => {
    //     const index = res.data.findIndex((el) => el.subjectCode === id.toUpperCase());
    //     if (index < 0) navigate('/404', { replace: 'true' });
    //     else {
    //       setCourseName(res.data[index].subjectName);
    //       setCourseCode(res.data[index].subjectCode);
    //       getResources(branch, id);

    //       setLoadMsg('Fetching Resources ...');
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    console.log(branch, id);
    let index = -1;
    let ind = -1;
    index = courseData.findIndex((el) => {
      ind = el.courses.findIndex((elem) => elem.subjectCode === id);
      return ind >= 0;
    });

    console.log(index, ind);
    if (index < 0 || ind < 0) navigate('/404', { replace: 'true' });
    else {
      setCourseName(courseData[index].courses[ind].subjectName);
      setCourseCode(courseData[index].courses[ind].subjectCode);
      getResources(branch, id);
    }
  };

  const getResources = (branch, id) => {
    axios
      .get(
        `https://arpbackend-df561.firebaseapp.com/studyResources/branches/${branch}/subjects/${id}`
      )
      .then((res) => {
        setResources(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const url = window.location.pathname;
    const code = url.split('/')[2];

    const index = branches.findIndex(
      (el) => el.code && el.code.toLowerCase() === code.substr(0, 2).toLowerCase()
    );

    if (index < 0) navigate('/404', { replace: true });
    else checkCourse(branches[index].code, code.toUpperCase());
  }, []);

  useEffect(() => {
    if (resources.length > 0) seperatePapers();
  }, [resources]);

  return (
    <Page title={` ${courseCode} | ARP`}>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {courseName}
          </Typography>
          {courseName !== '' && (
            <Button
              variant="contained"
              component={RouterLink}
              to="/upload"
              startIcon={<Icon icon={plusFill} />}
            >
              Add
            </Button>
          )}
        </Stack>
        {!loadMsg ? (
          <Grid container>
            {Object.entries(cards).map((type) => {
              const details = type[1];
              const key = type[0];
              return <TypeCard details={details} key={key} />;
            })}
          </Grid>
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

TypeCard.propTypes = {
  details: PropTypes.object.isRequired
};
