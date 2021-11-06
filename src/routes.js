import PropTypes from 'prop-types';
// react
import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
//
import DashboardApp from './pages/DashboardApp';
import CoursePage from './pages/CoursePage';
import BranchPage from './pages/BranchPage';
import AdminUnreviewed from './pages/AdminUnreviewed';
import AdminFlagged from './pages/AdminFlagged';
import AdminManage from './pages/AdminManage';
import AdminAddCourse from './pages/AdminAddCourse';
import ReviewPaper from './pages/ReviewPaper';
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
        { path: 'admin/manage', element: <AdminManage /> },
        { path: 'branch/:name', element: <BranchPage /> },
        { path: 'course/:code', element: <CoursePage /> },
        { path: 'upload', element: <Upload /> },
        { path: 'admin/unreviewed', element: <AdminUnreviewed /> },
        { path: 'admin/flagged', element: <AdminFlagged /> },
        { path: 'admin/addCourse', element: <AdminAddCourse /> },
        { path: 'admin/review/:id', element: <ReviewPaper /> },
        { path: '*', element: <Navigate to="/404" replace /> },
        { path: '404', element: <NotFound /> }
      ]
    }
  ]);
}
