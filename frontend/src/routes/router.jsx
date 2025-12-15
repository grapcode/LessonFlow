import { createBrowserRouter } from 'react-router';
import Home from '../pages/Home/Home';
import MainLayout from '../layout/MainLayout';
import PublicLessons from '../pages/PublicLessons';
import Login from '../pages/login&Signup/Login';
import SignUp from '../pages/login&Signup/SignUp';
import DashboardLayout from '../layout/DashboardLayout';
import PrivateRoute from './PrivateRoute';
import DashboardHome from '../pages/Dashboard/DashboardHome/DashboardHome';
import MyLessons from '../pages/Dashboard/MyLessons';
import AddLesson from '../pages/Dashboard/AddLesson';
import LessonDetails from '../pages/LessonDetails';
import Profile from '../pages/private_page/Profile';
import ManageLessons from '../pages/Dashboard/ManageLessons';
import Pricing from '../pages/Payment/Pricing';
import PaymentSuccess from '../pages/Payment/PaymentSuccess';
import UserOverview from '../pages/Dashboard/DashboardHome/UserOverview';
import MyFavorites from '../pages/Dashboard/MyFavorites';
import AdminOverview from '../pages/Dashboard/DashboardHome/AdminOverview';
import ManageUsers from '../pages/Dashboard/ManageUsers';
import ReportedLessons from '../pages/Dashboard/ReportedLessons';
import AdminRoute from './AdminRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/lessons',
        element: <PublicLessons />,
      },
      {
        path: '/lessons/:id',
        element: (
          <PrivateRoute>
            <LessonDetails />
          </PrivateRoute>
        ),
      },
      {
        path: '/profile',
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <SignUp />,
      },
      {
        path: '/pricing',
        element: <Pricing />,
        loader: () => fetch('https://lessonflow-server.vercel.app/pricing'),
      },
      {
        path: '/payment-success',
        element: <PaymentSuccess />,
      },

      {
        path: '/*',
        element: <h2>Error 404</h2>,
      },
    ],
  },
  // ❌ Dashboard Layout
  {
    path: 'dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },

      {
        path: 'add-lesson',
        element: <AddLesson />,
      },
      {
        path: 'my-lessons',
        element: <MyLessons />,
      },
      {
        path: 'my-favorites',
        element: <MyFavorites />,
      },
      {
        path: 'user-summary',
        element: <UserOverview />,
      },
      {
        path: 'admin-summary',
        element: (
          <AdminRoute>
            <AdminOverview />
          </AdminRoute>
        ),
      },
      {
        path: 'manageLessons',
        element: (
          <AdminRoute>
            <ManageLessons />
          </AdminRoute>
        ),
      },
      {
        path: 'manageUsers',
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: 'reported-lessons',
        element: (
          <AdminRoute>
            <ReportedLessons />
          </AdminRoute>
        ),
      },
    ],
  },
]);
