import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
// material
import { Button, Box, Divider, Typography, Avatar, IconButton } from '@mui/material';

// components
import MenuPopover from '../../components/MenuPopover';
//
// import account from '../../_mocks_/account';

// ----------------------------------------------------------------------

AccountPopover.propTypes = {
  user: PropTypes.object,
  load: PropTypes.func,
  logout: PropTypes.func
};

export default function AccountPopover({ user, load, logout }) {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 40,
          height: 40,
          '&:before': {
            transition: 'all 0.2s ease-in-out',
            boxShadow: (theme) =>
              open
                ? `0px 0px 20px 2px ${theme.palette.primary.main}`
                : `0px 0px 0px 0px ${theme.palette.primary.main}`,
            zIndex: 1,
            content: "''",
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            position: 'absolute'
          }
        }}
      >
        <Avatar src={user.img} alt={user.name} />
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 220 }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap>
            {user.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user.email}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button fullWidth color="inherit" variant="outlined" onClick={logout}>
            Logout
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}
