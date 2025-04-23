import React, { useState, useEffect } from 'react';
import { FolderList } from './FolderList';
import { useBookmarks } from '../hooks/useBookmarks';

interface SidebarProps {
  isVisible: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isVisible, onToggle }) => {
  const {
    folders,
    loading,
    error,
    createFolder,
    deleteFolder,
    addBookmarkToFolder,
    deleteBookmark,
    getCurrentTabInfo
  } = useBookmarks();

  const handleAddBookmark = async (folderId: string) => {
    try {
      const bookmark = await getCurrentTabInfo();
      if (!bookmark) {
        alert('Could not get current page information. Please try again or use the popup instead.');
        return;
      }
      
      const success = await addBookmarkToFolder(folderId, bookmark);
      if (success) {
        // Provide visual feedback
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
          sidebar.classList.add('bookmark-added');
          setTimeout(() => {
            sidebar.classList.remove('bookmark-added');
          }, 500);
        }
      } else {
        alert('This bookmark already exists in the selected folder or could not be added.');
      }
    } catch (err) {
      console.error('Error adding bookmark:', err);
      alert('An error occurred while adding the bookmark. Please try again.');
    }
  };

  if (loading) {
    return <div className="sidebar loading">Loading...</div>;
  }

  if (error) {
    return <div className="sidebar error">Error: {error}</div>;
  }

  return (
    <div className={`sidebar ${isVisible ? 'visible' : ''}`}>
      <div className="sidebar-tab" onClick={onToggle}>
        <span>★</span>
      </div>
      
      <div className="sidebar-content">
        <h2>Bookmarks</h2>
        
        <FolderList
          folders={folders}
          onDeleteFolder={deleteFolder}
          onAddBookmark={handleAddBookmark}
          onDeleteBookmark={deleteBookmark}
          onCreateFolder={createFolder}
        />
      </div>
    </div>
  );
}; 