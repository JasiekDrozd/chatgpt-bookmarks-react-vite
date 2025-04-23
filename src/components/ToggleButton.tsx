import React from 'react';

interface ToggleButtonProps {
  onClick: () => void;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({ onClick }) => {
  return (
    <button 
      className="toggle-button"
      onClick={(e) => {
        e.stopPropagation(); // Prevent potential clicks on underlying elements
        onClick();
      }}
      aria-label="Toggle Bookmarks Sidebar"
    >
      <img 
        src={chrome.runtime.getURL('icons/star.svg')}
        alt="Bookmarks"
        style={{
          width: '20px',
          height: '20px',
          filter: 'invert(50%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(80%)'
        }}
      />
    </button>
  );
}; 