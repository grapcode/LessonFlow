import React from 'react';

const MyLoading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-blue-500 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-indigo-400 animate-[spin_1.5s_linear_infinite]"></div>
      </div>
      <p className="mt-5 text-lg font-semibold text-gray-700 animate-pulse">
        Loading<span className="text-indigo-500">...</span>
      </p>
    </div>
  );
};

export default MyLoading;
