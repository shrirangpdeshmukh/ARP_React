import PropTypes from 'prop-types';
// react
import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import Products from './pages/Products';
import Blog from './pages/Blog';
import User from './pages/User';
import CoursePage from './pages/CoursePage';
import BranchPage from './pages/BranchPage';
import AdminUnreviewed from './pages/AdminUnreviewed';
import AdminFlagged from './pages/AdminFlagged';
import Upload from './pages/Upload';
import NotFound from './pages/Page404';

// ----------------------------------------------------------------------

Router.propTypes = {
  user: PropTypes.object,
  updateUser: PropTypes.func
};

export default function Router({ user, updateUser }) {
  return useRoutes([
    {
      path: '/',
      element: <DashboardLayout user={user} updateUser={updateUser} />,
      children: [
        { element: <Navigate to="/app" replace /> },
        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: <User /> },
        { path: 'branch/:name', element: <BranchPage /> },
        { path: 'course/:code', element: <CoursePage /> },
        { path: 'upload', element: <Upload /> },
        { path: 'products', element: <Products /> },
        { path: 'blog', element: <Blog /> }
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to="/" /> }
      ]
    },
    {
      path: '/admin',
      element: <DashboardLayout user={user} updateUser={updateUser} />,
      children: [
        { path: 'unreviewed', element: <AdminUnreviewed /> },
        { path: 'flagged', element: <AdminFlagged /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
