// react
import { useState, useEffect } from 'react';
//
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
// material
import {
  Stack,
  Button,
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
// iconify
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
// components
import Page from '../components/Page';
import { TypeCard, FlagDialog } from '../components/_dashboard/course_page';
//
// import USERLIST from '../_mocks_/user';

import { branches } from '../assets/data/branchData';
import { getResourcesBySubjectCode } from '../API/studyResources';
import useSubjectsContext from '../hooks/useSubjectsContext';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function CoursePage() {
  const navigate = useNavigate();
  const { branchSubjectList } = useSubjectsContext();
  const globalCourseCode = useParams().code;

  const [courseCode, setCourseCode] = useState('Course');
  const [courseName, setCourseName] = useState('');
  const [resources, setResources] = useState([]);

  const [loadMsg, setLoadMsg] = useState('Loading Course ...');

  const initCardsState = {
    endsem: { array: [], title: 'End Semester' },
    midsem: { array: [], title: 'Mid Semester' },
    quiz: { array: [], title: 'Quiz' },
    tutorial: { array: [], title: 'Tutorials' },
    others: { array: [], title: 'Others' }
  };

  const [cards, setCards] = useState(initCardsState);

  const [flagDialogOpen, setFlagDialogOpen] = useState(false);
  const [flagFile, setFlagFile] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [serverResponse, setServerResponse] = useState({ message: '', severity: 'info' });

  const handleClose = () => {
    setSnackbarOpen(false);
  };

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
    const newCards = initCardsState;
    console.log(resources);
    resources.forEach((paper) => newCards[paper.type].array.push(paper));
    setCards(newCards);

    setLoadMsg(null);
  };

  const checkCourse = (branch, id) => {
    const courseData = branchSubjectList;

    let index = -1;
    let ind = -1;
    index = courseData.findIndex((el) => {
      ind = el.data.findIndex((elem) => elem.subjectCode === id);
      return ind >= 0;
    });

    if (index < 0 || ind < 0) navigate('/404', { replace: 'true' });
    else {
      setCourseName(courseData[index].data[ind].subjectName);
      setCourseCode(courseData[index].data[ind].subjectCode);
      getResources(branch, id);
    }
  };

  const getResources = async (branch, id) => {
    try {
      const data = await getResourcesBySubjectCode(branch, id);
      setResources(data);
      setLoadMsg(null);
    } catch (err) {
      console.log(err);
      window.alert(err.message);
    }
  };

  useEffect(() => {
    // const url = window.location.pathname;
    setLoadMsg('Loading Course ...');
    const code = globalCourseCode;
    const index = branches.findIndex(
      (el) => el.code && el.code.toLowerCase() === code.substring(0, 2).toLowerCase()
    );

    if (index < 0) navigate('/404', { replace: true });
    else checkCourse(branches[index].code, code.toUpperCase());
  }, [globalCourseCode]);

  useEffect(() => {
    if (resources.length > 0) seperatePapers();
  }, [resources]);

  return (
    <Page title={` ${courseCode} | ARP`}>
      <Container>
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
          <FlagDialog
            open={flagDialogOpen}
            handleClose={closeDialog}
            file={flagFile}
            setServerResponse={setServerResponse}
            setSnackbarOpen={setSnackbarOpen}
          />
        ) : null}
      </Container>
    </Page>
  );
}
