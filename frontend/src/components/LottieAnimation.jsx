import React from 'react';
import Lottie from 'lottie-react';

const LottieAnimation = ({ animationData, loop = false, onComplete }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="w-64 h-64">
        <Lottie
          animationData={animationData}
          loop={loop}
          onComplete={onComplete}
        />
      </div>
    </div>
  );
};

export default LottieAnimation;
