import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
// react
import { useState, useEffect } from 'react';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Button, Stack, AppBar, Toolbar, IconButton, CircularProgress } from '@mui/material';
// components
import { MHidden } from '../../components/@material-extend';
//
import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
import { googleLogin, googleLogout, getUserRole, getRedirectResponse } from '../../API/auth';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
  }
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5)
  }
}));

// ----------------------------------------------------------------------

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func,
  updateUser: PropTypes.func,
  Cookies: PropTypes.object
};

export default function DashboardNavbar({ onOpenSidebar, updateUser, Cookies }) {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(Cookies.cookies.user ? JSON.parse(Cookies.cookies.user) : null);

  useEffect(() => {
    updateUser(user);
  }, [user]);

  useEffect(() => {
    redirectedResult();
  }, []);

  const redirectedResult = async () => {
    try {
      setIsLoading(true);
      const data = await getRedirectResponse();
      console.log({ data });
      const resUser = data.user;
      console.log({ resUser });
      if (resUser) {
        await setResult(resUser);
      }
    } catch (e) {
      console.log(e);
      window.alert('Something went wrong with the Login!');
      setIsLoading(true);
    }
  };

  const setResult = async (resUser) => {
    try {
      const userRole = await getUserRole(resUser.email);

      const userObject = {
        email: resUser.email,
        name: resUser.displayName,
        imageUrl: resUser.photoURL,
        role: userRole
      };

      const expirationTime = new Date(resUser.stsTokenManager.expirationTime);
      console.log({ userObject, expirationTime });
      setUser(userObject);
      Cookies.set('user', userObject, {
        path: '/',
        expires: expirationTime
      });
      Cookies.set('isLoggedIn', true, {
        path: '/',
        expires: expirationTime
      });

      setIsLoading(false);
    } catch (err) {
      console.log(err);
      window.alert('Something went wrong with the Login!');
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      setIsLoading(true);
      const res = await googleLogin();
      if (!res) {
        throw new Error("Couldn't login");
      }
      const data = await getRedirectResponse();
      console.log({ res, data });
      const resUser = data.user;

      console.log({ resUser });
      await setResult(resUser);
    } catch (err) {
      console.log(err);
      window.alert('Something went wrong with the Login!');
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await googleLogout();
    setUser(null);
    setIsLoading(false);
  };

  const AuthBar = () => {
    if (!user && isLoading) return <CircularProgress />;

    if (!user && !isLoading)
      return (
        <Button onClick={login} variant="outlined">
          Log in
        </Button>
      );

    return (
      <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
        <AccountPopover
          user={{ img: user.imageUrl, name: user.name, email: user.email }}
          load={() => {
            setIsLoading(true);
          }}
          logout={logout}
        />
      </Stack>
    );
  };

  return (
    <RootStyle>
      <ToolbarStyle>
        <MHidden width="lgUp">
          <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
            <Icon icon={menu2Fill} />
          </IconButton>
        </MHidden>

        <Searchbar />
        <Box sx={{ flexGrow: 1 }} />

        <AuthBar />
      </ToolbarStyle>
    </RootStyle>
  );
}
