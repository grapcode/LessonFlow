import React from 'react';
import { Link } from 'react-router';

// BannerHero.jsx
// React + TailwindCSS + daisyUI
// Default export a reusable Banner / Hero component for the Home Page.
const title = 'Share & Find Free Food in Your Community';
const subtitle =
  'Reduce waste. Help neighbors. Collect food near you — fast and simple.';
const imageUrl =
  'https://i.ibb.co.com/nqPPZ7DC/photo-1727003826885-4512f0a8388a.jpg';

const Banner = () => {
  return (
    <header className="relative w-full">
      {/* Background image + dark overlay */}
      <div
        className="h-[60vh] md:h-[72vh] lg:h-[80vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
        role="img"
        aria-label="Community food sharing banner"
      >
        <div className="w-full h-full bg-gradient-to-r from-black/60 via-black/35 to-transparent flex items-center">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="max-w-3xl text-white">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                {title}
              </h1>
              <p className="mt-4 text-sm sm:text-base md:text-lg text-gray-200">
                {subtitle}
              </p>

              {/* CTA Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  to="/availableFoods"
                  className="btn btn-primary btn-lg text-white  hover:border-accent"
                  aria-label="View All Foods"
                >
                  View All Foods
                </Link>
              </div>

              {/* Small helper / trust badges */}
              <div className="mt-6 flex items-center gap-4 text-sm text-gray-200">
                <div className="flex items-center gap-2">
                  <span className="badge badge-accent">Verified Donors</span>
                  <span className="opacity-80">•</span>
                  <span>Community driven</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative wave / divider */}
      <div className="-mt-1">
        <svg
          viewBox="0 0 1440 64"
          className="w-full h-16 md:h-20"
          preserveAspectRatio="none"
        >
          <path
            d="M0,32 C240,96 480,0 720,32 C960,64 1200,0 1440,32 L1440 64 L0 64 Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    </header>
  );
};

export default Banner;
