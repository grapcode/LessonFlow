import { Link, NavLink } from 'react-router';
import LFlogo from '../../assets/LF_logo.jpg';
import MyContainer from '../my-components/MyContainer';
import { IoReorderThreeOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { FadeLoader } from 'react-spinners';
import { GoHomeFill } from 'react-icons/go';
import { MdOutlinePlayLesson, MdOutlineSpaceDashboard } from 'react-icons/md';
import { IoMdGitPullRequest, IoMdSettings } from 'react-icons/io';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  // 🔰 get user from authProvider

  const { user, setUser, loading, logOut } = useAuth();
  // console.log(user);

  // ⚡ handle sign out btn
  const handleSignout = () => {
    // signOut(auth)
    logOut()
      .then(() => {
        toast.success('Signout success!');
        setUser(null);
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  const links = (
    <>
      <li>
        <NavLink to="/">
          <GoHomeFill /> Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/lessons">
          <MdOutlinePlayLesson /> Public Lessons
        </NavLink>
      </li>

      {user && (
        <>
          <li>
            <NavLink to="/dashboard">
              <MdOutlineSpaceDashboard /> Dashboard
            </NavLink>
          </li>
        </>
      )}
    </>
  );
  return (
    <div className="bg-base-100 shadow-sm">
      <MyContainer>
        <div className="navbar">
          <div className="navbar-start">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost lg:hidden"
              >
                <IoReorderThreeOutline size={32} />
              </div>
              <ul
                tabIndex="-1"
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                {links}
              </ul>
            </div>
            {/* logo */}
            <div className="flex gap-3 justify-center items-center ">
              <Link
                to="/"
                className="text-2xl font-bold flex justify-center items-center space-x-2"
              >
                <img className="w-11 md:ml-0 ml-3" src={LFlogo} alt="" />
                Lesson<span className="text-primary">Flow</span>
              </Link>
            </div>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">{links}</ul>
          </div>

          {/* 💥 user condition 💥 */}
          <div className="navbar-end">
            {/* dropdown start*/}
            {loading ? (
              <FadeLoader />
            ) : user ? (
              <div className="dropdown dropdown-end z-50">
                <button tabIndex={0} role="button" className="cursor-pointer">
                  <img
                    className="md:size-15 size-12 rounded-full"
                    src={
                      user?.photoURL ||
                      'https://img.icons8.com/?size=80&id=108652&format=png'
                    }
                    alt=""
                    title={user?.displayName}
                  />
                </button>

                {/* under div is dropdown */}

                <div
                  tabIndex="-1"
                  className="dropdown-content menu menu-sm bg-base-100 rounded-box w-52  p-2 shadow-sm "
                >
                  <div className=" pb-3 border-b border-b-gray-200">
                    <li className="text-sm font-bold">{user.displayName}</li>
                    <li className="text-xs">{user.email}</li>
                  </div>
                  <li className="mt-2">
                    <NavLink to="/profile">
                      <IoMdSettings /> Profile
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard">
                      {' '}
                      <MdOutlineSpaceDashboard /> Dashboard
                    </NavLink>
                  </li>

                  <button
                    onClick={handleSignout}
                    className="btn btn-primary border-0 mt-2 "
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-x-3">
                <Link to="/login" className="btn btn-primary">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  SignUp
                </Link>
              </div>
            )}
          </div>
        </div>
      </MyContainer>
    </div>
  );
};

export default Navbar;
