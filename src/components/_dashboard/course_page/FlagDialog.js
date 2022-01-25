import PropTypes from 'prop-types';
import { useState } from 'react';

import { sentenceCase } from 'change-case';
// material
import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Box,
  MenuItem,
  FormControl,
  Select,
  InputLabel
} from '@mui/material';
import axios from 'axios';

// ----------------------------------------------------------------------

const FLAG_OPTIONS = [
  { value: 'irrelevant', label: 'The file is irrelevant' },
  { value: 'duplicate', label: 'The file is duplicated' },
  { value: 'unclear', label: 'The file is not clear' },
  { value: 'explict', label: 'The file is explict' }
];

export default function FlagDialog({
  file,
  handleClose,
  open,
  setServerResponse,
  setSnackbarOpen
}) {
  const [reason, setReason] = useState('');

  const closeHandler = () => {
    handleClose();
    setReason('');
  };

  console.log(open);
  console.log(file);

  const flagResource = () => {
    const branch = file.subjectCode.substring(0, 2);

    console.log('Called Flag Resource');
    axios
      .put(
        `http://localhost:5000/arpbackend-df561/us-central1/app/studyResources/branches/${branch}/subjects/${file.subjectCode}/resources/${file.resourceId}`,
        { flagReason: reason },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response);
        if (response.status === 204) {
          setServerResponse({ message: 'Flagged Successfully', severity: 'success' });
          setSnackbarOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setServerResponse({ message: err.response.data.error, severity: 'error' });
        setSnackbarOpen(true);
      });
  };

  if (open && file) {
    return (
      <Dialog open={open} onClose={closeHandler} fullWidth maxWidth="xs">
        <DialogTitle>Flag File</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2">{`${sentenceCase(file.type)}: ${file.semester} -${
            file.year
          }`}</Typography>
          <br />
          <Box py={1} sx={{ display: 'flex' }}>
            <FormControl fullWidth required>
              <InputLabel id="">Flag Reason</InputLabel>
              <Select
                variant="standard"
                labelId="flag-reason"
                id="flagReason"
                value={reason}
                label="Reason"
                onChange={(e) => {
                  setReason(e.target.value);
                }}
              >
                {FLAG_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={!reason}
            onClick={() => {
              flagResource();
              closeHandler();
            }}
          >
            OK
          </Button>
          <Button onClick={closeHandler}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return null;
}

FlagDialog.propTypes = {
  file: PropTypes.object,
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  setServerResponse: PropTypes.func,
  setSnackbarOpen: PropTypes.func
};
