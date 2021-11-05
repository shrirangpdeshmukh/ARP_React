// react
import { useState } from 'react';
// material
import { Button, Container, Typography, TextField, MenuItem, Box } from '@mui/material';
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
  const [file, setFile] = useState(null);

  const [data, setData] = useState({
    course: '',
    id: '',
    type: 'endsem',
    sem: 'autumn',
    year: '2021',
    desc: ''
  });

  const handleFile = (inFile) => {
    if (!inFile) return;

    setFile(inFile);
  };

  const handleChange = (el, e) => {
    const curr = { ...data };
    curr[el] = e.target.value;
    setData(curr);
  };

  return (
    <Page title="Upload | ARP">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Upload
        </Typography>

        <label htmlFor="file-resource" sx={{ cursor: 'pointer' }}>
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
          }}
        />

        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }} py={5}>
            <Box py={1}>
              <TextField label="Course name" sx={{ width: 'min(80vw,500px)' }} />
            </Box>

            <Box py={1}>
              <TextField label="Course ID" />
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

            {['tutorial', 'others'].includes(data.type) && (
              <Box py={1}>
                <TextField
                  label="Description"
                  placeholder={`Ex: ${
                    data.type === 'tutorial' ? 'Diodes Tutorial' : 'Fluid Mechanics Material'
                  }`}
                  sx={{ width: 'min(80vw,500px)' }}
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
          <Button sx={{ margin: '20px 10px' }}>Cancel</Button>
          <Button variant="contained" sx={{ margin: '20px 10px' }}>
            Submit
          </Button>
        </Box>
      </Container>
    </Page>
  );
}
