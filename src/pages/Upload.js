// react
import { useState, useEffect } from 'react';
//
import { useLocation, useNavigate } from 'react-router-dom';
// material
import {
  Button,
  Container,
  Typography,
  TextField,
  MenuItem,
  Box,
  Autocomplete,
  Snackbar,
  Alert,
  LinearProgress
} from '@mui/material';

import { createFilterOptions } from '@mui/material/Autocomplete';

// firebase
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// prop-types
import PropTypes from 'prop-types';
// components
import Page from '../components/Page';
import FilePreview from '../components/_dashboard/upload/FilePreview';
// firebase
import { storage } from '../firebaseConfig';
import { uploadStudyResource } from '../API/studyResources';
import useSubjectsContext from '../hooks/useSubjectsContext';

// ---------------------------------------------------------

const TYPE_OPTIONS = [
  { value: 'endsem', label: 'Endsem' },
  { value: 'midsem', label: 'Midsem' },
  { value: 'tutorial', label: 'Tutorial' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'others', label: 'Others' }
];

const SEM_OPTIONS = [
  { value: 'autumn', label: 'Autumn' },
  { value: 'spring', label: 'Spring' }
];

const YEAR_OPTIONS = [];

for (let i = new Date().getFullYear(); i > 2015; i -= 1) {
  YEAR_OPTIONS.push({ value: i.toString(), label: i.toString() });
}

Upload.propTypes = {
  user: PropTypes.object
};

