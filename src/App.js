// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
// contexts
import { AuthContextProvider } from './contexts/authContext';
import { SubjectsContextProvider } from './contexts/subjectsContext';
// ----------------------------------------------------------------------

const App = () => (
  <AuthContextProvider>
    <SubjectsContextProvider>
      <ThemeConfig>
        <ScrollToTop />
        <GlobalStyles />
        <Router />
      </ThemeConfig>
    </SubjectsContextProvider>
  </AuthContextProvider>
);

export default App;
