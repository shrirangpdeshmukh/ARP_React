import { useState } from 'react';
import PropTypes from 'prop-types';

// material
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Box,
  Stack,
  Input,
  InputLabel,
  FormControl
} from '@mui/material';

AdditionDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  onSubmit: PropTypes.func
};

export default function AdditionDialog({ handleClose, open, onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const closeHandler = () => {
    handleClose();
    setName('');
    setEmail('');
  };

  const submitHandler = () => {
    onSubmit(name, email);
    closeHandler();
  };

  return (
    <Dialog open={open} onClose={closeHandler} maxWidth="xs" fullWidth>
      <DialogTitle>Add Admin</DialogTitle>
      <DialogContent>
        <Box py={1}>
          <Stack direction="column" spacing={3}>
            <FormControl>
              <InputLabel>Name</InputLabel>
              <Input
                required
                autoFocus
                id="name"
                label="Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <InputLabel>Email</InputLabel>
              <Input
                required
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="abc123@iitbbs.ac.in"
              />
            </FormControl>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button disabled={!name || !email} onClick={submitHandler}>
          Add
        </Button>
        <Button onClick={closeHandler}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
