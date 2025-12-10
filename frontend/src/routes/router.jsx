import { createBrowserRouter } from 'react-router';
import Home from '../pages/Home';
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
        element: <LessonDetails />,
      },
      {
        path: '/profile',
        element: <Profile />,
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
        path: 'my-lessons',
        element: <MyLessons />,
      },
      {
        path: 'add-lesson',
        element: <AddLesson />,
      },
    ],
  },
]);
