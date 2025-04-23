import React from 'react';
import { Bookmark as BookmarkType } from '../types';

interface BookmarkProps {
  bookmark: BookmarkType;
  onDelete: () => void;
}

export const Bookmark: React.FC<BookmarkProps> = ({ bookmark, onDelete }) => {
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