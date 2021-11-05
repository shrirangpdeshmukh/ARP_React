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
import { TypeCard, FlagDialog } from '../components/_dashboard/course_page';
//
import USERLIST from '../_mocks_/user';

import { branches } from '../assets/data/branchData';
import courseData from '../assets/data/courseData.json';

// ----------------------------------------------------------------------

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
    others: { array: [], title: 'Others' }
  });

  const [flagDialogOpen, setFlagDialogOpen] = useState(false);
  const [flagFile, setFlagFile] = useState(null);

  const openDialog = () => {
    setFlagDialogOpen(true);
  };
  const closeDialog = () => {
    setFlagDialogOpen(false);
    setFlagFile(null);
  };

  const flagFileSet = (newFlagFile) => {
    setFlagFile(newFlagFile);
  };

  const seperatePapers = () => {
    const newCards = { ...cards };
    console.log(resources);
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

    let index = -1;
    let ind = -1;
    index = courseData.findIndex((el) => {
      ind = el.courses.findIndex((elem) => elem.subjectCode === id);
      return ind >= 0;
    });

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
              state={{ courseName, courseCode }}
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
              return (
                <TypeCard
                  details={details}
                  key={key}
                  handleOpen={openDialog}
                  flagFileSet={flagFileSet}
                />
              );
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
        {flagDialogOpen ? (
          <FlagDialog open={flagDialogOpen} handleClose={closeDialog} file={flagFile} />
        ) : null}
      </Container>
    </Page>
  );
}
