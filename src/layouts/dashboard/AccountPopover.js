import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import homeFill from '@iconify/icons-eva/home-fill';
import personFill from '@iconify/icons-eva/person-fill';
import settings2Fill from '@iconify/icons-eva/settings-2-fill';
import { Link as RouterLink } from 'react-router-dom';
// material
import { alpha } from '@mui/material/styles';
import { Button, Box, Divider, MenuItem, Typography, Avatar, IconButton } from '@mui/material';
// google-logout
import { GoogleLogout } from 'react-google-login';
// components
import MenuPopover from '../../components/MenuPopover';
//
import account from '../../_mocks_/account';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: homeFill,
    linkTo: '/'
  },
  {
    label: 'Profile',
    icon: personFill,
    linkTo: '#'
  },
  {
    label: 'Settings',
    icon: settings2Fill,
    linkTo: '#'
  }
];

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

        {MENU_OPTIONS.map((option) => (
          <MenuItem
            key={option.label}
            to={option.linkTo}
            component={RouterLink}
            onClick={handleClose}
            sx={{ typography: 'body2', py: 1, px: 2.5 }}
          >
            <Box
              component={Icon}
              icon={option.icon}
              sx={{
                mr: 2,
                width: 24,
                height: 24
              }}
            />

            {option.label}
          </MenuItem>
        ))}

        <GoogleLogout
          clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
          onLogoutSuccess={logout}
          render={(renderProps) => (
            <Box sx={{ p: 2, pt: 1.5 }}>
              <Button
                fullWidth
                color="inherit"
                variant="outlined"
                onClick={() => {
                  load();
                  renderProps.onClick();
                }}
              >
                Logout
              </Button>
            </Box>
          )}
        />
      </MenuPopover>
    </>
  );
}
