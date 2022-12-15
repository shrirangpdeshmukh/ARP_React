// react
import { useState, useEffect } from 'react';
import { withCookies } from 'react-cookie';
import PropTypes from 'prop-types';
// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
// API Call
import { getAllSubjects } from './API/studyResources';
// ----------------------------------------------------------------------

const App = ({ cookies }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const Cookies = cookies.cookies;

  const checkLoggedIn = () => {
    setUser(Cookies.user ? JSON.parse(Cookies.user) : null);
    setIsLoggedIn(Cookies.isLoggedIn ? cookies.isLoggedIn : false);
  };

  useEffect(() => {
    checkLoggedIn();
    getAllSubjects();
  }, []);

  return (
    <ThemeConfig>
      <ScrollToTop />
      <GlobalStyles />
      <Router
        user={user}
        isLoggedIn={isLoggedIn}
        Cookies={cookies}
        updateUser={(el) => {
          setUser(el);
        }}
      />
    </ThemeConfig>
  );
};

App.propTypes = {
  cookies: PropTypes.object
};

export default withCookies(App);
