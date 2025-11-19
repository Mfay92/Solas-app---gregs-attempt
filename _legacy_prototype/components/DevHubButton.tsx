import React from 'react';
import { CogIcon } from './Icons';

const DevHubButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={(e) => {
      e.stopPropagation(); // Prevent the underlying user menu button from firing
      onClick();
    }}
    className="absolute -top-1 -left-1 z-[100] bg-ivolve-blue text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 hover:bg-ivolve-dark-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ivolve-bright-green"
    aria-label="Open Developer Hub"
    title="Open Developer Hub"
  >
    <CogIcon />
  </button>
);

export default DevHubButton;