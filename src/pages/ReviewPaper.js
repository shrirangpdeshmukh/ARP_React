// react
import { useState, useEffect } from 'react';
//
import { useLocation } from 'react-router-dom';
// material
import {
  Button,
  Container,
  Typography,
  TextField,
  MenuItem,
  Box,
  IconButton,
  Stack
} from '@mui/material';
import { Icon } from '@iconify/react';
import editFill from '@iconify/icons-eva/edit-fill';
import refreshFill from '@iconify/icons-eva/refresh-fill';
// components
import Page from '../components/Page';
import FilePreview from '../components/_dashboard/upload/FilePreview';

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

export default function Upload() {
  const { state } = useLocation();

  const [fileUrl, setFileUrl] = useState(
    'https://firebasestorage.googleapis.com/v0/b/arpbackend-df561.appspot.com/o/CS1L001%3A1576825735435.pdf?alt=media&token=9cc12636-463e-4d05-a04b-0c1478ffd13c'
  );
  const [edit, setEdit] = useState(false);

  const [initData, setInitData] = useState({
    course: 'Introduction to Programming and Data Structures',
    id: 'CS1L001',
    type: 'endsem',
    sem: 'autumn',
    year: '2016',
    desc: '',
    email: 'pb20@iitbbs.ac.in'
  });

  const [data, setData] = useState({
    course: '',
    id: '',
    type: '',
    sem: '',
    year: '',
    desc: '',
    email: ''
  });

  const handleChange = (el, e) => {
    const curr = { ...data };
    curr[el] = e.target.value;
    setData(curr);
  };

  useEffect(() => {
    if (state) {
      const curr = { ...data };
      curr.course = state.courseName;
      curr.id = state.courseCode;
      setData(curr);

      window.history.replaceState(null, document.title);
    }

    setData(initData);
  }, []);

  return (
    <Page title="Review | ARP">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4" sx={{ mb: 2 }}>
            Review
          </Typography>
          <Button
            variant={edit ? 'outlined' : 'contained'}
            startIcon={<Icon icon={edit ? refreshFill : editFill} />}
            onClick={() => {
              if (edit) setData(initData);
              setEdit(!edit);
            }}
          >
            {edit ? 'Reset' : 'Edit'}
          </Button>
        </Stack>

        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }} py={2}>
            <Box sx={{ display: 'flex' }} pb={5}>
              <Typography sx={{ fontWeight: 600 }}>Uploaded by : &nbsp;</Typography>
              <Typography>{initData.email}</Typography>
            </Box>

            <Box py={1}>
              <TextField
                label="Course name"
                sx={{ width: 'min(80vw,500px)' }}
                value={data.course}
                onChange={(e) => {
                  let text = e.target.value;
                  text = text.replace(/\s\s+/g, ' ');
                  text = text.replace(/[^\w\s]/gi, '');
                  const curr = { ...data };
                  curr.course = text.trimStart();
                  setData(curr);
                }}
                InputProps={{
                  readOnly: !edit
                }}
              />
            </Box>

            <Box py={1}>
              <TextField
                label="Course ID"
                value={data.id}
                onChange={(e) => {
                  let text = e.target.value;
                  text = text.replace(/\s/g, '');
                  text = text.replace(/[^\w]/gi, '');
                  text = text.substr(0, 7);
                  const curr = { ...data };
                  curr.id = text.toUpperCase();
                  setData(curr);
                }}
                InputProps={{
                  readOnly: !edit
                }}
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
                InputProps={{
                  readOnly: !edit
                }}
              >
                {TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {['tutorial', 'others'].includes(data.type) && (
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
                  InputProps={{
                    readOnly: !edit
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
                InputProps={{
                  readOnly: !edit
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
                InputProps={{
                  readOnly: !edit
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

          {fileUrl ? (
            <Box
              px={2}
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}
            >
              <FilePreview src={fileUrl} />
            </Box>
          ) : null}
        </Box>

        <Box sx={{ textAlign: 'right' }}>
          <Button sx={{ margin: '20px 10px' }}>Cancel</Button>
          <Button variant="contained" sx={{ margin: '20px 10px' }}>
            Accept
          </Button>
        </Box>
      </Container>
    </Page>
  );
}
