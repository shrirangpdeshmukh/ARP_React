import PropTypes from 'prop-types';
// react
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
//
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import Scrollbar from '../../components/Scrollbar';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
  display: 'flex',
  height: '100vh',
  overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  height: `calc(100vh - ${APP_BAR_MOBILE}px - 24)`,
  marginTop: APP_BAR_MOBILE + 24,
  // paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    height: `calc(100vh - ${APP_BAR_DESKTOP}px - 24)`,
    marginTop: APP_BAR_DESKTOP + 24
    // paddingLeft: theme.spacing(2),
    // paddingRight: theme.spacing(2)
  }
}));

const PaddedStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

// ----------------------------------------------------------------------

DashboardLayout.propTypes = {
  user: PropTypes.object,
  updateUser: PropTypes.func
};

export default function DashboardLayout({ user, updateUser }) {
  const [open, setOpen] = useState(false);

  return (
    <RootStyle>
      <DashboardNavbar onOpenSidebar={() => setOpen(true)} updateUser={updateUser} />
      <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} user={user} />
      <MainStyle>
        <Scrollbar>
          <PaddedStyle>
            <Outlet />
          </PaddedStyle>
        </Scrollbar>
      </MainStyle>
    </RootStyle>
  );
}
