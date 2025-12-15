import React from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import { FaUsers } from 'react-icons/fa6';
import { FaTasks } from 'react-icons/fa';
import FLlogo from '../assets/LF_logo.jpg';
import MyContainer from '../components/my-components/MyContainer';

import {
  MdFavorite,
  MdOutlineAddToPhotos,
  MdOutlinePlayLesson,
  MdOutlineReportOff,
  MdOutlineSpaceDashboard,
} from 'react-icons/md';
import { GrOverview } from 'react-icons/gr';
import Navbar from '../components/Shared/Navbar';

const DashboardLayout = () => {
  // const { role } = useRole();

  return (
    <div>
      <Navbar />
      <MyContainer>
        <div className="drawer lg:drawer-open">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* Navbar */}
            <nav className="navbar w-full bg-base-300">
              <label
                htmlFor="my-drawer-4"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost"
              >
                {/* Sidebar toggle icon */}
                <MdOutlineSpaceDashboard className="my-1.5 inline-block size-4" />
              </label>
              <div className="px-4 font-semibold">LessonFlow Dashboard</div>
            </nav>
            {/* Page content here */}
            <Outlet></Outlet>
            {/* <div className="p-4">Page Content</div> */}
          </div>

          <div className="drawer-side is-drawer-close:overflow-visible">
            <label
              htmlFor="my-drawer-4"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
              {/* Sidebar content here */}
              <ul className="menu w-full grow">
                {/* List item */}
                <li>
                  <Link to="/">
                    <img
                      src={FLlogo}
                      alt=""
                      className="my-1.5 inline-block size-4"
                    />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="overview page"
                  >
                    {/* Home / Overview icon */}
                    <GrOverview className="my-1.5 inline-block size-4" />

                    <span className="is-drawer-close:hidden">Overview</span>
                  </Link>
                </li>

                {/* our dashboard links */}
                <li>
                  <NavLink
                    to="/dashboard/add-lesson"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Add Lesson"
                  >
                    <MdOutlineAddToPhotos className="my-1.5 inline-block size-4" />

                    <span className="is-drawer-close:hidden">Add Lesson</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/dashboard/my-lessons"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="My Lessons"
                  >
                    <MdOutlinePlayLesson className="my-1.5 inline-block size-4" />

                    <span className="is-drawer-close:hidden">My Lessons</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/my-favorites"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="My Favorites"
                  >
                    <MdFavorite className="my-1.5 inline-block size-4" />

                    <span className="is-drawer-close:hidden">My Favorites</span>
                  </NavLink>
                </li>

                <>
                  <li>
                    <NavLink
                      to="/dashboard/manageLessons"
                      className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                      data-tip="Manage Lessons"
                    >
                      <FaTasks className="my-1.5 inline-block size-4" />

                      <span className="is-drawer-close:hidden">
                        Manage Lessons
                      </span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/manageUsers"
                      className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                      data-tip="Manage Users"
                    >
                      <FaUsers className="my-1.5 inline-block size-4" />

                      <span className="is-drawer-close:hidden">
                        Manage Users
                      </span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/reported-lessons"
                      className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                      data-tip="Reported Lessons"
                    >
                      <MdOutlineReportOff className="my-1.5 inline-block size-4" />

                      <span className="is-drawer-close:hidden">
                        Reported Lessons
                      </span>
                    </NavLink>
                  </li>
                </>

                {/* admin only links */}
                {/* {role === 'admin' && ()} */}
              </ul>
            </div>
          </div>
        </div>
      </MyContainer>
    </div>
  );
};

export default DashboardLayout;
