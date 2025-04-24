import React from 'react';
import { Bookmark as BookmarkType } from '../types';

interface BookmarkProps {
  bookmark: BookmarkType;
  onDelete: () => void;
}

export const Bookmark: React.FC<BookmarkProps> = ({ bookmark, onDelete }) => {
  // Add safety check to ensure bookmark object exists and has required properties
  if (!bookmark || !bookmark.url) {
    console.error('Invalid bookmark data:', bookmark);
    return <li className="bookmark error">Invalid bookmark data</li>;
  }

  return (
    <li className="bookmark">
      <a 
        href={bookmark.url} 
        target="_blank" 
        rel="noopener noreferrer"
        title={bookmark.url}
      >
        {bookmark.title || bookmark.url}
      </a>
      <button 
        className="delete-btn" 
        onClick={(e) => {
          e.preventDefault();
          onDelete();
        }}
      >
        Delete
      </button>
    </li>
  );
}; 