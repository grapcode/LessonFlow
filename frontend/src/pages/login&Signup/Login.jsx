import React, { useRef, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';

import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/my-components/LoadingSpinner';
import useAuth from '../../hooks/useAuth';
import { saveOrUpdateUser } from '../../utils';

const Login = () => {
  // ⚡ show password
  const [show, setShow] = useState(false);

  // 🎯  Forgot password
  const emailRef = useRef(null);

  const { signIn, signInWithGoogle, loading, user, setLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state || '/';

  if (loading) return <LoadingSpinner />;
  if (user) return <Navigate to={from} replace={true} />;

  // ⚡ handle signin/login from
  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      //User Login
      const { user } = await signIn(email, password);

      await saveOrUpdateUser({
        name: user?.displayName,
        email: user?.email,
        image: user?.photoURL,
      });

      navigate(from, { replace: true });
      toast.success('Login Successful');
    } catch (err) {
      console.log(err);
      toast.error(err?.message);
    }
  };

  // 🎯 handle Forgot password
  const handleForgotPassword = () => {};

  //   💥 google signin

  const handleGoogleSignin = async () => {
    try {
      //User Registration using google
      const { user } = await signInWithGoogle();
      await saveOrUpdateUser({
        name: user?.displayName,
        email: user?.email,
        image: user?.photoURL,
      });

      navigate(from, { replace: true });
      toast.success('Login Successful');
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error(err?.message);
    }
  };

  return (
    <div>
      <div className="hero bg-base-200 min-h-screen w-screen -mx-[calc((100vw-100%)/2)]">
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <h1 className="text-3xl text-center pt-6 font-bold ">Welcome Back</h1>
          {/* ⚡ form */}

          <form onSubmit={handleLogin} className="card-body">
            <fieldset className="fieldset">
              {/* email */}
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                // 🎯 Forgot password email value: system-2
                ref={emailRef}
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
              {/* 🎯 Forgot password */}
              <div>
                <span
                  to="/forgot-password"
                  onClick={handleForgotPassword}
                  className="link link-hover"
                >
                  Forgot password?
                </span>
              </div>
              {/* login btn */}
              <button className="btn btn-primary border-0 text-white mt-4">
                Login
              </button>

              {/* 💥 Google btn */}
              <button
                type="button"
                onClick={handleGoogleSignin}
                className="btn mt-2 bg-white text-black border-[#e5e5e5]"
              >
                <FcGoogle />
                Login with Google
              </button>
              <p className="text-sm text-black/60">
                Don't have account?{' '}
                <Link
                  to="/signup"
                  className="text-secondary hover:text-primary font-medium underline "
                >
                  Sign Up
                </Link>
              </p>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