export default function Upload({ user }) {
  // console.log(courseData);
  const navigate = useNavigate();

  const { state } = useLocation();

  const filter = createFilterOptions();

  const [file, setFile] = useState(null);

  const [data, setData] = useState({
    course: '',
    id: '',
    type: 'endsem',
    sem: 'autumn',
    year: '2022',
    desc: ''
  });

  const [isUploading, setUploading] = useState(false);

  const { searchArray } = useSubjectsContext();

  const optionsArray = [];

  searchArray.forEach((item) => {
    if (item.information.subjectName !== 'Environmental Science Technology And Management') {
      optionsArray.push({
        subjectName: item.information.subjectName,
        subjectCode: item.information.subjectCode
      });
    }
  });

  // console.log(optionsArray);

  const handleFile = (inFile) => {
    if (!inFile) return;

    if (inFile.type !== 'application/pdf') {
      setServerResponse({
        message: 'Please Upload a PDF file.',
        severity: 'error'
      });
      setSnackbarOpen(true);
      return;
    }

    setFile(inFile);
  };

  const handleChange = (el, e) => {
    const curr = { ...data };
    curr[el] = e.target.value;
    setData(curr);
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [serverResponse, setServerResponse] = useState({ message: '', severity: 'info' });

  const handleClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (!user) {
      setServerResponse({
        message: 'You not Logged. Please Log in with your institute email address.',
        severity: 'error'
      });
      setSnackbarOpen(true);
    }

    if (state) {
      const curr = { ...data };
      curr.course = state.courseName;
      curr.id = state.courseCode;
      setData(curr);

      window.history.replaceState(null, document.title);
    }
  }, []);

  const enableButton =
    data.course &&
    data.id &&
    data.sem &&
    data.year &&
    data.type &&
    file &&
    (['tutorial', 'others', 'quiz'].includes(data.type) ? data.desc : true);

  const postData = (URL, timestamp) => {
    console.log(URL);
    if (!URL) return;

    const body = {
      emailId: user.email,
      subjectName: data.course.trim(),
      semester: data.sem,
      subjectCode: data.id.toUpperCase().trim(),
      type: data.type,
      year: data.year,
      downloadLink: URL,
      storageReference: `gs://arpbackend-df561.appspot.com/${timestamp}`,
      description: data.desc
    };

    const branch = body.subjectCode.substring(0, 2);

    uploadStudyResource(body, branch)
      .then((res) => {
        console.log(res);
        if (res) {
          setServerResponse({ message: 'File Uploaded Successfully', severity: 'success' });
          setSnackbarOpen(true);
          setData({
            course: '',
            id: '',
            type: 'endsem',
            sem: 'autumn',
            year: '2021',
            desc: ''
          });
          setFile(null);
          setUploading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        console.log(err.message);

        setServerResponse({ message: err.message, severity: 'error' });
        setSnackbarOpen(true);
        setUploading(false);
      });
  };

  const submitHandler = async () => {
    if (!user) {
      setServerResponse({
        message: 'You not Logged. Please Log in with your institute email address.',
        severity: 'error'
      });
      setSnackbarOpen(true);
      return;
    }

    if (!data) {
      setServerResponse({
        message: 'Something went while selecting the data!',
        severity: 'error'
      });
      setSnackbarOpen(true);
      return;
    }

    // DownloadURL
    let URL;
    // Create the file metadata
    const metadata = {
      contentType: 'application/pdf'
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    const timestamp = new Date().valueOf();
    const fileName = `${data.id}:${timestamp}.pdf/`;

    // Upload file and metadata to the object
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress} % done`);
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
          default:
            console.log('Upload is fine');
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;
          // ...
          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
          default:
            console.log('break');
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          URL = downloadURL;
          postData(URL, timestamp);
        });
      }
    );
  };

  return (
    <Page title="Upload | ARP">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Upload
        </Typography>

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

        <label htmlFor="file-resource">
          <Box
            sx={{ borderRadius: 2, bgcolor: 'grey.200', py: 5 }}
            onDrop={(event) => {
              event.preventDefault();

              let file = null;
              for (let i = 0; i < event.dataTransfer.files.length; i += 1) {
                if (event.dataTransfer.files[i].type !== '') {
                  file = event.dataTransfer.files[i];
                  break;
                }
              }

              if (file) handleFile(file);
            }}
            onDragOver={(event) => {
              event.preventDefault();
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 500 }}>
                Drag File
              </Typography>
              <Typography sx={{ position: 'relative', bottom: -6 }}>or</Typography>
            </Box>
          </Box>
        </label>

        <Box style={{ textAlign: 'center', position: 'relative', top: -20 }}>
          <Button
            variant="contained"
            onClick={() => {
              document.getElementById('file-resource').click();
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 500, cursor: 'pointer' }}>
              Upload
            </Typography>
          </Button>
        </Box>

        <input
          id="file-resource"
          type="file"
          hidden
          onChange={(event) => {
            handleFile(event.target.files[0]);
            window.scrollTo({
              bottom: 0,
              behavior: 'smooth'
            });
          }}
        />

        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }} py={5}>
            <Box py={1}>
              <Autocomplete
                onChange={(event, newValue) => {
                  const curr = { ...data };
                  if (typeof newValue === 'string') {
                    curr.course = newValue;
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    curr.course = newValue.inputValue;
                  } else {
                    curr.id = newValue.subjectCode;
                    curr.course = newValue.subjectName;
                  }
                  setData(curr);
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);

                  const { inputValue } = params;
                  // Suggest the creation of a new value
                  const isExisting = options.some((option) => inputValue === option.subjectName);
                  if (inputValue !== '' && !isExisting) {
                    filtered.push({
                      inputValue,
                      subjectName: `Add "${inputValue}"`
                    });
                  }

                  return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                options={optionsArray}
                getOptionLabel={(option) => {
                  // Value selected with enter, right from the input
                  if (typeof option === 'string') {
                    return option;
                  }
                  // Add "xxx" option created dynamically
                  if (option.inputValue) {
                    return option.inputValue;
                  }
                  // Regular option
                  return option.subjectName;
                }}
                renderOption={(props, option) => <li {...props}>{option.subjectName}</li>}
                value={data.course}
                disablePortal
                freeSolo
                disableClearable
                id="combo-box-demo"
                // options={courseNameArray}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Course name" sx={{ width: 'min(80vw,500px)' }} />
                )}
              />
            </Box>

            <Box py={1}>
              <Autocomplete
                onChange={(event, newValue) => {
                  const curr = { ...data };

                  if (typeof newValue === 'string') {
                    curr.id = newValue;
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    curr.id = newValue.inputValue;
                  } else {
                    curr.id = newValue.subjectCode;
                    curr.course = newValue.subjectName;
                  }
                  setData(curr);
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);

                  const { inputValue } = params;
                  // Suggest the creation of a new value
                  const isExisting = options.some((option) => inputValue === option.subjectCode);
                  if (inputValue !== '' && !isExisting) {
                    filtered.push({
                      inputValue,
                      subjectCode: `Add "${inputValue}"`
                    });
                  }

                  return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                options={optionsArray}
                getOptionLabel={(option) => {
                  // Value selected with enter, right from the input
                  if (typeof option === 'string') {
                    return option;
                  }
                  // Add "xxx" option created dynamically
                  if (option.inputValue) {
                    return option.inputValue;
                  }
                  // Regular option
                  return option.subjectCode;
                }}
                renderOption={(props, option) => <li {...props}>{option.subjectCode}</li>}
                value={data.id}
                disablePortal
                freeSolo
                disableClearable
                id="course-id-demo"
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Course name" sx={{ width: 'min(80vw,500px)' }} />
                )}
              />
            </Box>

            <Box py={1} sx={{ display: 'flex' }}>
              <Typography sx={{ display: 'flex', alignItems: 'center', width: '160px' }}>
                Resource Type
              </Typography>
              <TextField
                select
                size="small"
                value={data.type}
                sx={{ paddingRight: '20px' }}
                onChange={(event) => {
                  handleChange('type', event);
                }}
              >
                {TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {['tutorial', 'quiz', 'others'].includes(data.type) && (
              <Box py={1}>
                <TextField
                  label="Description"
                  placeholder={`Ex: ${
                    data.type === 'tutorial' ? 'Diodes Tutorial' : 'Fluid Mechanics Material'
                  }`}
                  sx={{ width: 'min(80vw,500px)' }}
                  value={data.desc}
                  onChange={(e) => {
                    let text = e.target.value;
                    text = text.replace(/\s\s+/g, ' ');
                    const curr = { ...data };
                    curr.desc = text.trimStart();
                    setData(curr);
                  }}
                />
              </Box>
            )}

            <Box py={1} sx={{ display: 'flex' }}>
              <Typography sx={{ display: 'flex', alignItems: 'center', width: '160px' }}>
                Resource Semester
              </Typography>
              <TextField
                select
                size="small"
                value={data.sem}
                sx={{ paddingRight: '20px' }}
                onChange={(event) => {
                  handleChange('sem', event);
                }}
              >
                {SEM_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box py={1} sx={{ display: 'flex' }}>
              <Typography sx={{ display: 'flex', alignItems: 'center', width: '160px' }}>
                Resource Year
              </Typography>
              <TextField
                select
                size="small"
                value={data.year}
                sx={{ paddingRight: '20px' }}
                onChange={(event) => {
                  handleChange('year', event);
                }}
              >
                {YEAR_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>

          {file ? (
            <Box
              px={2}
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}
            >
              <FilePreview file={file} />
            </Box>
          ) : null}
        </Box>

        <Box sx={{ textAlign: 'right' }}>
          {' '}
          {isUploading ? (
            <Box sx={{ width: '100%' }}>
              <LinearProgress />
            </Box>
          ) : (
            <>
              <Button
                sx={{ margin: '20px 10px' }}
                onClick={() => {
                  setData({
                    course: '',
                    id: '',
                    type: 'endsem',
                    sem: 'autumn',
                    year: '2021',
                    desc: ''
                  });
                  setFile(null);
                }}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                sx={{ margin: '20px 10px' }}
                onClick={() => {
                  setUploading(true);
                  submitHandler();
                }}
                disabled={!enableButton}
              >
                Submit
              </Button>
            </>
          )}
        </Box>
      </Container>
    </Page>
  );
}
