import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import PropTypes from 'prop-types';

export default function AlertDialog({ handleClose, open, details }) {
  const actionHandler = () => {
    details.action();
    handleClose();
  };

  const closeHandler = () => {
    handleClose();
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={closeHandler}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{details.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{details.description}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHandler}>Cancel</Button>
          <Button onClick={actionHandler} autoFocus>
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

AlertDialog.propTypes = {
  details: PropTypes.object,
  handleClose: PropTypes.func,
  open: PropTypes.bool
};
