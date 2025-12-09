import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';

const SignUp = () => {
  // 🔰 get authProvider Func
  const {
    createUser,
    setUser,
    // updateUserProfile,
    // sendEmailVerificationFunc,
    // setLoading,
    // logOut,
  } = useAuth();

  // 🔰 After successful signup, navigate to login page
  const navigate = useNavigate();

  // ⚡ show password
  const [show, setShow] = useState(false);

  // ⚡ handle signup btn
  const handleSignup = (e) => {
    e.preventDefault();
    const displayName = e.target.name.value;
    const photoURL = e.target.photo.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    console.log(displayName, photoURL, email, password);

    // const passwordRegex =
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // if (!passwordRegex.test(password)) {
    //   toast.error(
    //     'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
    //   );
    //   return;
    // }

    // ⚡1st: signup with email
    createUser(email, password)
      .then((res) => {
        const user = res.user;
        toast.success('Account created successfully!', user);
        setUser(null);
        navigate('/login');
      })
      .catch((e) => {
        console.log(e.message);
      });
  };
  return (
    <div>
      <div className="hero bg-base-200 min-h-screen w-screen -mx-[calc((100vw-100%)/2)]">
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <h1 className="text-3xl text-center pt-6 font-bold ">
            Create Your Account
          </h1>
          {/* ⚡ form */}
          <form onSubmit={handleSignup} className="card-body">
            <fieldset className="fieldset">
              {/* email */}
              <label className="label">Name</label>
              <input
                type="text"
                name="name"
                className="input"
                placeholder="Your Name"
              />
              {/* photo URL */}
              <label className="label">Photo-URL</label>
              <input
                type="text"
                name="photo"
                className="input"
                placeholder="Photo URL"
              />
              {/* email */}
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                className="input"
                placeholder="Email"
              />
              {/* ⚡ password */}
              <div className="space-y-2 relative">
                <label className="label">Password</label>
                <input
                  type={show ? 'text' : 'password'}
                  name="password"
                  className="input"
                  placeholder="Password"
                />
                <span
                  onClick={() => setShow(!show)}
                  className="absolute right-8 bottom-5 cursor-pointer z-50"
                >
                  {show ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>

              <button className="btn btn-primary border-0 text-white mt-4">
                Register
              </button>
              <p className="text-sm text-black/60">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-secondary hover:text-primary font-medium underline"
                >
                  Login
                </Link>
              </p>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
