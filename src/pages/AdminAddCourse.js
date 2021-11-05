// react
import { useState } from 'react';
//
// material
import { Button, Container, Typography, TextField, MenuItem, Box } from '@mui/material';
// components
import Page from '../components/Page';
//
import { branches as BRANCHES } from '../assets/data/branchData';
// ---------------------------------------------------------

export default function AddCourse() {
  const [data, setData] = useState({
    course: '',
    id: '',
    branch: ''
  });

  const handleChange = (el, e) => {
    const curr = { ...data };
    curr[el] = e.target.value;
    setData(curr);
  };

  return (
    <Page title="Admin | Add Course | ARP">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Add New Course
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }} py={5}>
            <Box py={1} sx={{ display: 'flex' }}>
              <TextField
                select
                // fullWidth
                style={{ width: 'min(85vw,500px)' }}
                SelectProps={{ displayEmpty: true }}
                label="Branch"
                value={data.branch}
                sx={{ paddingRight: '20px' }}
                placeholder="branch"
                onChange={(event) => {
                  handleChange('branch', event);
                }}
              >
                {BRANCHES.map((option) => {
                  if (option.show)
                    return (
                      <MenuItem key={option.icon} value={option.icon}>
                        {option.subtitle}
                      </MenuItem>
                    );
                  return null;
                })}
              </TextField>
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
              />
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
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ textAlign: 'left' }}>
          <Button sx={{ margin: '20px 10px' }}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ margin: '20px 10px' }}
            disabled={!data || !data.id || !data.course || !data.branch}
          >
            Add
          </Button>
        </Box>
      </Container>
    </Page>
  );
}
