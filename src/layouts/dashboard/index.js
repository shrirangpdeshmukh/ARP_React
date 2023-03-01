import PropTypes from 'prop-types';
// react
import { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
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
  height: `calc(100vh - ${APP_BAR_MOBILE}px - 12)`,
  marginTop: APP_BAR_MOBILE + 12,
  // paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    height: `calc(100vh - ${APP_BAR_DESKTOP}px - 12)`,
    marginTop: APP_BAR_DESKTOP + 12
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
  user: PropTypes.object
};

export default function DashboardLayout({ user }) {
  const [open, setOpen] = useState(false);
  const compRef = useRef(null);

  const { pathname } = useLocation();

  useEffect(() => {
    compRef.current.scrollIntoView();
  }, [pathname]);

  return (
    <RootStyle>
      <DashboardNavbar onOpenSidebar={() => setOpen(true)} />
      <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} user={user} />
      <MainStyle>
        <Scrollbar>
          <PaddedStyle ref={compRef}>
            <Outlet />
          </PaddedStyle>
        </Scrollbar>
      </MainStyle>
    </RootStyle>
  );
}
