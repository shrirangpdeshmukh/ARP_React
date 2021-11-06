// react
import { useState } from 'react';
// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';

// ----------------------------------------------------------------------

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <ThemeConfig>
      <ScrollToTop />
      <GlobalStyles />
      <Router
        user={user}
        updateUser={(el) => {
          setUser(el);
        }}
      />
    </ThemeConfig>
  );
}
