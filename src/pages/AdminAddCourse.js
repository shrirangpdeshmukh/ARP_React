// react
import { useState } from 'react';
//
// material
import { Button, Container, Typography, TextField, MenuItem, Box } from '@mui/material';
// components
import Page from '../components/Page';
//
import { branches as BRANCHES } from '../assets/data/branchData';
import courseData from '../assets/data/courseData.json';
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

  const courseIDValidation = (id) => {
    if (id.length !== 7) return { valid: false, err: 'Course ID length should be equal to 7' };

    const code = id.substr(0, 2);
    const index = BRANCHES.findIndex((el) => el.code === code);
    if (index < 0) return { valid: false, err: 'Branch Code in Course ID is invalid' };

    if (
      Number.isNaN(parseInt(id[2], 10)) ||
      Number.isNaN(parseInt(id[4], 10)) ||
      Number.isNaN(parseInt(id[5], 10)) ||
      Number.isNaN(parseInt(id[6], 10))
    )
      return { valid: false, err: 'Course ID is invalid' };

    if (!['L', 'P', 'T'].includes(id[3]))
      return { valid: false, err: 'Fourth character in Course ID should be L, P or T' };

    return { valid: true, err: '' };
  };

  const onSubmit = () => {
    const { valid, err } = courseIDValidation(data.id);
    if (!valid) {
      window.alert(err);
      return;
    }

    const index = courseData.findIndex((el) => el.course === data.branch);
    if (index >= 0) {
      console.log('Found Course');

      const newCourse = { subjectName: data.course, subjectCode: data.id };

      courseData[index].courses.push(newCourse);

      // writeJsonFileSync('../assets/data/courseData.json', { courseData });
    }
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
                      <MenuItem key={option.icon} value={option.title}>
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
            onClick={onSubmit}
            disabled={!data || !data.id || !data.course || !data.branch}
          >
            Add
          </Button>
        </Box>
      </Container>
    </Page>
  );
}