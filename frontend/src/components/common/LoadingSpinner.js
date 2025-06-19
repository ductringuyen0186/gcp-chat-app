import React from 'react';

const LoadingSpinner = ({ size = 'large', message = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="h-screen bg-discord-background flex items-center justify-center">
      <div className="text-center">
        <div className={`spinner mx-auto mb-4 ${sizeClasses[size]}`}></div>
        <p className="text-discord-light">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
