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

// ----------------------------------------------------------------------

const FLAG_OPTIONS = [
  { value: 'irrelevant', label: 'The file is irrelevant' },
  { value: 'duplicate', label: 'The file is duplicated' },
  { value: 'unclear', label: 'The file is not clear' },
  { value: 'explict', label: 'The file is explict' }
];

export default function FlagDialog({ file, handleClose, open }) {
  const [reason, setReason] = useState('');

  const closeHandler = () => {
    handleClose();
    setReason('');
  };
  console.log(open);
  console.log(file);

  if (open && file) {
    return (
      <Dialog open={open} onClose={closeHandler} maxWidth="xl">
        <DialogTitle>Flag File</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2">{`${sentenceCase(file.type)}: ${file.sem}`}</Typography>
          <br />
          <Box py={1} sx={{ display: 'flex' }}>
            <FormControl fullWidth required>
              <InputLabel id="">Flag Reason</InputLabel>
              <Select
                autoWidth
                displayEmpty
                variant="filled"
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
          <Button disabled={!reason} onClick={closeHandler}>
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
  open: PropTypes.bool
};
