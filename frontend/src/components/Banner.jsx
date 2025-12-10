import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';

//  LessonFlow: Titles auto-change হবে
const dynamicTitles = [
  'Discover Life Lessons From Real People',
  'Share Your Wisdom With the World',
  'Learn From Mistakes, Experiences & Stories',
  'Your Journey Can Inspire Someone Today',
];

//  LessonFlow: Subtitles auto-change
const dynamicSubtitles = [
  'Every lesson teaches something valuable.',
  'Your story might save someone from a mistake.',
  'Learn. Grow. Inspire.',
  'Write your journey — someone needs it.',
];

//  Multiple Banner Images
const images = [
  'https://i.ibb.co.com/jpTcFY3/photo-1621606676970-fc3a0a39aa96.avif',
  'https://i.ibb.co.com/Lz4BMrpD/photo-1758270703878-de80505b6714.avif',
  'https://i.ibb.co.com/yc4Ksprt/photo-1585432959445-662c9bbcd91d.avif',
];

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  //  Auto-change image
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  //  Auto-change text (3s)
  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % dynamicTitles.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative w-full overflow-hidden h-[60vh] md:h-[72vh] lg:h-[80vh] rounded-3xl my-5">
      {/* Animated Background Image */}
      <AnimatePresence>
        <motion.div
          key={currentIndex}
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${images[currentIndex]})` }}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1.5 }}
        />
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent flex items-center">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <motion.div
            className="max-w-3xl text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {/* ❌ Animated Title */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={textIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight"
              >
                {dynamicTitles[textIndex]}
              </motion.h1>
            </AnimatePresence>

            {/* ❌ Animated Subtitle */}
            <AnimatePresence mode="wait">
              <motion.p
                key={'sub-' + textIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="mt-4 text-sm sm:text-base md:text-lg text-gray-200"
              >
                {dynamicSubtitles[textIndex]}
              </motion.p>
            </AnimatePresence>

            {/* CTA Buttons */}
            <motion.div
              className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
            >
              <Link
                to="/lessons"
                className="btn btn-primary btn-lg text-white hover:border-accent"
              >
                View Lessons
              </Link>
              <Link
                to="/dashboard/add-lesson"
                className="btn bg-white text-black btn-lg hover:bg-gray-200"
              >
                Share Your Lesson
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              className="mt-6 flex items-center gap-4 text-sm text-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.3 }}
            >
              <div className="flex items-center gap-2">
                <span className="badge badge-accent">Real Stories</span>
                <span className="opacity-80">•</span>
                <span>Community Inspired</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* White Wave Divider */}
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
