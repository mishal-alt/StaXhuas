import React from 'react';
import staxhausLogo from '../../assets/staxhaus-logo.png';

export const Logo = ({ className = "h-8" }) => {
  return (
    <div className="inline-flex items-center">
      <img 
        src={staxhausLogo} 
        alt="Staxhaus Logo" 
        className={`${className} object-contain`}
      />
    </div>
  );
};

